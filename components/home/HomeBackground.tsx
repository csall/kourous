"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, PerspectiveCamera } from "@react-three/drei";
import { useRef, useMemo, memo } from "react";
import * as THREE from "three";

// Custom Shader for the Liquid Nebula
const LiquidNebulaMaterial = {
    uniforms: {
        uTime: { value: 0 },
        uColorA: { value: new THREE.Color("#4f46e5") }, // Indigo
        uColorB: { value: new THREE.Color("#7c3aed") }, // Violet
        uColorC: { value: new THREE.Color("#db2777") }, // Pink
        uResolution: { value: new THREE.Vector2() },
    },
    vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        void main() {
            vUv = uv;
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform float uTime;
        uniform vec2 uResolution;
        uniform vec3 uColorA;
        uniform vec3 uColorB;
        uniform vec3 uColorC;
        varying vec2 vUv;
        varying vec3 vPosition;

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
          vec3 m1 = m * ( 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h ) );
          vec3 g;
          g.x  = a0.x  * x0.x  + h.x  * x0.y;
          g.yz = a0.yz * x12.xz + h.yz * x12.yw;
          return 130.0 * dot(m1, g);
        }

        void main() {
            vec2 uv = vUv;
            // Enhanced multi-layer noise
            float n1 = snoise(uv * 1.5 + uTime * 0.08);
            float n2 = snoise(uv * 3.0 - uTime * 0.12);
            float n3 = snoise(uv * 6.0 + uTime * 0.05);
            
            float combined = n1 * 0.5 + n2 * 0.3 + n3 * 0.2;
            vec3 color = mix(uColorA, uColorB, combined * 0.5 + 0.5);
            color = mix(color, uColorC, snoise(uv * 2.0 + uTime * 0.04) * 0.5 + 0.5);
            
            // Apply high-end depth (darken edges)
            float edge = 1.0 - length(vUv - 0.5) * 1.2;
            gl_FragColor = vec4(color * 0.5 * clamp(edge, 0.2, 1.0), 1.0);
        }
    `
};

const EtherealFloatingBead = ({ position, size, color }: { position: [number, number, number], size: number, color: string }) => {
    return (
        <Float speed={2} rotationIntensity={1} floatIntensity={2} position={position}>
            <mesh>
                <sphereGeometry args={[size, 64, 64]} />
                <MeshDistortMaterial
                    color={color}
                    speed={3}
                    distort={0.4}
                    radius={size}
                    transparent
                    opacity={0.5}
                    transmission={0.9}
                    thickness={1.5}
                    metalness={0.2}
                    roughness={0.1}
                    clearcoat={1}
                />
            </mesh>
        </Float>
    );
};

const BackgroundScene = () => {
    const materialRef = useRef<THREE.ShaderMaterial>(null);

    useFrame((state) => {
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
        }
    });

    return (
        <>
            <mesh scale={[25, 25, 1]} position={[0, 0, -3]}>
                <planeGeometry />
                <shaderMaterial
                    ref={materialRef}
                    {...LiquidNebulaMaterial}
                    transparent
                />
            </mesh>

            <EtherealFloatingBead position={[-4, 3, -2]} size={0.6} color="#818cf8" />
            <EtherealFloatingBead position={[5, -3, -1]} size={1.5} color="#f472b6" />
            <EtherealFloatingBead position={[-2, -5, -3]} size={0.8} color="#fbbf24" />
            <EtherealFloatingBead position={[1, 4, -4]} size={1.2} color="#6366f1" />

            <ambientLight intensity={0.8} />
            <pointLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" />
            <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4f46e5" />
        </>
    );
};

export const HomeBackground = memo(() => {
    return (
        <div className="fixed inset-0 -z-10 pointer-events-none bg-[#02040a]">
            <Canvas dpr={[1, 2]} gl={{ alpha: true }}>
                <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={55} />
                <BackgroundScene />
                <fog attach="fog" args={["#02040a", 5, 20]} />
            </Canvas>

            {/* Grain & Noise Overlay - Refined */}
            <div className="absolute inset-0 opacity-[0.1] pointer-events-none mix-blend-soft-light">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat opacity-40 scale-150" />
            </div>

            {/* Luxury Vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.6)_100%)]" />
        </div>
    );
});

HomeBackground.displayName = "HomeBackground";
