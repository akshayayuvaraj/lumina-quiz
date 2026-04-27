// src/components/ThreeScene.jsx
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float, Environment } from '@react-three/drei';
import { useRef, Suspense } from 'react';
import * as THREE from 'three';

function GlassSphere({ position, scale, speed, distort, color }) {
  const meshRef = useRef();
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * speed * 0.3;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * speed * 0.5;
    }
  });

  return (
    <Float speed={speed} rotationIntensity={0.5} floatIntensity={1.5}>
      <Sphere ref={meshRef} args={[1, 64, 64]} position={position} scale={scale}>
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={distort}
          speed={2}
          roughness={0.1}
          metalness={0.2}
          transparent
          opacity={0.7}
          envMapIntensity={1}
        />
      </Sphere>
    </Float>
  );
}

function GeometricRing({ position }) {
  const ref = useRef();
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.getElapsedTime() * 0.3;
      ref.current.rotation.z = state.clock.getElapsedTime() * 0.2;
    }
  });

  return (
    <Float speed={1.5} floatIntensity={1}>
      <mesh ref={ref} position={position}>
        <torusGeometry args={[1.2, 0.04, 16, 80]} />
        <meshStandardMaterial
          color="#a855f7"
          transparent
          opacity={0.6}
          emissive="#a855f7"
          emissiveIntensity={0.5}
          wireframe={false}
        />
      </mesh>
    </Float>
  );
}

function SmallOrbs() {
  const orbs = [
    { pos: [3, 1, -2], color: '#ec4899', scale: 0.15 },
    { pos: [-4, -1, -1], color: '#3b82f6', scale: 0.2 },
    { pos: [2, -2, 1], color: '#06b6d4', scale: 0.12 },
    { pos: [-2, 2, -3], color: '#a855f7', scale: 0.18 },
    { pos: [4, -1, -2], color: '#f59e0b', scale: 0.1 },
  ];

  return (
    <>
      {orbs.map((orb, i) => (
        <Float key={i} speed={1 + i * 0.3} floatIntensity={2}>
          <mesh position={orb.pos}>
            <sphereGeometry args={[orb.scale, 16, 16]} />
            <meshStandardMaterial
              color={orb.color}
              emissive={orb.color}
              emissiveIntensity={1}
              transparent
              opacity={0.8}
            />
          </mesh>
        </Float>
      ))}
    </>
  );
}

export default function ThreeScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 60 }}
      style={{ position: 'absolute', inset: 0, zIndex: 1 }}
      gl={{ antialias: true, alpha: true }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#a855f7" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ec4899" />
        <pointLight position={[0, 0, 5]} intensity={0.8} color="#3b82f6" />

        <GlassSphere
          position={[-2.5, 0.5, 0]}
          scale={1.4}
          speed={1.2}
          distort={0.4}
          color="#a855f7"
        />
        <GlassSphere
          position={[2.5, -0.5, -1]}
          scale={1.0}
          speed={0.8}
          distort={0.3}
          color="#ec4899"
        />
        <GlassSphere
          position={[0, 1.5, -2]}
          scale={0.7}
          speed={1.5}
          distort={0.5}
          color="#3b82f6"
        />
        <GeometricRing position={[3.5, 1, -1]} />
        <GeometricRing position={[-3, -1, -2]} />
        <SmallOrbs />

        <Environment preset="night" />
      </Suspense>
    </Canvas>
  );
}