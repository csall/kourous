"use client";

import React, { useRef, useMemo, memo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PerspectiveCamera, MeshDistortMaterial, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

/* ── Shader ───────────────────────────────────────────────── */
const LiquidNebulaMaterial = {
    uniforms: {
        uTime: { value: 0 },
        uColorA: { value: new THREE.Color("#04081c") },
        uColorB: { value: new THREE.Color("#170d38") },
        uColorC: { value: new THREE.Color("#2a1860") },
        uColorD: { value: new THREE.Color("#0b1e38") },
    },
    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        varying vec2 vUv;
        uniform float uTime;
        uniform vec3 uColorA;
        uniform vec3 uColorB;
        uniform vec3 uColorC;
        uniform vec3 uColorD;

        vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

        float snoise(vec2 v) {
            const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
            vec2 i  = floor(v + dot(v, C.yy));
            vec2 x0 = v - i + dot(i, C.xx);
            vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
            vec4 x12 = x0.xyxy + C.xxzz;
            x12.xy -= i1;
            i = mod(i, 289.0);
            vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
            vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
            m = m*m; m = m*m;
            vec3 x = 2.0 * fract(p * C.www) - 1.0;
            vec3 h = abs(x) - 0.5;
            vec3 a0 = x - floor(x + 0.5);
            m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
            vec3 gv;
            gv.x = a0.x * x0.x  + h.x * x0.y;
            gv.y = a0.y * x12.x + h.y * x12.y;
            gv.z = a0.z * x12.z + h.z * x12.w;
            return 130.0 * dot(m, gv);
        }

        void main() {
            vec2 uv = vUv;

            // Multi-layer fluid noise
            float n1 = snoise(uv * 1.1 + uTime * 0.04);
            float n2 = snoise(uv * 2.6 - uTime * 0.065);
            float n3 = snoise(uv * 5.2 + uTime * 0.022);
            float n4 = snoise(uv * 0.7 - uTime * 0.018);
            float combined = n1 * 0.45 + n2 * 0.3 + n3 * 0.15 + n4 * 0.1;

            // Deep color blends
            vec3 color = mix(uColorA, uColorB, combined * 0.5 + 0.5);
            color = mix(color, uColorC, snoise(uv * 2.2 + uTime * 0.014) * 0.5 + 0.5);
            color = mix(color, uColorD, snoise(uv * 1.4 - uTime * 0.028) * 0.3 + 0.3);

            // Aurora horizontal sweep
            float auroraN = snoise(vec2(uv.x * 2.5 + uTime * 0.06, uv.y * 0.4 + uTime * 0.01));
            float auroraMask = smoothstep(0.25, 0.65, uv.y) * smoothstep(0.92, 0.55, uv.y);
            color += vec3(0.015, 0.04, 0.12) * auroraN * auroraMask * 1.5;

            // Warm gold streak near bottom
            float goldN = snoise(vec2(uv.x * 3.0 - uTime * 0.04, uv.y * 0.3));
            float goldMask = smoothstep(0.8, 1.0, uv.y);
            color += vec3(0.04, 0.025, 0.0) * goldN * goldMask;

            // Crystal shimmer
            float v = snoise(uv * 11.0 + uTime * 0.11);
            color += vec3(0.025, 0.04, 0.08) * v;

            // Vignette
            float edge = 1.0 - length(vUv - 0.5) * 1.18;
            gl_FragColor = vec4(color * 0.48 * clamp(edge, 0.22, 1.0), 1.0);
        }
    `
};

/* ── Indigo/violet particles ──────────────────────────────── */
const BioluminescentParticles = ({ count = 1200 }: { count?: number }) => {
    const points = useMemo(() => {
        const p = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const theta = Math.random() * Math.PI * 2;
            const r = Math.pow(Math.random(), 0.6) * 16;
            p[i * 3] = Math.cos(theta) * r;
            p[i * 3 + 1] = (Math.random() - 0.5) * 22;
            p[i * 3 + 2] = (Math.random() - 0.5) * 12;
        }
        return p;
    }, [count]);

    const ref = useRef<THREE.Points>(null);
    useFrame((state) => {
        if (ref.current) {
            ref.current.rotation.y = state.clock.elapsedTime * 0.014;
            ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.09) * 0.04;
        }
    });

    return (
        <Points ref={ref} positions={points} stride={3}>
            <PointMaterial
                transparent color="#a5b4fc" size={0.04}
                sizeAttenuation depthWrite={false}
                blending={THREE.AdditiveBlending} opacity={0.55}
            />
        </Points>
    );
};

/* ── Gold accent particles ────────────────────────────────── */
const GoldParticles = ({ count = 350 }: { count?: number }) => {
    const points = useMemo(() => {
        const p = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            p[i * 3] = (Math.random() - 0.5) * 20;
            p[i * 3 + 1] = (Math.random() - 0.5) * 20;
            p[i * 3 + 2] = (Math.random() - 0.5) * 10;
        }
        return p;
    }, [count]);

    const ref = useRef<THREE.Points>(null);
    useFrame((state) => {
        if (ref.current) {
            ref.current.rotation.y = -state.clock.elapsedTime * 0.022;
            ref.current.rotation.z = state.clock.elapsedTime * 0.007;
        }
    });

    return (
        <Points ref={ref} positions={points} stride={3}>
            <PointMaterial
                transparent color="#fcd34d" size={0.028}
                sizeAttenuation depthWrite={false}
                blending={THREE.AdditiveBlending} opacity={0.28}
            />
        </Points>
    );
};

/* ── Rose accent particles ────────────────────────────────── */
const RoseParticles = ({ count = 250 }: { count?: number }) => {
    const points = useMemo(() => {
        const p = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            p[i * 3] = (Math.random() - 0.5) * 18;
            p[i * 3 + 1] = (Math.random() - 0.5) * 18;
            p[i * 3 + 2] = (Math.random() - 0.5) * 8;
        }
        return p;
    }, [count]);

    const ref = useRef<THREE.Points>(null);
    useFrame((state) => {
        if (ref.current) {
            ref.current.rotation.x = state.clock.elapsedTime * 0.012;
            ref.current.rotation.z = -state.clock.elapsedTime * 0.018;
        }
    });

    return (
        <Points ref={ref} positions={points} stride={3}>
            <PointMaterial
                transparent color="#fb7185" size={0.032}
                sizeAttenuation depthWrite={false}
                blending={THREE.AdditiveBlending} opacity={0.2}
            />
        </Points>
    );
};

/* ── Floating glass bead ──────────────────────────────────── */
const EtherealBead = ({
    position, size, color,
}: { position: [number, number, number]; size: number; color: string }) => (
    <Float
        speed={1.2 + Math.random() * 2.2}
        rotationIntensity={0.7}
        floatIntensity={1.4}
        position={position}
    >
        <mesh>
            <sphereGeometry args={[size, 64, 64]} />
            <MeshDistortMaterial
                color={color}
                speed={1.8}
                distort={0.38}
                radius={size}
                transparent
                opacity={0.5}
                transmission={0.96}
                thickness={2.8}
                metalness={0.12}
                roughness={0.02}
                clearcoat={1}
            />
        </mesh>
    </Float>
);

/* ── Scene ────────────────────────────────────────────────── */
const BackgroundScene = () => {
    const materialRef = useRef<THREE.ShaderMaterial>(null);
    const lightARef = useRef<THREE.PointLight>(null);
    const lightBRef = useRef<THREE.PointLight>(null);

    useFrame((state) => {
        const t = state.clock.elapsedTime;
        if (materialRef.current) materialRef.current.uniforms.uTime.value = t;
        if (lightARef.current) {
            lightARef.current.position.x = Math.sin(t * 0.38) * 13;
            lightARef.current.position.y = Math.cos(t * 0.24) * 10;
        }
        if (lightBRef.current) {
            lightBRef.current.position.x = Math.cos(t * 0.32) * 11;
            lightBRef.current.position.y = Math.sin(t * 0.19) * 8;
        }
    });

    return (
        <>
            {/* Background plane */}
            <mesh scale={[42, 42, 1]} position={[0, 0, -7]}>
                <planeGeometry />
                <shaderMaterial ref={materialRef} {...LiquidNebulaMaterial} transparent />
            </mesh>

            {/* Particle systems */}
            <BioluminescentParticles count={1200} />
            <GoldParticles count={350} />
            <RoseParticles count={250} />

            {/* Floating glass beads */}
            <EtherealBead position={[-7, 5, -3]} size={0.65} color="#818cf8" />
            <EtherealBead position={[8, -5, -2]} size={1.55} color="#f472b6" />
            <EtherealBead position={[-4, -7, -4]} size={0.85} color="#fbbf24" />
            <EtherealBead position={[3, 7, -6]} size={1.35} color="#6366f1" />
            <EtherealBead position={[0, 0, -10]} size={2.7} color="#3730a3" />
            <EtherealBead position={[10, 2, -5]} size={0.55} color="#34d399" />
            <EtherealBead position={[-9, -3, -7]} size={1.0} color="#fb923c" />
            <EtherealBead position={[5, -9, -3]} size={0.7} color="#c084fc" />

            {/* Lights */}
            <ambientLight intensity={0.45} />
            <pointLight ref={lightARef} intensity={5.5} distance={30} color="#818cf8" decay={2} />
            <pointLight ref={lightBRef} intensity={3.5} distance={22} color="#f472b6" decay={2} />
            <pointLight position={[14, 14, 5]} intensity={2} color="#ffffff" />
            <pointLight position={[-14, -14, -5]} intensity={1.5} color="#4f46e5" />
            <pointLight position={[0, -12, 0]} intensity={1.2} color="#fbbf24" decay={2} />
        </>
    );
};

/* ── Export ───────────────────────────────────────────────── */
export const HomeBackground = memo(() => (
    <div className="fixed inset-0 -z-10 pointer-events-none bg-[#010208]">
        <Canvas dpr={[1, 2]} gl={{ alpha: true, antialias: true }}>
            <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={50} />
            <BackgroundScene />
            <fog attach="fog" args={["#010208", 10, 30]} />
        </Canvas>

        {/* Grain overlay */}
        <div className="absolute inset-0 opacity-[0.055] pointer-events-none mix-blend-soft-light scale-125">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat" />
        </div>

        {/* Soft vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_50%,transparent_25%,rgba(1,2,8,0.7)_100%)]" />

        {/* Top fade for status bar readability */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[rgba(1,2,8,0.4)] to-transparent" />
    </div>
));

HomeBackground.displayName = "HomeBackground";
