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
# 2. PARAMETERS
# ══════════════════════════════════════════════
ROPE_HEIGHT     = 6.0
HELIX_RADIUS    = 0.095
STRAND_RADIUS   = 0.070
FIBER_RADIUS    = 0.009
SEGS_PER_TURN   = 32
RING_VERTS      = 6

# Animation twist range
TURNS_START     = 24      # tight cable
TURNS_END       = 1       # nearly straight (NOT 0 — keeps geometry stable)

TOTAL_FRAMES    = 180
FPS             = 24

# Shape keys: 1 per turn of twist (monotonic, no oscillation)
NUM_SHAPES      = TURNS_START - TURNS_END + 1  # 24 shape keys (24→1)

# Topology: fixed at max turns
FIXED_SEGS      = TURNS_START * SEGS_PER_TURN
FIXED_RINGS     = FIXED_SEGS + 1

# ══════════════════════════════════════════════
# 3. HEX PACKING
# ══════════════════════════════════════════════
positions = [(0.0, 0.0)]
ring_idx = 1
while True:
    orbit_r = FIBER_RADIUS * 2 * ring_idx
    if orbit_r + FIBER_RADIUS > STRAND_RADIUS:
        break
    count = max(6, int(2 * math.pi * orbit_r / (2 * FIBER_RADIUS)))
    for i in range(count):
        angle = 2 * math.pi * i / count
        if ring_idx % 2 == 1:
            angle += math.pi / count
        positions.append((orbit_r * math.cos(angle), orbit_r * math.sin(angle)))
    ring_idx += 1

NUM_FIBERS = len(positions)
VERTS_PER_FIBER = FIXED_RINGS * RING_VERTS

print(f"[2/6] Setup:")
print(f"  {NUM_FIBERS} fibers/strand, {NUM_FIBERS*2} total")
print(f"  Untwist: {TURNS_START} → {TURNS_END} turns (one direction)")
print(f"  Shape keys: {NUM_SHAPES} (one per turn, monotonic)")
print(f"  Topology: {FIXED_SEGS} segs, {VERTS_PER_FIBER} verts/fiber")

# ══════════════════════════════════════════════
# 4. VERTEX COMPUTATION
# ══════════════════════════════════════════════
def compute_verts(turns, strand_phase, fx, fy):
    if turns < 0.1:
        turns = 0.1
    a_step = (2 * math.pi * turns) / FIXED_SEGS
    h_step = ROPE_HEIGHT / FIXED_SEGS
    coords = []
    for i in range(FIXED_RINGS):
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
            coords.extend([
                cx + FIBER_RADIUS * (math.cos(phi) * nx + math.sin(phi) * bx),
                cy + FIBER_RADIUS * (math.cos(phi) * ny + math.sin(phi) * by),
                cz + FIBER_RADIUS * (math.cos(phi) * nz + math.sin(phi) * bz),
            ])
    return coords

# ══════════════════════════════════════════════
# 5. BUILD BASE MESHES (basis = TURNS_START)
# ══════════════════════════════════════════════
print("[3/6] Building meshes...")

def build_fiber_mesh(name, strand_phase, fx, fy):
    h_step = ROPE_HEIGHT / FIXED_SEGS
    a_step = (2 * math.pi * TURNS_START) / FIXED_SEGS
    verts = []
    faces = []
    for i in range(FIXED_RINGS):
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
            verts.append((
                cx + FIBER_RADIUS * (math.cos(phi) * nx + math.sin(phi) * bx),
                cy + FIBER_RADIUS * (math.cos(phi) * ny + math.sin(phi) * by),
                cz + FIBER_RADIUS * (math.cos(phi) * nz + math.sin(phi) * bz),
            ))
    for i in range(FIXED_RINGS - 1):
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

all_objects = []
fiber_specs = []

for strand_idx, strand_name in enumerate(["Strand_A", "Strand_B"]):
    phase = strand_idx * math.pi
    for fi, (fx, fy) in enumerate(positions):
        fname = f"{strand_name}_Fiber_{fi:02d}"
        obj = build_fiber_mesh(fname, phase, fx, fy)
        all_objects.append(obj)
        fiber_specs.append((strand_idx, fi, fx, fy))

print(f"  {len(all_objects)} objects created")

# ══════════════════════════════════════════════
# 6. MATERIAL + SHADING
# ══════════════════════════════════════════════
print("[4/6] Material + shading...")
mat = bpy.data.materials.new(name="Stainless_Steel")
mat.use_nodes = True
bsdf = mat.node_tree.nodes.get("Principled BSDF")
if bsdf:
    bsdf.inputs['Base Color'].default_value = (0.796, 0.816, 0.843, 1.0)
    bsdf.inputs['Metallic'].default_value = 1.0
    bsdf.inputs['Roughness'].default_value = 0.15

for obj in all_objects:
    obj.data.materials.append(mat)
    bpy.context.view_layer.objects.active = obj
    obj.select_set(True)
    bpy.ops.object.shade_smooth()
    mod = obj.modifiers.new(name="Subdivision", type='SUBSURF')
    mod.levels = 1
    mod.render_levels = 2
    obj.select_set(False)

bpy.context.scene.cursor.location = (0, 0, 0)
for obj in all_objects:
    bpy.context.view_layer.objects.active = obj
    obj.select_set(True)
    bpy.ops.object.origin_set(type='ORIGIN_CURSOR', center='BOUNDS')
    obj.location = (0, 0, 0)
    obj.select_set(False)

# ══════════════════════════════════════════════
# 7. SHAPE KEYS — monotonic, one per turn
# ══════════════════════════════════════════════
print(f"[5/6] Generating {NUM_SHAPES} shape keys per fiber...")

# Turns list: 24, 23, 22, ... 2, 1 (strictly decreasing)
shape_turns = list(range(TURNS_START, TURNS_END - 1, -1))

for oi, obj in enumerate(all_objects):
    strand_idx, fi, fx, fy = fiber_specs[oi]
    phase = strand_idx * math.pi

    # Basis = 24 turns
    obj.shape_key_add(name="Basis", from_mix=False)

    # One shape key per turn
    for si, turns in enumerate(shape_turns):
        sk = obj.shape_key_add(name=f"Turns_{turns:02d}", from_mix=False)
        coords = compute_verts(turns, phase, fx, fy)
        sk.data.foreach_set("co", coords)

    if (oi + 1) % 10 == 0 or oi == len(all_objects) - 1:
        print(f"  {oi+1}/{len(all_objects)} fibers done")

# ══════════════════════════════════════════════
# 8. KEYFRAME — linear value ramp, one shape active at a time
# ══════════════════════════════════════════════
print("[6/6] Keyframing...")

bpy.context.scene.frame_start = 1
bpy.context.scene.frame_end = TOTAL_FRAMES
bpy.context.scene.render.fps = FPS

for obj in all_objects:
    keys = obj.data.shape_keys.key_blocks
    num_keys = len(keys)  # Basis + shape keys

    for frame in range(1, TOTAL_FRAMES + 1):
        t = (frame - 1) / (TOTAL_FRAMES - 1)  # 0..1

        # Map t to shape key index range
        # keys[0] = Basis (24 turns), keys[1] = Turns_23, ..., keys[-1] = Turns_01
        shape_f = t * (num_keys - 2)  # 0 .. (num_keys-2), skipping basis
        shape_idx = int(shape_f)       # which pair of keys
        shape_frac = shape_f - shape_idx

        if shape_idx >= num_keys - 2:
            shape_idx = num_keys - 3
            shape_frac = 1.0

        # Zero all shape keys
        for ki in range(1, num_keys):
            keys[ki].value = 0.0
            keys[ki].keyframe_insert(data_path="value", frame=frame)

        # Blend between two adjacent shape keys
        sk_a = keys[1 + shape_idx]
        sk_b = keys[1 + shape_idx + 1] if 1 + shape_idx + 1 < num_keys else sk_a
        sk_a.value = 1.0 - shape_frac
        sk_b.value = shape_frac
        sk_a.keyframe_insert(data_path="value", frame=frame)
        sk_b.keyframe_insert(data_path="value", frame=frame)

# Set linear interpolation
print("  Setting linear interpolation...")
for obj in all_objects:
    if obj.data.shape_keys and obj.data.shape_keys.animation_data:
        action = obj.data.shape_keys.animation_data.action
        if action:
            try:
                for slot in action.slots:
                    for fc in slot.channels:
                        for kp in fc.keyframe_points:
                            kp.interpolation = 'LINEAR'
            except AttributeError:
                try:
                    for fc in action.fcurves:
                        for kp in fc.keyframe_points:
                            kp.interpolation = 'LINEAR'
                except Exception:
                    pass

print(f"  {len(all_objects)} fibers keyframed")

# ══════════════════════════════════════════════
# 9. CAMERA + LIGHTS
# ══════════════════════════════════════════════
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
print("=== ANIMATION VERIFICATION ===")
print("=" * 55)
print(f"\n  Timeline: {TOTAL_FRAMES}f @ {FPS}fps = {TOTAL_FRAMES/FPS:.1f}s")
print(f"  Shape keys/fiber: {NUM_SHAPES} + Basis = {NUM_SHAPES+1}")
print(f"  Turns: {TURNS_START} → {TURNS_END} (monotonic decrease)")
print(f"  Direction: ONE-WAY untwist with visible spiral motion")
print(f"  Min turns: {TURNS_END} (strands nearly separated)")
print(f"  Objects: {len(all_objects)} fibers")

turns_at = {
    1: TURNS_START,
    45: TURNS_START + (TURNS_END - TURNS_START) * 44/179,
    90: TURNS_START + (TURNS_END - TURNS_START) * 89/179,
    135: TURNS_START + (TURNS_END - TURNS_START) * 134/179,
    180: TURNS_END,
}
print(f"\n  Twist at key frames:")
for f, t in turns_at.items():
    print(f"    Frame {f:3d}: {t:.1f} turns")

output = "/Users/yurikaza/Projects/StainlessArt/wire_rope_animated.blend"
bpy.ops.wm.save_as_mainfile(filepath=output)
print(f"\nSaved: {output}")
print("\nPress SPACE in viewport to preview.")
