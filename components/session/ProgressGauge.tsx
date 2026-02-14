"use client";

import { motion } from "framer-motion";

interface ProgressGaugeProps {
    current: number;
    total: number;
    size?: number;
    strokeWidth?: number;
    color?: string;
}

export function ProgressGauge({
    current,
    total,
    size = 80,
    strokeWidth = 6,
    color = "#fb7185" // rose-400
}: ProgressGaugeProps) {
    const radius = size / 2;
    const normalizedRadius = radius - strokeWidth * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const percentage = Math.min((current / total), 1);
    const strokeDashoffset = circumference - percentage * circumference;

    return (
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            {/* Background Circle */}
            <svg
                height={size}
                width={size}
                className="rotate-[-90deg] absolute"
            >
                <circle
                    stroke="rgba(255, 255, 255, 0.1)"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                />
            </svg>

            {/* Progress Circle */}
            <svg
                height={size}
                width={size}
                className="rotate-[-90deg] absolute"
                style={{ overflow: 'visible' }}
            >
                <motion.circle
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference + ' ' + circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    strokeLinecap="round"
                    fill="transparent"
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                />

                {/* Optional: Glow effect on the tip? Maybe too complex for now. */}
            </svg>

            {/* Center Text */}
            <div className="absolute flex flex-col items-center justify-center text-white z-10">
                <motion.span
                    key={current}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-2xl font-bold font-mono leading-none tracking-tighter"
                >
                    {current}
                </motion.span>
                <span className="text-[10px] text-white/50 uppercase tracking-widest mt-1">
                    of {total}
                </span>
            </div>

            {/* Ambient Glow behind */}
            <div
                className="absolute inset-0 rounded-full bg-rose-500/5 blur-xl pointer-events-none"
            />
        </div>
    );
}
