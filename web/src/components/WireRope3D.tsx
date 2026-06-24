'use client';

import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function WireStrand({
  turns,
  height,
  helixRadius,
  tubeRadius,
  phase,
  color,
}: {
  turns: number;
  height: number;
  helixRadius: number;
  tubeRadius: number;
  phase: number;
  color: string;
}) {
  const geometry = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const segments = turns * 48;
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const angle = 2 * Math.PI * turns * t + phase;
      const x = helixRadius * Math.cos(angle);
      const y = height * t - height / 2;
      const z = helixRadius * Math.sin(angle);
      points.push(new THREE.Vector3(x, y, z));
    }
    const curve = new THREE.CatmullRomCurve3(points);
    return new THREE.TubeGeometry(curve, segments, tubeRadius, 12, false);
  }, [turns, height, helixRadius, tubeRadius, phase]);

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial
        color={color}
        metalness={0.9}
        roughness={0.18}
      />
    </mesh>
  );
}

function RopeGroup() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.12;
    }
  });

  return (
    <group ref={groupRef} rotation={[0.2, 0, 0.05]}>
      {/* Strand A */}
      <WireStrand
        turns={18}
        height={6}
        helixRadius={0.095}
        tubeRadius={0.06}
        phase={0}
        color="#c8cdd4"
      />
      {/* Strand B */}
      <WireStrand
        turns={18}
        height={6}
        helixRadius={0.095}
        tubeRadius={0.06}
        phase={Math.PI}
        color="#bec3ca"
      />
      {/* Visible sub-fibers on Strand A */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const angle = (i * Math.PI) / 3;
        const orbit = 0.04;
        return (
          <WireStrand
            key={`a-${i}`}
            turns={18}
            height={6}
            helixRadius={0.095 + orbit * Math.cos(angle) * 0.3}
            tubeRadius={0.012}
            phase={angle * 0.4}
            color="#d5dae0"
          />
        );
      })}
      {/* Visible sub-fibers on Strand B */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const angle = (i * Math.PI) / 3;
        const orbit = 0.04;
        return (
          <WireStrand
            key={`b-${i}`}
            turns={18}
            height={6}
            helixRadius={0.095 + orbit * Math.cos(angle) * 0.3}
            tubeRadius={0.012}
            phase={Math.PI + angle * 0.4}
            color="#cdd2d8"
          />
        );
      })}
    </group>
  );
}

export default function WireRope3D() {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 30 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} color="#ffffff" />
        <directionalLight position={[-3, 3, -2]} intensity={0.6} color="#e0e5ec" />
        <pointLight position={[0, 4, 3]} intensity={0.8} color="#ffffff" />
        <RopeGroup />
      </Canvas>
    </div>
  );
}
