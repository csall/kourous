"use client";

import Link from "next/link";
import { useSessionStore } from "@/lib/store/sessionStore";
import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  Sparkles,
  Moon,
  Sun,
  Sunrise,
  Sunset,
  Play,
} from "lucide-react";

/* ─── Greeting Logic ─────────────────────────────────────── */
function getGreeting(): { label: string; sub: string; icon: React.ReactNode } {
  const h = new Date().getHours();
  if (h >= 5 && h < 12)
    return { label: "Bonjour", sub: "La clarté du matin", icon: <Sunrise size={20} className="text-amber-300" /> };
  if (h >= 12 && h < 18)
    return { label: "Bienvenue", sub: "L'équilibre du moment", icon: <Sun size={20} className="text-orange-300" /> };
  if (h >= 18 && h < 22)
    return { label: "Bonsoir", sub: "Un souffle de sérénité", icon: <Sunset size={20} className="text-rose-300" /> };
  return { label: "Douce nuit", sub: "La paix du silence", icon: <Moon size={20} className="text-indigo-200" /> };
}

export default function ZenDashboard() {
  const [mounted, setMounted] = useState(false);
  const hasHydrated = useSessionStore((s) => s._hasHydrated);
  const preset = useSessionStore((s) => s.preset);
  const totalCount = useSessionStore((s) => s.totalCount);
  const isComplete = useSessionStore((s) => s.isComplete);
  const beadColor = useSessionStore((s) => s.beadColor);

  useEffect(() => { setMounted(true); }, []);

  const greeting = useMemo(() => getGreeting(), []);
  const hasActiveSession = mounted && hasHydrated && preset && totalCount > 0 && !isComplete;
  const progress = hasActiveSession && preset ? (totalCount / preset.totalBeads) : 0;

  const handleStartEffect = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: [beadColor, '#ffffff', '#60a5fa'],
      ticks: 200,
      gravity: 1.2,
      scalar: 0.7,
      shapes: ['circle', 'square'],
    });
  };

  if (!mounted || !hasHydrated) return <div className="min-h-screen bg-slate-950" />;

  return (
    <div className="h-[100dvh] bg-slate-950 text-slate-100 flex flex-col items-center overflow-hidden selection:bg-blue-500/30 relative">
      <div className="absolute inset-0 noise-bg pointer-events-none opacity-20" />

      {/* ── IMMERSIVE BACKGROUND ─────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-slate-950">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.25, 0.15],
            x: [0, 30, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-20%] right-[-10%] w-[120%] h-[120%] blur-[160px] rounded-full"
          style={{ backgroundColor: beadColor }}
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.05, 0.12, 0.05],
            x: [0, -20, 0],
            y: [0, 20, 0],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[-10%] left-[-20%] w-[100%] h-[100%] bg-indigo-600 blur-[180px] rounded-full"
        />
      </div>

      {/* ── CONTENT WRAPPER ──────────────────────────────── */}
      <div className="flex-1 w-full flex flex-col items-center justify-between px-6 pb-[calc(env(safe-area-inset-bottom,0px)+74px)] pt-[calc(env(safe-area-inset-top,0px)+1.5rem)]">

        {/* ── TOP GREETING ────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center text-center gap-2"
        >
          <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.06] backdrop-blur-3xl shadow-2xl">
            {greeting.icon}
            <span className="text-xs font-medium tracking-[0.2em] uppercase text-slate-400">{greeting.label}</span>
          </div>
          <h1 className="text-base font-light tracking-wide text-slate-400/60 lowercase italic">
            {greeting.sub}
          </h1>
        </motion.div>

        {/* ── CENTRAL ORB GATEWAY ─────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="relative flex items-center justify-center py-4"
        >
          {/* Breathing Aura */}
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute w-64 h-64 rounded-full blur-[60px]"
            style={{ backgroundColor: `${beadColor}66` }}
          />

          {/* The Action Orb */}
          <Link href="/session" onClick={handleStartEffect} className="relative group block">
            <motion.div
              whileTap={{ scale: 0.9, rotate: 1 }}
              className="w-56 h-56 rounded-full bg-white/[0.02] border border-white/[0.08] backdrop-blur-3xl flex flex-col items-center justify-center text-center p-8 transition-colors hover:bg-white/[0.05] relative z-10 overflow-hidden shadow-[inset_0_0_40px_rgba(255,255,255,0.02)]"
            >
              <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity">
                <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white to-transparent" />
                <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-white to-transparent" />
              </div>

              <AnimatePresence mode="wait">
                {hasActiveSession ? (
                  <motion.div
                    key="active"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center gap-4"
                  >
                    <div className="text-[10px] font-black tracking-[0.3em] uppercase text-white/40">Continuer</div>
                    <div className="text-5xl font-black tracking-tighter tabular-nums text-white">
                      {Math.round(progress * 100)}<span className="text-lg opacity-30 ml-1">%</span>
                    </div>
                    <div className="text-[11px] font-medium text-slate-500 tracking-wider">
                      {preset?.name}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="new"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col items-center justify-center"
                  >
                    <div className="relative group/btn">
                      <div className="absolute -inset-4 bg-white/5 rounded-full blur-2xl opacity-0 group-hover/btn:opacity-100 transition-opacity duration-700" />

                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.9, rotate: -2 }}
                        className="relative px-8 py-4 rounded-2xl bg-white text-slate-950 font-bold text-sm uppercase tracking-[0.2em] shadow-[0_20px_50px_rgba(255,255,255,0.2)] flex items-center gap-3 overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite] pointer-events-none" />
                        <Sparkles size={16} className="text-slate-900" />
                        Commencer
                      </motion.div>
                    </div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.5 }}
                      className="mt-6 text-[10px] font-medium text-white uppercase tracking-[0.3em] italic"
                    >
                      Un voyage intérieur
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {hasActiveSession && (
                <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
                  <circle
                    cx="50%" cy="50%" r="48%"
                    fill="none"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeDasharray="1 1"
                    strokeOpacity="0.05"
                  />
                  <motion.circle
                    cx="50%" cy="50%" r="48%"
                    fill="none"
                    stroke={beadColor}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeDasharray="100 100"
                    pathLength="100"
                    initial={{ strokeDashoffset: 100 }}
                    animate={{ strokeDashoffset: 100 - (progress * 100) }}
                    transition={{ duration: 2, ease: "circOut" }}
                    strokeOpacity="0.8"
                  />
                </svg>
              )}
            </motion.div>
          </Link>
        </motion.div>

        {/* ── FOOTER HINT ───────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 1.5, delay: 1 }}
          className="flex flex-col items-center gap-2"
        >
          <div className="w-px h-8 bg-gradient-to-b from-transparent via-white/40 to-transparent" />
          <span className="text-[10px] font-medium uppercase tracking-[0.4em] text-white">Kourous</span>
        </motion.div>
      </div>
    </div>
  );
}
