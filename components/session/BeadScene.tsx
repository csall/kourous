"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Sparkles, ContactShadows, Stars, Trail } from "@react-three/drei";
import { useRef, useState, useMemo, useEffect, useCallback } from "react";
import * as THREE from "three";
import { useSpring, animated, config } from "@react-spring/three";
import React, { memo } from "react";

const AnimatedSparkles = animated(Sparkles);

interface PearlProps {
    position: [number, number, number];
    activeProgress: any; // SpringValue<number>
    color: string;
    idx: number;
    rotation?: [number, number, number];
    tapProgress: any; // SpringValue<number>
}

const Pearl = memo(({ position, activeProgress, color, idx, rotation = [0, 0, 0], tapProgress }: PearlProps) => {
    const meshRef = useRef<THREE.Mesh>(null);

    const scale = activeProgress.to((p: number) => 0.72 + (0.68 * p));
    const roughness = activeProgress.to((p: number) => 0.25 - (0.17 * p));
    const metalness = activeProgress.to((p: number) => 0.05 + (0.10 * p));
    const transmission = activeProgress.to((p: number) => 0.4 + (0.4 * p));
    const thickness = activeProgress.to((p: number) => 2.0 - (1.0 * p));

    // Combine activeProgress and tapProgress for emissive and zoom effect
    const emissiveIntensity = tapProgress.to((t: number) => {
        const base = activeProgress.get() * 0.3;
        return base + (t * 2.5); // High flash on tap
    });

    const envMapIntensity = activeProgress.to((p: number) => 1 + (4 * p));

    const tapScale = tapProgress.to((t: number) => 1 - (t * 0.50)); // Moderate shrink effect on tap (50%)

    // Smoothly interpolate between base gray and active color
    const interpolatedColor = activeProgress.to((p: number) => {
        const c1 = new THREE.Color("#71717a");
        const c2 = new THREE.Color(color);
        return "#" + c1.lerp(c2, p).getHexString();
    });

    const floatOffset = useMemo(() => (idx * 0.77) % (Math.PI * 2), [idx]);

    useFrame((state) => {
        if (!meshRef.current) return;
        const time = state.clock.getElapsedTime();

        // Subtle rotation only, no floating
        meshRef.current.rotation.y += 0.003;
        meshRef.current.rotation.z += 0.001;

        // Pulse effect based on activeProgress + tap impact (shrink)
        const p = activeProgress.get();
        const pulse = 1 + (Math.sin(time * 2.5) * (0.015 * p));
        const currentScale = scale.get() * pulse * tapScale.get();
        meshRef.current.scale.set(currentScale, currentScale, currentScale);
    });

    return (
        <animated.mesh
            ref={meshRef}
            position={position}
            rotation={rotation}
            castShadow
            receiveShadow
        >
            <sphereGeometry args={[1, 64, 64]} />
            <animated.meshPhysicalMaterial
                color={interpolatedColor}
                roughness={roughness}
                metalness={metalness}
                transmission={transmission}
                thickness={thickness}
                envMapIntensity={envMapIntensity}
                clearcoat={1}
                clearcoatRoughness={0.1}
                reflectivity={1}
                emissive={interpolatedColor}
                emissiveIntensity={emissiveIntensity}
            />
            {/* Sparkles intensity tied to activeProgress */}
            <AnimatedSparkles
                count={10}
                scale={2}
                size={1.5}
                speed={0.4}
                opacity={activeProgress.to((p: number) => {
                    const base = p * 0.4;
                    const tapBurst = tapProgress.get() * 0.6;
                    return Math.min(1, base + tapBurst);
                })}
                color="#ffffff"
            />
        </animated.mesh>
    );
});

Pearl.displayName = "Pearl";

const ConnectionString = memo(({ radius, spacing, windowRange }: { radius: number, spacing: number, windowRange: number[] }) => {
    const curve = useMemo(() => {
        const points = [];
        // The curve should follow the same (count - idx) logic but in local space
        // We'll just define a static arc that covers the visible window
        // Longer string to allow for the wider spacing
        for (let r = -15; r <= 15; r++) {
            const angle = r * spacing;
            const y = Math.sin(angle) * radius;
            const z = (Math.cos(angle) * radius) - radius;
            points.push(new THREE.Vector3(0, -y, z));
        }
        return new THREE.CatmullRomCurve3(points);
    }, [radius, spacing]);

    return (
        <mesh castShadow>
            <tubeGeometry args={[curve, 100, 0.035, 12, false]} />
            <meshPhysicalMaterial
                color="#1a1a1e"
                roughness={0.7}
                metalness={0.2}
                emissive="#ffffff"
                emissiveIntensity={0.01}
                clearcoat={0.2}
            />
        </mesh>
    );
});

ConnectionString.displayName = "ConnectionString";

const ShootingStar = () => {
    const ref = useRef<THREE.Mesh>(null);
    const [active, setActive] = useState(false);

    // Randomize start delay and position
    const reset = useCallback(() => {
        if (!ref.current) return;
        const x = (Math.random() - 0.5) * 100;
        const y = (Math.random() - 0.5) * 60 + 20; // High in the sky
        const z = -40 - Math.random() * 40;
        ref.current.position.set(x, y, z);
        setActive(false);

        // Random timeout before next launch 5s to 15s
        setTimeout(() => setActive(true), Math.random() * 10000 + 5000);
    }, []);

    useEffect(() => {
        reset();
    }, [reset]);

    useFrame((state, delta) => {
        if (!active || !ref.current) return;

        // Move across screen
        ref.current.position.x -= delta * 60; // Fast!
        ref.current.position.y -= delta * 20; // Downward slope

        // If out of bounds, reset
        if (ref.current.position.x < -60) {
            reset();
        }
    });

    if (!active) return null;

    return (
        <Trail
            width={3}
            length={12}
            color={new THREE.Color("#fbbf24")}
            attenuation={(t) => t * t}
        >
            <mesh ref={ref}>
                <sphereGeometry args={[0.2, 8, 8]} />
                <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={5} toneMapped={false} />
            </mesh>
        </Trail>
    );
};

const StarryNightBackground = memo(() => {
    return (
        <group>
            <color attach="background" args={['#000000']} />
            {/* Dense star field */}
            <Stars radius={120} depth={60} count={8000} factor={4} saturation={0} fade speed={0.5} />
            {/* Periodic shooting stars */}
            <ShootingStar />
            <ShootingStar />
            <ShootingStar />
        </group>
    );
});
StarryNightBackground.displayName = "StarryNightBackground";


interface BeadSceneProps {
    presetId: string;
    count: number;
    total: number;
    beadColor: string;
    onAdvance: () => void;
    onRewind: () => void;
}

// Internal scene with animated state
function SceneInternal({ count, beadWindow, CURVE_RADIUS, ANGLE_SPACING, presetId, beadColor, tapProgress }: any) {
    const lastPresetId = useRef(presetId);
    const lastCount = useRef(count);

    const [{ smoothedCount }, api] = useSpring(() => ({
        smoothedCount: count,
        config: {
            mass: 1.2,
            tension: 110,
            friction: 35,
            precision: 0.0001
        }
    }));

    // Handle jumps and preset changes
    useEffect(() => {
        const isJump = lastPresetId.current !== presetId || Math.abs(lastCount.current - count) > 1;

        api.start({
            smoothedCount: count,
            immediate: isJump
        });

        lastPresetId.current = presetId;
        lastCount.current = count;
    }, [count, presetId, api]);

    return (
        <group>
            {beadWindow.map((idx: number) => {
                return (
                    <animated.group
                        key={idx}
                        // Position AND Rotation based on smoothedCount for physical "turning" descent
                        position={smoothedCount.to((sc: number) => {
                            const angle = (idx - sc) * ANGLE_SPACING;
                            const yPos = Math.sin(angle) * CURVE_RADIUS;
                            const zPos = (Math.cos(angle) * CURVE_RADIUS) - CURVE_RADIUS;
                            return [0, yPos, zPos];
                        })}
                        rotation={smoothedCount.to((sc: number) => [
                            idx * 0.8 + (idx - sc) * 1.5,
                            idx * 0.4,
                            0
                        ])}
                    >
                        <Pearl
                            position={[0, 0, 0]}
                            idx={idx}
                            tapProgress={tapProgress}
                            activeProgress={smoothedCount.to((sc: number) => {
                                // Smooth bell curve centered at current index
                                // Result is 1.0 when sc === idx, and falls off quickly
                                const dist = Math.abs(idx - sc);
                                return Math.max(0, 1 - dist * 1.2);
                            })}
                            color={beadColor}
                        />
                    </animated.group>
                );
            })}
        </group>
    );
}

export const BeadScene = memo(({ presetId, count, total, beadColor, onAdvance, onRewind }: BeadSceneProps) => {
    const isDragging = useRef(false);
    const hasTrippedAdvance = useRef(false);

    const [{ tapProgress }, tapApi] = useSpring(() => ({
        tapProgress: 0,
        config: config.stiff
    }));

    const triggerTapAnimation = useCallback(() => {
        tapApi.start({
            from: { tapProgress: 1 },
            to: { tapProgress: 0 },
            config: {
                mass: 1,
                tension: 400,
                friction: 20
            }
        });
    }, [tapApi]);

    const CURVE_RADIUS = 13.5;
    const ANGLE_SPACING = 0.48;

    const beadWindow = useMemo(() => {
        const window: number[] = [];
        const radius = 1; // Show exactly 3 beads (prev, current, next) for continuity
        for (let i = count - radius; i <= count + radius; i++) {
            window.push(i);
        }
        return window;
    }, [count]);
    const startPos = useRef({ x: 0, y: 0 });

    const handlePointerDown = (e: React.PointerEvent) => {
        isDragging.current = true;
        startPos.current = { x: e.clientX, y: e.clientY };
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        if (!isDragging.current) return;

        const deltaX = Math.abs(e.clientX - startPos.current.x);
        const deltaY = Math.abs(e.clientY - startPos.current.y);
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        // Default tap action (advance)
        if (distance < 10) {
            triggerTapAnimation();
            onAdvance();
        }

        isDragging.current = false;
    };

    return (
        <div
            className="h-full w-full cursor-pointer touch-none select-none"
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
        >
            <Canvas
                key="main-bead-canvas"
                shadows
                camera={{
                    position: [0, 0, 8],
                    fov: 32
                }}
                gl={{
                    antialias: true,
                    alpha: true,
                    powerPreference: "high-performance",
                    preserveDrawingBuffer: true
                }}
                onCreated={(state) => {
                    state.gl.setClearColor('#020617');
                }}
                style={{ width: '100%', height: '100%' }}
            >
                <ambientLight intensity={0.25} />
                <spotLight position={[10, 25, 15]} angle={0.3} penumbra={1} intensity={2.5} castShadow />
                <pointLight position={[-10, 5, -10]} intensity={1.5} color="#f43f5e" />

                <Environment preset="city" />

                <SceneInternal
                    presetId={presetId}
                    count={count}
                    beadColor={beadColor}
                    beadWindow={beadWindow}
                    CURVE_RADIUS={CURVE_RADIUS}
                    ANGLE_SPACING={ANGLE_SPACING}
                    tapProgress={tapProgress}
                />

                <StarryNightBackground />
                <fog attach="fog" args={['#000000', 30, 90]} />
            </Canvas>
        </div>
    );
});

BeadScene.displayName = "BeadScene";
