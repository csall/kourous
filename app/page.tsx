"use client";

import Link from "next/link";
import { useSessionStore } from "@/lib/store/sessionStore";
import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRouter } from "next/navigation";

import {
  Sparkles,
  Moon,
  Sun,
  Sunrise,
  Sunset,
  Play,
  Infinity as InfinityIcon,
  Library,
  ChevronRight
} from "lucide-react";

/* ─── Greeting Logic ─────────────────────────────────────── */
function getGreeting(): { label: string; sub: string; icon: React.ReactNode } {
  const h = new Date().getHours();
  if (h >= 5 && h < 12)
    return { label: "Bonjour", sub: "La clarté du matin", icon: <Sunrise size={18} className="text-amber-300" /> };
  if (h >= 12 && h < 18)
    return { label: "Bienvenue", sub: "L'équilibre du moment", icon: <Sun size={18} className="text-orange-300" /> };
  if (h >= 18 && h < 22)
    return { label: "Bonsoir", sub: "Un souffle de sérénité", icon: <Sunset size={18} className="text-rose-300" /> };
  return { label: "Douce nuit", sub: "La paix du silence", icon: <Moon size={18} className="text-indigo-200" /> };
}

/* ─── Particle Background Component ──────────────────────── */
const ParticleBackground = ({ color }: { color: string }) => {
  // Generate stable random positions for Client Side
  const [particles, setParticles] = useState<Array<{ x: number, y: number, size: number, duration: number }>>([]);

  useEffect(() => {
    const p = Array.from({ length: 20 }).map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      duration: Math.random() * 20 + 10,
    }));
    setParticles(p);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full opacity-20"
          style={{
            backgroundColor: color,
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
};

export default function ZenDashboard() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const hasHydrated = useSessionStore((s) => s._hasHydrated);
  const preset = useSessionStore((s) => s.preset);
  const totalCount = useSessionStore((s) => s.totalCount);
  const isComplete = useSessionStore((s) => s.isComplete);
  const beadColor = useSessionStore((s) => s.beadColor);
  const setFreeSession = useSessionStore((s) => s.setFreeSession);

  useEffect(() => { setMounted(true); }, []);

  const greeting = useMemo(() => getGreeting(), []);

  // Decide what "main action" to show
  const hasActiveSession = mounted && hasHydrated && preset && totalCount > 0 && !isComplete;
  const progress = hasActiveSession && preset ? (totalCount / preset.totalBeads) : 0;

  // ─── TILT EFFECT ──────────────────────────────────────────
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-300, 300], [5, -5]); // Reduced tilt for subtle feel
  const rotateY = useTransform(x, [-300, 300], [-5, 5]);

  const springConfig = { damping: 25, stiffness: 150 };
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(event.clientX - centerX);
    y.set(event.clientY - centerY);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  const handleStartFreeSession = () => {
    setFreeSession();
    router.push("/session");
  };

  if (!mounted || !hasHydrated) return <div className="min-h-screen bg-slate-950" />;

  return (
    <div
      className="h-[100dvh] max-h-[100dvh] bg-slate-950 text-slate-100 flex flex-col items-center overflow-hidden selection:bg-blue-500/30 relative touch-none perspective-1000"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="absolute inset-0 noise-bg pointer-events-none opacity-20" />

      {/* ── PARTICLES LAYER ──────────────────────────────── */}
      <ParticleBackground color={beadColor} />

      {/* ── IMMERSIVE BACKGROUND GLOWS ────────────────────── */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-slate-950">
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.2, 0.1],
            rotate: [0, 90, 0], // Slight rotation
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-30%] right-[-20%] w-[140%] h-[140%] blur-[160px] rounded-full mix-blend-screen"
          style={{ backgroundColor: beadColor }}
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.05, 0.1, 0.05],
            x: [0, -50, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[-30%] left-[-20%] w-[120%] h-[120%] bg-indigo-900 blur-[180px] rounded-full mix-blend-screen"
        />
      </div>

      {/* ── CONTENT WRAPPER ──────────────────────────────── */}
      <motion.div
        style={{ rotateX: springRotateX, rotateY: springRotateY }}
        className="flex-1 w-full max-w-md flex flex-col items-center justify-between p-6 z-10 min-h-[100svh] pt-[calc(env(safe-area-inset-top,20px)+2rem)] pb-[calc(env(safe-area-inset-bottom,20px)+2rem)]"
      >

        {/* ── TOP GREETING ────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="flex flex-col items-center text-center gap-2 shrink-0"
        >
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-md shadow-lg">
            {greeting.icon}
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-slate-300">{greeting.label}</span>
          </div>
          <h1 className="text-xl font-light text-white/90 tracking-tight">
            {greeting.sub}
          </h1>
        </motion.div>

        {/* ── CENTRAL ACTION MODULE ──────────────────────── */}
        <div className="flex-1 flex flex-col items-center justify-center gap-8 w-full">

          {/* ORB */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="relative flex items-center justify-center shrink-0"
          >
            <div className="relative group perspective-500">

              {/* Complex Pulse Aura */}
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-gradient-to-tr from-indigo-500/30 to-emerald-500/30 blur-[60px] rounded-full scale-150"
              />

              {/* The ORB */}
              <Link href={hasActiveSession ? "/session" : "/library"} className="block relative z-10">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-56 h-56 sm:w-64 sm:h-64 rounded-full border border-white/10 relative flex items-center justify-center overflow-hidden shadow-2xl backdrop-blur-xl bg-white/[0.02]"
                  style={{
                    boxShadow: `0 20px 50px -20px ${beadColor}40, inset 0 0 80px -20px rgba(255,255,255,0.05)`
                  }}
                >
                  {/* Dynamic Inner Gradient */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-transparent opacity-50"
                  />

                  {/* Orbital Rings - Inner */}
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-4 rounded-full border border-white/5 border-t-white/20 border-l-transparent border-r-transparent"
                  />

                  {/* Orbiting Content */}
                  <div className="relative z-20 flex flex-col items-center justify-center gap-2 text-center p-6">
                    {hasActiveSession ? (
                      <>
                        <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-emerald-400">En cours</div>
                        <div className="text-5xl font-bold tracking-tight text-white tabular-nums">
                          {Math.round(progress * 100)}<span className="text-lg opacity-40">%</span>
                        </div>
                        <div className="text-sm text-white/50 max-w-[80%] truncate">{preset?.name}</div>
                      </>
                    ) : (
                      <>
                        <motion.div
                          whileHover={{ rotate: 180 }}
                          transition={{ duration: 0.5 }}
                          className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-1 ring-1 ring-white/10 group-hover:bg-white/10"
                        >
                          <Library size={24} className="text-white/80" />
                        </motion.div>
                        <span className="text-lg font-medium text-white tracking-wide group-hover:text-white transition-colors">
                          Bibliothèque
                        </span>
                        <span className="text-[10px] uppercase tracking-widest text-white/40">Choisir une prière</span>
                      </>
                    )}
                  </div>

                  {/* Circular Progress (Active) */}
                  {hasActiveSession && (
                    <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
                      <circle cx="50%" cy="50%" r="48%" fill="none" stroke="white" strokeWidth="1" strokeOpacity="0.1" />
                      <motion.circle
                        cx="50%" cy="50%" r="48%"
                        fill="none"
                        stroke={beadColor}
                        strokeWidth="3"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: progress }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                      />
                    </svg>
                  )}
                </motion.div>
              </Link>

              {/* Orbital Ring - Outer */}
              <div className="absolute inset-0 -m-6 border border-white/5 rounded-full animate-spin-slow pointer-events-none opacity-50" />
              <div className="absolute inset-0 -m-2 border border-dashed border-white/10 rounded-full animate-reverse-spin pointer-events-none opacity-30" />
            </div>
          </motion.div>

          {/* BUTTON (Grouped with Orb) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="w-full max-w-[280px]" // Limit width for better stacking
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleStartFreeSession}
              className="w-full relative group overflow-hidden bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 p-3 rounded-xl flex items-center justify-between transition-all hover:bg-emerald-500/30 hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]"
            >
              {/* Animated Shimmer Effect */}
              <motion.div
                className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent z-0"
                style={{
                  skewX: "-20deg"
                }}
              />

              <div className="flex items-center gap-3 relative z-10 px-2">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                  <InfinityIcon size={16} />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-white text-sm">Session Libre</h3>
                </div>
              </div>

              <div className="relative z-10 text-emerald-400/50 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all px-2">
                <ChevronRight size={16} />
              </div>
            </motion.button>
          </motion.div>

        </div>
        {/* End Central Module */}

      </motion.div>
    </div>
  );
}
