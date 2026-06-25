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
      <meshPhongMaterial
        color={color}
        specular="#ffffff"
        shininess={90}
        reflectivity={0.6}
      />
    </mesh>
  );
}

type RopeGroupProps = {
  scrollProgressRef: React.MutableRefObject<number>;
  reducedMotion: boolean;
};

function RopeGroup({ scrollProgressRef, reducedMotion }: RopeGroupProps) {
  const masterRef = useRef<THREE.Group>(null);
  const leftRef = useRef<THREE.Group>(null);
  const rightRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    const progress = scrollProgressRef.current;

    // Split phase: 0.15 → 0.65 — strands part like a gate
    const splitAmount = THREE.MathUtils.clamp((progress - 0.15) / 0.5, 0, 1);

    if (masterRef.current && !reducedMotion) {
      masterRef.current.rotation.y += delta * 0.12 * (1 - splitAmount * 0.9);
    }

    if (leftRef.current && rightRef.current) {
      const offset = reducedMotion ? 0 : splitAmount * 3.2;
      leftRef.current.position.x = THREE.MathUtils.lerp(
        leftRef.current.position.x,
        -offset,
        0.08
      );
      rightRef.current.position.x = THREE.MathUtils.lerp(
        rightRef.current.position.x,
        offset,
        0.08
      );
    }
  });

  const subFiberProps = (i: number, phase: number) => {
    const angle = (i * Math.PI) / 3;
    return {
      turns: 18,
      height: 6,
      helixRadius: 0.095 + 0.04 * Math.cos(angle) * 0.3,
      tubeRadius: 0.012,
      phase: phase + angle * 0.4,
    };
  };

  return (
    <group ref={masterRef} rotation={[0.2, 0, 0.05]}>
      {/* Left strand group */}
      <group ref={leftRef}>
        <WireStrand turns={18} height={6} helixRadius={0.095} tubeRadius={0.06} phase={0} color="#7a8899" />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <WireStrand key={`a-${i}`} {...subFiberProps(i, 0)} color="#8a99aa" />
        ))}
      </group>

      {/* Right strand group */}
      <group ref={rightRef}>
        <WireStrand turns={18} height={6} helixRadius={0.095} tubeRadius={0.06} phase={Math.PI} color="#6e7d8c" />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <WireStrand key={`b-${i}`} {...subFiberProps(i, Math.PI)} color="#8090a0" />
        ))}
      </group>
    </group>
  );
}

type WireRope3DProps = {
  scrollProgressRef: React.MutableRefObject<number>;
};

export default function WireRope3D({ scrollProgressRef }: WireRope3DProps) {
  const reducedMotion =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 30 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[3, 5, 4]} intensity={2.5} color="#ffffff" />
        <directionalLight position={[-4, 2, -3]} intensity={1.2} color="#dde4ec" />
        <pointLight position={[0, 4, 3]} intensity={1.5} color="#ffffff" />
        <pointLight position={[3, -2, 1]} intensity={0.8} color="#c8d8e8" />
        <RopeGroup scrollProgressRef={scrollProgressRef} reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  );
}
