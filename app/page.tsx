"use client";

import Link from "next/link";
import { useSessionStore } from "@/lib/store/sessionStore";
import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

import {
  Moon,
  Sun,
  Sunrise,
  Sunset,
  Play,
  Infinity as InfinityIcon,
  Library,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Quote
} from "lucide-react";

/* ─── Greeting & Date Logic ──────────────────────────────── */
function getGreeting() {
  const h = new Date().getHours();
  if (h >= 5 && h < 12)
    return { label: "Bonjour", sub: "Matinée paisible", icon: <Sunrise size={20} className="text-amber-400" />, theme: "from-amber-500/20 to-orange-600/10" };
  if (h >= 12 && h < 18)
    return { label: "Après-midi", sub: "Restez centré", icon: <Sun size={20} className="text-orange-400" />, theme: "from-orange-500/20 to-rose-600/10" };
  if (h >= 18 && h < 22)
    return { label: "Bonsoir", sub: "Détente du soir", icon: <Sunset size={20} className="text-rose-400" />, theme: "from-rose-500/20 to-indigo-600/10" };
  return { label: "Bonne nuit", sub: "Paix intérieure", icon: <Moon size={20} className="text-indigo-400" />, theme: "from-indigo-500/30 to-slate-900/80" };
}

function getTodayDates() {
  const now = new Date();
  const gregorian = new Intl.DateTimeFormat("fr-FR", { weekday: 'long', day: 'numeric', month: 'long' }).format(now);
  const hijri = new Intl.DateTimeFormat("fr-FR-u-ca-islamic", { day: 'numeric', month: 'long', year: 'numeric' }).format(now);
  return { gregorian, hijri };
}

/* ─── iOS Glass Widget Component ───────────────────────────────── */
const GlassCard = ({ children, className = "", delay = 0, onClick }: { children: React.ReactNode, className?: string, delay?: number, onClick?: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.7,
        delay,
        type: "spring",
        stiffness: 100,
        damping: 20
      }}
      whileTap={onClick ? { scale: 0.96 } : undefined}
      onClick={onClick}
      className={`relative overflow-hidden bg-white/[0.05] border border-white/[0.1] shadow-2xl shadow-black/40 backdrop-blur-2xl rounded-[32px] p-6 flex flex-col ${className} ${onClick ? 'cursor-pointer hover:bg-white/[0.08] transition-colors duration-300' : ''}`}
    >
      {/* Glossy top overlay (reflection effect) */}
      <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />
      {children}
    </motion.div>
  );
};

/* ─── Ambient Glow ────────────────────────────────── */
const AmbientGlow = ({ theme }: { theme: string }) => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10 bg-slate-950">
    <div className={`absolute top-[-10%] left-[-20%] w-[140%] h-[70%] rounded-full bg-gradient-to-br ${theme} blur-[120px] opacity-60 animate-pulse-slow`} />
    <div className="absolute bottom-[-10%] right-[-20%] w-[100%] h-[60%] rounded-full bg-indigo-900/20 blur-[100px]" />
    <div className="absolute inset-0 noise-bg opacity-[0.2] mix-blend-overlay" />
  </div>
);

export default function ModernDashboard() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const hasHydrated = useSessionStore((s) => s._hasHydrated);
  const preset = useSessionStore((s) => s.preset);
  const totalCount = useSessionStore((s) => s.totalCount);
  const isComplete = useSessionStore((s) => s.isComplete);
  const setFreeSession = useSessionStore((s) => s.setFreeSession);

  useEffect(() => { setMounted(true); }, []);

  const greeting = useMemo(() => getGreeting(), []);
  const dates = useMemo(() => getTodayDates(), []);

  const hasActiveSession = mounted && hasHydrated && preset && totalCount > 0 && !isComplete;
  const progress = hasActiveSession && preset && preset.totalBeads > 0 ? (totalCount / preset.totalBeads) : 0;

  const handleStartFreeSession = () => {
    setFreeSession();
    router.push("/session");
  };

  if (!mounted || !hasHydrated) return <div className="min-h-screen bg-slate-950" />;

  return (
    <div className="h-[100dvh] text-slate-100 flex flex-col relative overflow-hidden selection:bg-emerald-500/30 font-sans pb-[env(safe-area-inset-bottom,20px)]">

      <AmbientGlow theme={greeting.theme} />

      {/* ── MAIN CONTENT ─────────────────────────────────── */}
      {/* We use pb-24 (6rem) to account for the bottom nav bar, keeping the content above it */}
      <main className="flex-1 px-4 pt-[calc(env(safe-area-inset-top,20px)+1rem)] pb-20 flex flex-col gap-3 z-10 max-w-lg mx-auto w-full h-full justify-between">

        {/* BIG DATE DISPLAY & SETTINGS */}
        <motion.div
          initial={{ opacity: 0, filter: "blur(10px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="px-2 mb-1 shrink-0 flex items-start justify-between"
        >
          <div>
            <h1 className="text-3xl font-light text-white tracking-tight capitalize leading-tight">
              {dates.gregorian}
            </h1>
            <p className="text-emerald-400 mt-1 text-sm font-medium flex items-center gap-2">
              <Sparkles size={16} /> {greeting.sub} <span className="text-white/30 truncate hidden sm:inline-block">({dates.hijri})</span>
            </p>
          </div>
        </motion.div>

        {/* DAILY INSPIRATION WIDGET */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="w-full bg-white/[0.03] border border-white/5 rounded-2xl p-3 shrink-0 backdrop-blur-md flex items-start gap-3"
        >
          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0 mt-0.5">
            <Quote size={12} className="text-white/40" />
          </div>
          <div>
            <p className="text-white/70 text-xs italic leading-tight">
              "La paix vient de l'intérieur. Ne la cherchez pas à l'extérieur."
            </p>
            <p className="text-white/30 text-[10px] mt-1 font-medium">— Pensée du jour</p>
          </div>
        </motion.div>

        {/* HERO WIDGET: INVOCATION / REPRENDRE */}
        <GlassCard
          className="flex-1 w-full min-h-0 group overflow-visible"
          delay={0.2}
          onClick={() => {
            if (hasActiveSession) router.push("/session");
            else router.push("/library");
          }}
        >
          {/* Animated Gradient Behind Inner Content */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-transparent to-slate-900/80 z-0 pointer-events-none rounded-[32px] opacity-80" />

          <div className="relative z-10 flex flex-col h-full">
            <div className="flex justify-between items-center mb-6">
              <div className="bg-emerald-500/20 text-emerald-300 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-md flex items-center gap-1.5 border border-emerald-500/20">
                {hasActiveSession ? <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span></span> : null}
                {hasActiveSession ? "En cours" : "Méditation"}
              </div>
              {hasActiveSession ? <Sparkles className="text-white/30" size={24} /> : <Library className="text-white/30" size={24} />}
            </div>

            {/* Floating Orb */}
            <div className="flex-1 min-h-0 flex items-center justify-center relative my-1">
              <motion.div
                className="w-24 h-24 relative flex items-center justify-center max-h-full aspect-square"
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="absolute inset-0 bg-emerald-500/30 blur-[40px] rounded-full scale-125" />

                {/* Glass Orb Body */}
                <div className="absolute inset-0 rounded-full border border-white/20 shadow-[inset_0_4px_30px_rgba(255,255,255,0.15)] bg-gradient-to-tr from-white/10 to-transparent backdrop-blur-xl flex items-center justify-center z-10 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-transparent opacity-60" />
                  {hasActiveSession ? (
                    <div className="flex flex-col items-center">
                      <span className="text-4xl font-bold text-white tabular-nums tracking-tighter drop-shadow-lg">{Math.round(progress * 100)}%</span>
                    </div>
                  ) : (
                    <Play className="text-white ml-2 fill-white drop-shadow-lg" size={40} />
                  )}
                </div>

                {/* Orbiting ring */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-[-20px] border-[1.5px] border-dashed border-emerald-500/20 rounded-full"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-[-35px] border border-solid border-white/5 rounded-full"
                />
              </motion.div>
            </div>

            <div className="mt-4 flex items-end justify-between shrink-0">
              <div>
                <h2 className="text-2xl font-semibold text-white mb-1 tracking-tight">
                  {hasActiveSession ? "Mon Chapelet" : "Parcourir"}
                </h2>
                <p className="text-white/60 text-[13px] font-medium">
                  {hasActiveSession ? "Continuer la session" : "Choisir une invocation"}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.3)] group-hover:scale-110 transition-transform">
                <ArrowRight size={18} />
              </div>
            </div>
          </div>
        </GlassCard>

        {/* ROW OF 2 WIDGETS */}
        <div className="grid grid-cols-2 gap-3 w-full h-[100px] sm:h-[120px] shrink-0">

          {/* LIBRARY WIDGET */}
          <GlassCard
            className="h-full group flex flex-col justify-between"
            delay={0.3}
            onClick={() => router.push("/library")}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-500/20 flex items-center justify-center text-indigo-300 shadow-inner">
              <Library size={22} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white leading-tight">Biblio</h3>
              <p className="text-indigo-200/60 text-[11px] font-medium">Invocations</p>
            </div>
          </GlassCard>

          {/* SESSION LIBRE WIDGET */}
          <GlassCard
            className="h-full group flex flex-col justify-between"
            delay={0.4}
            onClick={handleStartFreeSession}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/20 flex items-center justify-center text-emerald-300 shadow-inner">
                <InfinityIcon size={22} />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white leading-tight">Libre</h3>
              <p className="text-emerald-200/60 text-[11px] font-medium">Infini</p>
            </div>
          </GlassCard>

        </div>

      </main>
    </div>
  );
}
