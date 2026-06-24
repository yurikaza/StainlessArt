import bpy
import math

# ══════════════════════════════════════════════
# 1. CLEAR SCENE
# ══════════════════════════════════════════════
print("\n[1/6] Clearing scene...")
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)
for block in bpy.data.meshes:
    if block.users == 0:
        bpy.data.meshes.remove(block)
for block in bpy.data.materials:
    if block.users == 0:
        bpy.data.materials.remove(block)
for block in bpy.data.cameras:
    if block.users == 0:
        bpy.data.cameras.remove(block)
for block in bpy.data.lights:
    if block.users == 0:
        bpy.data.lights.remove(block)
print("  Scene cleared.")

# ══════════════════════════════════════════════
# 2. ROPE PARAMETERS
# ══════════════════════════════════════════════
ROPE_TURNS      = 18
ROPE_HEIGHT     = 6.0
HELIX_RADIUS    = 0.095
STRAND_RADIUS   = 0.070
FIBER_RADIUS    = 0.009
SEGS_PER_TURN   = 32
RING_VERTS      = 6

total_segs = ROPE_TURNS * SEGS_PER_TURN
h_step = ROPE_HEIGHT / total_segs
a_step = (2 * math.pi * ROPE_TURNS) / total_segs

# ══════════════════════════════════════════════
# 3. HEX PACKING — fiber positions within strand cross-section
# ══════════════════════════════════════════════
positions = [(0.0, 0.0)]  # center fiber
ring_idx = 1

while True:
    orbit_r = FIBER_RADIUS * 2 * ring_idx  # hex row spacing
    if orbit_r + FIBER_RADIUS > STRAND_RADIUS:
        break
    # fibers per ring: circumference / (2 * fiber_radius)
    count = max(6, int(2 * math.pi * orbit_r / (2 * FIBER_RADIUS)))
    for i in range(count):
        angle = 2 * math.pi * i / count
        # stagger odd rings by half-step
        if ring_idx % 2 == 1:
            angle += math.pi / count
        positions.append((orbit_r * math.cos(angle), orbit_r * math.sin(angle)))
    ring_idx += 1

NUM_FIBERS = len(positions)
print(f"[2/6] Rope: {ROPE_TURNS} turns, h={ROPE_HEIGHT}")
print(f"  helix_r={HELIX_RADIUS}, strand_r={STRAND_RADIUS}, fiber_r={FIBER_RADIUS}")
print(f"  Hex pack: {NUM_FIBERS} fibers/strand, {ring_idx} rings")
print(f"  Total mesh objects: {NUM_FIBERS * 2}")

# ══════════════════════════════════════════════
# 4. MESH BUILDER
# ══════════════════════════════════════════════
def build_fiber(name, strand_phase, fx, fy):
    verts = []
    faces = []
    rings = total_segs + 1

    for i in range(rings):
        theta = a_step * i + strand_phase
        z = h_step * i - ROPE_HEIGHT / 2.0

        sx = HELIX_RADIUS * math.cos(theta)
        sy = HELIX_RADIUS * math.sin(theta)

        tx = -HELIX_RADIUS * math.sin(theta)
        ty =  HELIX_RADIUS * math.cos(theta)
        tz =  h_step
        tl = math.sqrt(tx*tx + ty*ty + tz*tz)
        tx, ty, tz = tx/tl, ty/tl, tz/tl

        ref = (0, 0, 1) if abs(tz) < 0.9 else (1, 0, 0)
        nx = ref[1]*tz - ref[2]*ty
        ny = ref[2]*tx - ref[0]*tz
        nz = ref[0]*ty - ref[1]*tx
        nl = math.sqrt(nx*nx + ny*ny + nz*nz)
        nx, ny, nz = nx/nl, ny/nl, nz/nl
        bx = ty*nz - tz*ny
        by = tz*nx - tx*nz
        bz = tx*ny - ty*nx

        cx = sx + fx * nx + fy * bx
        cy = sy + fx * ny + fy * by
        cz = z  + fx * nz + fy * bz

        for j in range(RING_VERTS):
            phi = 2 * math.pi * j / RING_VERTS
            vx = cx + FIBER_RADIUS * (math.cos(phi) * nx + math.sin(phi) * bx)
            vy = cy + FIBER_RADIUS * (math.cos(phi) * ny + math.sin(phi) * by)
            vz = cz + FIBER_RADIUS * (math.cos(phi) * nz + math.sin(phi) * bz)
            verts.append((vx, vy, vz))

    for i in range(rings - 1):
        for j in range(RING_VERTS):
            jn = (j + 1) % RING_VERTS
            a = i * RING_VERTS + j
            b = i * RING_VERTS + jn
            c = (i + 1) * RING_VERTS + jn
            d = (i + 1) * RING_VERTS + j
            faces.append((a, b, c, d))

    mesh = bpy.data.meshes.new(name)
    mesh.from_pydata(verts, [], faces)
    mesh.update()
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    return obj

# ══════════════════════════════════════════════
# 5. GENERATE ALL FIBERS
# ══════════════════════════════════════════════
print("[3/6] Generating fibers...")
all_objects = []

for strand_idx, strand_name in enumerate(["Strand_A", "Strand_B"]):
    phase = strand_idx * math.pi
    for fi, (fx, fy) in enumerate(positions):
        fname = f"{strand_name}_Fiber_{fi:02d}"
        obj = build_fiber(fname, phase, fx, fy)
        all_objects.append(obj)

verts_per = len(all_objects[0].data.vertices)
faces_per = len(all_objects[0].data.polygons)
print(f"  {len(all_objects)} fibers generated ({verts_per}v / {faces_per}f each)")

# ══════════════════════════════════════════════
# 6. MATERIAL
# ══════════════════════════════════════════════
print("[4/6] Stainless_Steel material...")
mat = bpy.data.materials.new(name="Stainless_Steel")
mat.use_nodes = True
bsdf = mat.node_tree.nodes.get("Principled BSDF")
if bsdf:
    bsdf.inputs['Base Color'].default_value = (0.796, 0.816, 0.843, 1.0)
    bsdf.inputs['Metallic'].default_value = 1.0
    bsdf.inputs['Roughness'].default_value = 0.15

for obj in all_objects:
    obj.data.materials.append(mat)

# ══════════════════════════════════════════════
# 7. SMOOTH + SUBDIVISION
# ══════════════════════════════════════════════
print("[5/6] Smooth shading + subdivision...")
for obj in all_objects:
    bpy.context.view_layer.objects.active = obj
    obj.select_set(True)
    bpy.ops.object.shade_smooth()
    mod = obj.modifiers.new(name="Subdivision", type='SUBSURF')
    mod.levels = 1
    mod.render_levels = 2
    obj.select_set(False)

# ══════════════════════════════════════════════
# 8. ORIGINS + CAMERA + LIGHTS
# ══════════════════════════════════════════════
print("[6/6] Origins + scene...")
bpy.context.scene.cursor.location = (0, 0, 0)
for obj in all_objects:
    bpy.context.view_layer.objects.active = obj
    obj.select_set(True)
    bpy.ops.object.origin_set(type='ORIGIN_CURSOR', center='BOUNDS')
    obj.location = (0, 0, 0)
    obj.select_set(False)

bpy.ops.object.camera_add(location=(3, -3, 2))
cam = bpy.context.active_object
cam.rotation_euler = (math.radians(65), 0, math.radians(45))
bpy.context.scene.camera = cam

bpy.ops.object.light_add(type='AREA', location=(2, -2, 3))
bpy.context.active_object.data.energy = 200
bpy.context.active_object.data.size = 2
bpy.context.active_object.name = "Key_Light"

bpy.ops.object.light_add(type='AREA', location=(-2, 2, 1))
bpy.context.active_object.data.energy = 80
bpy.context.active_object.data.size = 3
bpy.context.active_object.name = "Fill_Light"

# ══════════════════════════════════════════════
# VERIFICATION
# ══════════════════════════════════════════════
print("\n" + "=" * 55)
print("=== FINAL VERIFICATION ===")
print("=" * 55)

a_fibers = [o for o in all_objects if o.name.startswith("Strand_A")]
b_fibers = [o for o in all_objects if o.name.startswith("Strand_B")]
print(f"\n  Strand_A: {len(a_fibers)} fibers")
print(f"  Strand_B: {len(b_fibers)} fibers")

total_verts = sum(len(o.data.vertices) for o in all_objects)
total_faces = sum(len(o.data.polygons) for o in all_objects)
print(f"  Total verts:  {total_verts:,}")
print(f"  Total faces:  {total_faces:,}")

print(f"\n--- Objects ({len(bpy.data.objects)}) ---")
for obj in bpy.data.objects:
    loc = tuple(round(v, 3) for v in obj.location)
    print(f"  {obj.name:25s} | {obj.type:6s} | {loc}")

output = "/Users/yurikaza/Projects/StainlessArt/wire_rope.blend"
bpy.ops.wm.save_as_mainfile(filepath=output)
print(f"\nSaved: {output}")
print("\nDone!")
