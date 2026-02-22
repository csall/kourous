"use client";

import { useSessionStore } from "@/lib/store/sessionStore";
import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

import {
  Moon,
  Sun,
  Sunrise,
  Sunset,
  Infinity as InfinityIcon,
  Library,
} from "lucide-react";
import { getRandomQuote } from "@/lib/data/quotes";
import { HomeBackground } from "@/components/home/HomeBackground";
import { HomeBeadScene } from "@/components/home/HomeBeadScene";
import { useTranslation } from "@/lib/hooks/useTranslation";

/* ─── Greeting Logic ──────────────────────────────── */
function getGreeting() {
  const h = new Date().getHours();
  // Using text-white/40 for a consistent gray look as requested
  if (h >= 5 && h < 12)
    return { key: "morning", icon: <Sunrise size={18} className="text-white/40" />, accent: "#94a3b8", glow: "rgba(255,255,255,0.1)" };
  if (h >= 12 && h < 18)
    return { key: "afternoon", icon: <Sun size={18} className="text-white/40" />, accent: "#94a3b8", glow: "rgba(255,255,255,0.1)" };
  if (h >= 18 && h < 22)
    return { key: "evening", icon: <Sunset size={18} className="text-white/40" />, accent: "#94a3b8", glow: "rgba(255,255,255,0.1)" };
  return { key: "night", icon: <Moon size={18} className="text-white/40" />, accent: "#94a3b8", glow: "rgba(255,255,255,0.1)" };
}



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
        <div className="w-full shrink-0">
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
            <div className="flex items-center p-1 rounded-[14px] glass-premium border border-white/10" role="group" aria-label="Language selection">
              <button
                onClick={() => useSessionStore.getState().setLanguage('fr')}
                aria-label="Switch to French"
                aria-pressed={language === 'fr'}
                className={`px-2 py-1 rounded-[10px] text-[10px] font-black transition-all ${language === 'fr' ? 'bg-white/10 text-white' : 'text-white/30 hover:text-white/60'}`}
              >
                FR
              </button>
              <button
                onClick={() => useSessionStore.getState().setLanguage('en')}
                aria-label="Switch to English"
                aria-pressed={language === 'en'}
                className={`px-2 py-1 rounded-[10px] text-[10px] font-black transition-all ${language === 'en' ? 'bg-white/10 text-white' : 'text-white/30 hover:text-white/60'}`}
              >
                EN
              </button>
            </div>
          </motion.div>
        </div>

        {/* ── CHAPELET FLOTTANT ────────────────────── */}
        <div className="flex-1 w-full flex flex-col items-center min-h-0 relative">
          {/* Halo indigo */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(99,102,241,0.14) 0%, transparent 66%)" }}
            animate={{ opacity: [0.4, 0.85, 0.4] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Halo rose */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at 55% 45%, rgba(244,114,182,0.07) 0%, transparent 60%)" }}
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Canvas — prend l'espace disponible */}
          <div className="flex-1 w-full flex items-center justify-center min-h-0 pointer-events-none">
            <div className="w-full h-full max-w-[300px] max-h-[38vh]">
              <HomeBeadScene cameraY={0} />
            </div>
          </div>

          {/* ── Citation ── juste sous le chapelet ── */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
            className="shrink-0 w-full text-center px-6 pb-3"
          >
            <div className="w-8 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent mx-auto mb-2.5" />
            <p className="text-[12px] leading-[1.6] text-white/55 font-light italic line-clamp-2">
              &ldquo;{resolve(dailyQuote.text)}&rdquo;
            </p>
            <span className="text-[8px] font-black uppercase tracking-[0.4em] text-white/20 mt-1.5 block">
              {resolve(dailyQuote.source)}
            </span>
          </motion.div>
        </div>

        {/* ── BLOC BAS : info + actions ────────────── */}
        <div className="w-full shrink-0 flex flex-col gap-3 pb-4">

          {/* Carte info */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full rounded-[26px] p-4"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
            }}
          >
            {hasActiveSession ? (
              <>
                <p className="text-[8px] font-black uppercase tracking-[0.45em] text-white/25 mb-1.5">
                  {t.home.progression}
                </p>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-3xl font-bold text-white tabular-nums leading-none">
                    {Math.round(progress * 100)}
                    <span className="text-sm text-white/25 ml-0.5">%</span>
                  </span>
                  <span className="ml-auto text-[10px] text-white/30 italic truncate max-w-[150px]">
                    &laquo;{resolve(preset?.name)}&raquo;
                  </span>
                </div>
                <div className="h-[2px] w-full bg-white/[0.07] rounded-full overflow-hidden mb-4">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-violet-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress * 100}%` }}
                    transition={{ duration: 0.9, ease: "easeOut" }}
                  />
                </div>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push("/session")}
                  aria-label={`Continue session — ${Math.round(progress * 100)}% complete`}
                  className="w-full py-[10px] rounded-[14px] text-[10px] font-black uppercase tracking-[0.35em] text-center"
                  style={{ background: "rgba(99,102,241,0.18)", border: "1px solid rgba(99,102,241,0.28)", color: "#a5b4fc" }}
                >
                  {t.common.continue} →
                </motion.button>
              </>
            ) : (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push("/library")}
                aria-label="Explore dhikr library"
                className="w-full py-[10px] rounded-[14px] text-[10px] font-black uppercase tracking-[0.35em] text-center"
                style={{ background: "rgba(99,102,241,0.16)", border: "1px solid rgba(99,102,241,0.24)", color: "#a5b4fc" }}
              >
                ▶&nbsp;&nbsp;{t.home.explorer}
              </motion.button>
            )}
          </motion.div>

          {/* Boutons rapides */}
          <div className="w-full grid grid-cols-2 gap-3">
            <motion.button
              initial={{ opacity: 0, y: 14, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.85, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              whileTap={{ scale: 0.94, y: 2 }}
              onClick={() => router.push("/library")}
              aria-label="Open dhikr library"
              className="flex flex-col items-center gap-2.5 py-4 glass-premium rounded-[24px] border border-white/[0.08] relative overflow-hidden shadow-2xl"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-400/20 flex items-center justify-center" aria-hidden="true">
                <Library size={18} className="text-indigo-400" />
              </div>
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40">{t.home.library}</span>
            </motion.button>

            <motion.button
              initial={{ opacity: 0, y: 14, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.95, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              whileTap={{ scale: 0.94, y: 2 }}
              onClick={handleStartFreeSession}
              aria-label="Start a free dhikr session"
              className="flex flex-col items-center gap-2.5 py-4 glass-premium rounded-[24px] border border-white/[0.08] relative overflow-hidden shadow-2xl"
            >
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-400/20 flex items-center justify-center">
                <InfinityIcon size={20} className="text-rose-400" />
              </div>
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40">{t.home.free}</span>
            </motion.button>
          </div>

        </div>

      </main>
    </div>
  );
}
