"use client";

import Link from "next/link";
import { useSessionStore } from "@/lib/store/sessionStore";
import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
  Sparkles,
  Moon,
  Sun,
  Sunrise,
  Sunset,
  Play,
} from "lucide-react";

const PrayingHands = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 21.5V6" />
    <path d="M12 21.5C12 21.5 16 19 17 15C18 11 15 5.5 12 2C9 5.5 6 11 7 15C8 19 12 21.5 12 21.5Z" />
  </svg>
);

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



  if (!mounted || !hasHydrated) return <div className="min-h-screen bg-slate-950" />;

  return (
    <div className="h-[100dvh] max-h-[100dvh] bg-slate-950 text-slate-100 flex flex-col items-center overflow-hidden selection:bg-blue-500/30 relative touch-none">
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
      <div className="flex-1 w-full max-h-full flex flex-col items-center justify-between px-6 pb-[calc(env(safe-area-inset-bottom,20px)+90px)] pt-[calc(env(safe-area-inset-top,20px)+2rem)]">

        {/* ── TOP GREETING ────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center text-center gap-1 shrink-0"
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
          className="relative flex items-center justify-center py-2 shrink-0"
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
            className="absolute w-56 h-56 rounded-full blur-[60px]"
            style={{ backgroundColor: `${beadColor}66` }}
          />

          {/* The Action Orb */}
          <Link href="/session" className="relative group block">
            <motion.div
              whileTap={{ scale: 0.9, rotate: 1 }}
              className="w-48 h-48 rounded-full bg-white/[0.02] border border-white/[0.08] backdrop-blur-3xl flex flex-col items-center justify-center text-center p-6 transition-colors hover:bg-white/[0.05] relative z-10 overflow-hidden shadow-[inset_0_0_40px_rgba(255,255,255,0.02)]"
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
                    className="flex flex-col items-center justify-center gap-3"
                  >
                    <div className="text-[9px] font-black tracking-[0.3em] uppercase text-white/40">Continuer</div>
                    <div className="text-4xl font-black tracking-tighter tabular-nums text-white">
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
                    className="flex flex-col items-center justify-center gap-4 group/orb"
                  >
                    {/* Circular Play Trigger */}
                    <div className="relative">
                      {/* Ripple Rings */}
                      <div className="absolute inset-0 rounded-full border border-white/20 opacity-0 group-hover/orb:opacity-100 group-hover/orb:animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]" />
                      <div className="absolute inset-0 rounded-full border border-white/10 opacity-0 group-hover/orb:opacity-50 group-hover/orb:animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite] delay-150" />

                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                          backgroundColor: beadColor,
                          boxShadow: `0 0 40px -10px ${beadColor}80`
                        }}
                        className="relative w-14 h-14 rounded-full flex items-center justify-center text-white shadow-2xl z-10 border border-white/20 backdrop-blur-md"
                      >
                        <PrayingHands size={24} className="ml-0.5 relative z-10" />

                        {/* Inner Gloss */}
                        <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent rounded-t-full opacity-60" />
                      </motion.div>
                    </div>

                    {/* Text Label */}
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white group-hover/orb:tracking-[0.4em] transition-all duration-500">
                        Commencer
                      </span>
                      <div className="h-px w-6 bg-white/20 group-hover/orb:w-12 transition-all duration-500" />
                    </div>
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
