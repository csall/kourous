"use client";

import { useRef, useMemo, memo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

const NUM_BEADS = 33;
const RADIUS = 1.85;

/* ── Single bead ────────────────────────────────────────────── */
const Bead = memo(({ angle, isImame = false }: { angle: number; isImame?: boolean }) => {
    const x = Math.cos(angle) * RADIUS;
    const y = Math.sin(angle) * RADIUS;
    const size = isImame ? 0.28 : 0.15;

    return (
        <mesh position={[x, y, 0]}>
            <sphereGeometry args={[size, 16, 16]} />
            <meshPhysicalMaterial
                color={isImame ? "#fbbf24" : "#a5b4fc"}
                roughness={0.04}
                metalness={0.1}
                transmission={0.4}
                thickness={isImame ? 2.2 : 0.9}
                clearcoat={1}
                clearcoatRoughness={0.02}
                envMapIntensity={5}
                emissive={isImame ? "#d97706" : "#6366f1"}
                emissiveIntensity={isImame ? 0.6 : 0.28}
            />
        </mesh>
    );
});
Bead.displayName = "Bead";

/* ── Imame pendant (decorative tail) ────────────────────────── */
const Pendant = memo(() => {
    const x = Math.cos(0) * RADIUS;
    const y = Math.sin(0) * RADIUS;
    return (
        <group position={[x, y, 0]}>
            <mesh position={[0.18, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.018, 0.018, 0.36, 8]} />
                <meshPhysicalMaterial color="#e2e8f0" roughness={0.3} metalness={0.5} emissive="#c4b5fd" emissiveIntensity={0.2} />
            </mesh>
            <mesh position={[0.42, 0, 0]}>
                <sphereGeometry args={[0.11, 12, 12]} />
                <meshPhysicalMaterial
                    color="#fbbf24"
                    roughness={0.04}
                    metalness={0.1}
                    transmission={0.3}
                    clearcoat={1}
                    envMapIntensity={5}
                    emissive="#d97706"
                    emissiveIntensity={0.5}
                />
            </mesh>
        </group>
    );
});
Pendant.displayName = "Pendant";

/* ── The cord connecting all beads ──────────────────────────── */
const Cord = memo(() => {
    const geometry = useMemo(() => {
        const pts: THREE.Vector3[] = [];
        for (let i = 0; i <= 128; i++) {
            const a = (i / 128) * Math.PI * 2;
            pts.push(new THREE.Vector3(Math.cos(a) * RADIUS, Math.sin(a) * RADIUS, 0));
        }
        const curve = new THREE.CatmullRomCurve3(pts, true);
        return new THREE.TubeGeometry(curve, 128, 0.022, 8, true);
    }, []);

    return (
        <mesh geometry={geometry}>
            <meshPhysicalMaterial
                color="#e8e4f0"
                roughness={0.25}
                metalness={0.45}
                clearcoat={0.8}
                envMapIntensity={2}
                emissive="#c4b5fd"
                emissiveIntensity={0.18}
            />
        </mesh>
    );
});
Cord.displayName = "Cord";

/* ── Subtle glow ring at bead plane ─────────────────────────── */
const GlowRing = memo(() => {
    const geometry = useMemo(() => new THREE.TorusGeometry(RADIUS, 0.055, 8, 128), []);
    return (
        <mesh geometry={geometry}>
            <meshBasicMaterial
                color="#818cf8"
                transparent
                opacity={0.10}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </mesh>
    );
});
GlowRing.displayName = "GlowRing";

/* ── Chapelet group with rotation animation ─────────────────── */
const Chapelet = memo(() => {
    const groupRef = useRef<THREE.Group>(null);

    const beadAngles = useMemo(
        () => Array.from({ length: NUM_BEADS }, (_, i) => (i / NUM_BEADS) * Math.PI * 2),
        []
    );

    useFrame(({ clock }) => {
        if (!groupRef.current) return;
        const t = clock.elapsedTime;
        groupRef.current.rotation.z = t * 0.17;
        groupRef.current.rotation.x = Math.PI * 0.33 + Math.sin(t * 0.27) * 0.055;
        groupRef.current.rotation.y = Math.sin(t * 0.18) * 0.04;
    });

    return (
        <group ref={groupRef} rotation={[Math.PI * 0.33, 0, 0]}>
            <Cord />
            <GlowRing />
            {beadAngles.map((angle, i) => (
                <Bead key={i} angle={angle} isImame={i === 0} />
            ))}
            <Pendant />
        </group>
    );
});
Chapelet.displayName = "Chapelet";

/* ── Export ─────────────────────────────────────────────────── */
export const HomeBeadScene = memo(({ cameraY = 0 }: { cameraY?: number }) => (
    <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, cameraY, 6], fov: 44 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        style={{ background: 'transparent', width: '100%', height: '100%' }}
    >
        <ambientLight intensity={0.3} />
        <pointLight position={[5, 4, 5]} intensity={5} color="#818cf8" />
        <pointLight position={[-5, -4, 3]} intensity={3} color="#f472b6" />
        <pointLight position={[RADIUS + 1, 0, 3]} intensity={2.5} color="#fbbf24" />
        <pointLight position={[0, 0, -4]} intensity={1.5} color="#4f46e5" />

        <Environment preset="studio" />

        <Chapelet />

        <Sparkles count={28} scale={5} size={1.5} speed={0.12} opacity={0.18} color="#a5b4fc" />
    </Canvas>
));
HomeBeadScene.displayName = "HomeBeadScene";
