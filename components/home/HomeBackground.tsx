"use client";

import React, { useRef, useMemo, memo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PerspectiveCamera, MeshDistortMaterial, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

const LiquidNebulaMaterial = {
    uniforms: {
        uTime: { value: 0 },
        uColorA: { value: new THREE.Color("#0a0f2d") },
        uColorB: { value: new THREE.Color("#1e1b4b") },
        uColorC: { value: new THREE.Color("#312e81") },
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

        // Simplex 2D noise
        vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
        float snoise(vec2 v){
          const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                   -0.577350269189626, 0.024390243902439);
          vec2 i  = floor(v + dot(v, C.yy) );
          vec2 x0 = v -   i + dot(i, C.xx);
          vec2 i1;
          i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
          vec4 x12 = x0.xyxy + C.xxzz;
          x12.xy -= i1;
          i = mod(i, 289.0);
          vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
          + i.x + vec3(0.0, i1.x, 1.0 ));
          vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
            dot(x12.zw,x12.zw)), 0.0);
          m = m*m ;
          m = m*m ;
          vec3 x = 2.0 * fract(p * C.www) - 1.0;
          vec3 h = abs(x) - 0.5;
          vec3 a0 = x - floor(x + 0.5);
          vec3 g = sin(uTime * 0.1 + p * 6.28);
          m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
          vec3 vec;
          vec.x = a0.x  * x0.x  + h.x  * x0.y;
          vec.y = a0.y  * x12.x + h.y  * x12.y;
          vec.z = a0.z  * x12.z + h.z  * x12.w;
          return 130.0 * dot(m, vec);
        }

        void main() {
            vec2 uv = vUv;
            // Enhanced multi-layer noise for liquid effect
            float n1 = snoise(uv * 1.2 + uTime * 0.05);
            float n2 = snoise(uv * 2.5 - uTime * 0.08);
            float n3 = snoise(uv * 5.0 + uTime * 0.03);
            
            float combined = n1 * 0.5 + n2 * 0.3 + n3 * 0.2;
            vec3 color = mix(uColorA, uColorB, combined * 0.5 + 0.5);
            color = mix(color, uColorC, snoise(uv * 3.0 + uTime * 0.02) * 0.5 + 0.5);
            
            // Crystal refraction simulation
            float v = snoise(uv * 10.0 + uTime * 0.1);
            color += vec3(0.05, 0.08, 0.15) * v;
            
            // Depth and Vignette
            float edge = 1.0 - length(vUv - 0.5) * 1.1;
            gl_FragColor = vec4(color * 0.4 * clamp(edge, 0.3, 1.0), 1.0);
        }
    `
};

const BioluminescentParticles = ({ count = 600 }) => {
    const points = useMemo(() => {
        const p = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            p[i * 3] = (Math.random() - 0.5) * 20;
            p[i * 3 + 1] = (Math.random() - 0.5) * 20;
            p[i * 3 + 2] = (Math.random() - 0.5) * 15;
        }
        return p;
    }, [count]);

    const pointsRef = useRef<THREE.Points>(null);

    useFrame((state) => {
        if (pointsRef.current) {
            pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02;
            pointsRef.current.rotation.x = state.clock.elapsedTime * 0.01;
        }
    });

    return (
        <Points ref={pointsRef} positions={points} stride={3}>
            <PointMaterial
                transparent
                color="#818cf8"
                size={0.05}
                sizeAttenuation={true}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
                opacity={0.4}
            />
        </Points>
    );
};

const EtherealFloatingBead = ({ position, size, color, delay = 0 }: { position: [number, number, number], size: number, color: string, delay?: number }) => {
    return (
        <Float speed={2 + Math.random()} rotationIntensity={1} floatIntensity={2} position={position}>
            <mesh>
                <sphereGeometry args={[size, 64, 64]} />
                <MeshDistortMaterial
                    color={color}
                    speed={2}
                    distort={0.4}
                    radius={size}
                    transparent
                    opacity={0.6}
                    transmission={0.95}
                    thickness={2}
                    metalness={0.1}
                    roughness={0.05}
                    clearcoat={1}
                />
            </mesh>
        </Float>
    );
};

const BackgroundScene = () => {
    const materialRef = useRef<THREE.ShaderMaterial>(null);
    const lightRef = useRef<THREE.PointLight>(null);

    useFrame((state) => {
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
        }
        if (lightRef.current) {
            lightRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.5) * 10;
            lightRef.current.position.y = Math.cos(state.clock.elapsedTime * 0.3) * 8;
        }
    });

    return (
        <>
            <mesh scale={[35, 35, 1]} position={[0, 0, -5]}>
                <planeGeometry />
                <shaderMaterial
                    ref={materialRef}
                    {...LiquidNebulaMaterial}
                    transparent
                />
            </mesh>

            <BioluminescentParticles count={800} />

            <EtherealFloatingBead position={[-6, 4, -3]} size={0.8} color="#818cf8" />
            <EtherealFloatingBead position={[8, -5, -2]} size={1.8} color="#f472b6" />
            <EtherealFloatingBead position={[-3, -8, -4]} size={1} color="#fbbf24" />
            <EtherealFloatingBead position={[2, 6, -6]} size={1.5} color="#6366f1" />
            <EtherealFloatingBead position={[0, 0, -8]} size={3} color="#4338ca" />

            <ambientLight intensity={0.6} />
            <pointLight
                ref={lightRef}
                intensity={4}
                distance={25}
                color="#818cf8"
                decay={2}
            />
            <pointLight position={[15, 15, 5]} intensity={2} color="#ffffff" />
            <pointLight position={[-15, -15, -5]} intensity={1} color="#4f46e5" />
        </>
    );
};

export const HomeBackground = memo(() => {
    return (
        <div className="fixed inset-0 -z-10 pointer-events-none bg-[#010208]">
            <Canvas dpr={[1, 2]} gl={{ alpha: true, antialias: true }}>
                <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={50} />
                <BackgroundScene />
                <fog attach="fog" args={["#010208", 8, 25]} />
            </Canvas>

            {/* Refined Luxury Grain and Vignette */}
            <div className="absolute inset-0 opacity-[0.08] pointer-events-none mix-blend-soft-light scale-125">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat" />
            </div>

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(1,2,8,0.8)_100%)]" />
        </div>
    );
});

HomeBackground.displayName = "HomeBackground";
