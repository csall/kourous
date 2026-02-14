"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Sparkles, ContactShadows } from "@react-three/drei";
import { useRef, useState, useMemo } from "react";
import * as THREE from "three";
import { useSpring, animated, config } from "@react-spring/three";

interface PearlProps {
    position: [number, number, number];
    isActive: boolean;
    color: string;
    rotation?: [number, number, number];
}

function Pearl({ position, isActive, color, rotation = [0, 0, 0] }: PearlProps) {
    const meshRef = useRef<THREE.Mesh>(null);

    const { scale, roughness, metalness, colorSpring, transmission, thickness } = useSpring({
        scale: isActive ? 0.8 : 0.42,
        roughness: isActive ? 0.08 : 0.25,
        metalness: isActive ? 0.15 : 0.05,
        transmission: isActive ? 0.8 : 0.4,
        thickness: isActive ? 1.0 : 2,
        colorSpring: isActive ? "#fb7185" : "#a1a1aa",
        config: {
            mass: 2.5,
            tension: 120,
            friction: 30,
        }
    });

    useFrame((state) => {
        if (isActive && meshRef.current) {
            const time = state.clock.getElapsedTime();
            meshRef.current.position.y = position[1] + Math.sin(time * 2) * 0.04;
            const pulse = 1 + Math.sin(time * 2.5) * 0.015;
            meshRef.current.scale.set(pulse * scale.get(), pulse * scale.get(), pulse * scale.get());
        }
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
                color={colorSpring}
                roughness={roughness}
                metalness={metalness}
                transmission={transmission}
                thickness={thickness}
                envMapIntensity={isActive ? 3 : 1}
                clearcoat={1}
                clearcoatRoughness={0.1}
                reflectivity={1}
            />
            {isActive && (
                <Sparkles count={10} scale={2} size={1.5} speed={0.4} opacity={0.4} color="#ffffff" />
            )}
        </animated.mesh>
    );
}

function ConnectionString({ radius, spacing, windowRange }: { radius: number, spacing: number, windowRange: number[] }) {
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
                emissive="#fb7185"
                emissiveIntensity={0.03}
                clearcoat={0.2}
            />
        </mesh>
    );
}

interface BeadSceneProps {
    count: number;
    total: number;
    onAdvance: () => void;
    onRewind: () => void;
}

// Internal scene with animated state
function SceneInternal({ count, dragAngle, beadWindow, CURVE_RADIUS, ANGLE_SPACING }: any) {
    // Smoothed transition for the "descend" effect
    const { smoothedCount } = useSpring({
        smoothedCount: count,
        config: {
            mass: 4.5, // Heavy stone/glass feel
            tension: 100,
            friction: 40,
            precision: 0.0001
        }
    });

    return (
        <animated.group rotation-x={dragAngle}>
            <ConnectionString radius={CURVE_RADIUS} spacing={ANGLE_SPACING} windowRange={beadWindow} />
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
                            isActive={idx === count}
                            color={idx === count ? "#fb7185" : "#71717a"}
                        />
                    </animated.group>
                );
            })}
        </animated.group>
    );
}

export function BeadScene({ count, total, onAdvance, onRewind }: BeadSceneProps) {
    const [dragY, setDragY] = useState(0);
    const isDragging = useRef(false);
    const startY = useRef(0);

    const CURVE_RADIUS = 12;
    // Dramatically wider spacing to show only ~4 pearls in the viewport
    const ANGLE_SPACING = 0.55;

    const beadWindow = useMemo(() => {
        const window: number[] = [];
        const radius = 4; // Show exactly a few beads
        for (let i = count - radius; i <= count + radius; i++) {
            window.push(i);
        }
        return window;
    }, [count]);

    const handlePointerDown = (e: React.PointerEvent) => {
        isDragging.current = true;
        startY.current = e.clientY;
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!isDragging.current) return;
        const delta = e.clientY - startY.current;

        const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
        const sensitivity = isMobile ? 0.003 : 0.002;
        const currentDrag = delta * sensitivity;

        // Note: drag logic remains the same (pull down = advance)
        if (currentDrag > ANGLE_SPACING / 1.2) {
            onAdvance();
            startY.current = e.clientY - (ANGLE_SPACING / sensitivity);
            setDragY(currentDrag - ANGLE_SPACING);
        } else if (currentDrag < -ANGLE_SPACING / 1.2) {
            onRewind();
            startY.current = e.clientY + (ANGLE_SPACING / sensitivity);
            setDragY(currentDrag + ANGLE_SPACING);
        } else {
            setDragY(currentDrag);
        }
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        if (!isDragging.current) return;

        const deltaY = Math.abs(e.clientY - startY.current);
        if (deltaY < 10) { // Slightly more tolerant tap
            onAdvance();
        }

        isDragging.current = false;
        setDragY(0);
    };

    const { dragAngleSpring } = useSpring({
        dragAngleSpring: dragY,
        config: { mass: 1, tension: 500, friction: 35 }
    });

    return (
        <div
            className="h-full w-full cursor-ns-resize touch-none select-none"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
        >
            <Canvas
                shadows
                camera={{
                    position: [0, 0, 11], // Pulled back slightly
                    fov: typeof window !== 'undefined' && window.innerWidth < 768 ? 48 : 35
                }}
                gl={{ antialias: true, alpha: true }}
            >
                <color attach="background" args={['#020617']} />
                <ambientLight intensity={0.25} />
                <spotLight position={[10, 25, 15]} angle={0.3} penumbra={1} intensity={2.5} castShadow />
                <pointLight position={[-10, 5, -10]} intensity={1.5} color="#f43f5e" />

                <Environment preset="city" />

                <SceneInternal
                    count={count}
                    dragAngle={dragAngleSpring}
                    beadWindow={beadWindow}
                    CURVE_RADIUS={CURVE_RADIUS}
                    ANGLE_SPACING={ANGLE_SPACING}
                />

                <Sparkles count={40} scale={15} size={1} speed={0.05} opacity={0.15} />
                <ContactShadows position={[0, -8, 0]} opacity={0.3} scale={25} blur={3} far={10} color="#000" />
                <fog attach="fog" args={['#020617', 8, 28]} />
            </Canvas>
        </div>
    );
}
