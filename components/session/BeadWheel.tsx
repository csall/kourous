"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import { useSessionStore } from "@/lib/store/sessionStore";

const TOTAL_BEADS = 36;

export function BeadWheel() {
  const { preset, totalCount } = useSessionStore((state) => ({
    preset: state.preset,
    totalCount: state.totalCount,
  }));

  const beads = useMemo(() => {
    const count = preset?.totalBeads ?? TOTAL_BEADS;
    return Array.from({ length: count }).map((_, idx) => idx);
  }, [preset]);

  if (!preset) return null;

  return (
    <div className="relative mx-auto h-72 w-72">
      <motion.div
        className="absolute inset-[18%] rounded-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-center text-white shadow-[0_30px_80px_rgba(15,15,35,0.35)]"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <div className="flex h-full flex-col items-center justify-center gap-1">
          <p className="text-xs uppercase tracking-[0.35em] text-white/60">Progression</p>
          <p className="text-5xl font-semibold">{totalCount}</p>
          <p className="text-sm text-white/60">/ {preset.totalBeads}</p>
        </div>
      </motion.div>
      {beads.map((index) => {
        const angle = (index / beads.length) * 360;
        const radians = (angle * Math.PI) / 180;
        const radius = 150;
        const x = Math.cos(radians) * radius;
        const y = Math.sin(radians) * radius;
        const active = index < totalCount;
        return (
          <motion.span
            key={index}
            className={`absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full shadow ${
              active ? "bg-rose-500 shadow-rose-200" : "bg-slate-200 shadow-white"
            }`}
            style={{ transform: `translate(-50%, -50%) translate(${x}px, ${y}px)` }}
            animate={{ scale: active ? 1.2 : 0.9, opacity: active ? 1 : 0.7 }}
            transition={{ duration: 0.3 }}
          />
        );
      })}
    </div>
  );
}
