"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Sparkles, Stars, Trail, Text } from "@react-three/drei";
import { useRef, useState, useMemo, useEffect, useCallback } from "react";
import * as THREE from "three";
import { useSpring, animated, to } from "@react-spring/three";
import { memo } from "react";
import { useSessionStore } from "@/lib/store/sessionStore";

const AnimatedSparkles = animated(Sparkles);
const AnimatedText = animated(Text);

interface PearlProps {
    position: [number, number, number];
    activeProgress: any; // SpringValue<number>
    idx: number;
    rotation?: [number, number, number];
    tapProgress: any; // SpringValue<number>
}

const Pearl = memo(({ position, activeProgress, idx, rotation = [0, 0, 0], tapProgress }: PearlProps) => {
    // Read color directly from the store — changes are picked up in useFrame
    const [beadColor, setBeadColor] = useState(useSessionStore.getState().beadColor);
    const isInteractiveRef = useRef(!useSessionStore.getState().isUiOpen && !useSessionStore.getState().isComplete);

    useEffect(() => {
        return useSessionStore.subscribe((state) => {
            setBeadColor(state.beadColor);
            isInteractiveRef.current = !state.isUiOpen && !state.isComplete;
        });
    }, []);

    const color = beadColor;
    const meshRef = useRef<THREE.Mesh>(null);
    const groupRef = useRef<THREE.Group>(null);
    const animTimeRef = useRef(0);

    // Constant base size
    const BASE_SCALE = 0.3;

    const roughness = activeProgress.to((p: number) => 0.15 - (0.1 * p));
    const metalness = activeProgress.to((p: number) => 0.1 + (0.05 * p));
    const transmission = activeProgress.to((p: number) => 0.15 + (0.15 * p));
    const thickness = activeProgress.to((p: number) => 2 - (1 * p));

    const envMapIntensity = activeProgress.to((p: number) => 1 + (6 * p)); // High reflection on active

    // Smoothly interpolate between base gray and active color
    const interpolatedColor = activeProgress.to((p: number) => {
        const c1 = new THREE.Color("#52525b");
        const c2 = new THREE.Color(color);
        return "#" + c1.lerp(c2, p).getHexString();
    });

    const floatOffset = useMemo(() => (idx * 0.77) % (Math.PI * 2), [idx]);

    useFrame((state, delta) => {
        if (!meshRef.current || !groupRef.current) return;

        // Only advance animation time if we are interactive
        if (isInteractiveRef.current) {
            animTimeRef.current += delta;
        }

        const time = animTimeRef.current;
        const p = activeProgress.get();

        // 1. Dynamic rotation speed
        const rotationSpeed = 1 + (p * 4);
        meshRef.current.rotation.y += 0.005 * rotationSpeed * (isInteractiveRef.current ? 1 : 0);
        meshRef.current.rotation.z += 0.002 * rotationSpeed * (isInteractiveRef.current ? 1 : 0);

        // 2. Weightless Float 
        if (p > 0.01) {
            // Subtle Y-axis bobbing - use our STABLE animTime
            const bob = Math.sin(time * 2.5 + floatOffset) * 0.15 * p;

            // TAP IMPACT: Pull downward (simulating user pulling the bead)
            const tapOffset = tapProgress.get() * 0.7 * Math.pow(p, 3);
            meshRef.current.position.y = bob - tapOffset;

            // Subtle "wobble"
            meshRef.current.rotation.x = Math.sin(time * 1.5) * 0.1 * p;
        }
    });

    // Tap effects (shrink and flash) are now isolated to the active bead using activeProgress as a mask
    const animatedScale = to([activeProgress, tapProgress], (ap, tp) => {
        const tapImpact = tp * Math.pow(ap, 3); // Sharp falloff
        const s = BASE_SCALE * (1 - (Math.max(0, tapImpact) * 0.35));
        return [s, s, s];
    });

    return (
        <group ref={groupRef} position={position} rotation={rotation}>
            {/* Soft Pointlight ONLY for the active bead - Creates a localized aura */}
            <animated.pointLight
                intensity={activeProgress.to((p: number) => p * 2)}
                distance={2}
                color={color}
            />

            <animated.mesh
                ref={meshRef}
                scale={animatedScale as any}
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
                    clearcoatRoughness={0.05}
                    reflectivity={1}
                    emissive={interpolatedColor}
                    emissiveIntensity={to([activeProgress, tapProgress], (ap, tp) => {
                        // Base core light + Tap flash (masked for active only)
                        return ap * 0.5 + (tp * 5 * Math.pow(ap, 3));
                    })}
                />

                {/* Concentrated Spiritual Particles for active bead */}
                <AnimatedSparkles
                    count={activeProgress.to((p: number) => Math.floor(p * 20) + 4)}
                    scale={activeProgress.to((p: number) => 0.8 + p * 0.5)}
                    size={activeProgress.to((p: number) => 1.5 + p * 1.5)}
                    speed={activeProgress.to((p: number) => 0.4 + p * 0.8)}
                    opacity={activeProgress.to((p: number) => 0.2 + p * 0.6)}
                    color={color}
                />

            </animated.mesh>
        </group>
    );
});
Pearl.displayName = "Pearl";

const ConnectionString = memo(({ radius }: { radius: number }) => {
    const curve = useMemo(() => {
        const points = [];
        const segments = 128;
        for (let i = 0; i < segments; i++) {
            const angle = (i / segments) * Math.PI * 2;
            const y = Math.sin(angle) * radius;
            const z = (Math.cos(angle) * radius) - radius;
            points.push(new THREE.Vector3(0, y, z));
        }
        const c = new THREE.CatmullRomCurve3(points);
        c.closed = true;
        return c;
    }, [radius]);

    return (
        <mesh castShadow>
            <tubeGeometry args={[curve, 128, 0.02, 8, true]} />
            <meshPhysicalMaterial
                color="#64748b"
                roughness={0.8}
                metalness={0.1}
                clearcoat={0}
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
    const [theme, setTheme] = useState(useSessionStore.getState().theme);

    useEffect(() => {
        return useSessionStore.subscribe((state) => {
            setTheme(state.theme);
        });
    }, []);

    // Resolve 'auto' to actual mode
    const resolvedTheme = theme === 'auto'
        ? (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark')
        : theme;

    if (resolvedTheme === 'light') {
        return (
            <group>
                {/* No background color here - we want transparency */}
                {/* Soft warm sparkles for light mode */}
                <Sparkles count={30} scale={30} size={2} speed={0.15} opacity={0.12} color="#c4b5fd" />
                <Sparkles count={20} scale={25} size={3} speed={0.1} opacity={0.08} color="#93c5fd" />
            </group>
        );
    }

    return (
        <group>
            <color attach="background" args={['#020617']} />
            {/* Deep Universe background - Reduced for mobile */}
            <Stars radius={250} depth={100} count={1500} factor={4} saturation={1} fade speed={0.1} />
            <Stars radius={100} depth={50} count={500} factor={3} saturation={0} fade speed={0.5} />

            {/* Floating spiritual dust - Gold & Blue */}
            <Sparkles count={40} scale={25} size={2} speed={0.2} opacity={0.15} color="#fbbf24" />
            <Sparkles count={60} scale={35} size={4} speed={0.1} opacity={0.08} color="#6366f1" />

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
    onAdvance: () => void;
    interactive?: boolean;
}

const ActiveBeadCounter = ({ countSpring }: { countSpring: any }) => {
    const textRef = useRef<any>(null);
    const [lastVal, setLastVal] = useState(0);

    useFrame(() => {
        if (!textRef.current) return;
        const current = Math.round(countSpring.get());
        if (current !== lastVal) {
            textRef.current.text = current.toString();
            setLastVal(current);
        }
    });

    return (
        <group position={[0, 1.6, -1]}>
            {/* Minimalist Counter */}
            <Text
                ref={textRef}
                fontSize={0.35}
                color="white"
                anchorX="center"
                anchorY="middle"
                fillOpacity={0.4}
                letterSpacing={0.15}
            >
                0
            </Text>
        </group>
    );
};

// Internal scene with animated state
const SceneInternal = memo(({ count, beadWindow, total, presetId, tapProgress }: any) => {
    const lastPresetId = useRef(presetId);
    const lastCount = useRef(count);

    const [{ smoothedCount }, api] = useSpring(() => ({
        smoothedCount: count,
        config: {
            mass: 1.2,
            tension: 80,
            friction: 20,
            precision: 0.0001
        }
    }));

    // Handle jumps and preset changes
    useEffect(() => {
        const isPresetChange = lastPresetId.current !== presetId;
        const isReset = count === 0 && lastCount.current > 0; // Complete reset to 0
        const isJump = isPresetChange || Math.abs(lastCount.current - count) > 1;
        const isBackward = count < lastCount.current && lastPresetId.current === presetId && !isReset;

        api.start({
            smoothedCount: count,
            immediate: isJump || isBackward || isReset // Immediate for resets too
        });

        lastPresetId.current = presetId;
        lastCount.current = count;
    }, [count, presetId, api]);

    const radius = 8; // Tighter radius for closer look
    const angleStep = 0.1; // Maximum condensation for a dense holy look

    return (
        <group position={[0, -1.2, 0]}>
            {/* The Rosary String - Fixed Arc */}
            <ConnectionString radius={radius} />


            {beadWindow.map((idx: number) => {
                return (
                    <animated.group
                        key={idx}
                        position={smoothedCount.to((sc: number) => {
                            // Position on vertical wheel
                            const angle = (idx - sc) * angleStep;
                            const z = (Math.cos(angle) * radius) - radius;
                            const y = Math.sin(angle) * radius;

                            return [0, y, z];
                        })}
                        rotation={smoothedCount.to((sc: number) => {
                            const angle = (idx - sc) * angleStep;
                            return [angle, 0, 0];
                        })}
                    >
                        <Pearl
                            position={[0, 0, 0]}
                            idx={idx}
                            tapProgress={tapProgress}
                            activeProgress={smoothedCount.to((sc: number) => {
                                let dist = Math.abs(idx - sc);
                                return Math.max(0, 1 - dist * 0.8);
                            })}
                        />
                    </animated.group>
                );
            })}
        </group>
    );
});
SceneInternal.displayName = "SceneInternal";

export const BeadScene = memo(({ presetId, count, total, onAdvance }: BeadSceneProps) => {
    const isDragging = useRef(false);
    const isInteractiveRef = useRef(!useSessionStore.getState().isUiOpen && !useSessionStore.getState().isComplete);
    const [isUiOpen, setIsUiOpen] = useState(useSessionStore.getState().isUiOpen);
    const [theme, setThemeState] = useState(useSessionStore.getState().theme);

    useEffect(() => {
        return useSessionStore.subscribe((state) => {
            isInteractiveRef.current = !state.isUiOpen && !state.isComplete;
            setIsUiOpen(state.isUiOpen);
            setThemeState(state.theme);
        });
    }, []);

    const resolvedTheme = theme === 'auto'
        ? (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark')
        : theme;

    const isLight = resolvedTheme === 'light';

    const [{ tapProgress }, tapApi] = useSpring(() => ({
        tapProgress: 0,
        config: {
            mass: 1,
            tension: 400,
            friction: 20,
            clamp: true
        }
    }));

    const triggerTapAnimation = useCallback(() => {
        tapApi.start({
            to: [
                { tapProgress: 1, config: { tension: 800, friction: 20 } },
                { tapProgress: 0, config: { tension: 150, friction: 12 } }
            ]
        });
    }, [tapApi]);

    const beadWindow = useMemo(() => {
        const window: number[] = [];
        const range = 8;
        for (let i = count - range; i <= count + range; i++) {
            window.push(i);
        }
        return window;
    }, [count]);

    const startPos = useRef({ x: 0, y: 0 });

    const handlePointerDown = useCallback((e: React.PointerEvent) => {
        if (!isInteractiveRef.current) return;
        isDragging.current = true;
        startPos.current = { x: e.clientX, y: e.clientY };
    }, []);

    const onAdvanceRef = useRef(onAdvance);
    onAdvanceRef.current = onAdvance;

    const handlePointerUp = useCallback((e: React.PointerEvent) => {
        if (!isInteractiveRef.current || !isDragging.current) return;
        isDragging.current = false;

        const deltaX = e.clientX - startPos.current.x;
        const deltaY = e.clientY - startPos.current.y;
        const distance = Math.hypot(deltaX, deltaY);

        if (distance < 10 || (deltaY > 30 && deltaY > Math.abs(deltaX))) {
            triggerTapAnimation();
            onAdvanceRef.current();
        }
    }, [triggerTapAnimation]);

    if (presetId === "none") return <div className="h-full w-full bg-slate-950" />;

    return (
        <div
            className={`h-full w-full cursor-pointer touch-none select-none ${isUiOpen ? 'pointer-events-none' : ''}`}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
        >
            <Canvas
                key="main-bead-canvas"
                shadows
                camera={{
                    position: [0, 0, 5],
                    fov: 60
                }}
                gl={{
                    antialias: false,
                    alpha: true,
                    powerPreference: "high-performance",
                    preserveDrawingBuffer: true
                }}
                dpr={[1, 2]}
                onCreated={(state) => {
                    if (isLight) {
                        state.gl.setClearColor(0x000000, 0); // Transparent
                    } else {
                        state.gl.setClearColor('#020617', 1);
                    }
                }}
                style={{ width: '100%', height: '100%' }}
            >
                <ambientLight intensity={isLight ? 0.8 : 0.25} />
                <spotLight position={[10, 25, 15]} angle={0.3} penumbra={1} intensity={isLight ? 3.5 : 2.5} castShadow />
                <pointLight position={[-10, 5, -10]} intensity={isLight ? 0.5 : 1.5} color={isLight ? "#a78bfa" : "#f43f5e"} />

                <Environment preset="warehouse" />

                <SceneInternal
                    presetId={presetId}
                    count={count}
                    beadWindow={beadWindow}
                    total={total}
                    tapProgress={tapProgress}
                />

                <StarryNightBackground />
                <fog attach="fog" args={[isLight ? '#eeeef2' : '#0f172a', isLight ? 6 : 4, isLight ? 30 : 25]} />
            </Canvas>
        </div>
    );
});

BeadScene.displayName = "BeadScene";
