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
    smoothedCount: any; // SpringValue<number>
}

const Pearl = memo(({ position, activeProgress, idx, rotation = [0, 0, 0], tapProgress, smoothedCount }: PearlProps) => {
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
    const contentRef = useRef<THREE.Group>(null);
    const groupRef = useRef<THREE.Group>(null);
    const animTimeRef = useRef(0);

    // Constant base size
    const BASE_SCALE = 0.28;

    const roughness = activeProgress.to((p: number) => 0.15 - (0.1 * p));
    const metalness = activeProgress.to((p: number) => 0.1 + (0.05 * p));
    const transmission = activeProgress.to((p: number) => 0.15 + (0.15 * p));
    const thickness = activeProgress.to((p: number) => 2 - (1 * p));

    const envMapIntensity = activeProgress.to((p: number) => 1 + (6 * p)); // High reflection on active

    // Smoothly interpolate between base gray and active color
    const interpolatedColor = to([activeProgress, smoothedCount], (p, sc) => {
        const c1 = new THREE.Color("#52525b");
        const c2 = new THREE.Color(color);

        // Calculate mix based on position relative to count
        // Active (idx ~ sc + 1) -> ~0.5 mix from position, but 'p' is 1.0 -> Max is 1.0
        // History (idx <= sc) -> >= 1.5 mix -> Max is 1.0
        // Future (idx > sc + 1) -> < 0.5 mix -> Max is close to 0

        // INVERTED LOGIC: Only TOP beads (Future) are colored
        // Future (idx > sc) -> Positive value -> 1 -> Color
        // Past (idx <= sc) -> Negative value -> 0 -> Gray
        const futureMix = Math.min(1, Math.max(0, (idx - sc) + 0.2));

        // Active bead also gets colored by 'p' (activeProgress) if needed
        const finalMix = Math.max(p, futureMix);

        return "#" + c1.lerp(c2, finalMix).getHexString();
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

        // 1. Static rotation
        meshRef.current.rotation.y = 0;
        meshRef.current.rotation.z = 0;

        // 2. Weightless Float 
        if (p > 0.01 && contentRef.current) {
            // TAP IMPACT: Pull downward (simulating user pulling the bead)
            // Removed idle animation (bobbing/wobble) as requested
            const tapOffset = tapProgress.get() * 0.7 * Math.pow(p, 3);
            contentRef.current.position.y = -tapOffset;

            // Reset rotation
            contentRef.current.rotation.x = 0;
        }
    });

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

            <group ref={contentRef}>
                <animated.mesh
                    ref={meshRef}
                    scale={animatedScale as any}
                    castShadow
                    receiveShadow
                >
                    <sphereGeometry args={[1, 32, 32]} />
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

                </animated.mesh>

            </group>
        </group>
    );
});
Pearl.displayName = "Pearl";

const ConnectionString = memo(() => {
    return (
        <group>
            {/* The String itself - Much Thicker for clear visibility */}
            <mesh castShadow receiveShadow>
                <cylinderGeometry args={[0.04, 0.04, 20, 16]} />
                <meshPhysicalMaterial
                    color="#e2e8f0" // Platinum/Silver
                    roughness={0.3}
                    metalness={0.5}
                    clearcoat={1}
                    clearcoatRoughness={0.1}
                    emissive="#94a3b8"
                    emissiveIntensity={0.5}
                />
            </mesh>

            {/* Subtle Divine Shimmer along the string */}
            <Sparkles
                count={25}
                scale={[0.05, 20, 0.05]}
                size={2}
                speed={0.5}
                opacity={0.3}
                color="#f8fafc"
            />
        </group>
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
            </mesh>
        </Trail>
    );
};

const ZenRipple = memo(({ trigger, color }: { trigger: number; color: string }) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const [active, setActive] = useState(false);
    const lastTrigger = useRef(trigger);

    useEffect(() => {
        if (trigger > lastTrigger.current) {
            setActive(true);
            const timer = setTimeout(() => setActive(false), 2000);
            return () => clearTimeout(timer);
        }
        lastTrigger.current = trigger;
    }, [trigger]);

    useFrame((state, delta) => {
        if (!active || !meshRef.current) return;
        meshRef.current.scale.addScalar(delta * 12);
        const mat = meshRef.current.material as THREE.MeshBasicMaterial;
        mat.opacity = Math.max(0, 0.15 - (meshRef.current.scale.x / 12) * 0.15);
    });

    useEffect(() => {
        if (active && meshRef.current) {
            meshRef.current.scale.set(0.1, 0.1, 0.1);
        }
    }, [active]);

    return (
        <mesh ref={meshRef} position={[0, 0, -5]} visible={active}>
            <ringGeometry args={[0.95, 1, 64]} />
            <meshBasicMaterial color={color} transparent opacity={0.15} depthWrite={false} blending={THREE.AdditiveBlending} />
        </mesh>
    );
});



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
        <group position={[0, 2.4, -1]}>
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
            mass: 0.8,
            tension: 180,
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

    const spacing = 0.58; // Beads are 0.56 in diameter, this makes them 'stuck'
    const [beadColor, setBeadColor] = useState(useSessionStore.getState().beadColor);
    useEffect(() => {
        return useSessionStore.subscribe((state) => {
            setBeadColor(state.beadColor);
        });
    }, []);

    return (
        <group position={[0, -0.85, 0]}>
            {/* The Rosary String - Straight Vertical */}
            <ConnectionString />


            {beadWindow.map((idx: number) => {
                return (
                    <animated.group
                        key={idx}
                        position={smoothedCount.to((sc: number) => {
                            const i = Math.floor(sc);
                            const f = sc - i;
                            const gap = 1.2; // Reduced gap for a tighter feel

                            // Base linear position
                            let y = (idx - sc) * spacing;

                            // Apply gap to future beads
                            if (idx > i + 1) {
                                y += gap;
                            } else if (idx === i + 1) {
                                // Smoothly transition the pulling bead across the gap
                                y += gap * (1 - f);
                            }
                            // Already counted/active beads stay 'pushed down'

                            return [0, y, 0];
                        })}
                    >
                        <Pearl
                            position={[0, 0, 0]}
                            idx={idx}
                            tapProgress={tapProgress}
                            smoothedCount={smoothedCount}
                            activeProgress={smoothedCount.to((sc: number) => {
                                // Highlight the "next" bead (the one at the top of the gap to be pulled)
                                let dist = Math.abs(idx - (sc + 1));
                                return Math.pow(Math.max(0, 1 - dist * 1.5), 4);
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
    const [beadColor, setBeadColor] = useState(useSessionStore.getState().beadColor);

    useEffect(() => {
        return useSessionStore.subscribe((state) => {
            isInteractiveRef.current = !state.isUiOpen && !state.isComplete;
            setIsUiOpen(state.isUiOpen);
            setThemeState(state.theme);
            setBeadColor(state.beadColor);
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
        // Total 8 beads: 4 history (count-3 to count), 1 active (count+1), 3 future (count+2 to count+4)
        for (let i = count - 3; i <= count + 4; i++) {
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
                    state.gl.setClearColor(0x000000, 0); // Always transparent to show page mesh glows
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

                <ZenRipple trigger={count} color={isLight ? "#6366f1" : (beadColor as string)} />
                <StarryNightBackground />
                <fog attach="fog" args={[isLight ? '#eeeef2' : '#05070c', isLight ? 6 : 4, isLight ? 30 : 25]} />
            </Canvas>
        </div>
    );
});

BeadScene.displayName = "BeadScene";
