"use client";

import { useSessionStore } from "@/lib/store/sessionStore";
import { useEffect, useState, useMemo, useRef } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useRouter } from "next/navigation";

import {
  Moon,
  Sun,
  Sunrise,
  Sunset,
  Play,
  Infinity as InfinityIcon,
  Library,
  Quote as QuoteIcon
} from "lucide-react";
import { getRandomQuote } from "@/lib/data/quotes";
import { HomeBackground } from "@/components/home/HomeBackground";
import { useTranslation } from "@/lib/hooks/useTranslation";

/* ─── Greeting Logic ──────────────────────────────── */
function getGreeting() {
  const h = new Date().getHours();
  if (h >= 5 && h < 12)
    return { key: "morning", icon: <Sunrise size={18} className="text-amber-400" />, accent: "#f59e0b", glow: "rgba(245,158,11,0.3)" };
  if (h >= 12 && h < 18)
    return { key: "afternoon", icon: <Sun size={18} className="text-orange-400" />, accent: "#f97316", glow: "rgba(249,115,22,0.3)" };
  if (h >= 18 && h < 22)
    return { key: "evening", icon: <Sunset size={18} className="text-rose-400" />, accent: "#f43f5e", glow: "rgba(244,63,94,0.3)" };
  return { key: "night", icon: <Moon size={18} className="text-indigo-400" />, accent: "#818cf8", glow: "rgba(129,140,248,0.3)" };
}

/* ─── 3D Tilt Card ─────────────────────────────────── */
const TiltCard = ({
  children,
  className = "",
  delay = 0,
  onClick,
  style: extraStyle = {},
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  onClick?: () => void;
  style?: React.CSSProperties;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), { stiffness: 300, damping: 30 });
  const glareX = useTransform(x, [-0.5, 0.5], [0, 100]);
  const glareY = useTransform(y, [-0.5, 0.5], [0, 100]);

  const handlePointerMove = (e: React.PointerEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handlePointerLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div style={{ perspective: "1200px" }} className={className}>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, scale: 0.88, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d", ...extraStyle }}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        whileTap={onClick ? { scale: 0.97 } : undefined}
        onClick={onClick}
        className={`glass-iridescent relative overflow-hidden rounded-[38px] flex items-center justify-center w-full h-full ${onClick ? "cursor-pointer" : ""}`}
      >
        {/* Dynamic glare */}
        <motion.div
          className="absolute inset-0 pointer-events-none rounded-[38px]"
          style={{
            background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.12) 0%, transparent 65%)`,
          }}
        />
        <div className="relative z-10 w-full h-full flex items-center justify-center">
          {children}
        </div>
      </motion.div>
    </div>
  );
};

/* ─── Orbit Ring ──────────────────────────────────── */
const OrbitRing = ({ size, duration, reverse = false, dotColor = "#818cf8" }: { size: string; duration: number; reverse?: boolean; dotColor?: string }) => (
  <motion.div
    className="absolute rounded-full border border-white/[0.06]"
    style={{ width: size, height: size }}
    animate={{ rotate: reverse ? -360 : 360 }}
    transition={{ duration, repeat: Infinity, ease: "linear" }}
  >
    <div
      className="absolute w-1.5 h-1.5 rounded-full"
      style={{
        top: "-3px",
        left: "50%",
        transform: "translateX(-50%)",
        backgroundColor: dotColor,
        boxShadow: `0 0 8px ${dotColor}`,
      }}
    />
  </motion.div>
);

export default function HomePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const { t, resolve, language } = useTranslation();
  const hasHydrated = useSessionStore((s) => s._hasHydrated);
  const preset = useSessionStore((s) => s.preset);
  const totalCount = useSessionStore((s) => s.totalCount);
  const isComplete = useSessionStore((s) => s.isComplete);
  const setFreeSession = useSessionStore((s) => s.setFreeSession);

  useEffect(() => { setMounted(true); }, []);

  const greeting = useMemo(() => getGreeting(), []);
  const dailyQuote = useMemo(() => getRandomQuote(), []);

  const hasActiveSession = mounted && hasHydrated && preset && totalCount > 0 && !isComplete;
  const progress = hasActiveSession && preset && preset.totalBeads > 0 ? (totalCount / preset.totalBeads) : 0;

  const handleStartFreeSession = () => {
    setFreeSession();
    router.push("/session");
  };

  if (!mounted || !hasHydrated) return <div className="min-h-screen bg-[#010208]" />;

  return (
    <div className="h-[100dvh] text-slate-100 flex flex-col relative overflow-hidden touch-none font-sans select-none">
      <HomeBackground />

      <main className="flex-1 px-5 pt-[calc(env(safe-area-inset-top,24px)+0.75rem)] pb-[calc(env(safe-area-inset-bottom,20px)+5.5rem)] flex flex-col z-10 max-w-[420px] mx-auto w-full h-full justify-between items-center overflow-hidden">

        {/* ── HEADER ──────────────────────────────── */}
        <div className="w-full shrink-0 space-y-3">

          {/* Greeting row */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-between w-full"
          >
            <div className="flex items-center gap-3">
              <motion.div
                className="w-10 h-10 rounded-[14px] glass-premium flex items-center justify-center border border-white/10"
                animate={{
                  boxShadow: [
                    `0 0 12px ${greeting.glow}`,
                    `0 0 24px ${greeting.glow}`,
                    `0 0 12px ${greeting.glow}`,
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                {greeting.icon}
              </motion.div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.5em] text-white/20 leading-none mb-0.5">
                  {t.home[`greeting_${greeting.key}` as keyof typeof t.home]}
                </p>
                <p className="text-sm font-light text-white/75 tracking-wide">
                  {t.home[`sub_${greeting.key}` as keyof typeof t.home]}
                </p>
              </div>
            </div>

            {/* Language toggle */}
            <div className="flex items-center p-1 rounded-[14px] glass-premium border border-white/10">
              <button
                onClick={() => useSessionStore.getState().setLanguage('fr')}
                className={`px-2 py-1 rounded-[10px] text-[10px] font-black transition-all ${language === 'fr' ? 'bg-white/10 text-white' : 'text-white/30 hover:text-white/60'}`}
              >
                FR
              </button>
              <button
                onClick={() => useSessionStore.getState().setLanguage('en')}
                className={`px-2 py-1 rounded-[10px] text-[10px] font-black transition-all ${language === 'en' ? 'bg-white/10 text-white' : 'text-white/30 hover:text-white/60'}`}
              >
                EN
              </button>
            </div>
          </motion.div>

          {/* Quote card */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="glass-premium rounded-[24px] p-4 border border-white/[0.05] relative overflow-hidden"
          >
            {/* Subtle top shine */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-indigo-500/15 border border-indigo-400/20 flex items-center justify-center shrink-0 mt-0.5">
                <QuoteIcon size={12} className="text-indigo-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13.5px] leading-[1.65] text-white/80 font-light italic">
                  &ldquo;{resolve(dailyQuote.text)}&rdquo;
                </p>
                <div className="flex items-center gap-2 mt-2.5">
                  <div className="h-px w-5 bg-gradient-to-r from-indigo-400/30 to-transparent" />
                  <span className="text-[9px] font-black uppercase tracking-[0.45em] text-white/18">
                    {resolve(dailyQuote.source)}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── HERO ────────────────────────────────── */}
        <div className="flex-1 flex flex-col justify-center items-center w-full min-h-0 gap-4 py-2">

          {/* 3D Tilt Hero */}
          <TiltCard
            className="w-full aspect-square max-w-[270px] max-h-[36vh]"
            delay={0.4}
            onClick={() => {
              if (hasActiveSession) router.push("/session");
              else router.push("/library");
            }}
          >
            {/* Ambient glow pulse */}
            <motion.div
              className="absolute inset-0 rounded-full bg-indigo-500/8 blur-[70px]"
              animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute inset-0 rounded-full bg-rose-500/5 blur-[50px]"
              animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Orbit rings */}
            <OrbitRing size="58%" duration={18} dotColor="#818cf8" />
            <OrbitRing size="74%" duration={26} reverse dotColor="#f472b6" />
            <OrbitRing size="90%" duration={36} dotColor="#fbbf24" />

            {/* Center */}
            <div className="relative z-10 flex flex-col items-center" style={{ transform: "translateZ(24px)" }}>
              {hasActiveSession ? (
                <div className="flex flex-col items-center">
                  <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30 mb-2">
                    {t.home.progression}
                  </span>
                  <span
                    className="text-7xl font-bold text-white tracking-tighter tabular-nums"
                    style={{ textShadow: "0 0 40px rgba(255,255,255,0.2)" }}
                  >
                    {Math.round(progress * 100)}
                    <span className="text-2xl opacity-25 align-top mt-2">%</span>
                  </span>
                  <p className="mt-3 text-[10px] font-bold text-white/35 tracking-wide bg-white/5 px-3 py-1 rounded-full border border-white/5 italic overflow-hidden max-w-[160px] truncate">
                    &ldquo;{resolve(preset?.name)}&rdquo;
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <motion.div
                    className="w-[72px] h-[72px] rounded-full bg-white flex items-center justify-center"
                    style={{ boxShadow: "0 0 0 0 rgba(255,255,255,0.3)" }}
                    animate={{
                      boxShadow: [
                        "0 0 30px rgba(255,255,255,0.2), 0 0 60px rgba(129,140,248,0.15)",
                        "0 0 50px rgba(255,255,255,0.35), 0 0 100px rgba(129,140,248,0.3)",
                        "0 0 30px rgba(255,255,255,0.2), 0 0 60px rgba(129,140,248,0.15)",
                      ],
                    }}
                    transition={{ duration: 3.5, repeat: Infinity }}
                    whileTap={{ scale: 0.92 }}
                  >
                    <Play className="text-black fill-black ml-1" size={30} />
                  </motion.div>
                  <span className="mt-5 text-[9px] font-black uppercase tracking-[0.5em] text-white/40">
                    {t.home.explorer}
                  </span>
                </div>
              )}
            </div>
          </TiltCard>

          {/* Quick Access Buttons */}
          <div className="w-full grid grid-cols-2 gap-3">

            <motion.button
              initial={{ opacity: 0, y: 18, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              whileTap={{ scale: 0.94, y: 2 }}
              onClick={() => router.push("/library")}
              className="flex flex-col items-center gap-2.5 py-5 glass-premium rounded-[28px] border border-white/[0.07] relative overflow-hidden group"
              style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.06)" }}
            >
              {/* Top shine */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-400/20 to-transparent" />
              {/* Hover/tap glow */}
              <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/8 to-transparent opacity-0 group-active:opacity-100 transition-opacity duration-150" />

              <div className="w-11 h-11 rounded-2xl bg-indigo-500/15 border border-indigo-400/20 flex items-center justify-center relative">
                <div className="absolute inset-0 rounded-2xl bg-indigo-400/10 blur-sm" />
                <Library size={20} className="text-indigo-400 relative z-10" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/55">{t.home.library}</span>
            </motion.button>

            <motion.button
              initial={{ opacity: 0, y: 18, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.7, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              whileTap={{ scale: 0.94, y: 2 }}
              onClick={handleStartFreeSession}
              className="flex flex-col items-center gap-2.5 py-5 glass-premium rounded-[28px] border border-white/[0.07] relative overflow-hidden group"
              style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.06)" }}
            >
              {/* Top shine */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-rose-400/20 to-transparent" />
              {/* Hover/tap glow */}
              <div className="absolute inset-0 bg-gradient-to-b from-rose-500/8 to-transparent opacity-0 group-active:opacity-100 transition-opacity duration-150" />

              <div className="w-11 h-11 rounded-2xl bg-rose-500/15 border border-rose-400/20 flex items-center justify-center relative">
                <div className="absolute inset-0 rounded-2xl bg-rose-400/10 blur-sm" />
                <InfinityIcon size={22} className="text-rose-400 relative z-10" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/55">{t.home.free}</span>
            </motion.button>

          </div>
        </div>

      </main>
    </div>
  );
}
