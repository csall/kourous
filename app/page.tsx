"use client";

import Link from "next/link";
import Image from "next/image";
import { useSessionStore } from "@/lib/store/sessionStore";
import { prayerPresets } from "@/lib/data/prayerPresets";
import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  ChevronRight,
  Flame,
  Hash,
  Play,
  RotateCcw,
  Sparkles,
  Moon,
  Sun,
  Sunrise,
  Sunset,
} from "lucide-react";

/* ─── Greeting ─────────────────────────────────────── */
function getGreeting(): { label: string; arabic: string; icon: React.ReactNode } {
  const h = new Date().getHours();
  if (h >= 5 && h < 12)
    return { label: "Ṣabāḥ al-khayr", arabic: "صباح الخير", icon: <Sunrise size={16} className="text-amber-400" /> };
  if (h >= 12 && h < 16)
    return { label: "Masā' al-khayr", arabic: "مساء الخير", icon: <Sun size={16} className="text-orange-400" /> };
  if (h >= 16 && h < 19)
    return { label: "Masā' an-nūr", arabic: "مساء النور", icon: <Sunset size={16} className="text-rose-400" /> };
  return { label: "Ṭāba masā'uk", arabic: "طاب مساؤك", icon: <Moon size={16} className="text-indigo-300" /> };
}

/* ─── Page ─────────────────────────────────────────── */
export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const hasHydrated = useSessionStore((s) => s._hasHydrated);
  const preset = useSessionStore((s) => s.preset);
  const totalCount = useSessionStore((s) => s.totalCount);
  const isComplete = useSessionStore((s) => s.isComplete);
  const stats = useSessionStore((s) => s.stats);

  useEffect(() => { setMounted(true); }, []);

  const greeting = useMemo(() => getGreeting(), []);
  const hasActiveSession = mounted && hasHydrated && preset && totalCount > 0 && !isComplete;
  const progress = hasActiveSession && preset ? Math.round((totalCount / preset.totalBeads) * 100) : 0;
  const ready = mounted && hasHydrated;

  const stagger = {
    container: { hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } } },
    item: {
      hidden: { opacity: 0, y: 16 },
      show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const } },
    },
  };

  const circumference = 2 * Math.PI * 44;

  return (
    <div className="min-h-[100dvh] bg-[#050810] text-slate-100 pb-28 overflow-x-hidden">
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-18%] left-[50%] -translate-x-1/2 w-[80%] h-[45%] bg-blue-600/[0.06] blur-[160px] rounded-full" />
      </div>

      <motion.div
        className="relative z-10 max-w-md mx-auto px-5 pt-safe"
        variants={stagger.container}
        initial="hidden"
        animate="show"
      >
        {/* ── Header ─────────────────────────────── */}
        <motion.div variants={stagger.item} className="flex items-center gap-3 pt-4 mb-6">
          <div className="w-11 h-11 rounded-2xl overflow-hidden shadow-[0_4px_24px_rgba(59,130,246,0.3)]">
            <Image src="/icon.png" alt="Kourous" width={44} height={44} className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="text-[1.4rem] font-extrabold tracking-tight leading-tight">Kourous</h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              {greeting.icon}
              <span className="text-[11px] text-slate-400 font-medium">{greeting.label}</span>
              <span className="text-[11px] text-slate-600">{greeting.arabic}</span>
            </div>
          </div>
        </motion.div>

        {/* ── Session card ────────────────────────── */}
        {hasActiveSession && preset ? (
          <motion.div variants={stagger.item} className="mb-6">
            <Link href="/session" className="block group">
              <div className="relative overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-blue-600/20 via-indigo-600/12 to-transparent border border-blue-400/12 p-6">
                {/* Progress ring */}
                <div className="absolute top-5 right-5">
                  <svg width="60" height="60" viewBox="0 0 96 96">
                    <circle cx="48" cy="48" r="44" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="4" />
                    <circle
                      cx="48" cy="48" r="44" fill="none" stroke="url(#pg)" strokeWidth="4"
                      strokeDasharray={circumference} strokeDashoffset={circumference * (1 - progress / 100)}
                      strokeLinecap="round" transform="rotate(-90 48 48)" className="transition-all duration-700"
                    />
                    <defs><linearGradient id="pg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#60a5fa" /><stop offset="100%" stopColor="#818cf8" /></linearGradient></defs>
                    <text x="48" y="49" textAnchor="middle" dominantBaseline="middle" className="fill-white text-[13px] font-bold">{progress}%</text>
                  </svg>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-70" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-400" />
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-300">En cours</span>
                </div>

                <h2 className="text-xl font-bold text-white mb-1 pr-20">{preset.name}</h2>
                <p className="text-sm text-slate-400 mb-4">{totalCount} / {preset.totalBeads} répétitions</p>

                <div className="inline-flex items-center gap-2 text-blue-300 text-[13px] font-semibold">
                  <Play size={14} className="fill-blue-300" />
                  Continuer
                  <ChevronRight size={14} />
                </div>
              </div>
            </Link>
          </motion.div>
        ) : (
          <motion.div variants={stagger.item} className="mb-6">
            <Link href="/session" className="block group">
              <div className="relative overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 p-6 active:scale-[0.98] transition-transform shadow-[0_12px_40px_-8px_rgba(59,130,246,0.4)]">
                <div className="absolute top-[-30%] right-[-10%] w-32 h-32 rounded-full bg-white/[0.06]" />
                <div className="relative z-10 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-100/70 mb-1">Bismillāh</p>
                    <h2 className="text-xl font-bold text-white">Nouvelle session</h2>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center">
                    <Sparkles size={24} className="text-white" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        )}

        {/* ── Stats ───────────────────────────────── */}
        <motion.div variants={stagger.item} className="mb-4">
          <div className="rounded-[1.5rem] bg-white/[0.03] border border-white/[0.07] p-4">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-3 px-1">Statistiques</h3>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { icon: <Hash size={15} className="text-blue-400" />, value: ready ? stats?.totalSessions || 0 : "–", label: "Sessions" },
                { icon: <RotateCcw size={15} className="text-emerald-400" />, value: ready ? stats?.totalRepetitions || 0 : "–", label: "Dhikr" },
                { icon: <Flame size={15} className="text-orange-400" />, value: ready ? stats?.streak || 0 : "–", label: "Série" },
              ].map((s) => (
                <div key={s.label} className="rounded-2xl bg-white/[0.04] p-4 text-center">
                  <div className="w-8 h-8 rounded-xl bg-white/[0.05] flex items-center justify-center mx-auto mb-2">
                    {s.icon}
                  </div>
                  <p className="text-xl font-extrabold text-white leading-none">{s.value}</p>
                  <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-[0.1em] mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── Bibliothèque ────────────────────────── */}
        <motion.div variants={stagger.item}>
          <div className="rounded-[1.5rem] bg-white/[0.03] border border-white/[0.07] p-4">
            <div className="flex items-center justify-between mb-3 px-1">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">Bibliothèque</h3>
              <Link href="/library" className="text-[11px] text-blue-400 font-semibold">Voir tout</Link>
            </div>
            <div className="space-y-2">
              {prayerPresets.slice(0, 3).map((p) => (
                <Link
                  key={p.id}
                  href="/session"
                  onClick={() => useSessionStore.getState().setPreset(p)}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.04] active:scale-[0.98] transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                    <div className="w-3 h-3 rounded-full bg-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-white">{p.name}</h4>
                    <p className="text-[11px] text-slate-500 truncate">{p.description}</p>
                  </div>
                  <ChevronRight size={16} className="text-slate-600 shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── Footer ──────────────────────────────── */}
        <motion.div variants={stagger.item} className="flex items-center justify-center gap-5 pt-6 pb-4">
          <Link href="/privacy" className="text-[10px] text-slate-700 uppercase font-bold tracking-[0.15em] hover:text-blue-400 transition-colors">
            Confidentialité
          </Link>
          <span className="w-0.5 h-0.5 rounded-full bg-slate-800" />
          <Link href="/support" className="text-[10px] text-slate-700 uppercase font-bold tracking-[0.15em] hover:text-blue-400 transition-colors">
            Support
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
