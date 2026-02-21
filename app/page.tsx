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
  Quote as QuoteIcon
} from "lucide-react";
import { getDailyQuote, getRandomQuote } from "@/lib/data/quotes";

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


/* ─── iOS Glass Widget Component ───────────────────────────────── */
const GlassCardPremium = ({ children, className = "", delay = 0, onClick, accent = false }: { children: React.ReactNode, className?: string, delay?: number, onClick?: () => void, accent?: boolean }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      onClick={onClick}
      className={`${accent ? 'glass-premium-accent' : 'glass-premium'} relative overflow-hidden rounded-[38px] p-6 flex flex-col group transition-all duration-500 ${className} ${onClick ? 'cursor-pointer' : ''}`}
    >
      {/* Dynamic light reflection */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

import { HomeBackground } from "@/components/home/HomeBackground";

export default function LiquidEtherealDashboard() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

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

  if (!mounted || !hasHydrated) return <div className="min-h-screen bg-[#05060f]" />;

  return (
    <div className="h-[100dvh] text-slate-100 flex flex-col relative overflow-hidden touch-none font-sans pb-[env(safe-area-inset-bottom,20px)] select-none">

      <HomeBackground />

      {/* ── ETHEREAL UI LAYER ─────────────────────────────────── */}
      <main className="flex-1 px-7 pt-[calc(env(safe-area-inset-top,20px)+1.5rem)] pb-[calc(env(safe-area-inset-bottom,20px)+5.5rem)] flex flex-col z-10 max-w-lg mx-auto w-full h-full justify-between items-center overflow-hidden">

        {/* LUXURY HEADER SECTION */}
        <div className="space-y-4 w-full shrink-0">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-4"
          >
            <div className="w-11 h-11 rounded-full glass-premium flex items-center justify-center border border-white/20">
              {greeting.icon}
            </div>
            <div className="flex flex-col">
              <span className="text-white/30 text-[10px] font-black uppercase tracking-[0.4em] leading-none mb-1">
                {greeting.label}
              </span>
              <span className="text-white/90 text-sm font-light tracking-wide italic">
                {greeting.sub}
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-3"
          >
            <div className="flex items-start gap-4">
              <QuoteIcon size={14} className="text-indigo-400 mt-1.5 shrink-0 opacity-40" />
              <h1 className="text-xl font-medium text-white/90 tracking-wide leading-[1.4] text-balance italic">
                "{dailyQuote.text}"
              </h1>
            </div>
            <div className="flex items-center gap-3 ml-11">
              <div className="h-[1px] w-6 bg-indigo-500/20" />
              <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20">
                {dailyQuote.source}
              </span>
            </div>
          </motion.div>
        </div>

        {/* ORGANIC HERO HUB */}
        <div className="flex-1 flex flex-col justify-center gap-6 relative items-center w-full min-h-0">

          {/* Main Action Sphere */}
          <GlassCardPremium
            className="w-full aspect-square max-w-[290px] max-h-[38vh] glass-iridescent flex items-center justify-center border-none shadow-none"
            delay={0.4}
            onClick={() => {
              if (hasActiveSession) router.push("/session");
              else router.push("/library");
            }}
          >
            {/* Center Ethereal Element */}
            <div className="relative flex items-center justify-center w-full h-full scale-95 sm:scale-100">
              {/* Volumetric Glows */}
              <div className="absolute w-[140%] h-[140%] bg-indigo-500/10 blur-[80px] rounded-full animate-pulse-slow" />
              <div className="absolute w-[100%] h-[100%] bg-rose-500/5 blur-[60px] rounded-full animate-pulse delay-1000" />

              <div className="relative z-10 flex flex-col items-center">
                {hasActiveSession ? (
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-2">Progression</span>
                    <span className="text-6xl font-bold text-white tracking-tighter tabular-nums drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                      {Math.round(progress * 100)}<span className="text-xl opacity-30 align-top mt-2">%</span>
                    </span>
                    <p className="mt-3 text-[11px] font-bold text-white/50 tracking-wide bg-white/5 px-3 py-1 rounded-full border border-white/5 backdrop-blur-md italic line-clamp-1">
                      "{preset?.name}"
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center group">
                    <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.4)] transition-transform group-hover:scale-110">
                      <Play className="text-black fill-black ml-1.5" size={36} />
                    </div>
                    <span className="mt-6 text-[10px] font-black uppercase tracking-[0.4em] text-white/60">Explorer</span>
                  </div>
                )}
              </div>
            </div>
          </GlassCardPremium>

          {/* Quick Access Floating Row */}
          <div className="w-full flex justify-between gap-4">
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              onClick={() => router.push("/library")}
              className="flex-1 flex flex-col items-center gap-3 p-5 glass-premium rounded-[32px] border border-white/5 hover:bg-white/5 transition-colors"
            >
              <Library size={22} className="text-slate-400" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70">Biblio</span>
            </motion.button>

            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              onClick={handleStartFreeSession}
              className="flex-1 flex flex-col items-center gap-3 p-5 glass-premium rounded-[32px] border border-white/5 hover:bg-white/5 transition-colors"
            >
              <InfinityIcon size={24} className="text-slate-400" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70">Libre</span>
            </motion.button>
          </div>

        </div>


      </main>
    </div>
  );
}
