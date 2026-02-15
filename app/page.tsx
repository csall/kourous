"use client";

import Link from "next/link";
import { useSessionStore } from "@/lib/store/sessionStore";
import { prayerPresets } from "@/lib/data/prayerPresets";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, ChevronRight, Flame, Hash, RotateCcw, Sparkles } from "lucide-react";

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const hasHydrated = useSessionStore(state => state._hasHydrated);
  const preset = useSessionStore(state => state.preset);
  const totalCount = useSessionStore(state => state.totalCount);
  const isComplete = useSessionStore(state => state.isComplete);
  const stats = useSessionStore(state => state.stats);

  useEffect(() => { setMounted(true); }, []);

  const hasActiveSession = mounted && hasHydrated && preset && totalCount > 0 && !isComplete;
  const progress = hasActiveSession && preset ? Math.round((totalCount / preset.totalBeads) * 100) : 0;

  const stagger = {
    container: { hidden: {}, show: { transition: { staggerChildren: 0.06 } } },
    item: {
      hidden: { opacity: 0, y: 14 },
      show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] as const } },
    },
  };

  return (
    <div className="min-h-[100dvh] bg-[#05070c] text-slate-100 pb-28">
      {/* BG GLOW */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-15%] right-[-10%] w-[50%] h-[50%] bg-blue-600/8 blur-[140px] rounded-full" />
        <div className="absolute bottom-[20%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/5 blur-[120px] rounded-full" />
      </div>

      <motion.div
        className="relative z-10 max-w-md mx-auto px-5 pt-14"
        variants={stagger.container}
        initial="hidden"
        animate="show"
      >
        {/* HEADER */}
        <motion.div variants={stagger.item} className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600 shadow-[0_4px_20px_rgba(59,130,246,0.4)] flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-white/90" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">Kourous</h1>
        </motion.div>

        {/* SESSION EN COURS */}
        {hasActiveSession && preset ? (
          <motion.div variants={stagger.item} className="mb-6">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 mb-3 px-1">Session en cours</h3>
            <Link href="/session" className="block">
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600/20 to-indigo-600/10 border border-blue-500/20 p-5">
                {/* Progress ring */}
                <div className="absolute top-4 right-4">
                  <svg width="52" height="52" viewBox="0 0 52 52">
                    <circle cx="26" cy="26" r="22" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
                    <circle
                      cx="26" cy="26" r="22" fill="none" stroke="#3b82f6" strokeWidth="3"
                      strokeDasharray={`${2 * Math.PI * 22}`}
                      strokeDashoffset={`${2 * Math.PI * 22 * (1 - progress / 100)}`}
                      strokeLinecap="round"
                      transform="rotate(-90 26 26)"
                      className="transition-all duration-500"
                    />
                    <text x="26" y="27" textAnchor="middle" dominantBaseline="middle" className="fill-white text-[11px] font-bold">
                      {progress}%
                    </text>
                  </svg>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-blue-400">En cours</span>
                </div>
                <h2 className="text-xl font-bold text-white mb-1">{preset.name}</h2>
                <p className="text-sm text-slate-400 mb-4">{totalCount} / {preset.totalBeads} répétitions</p>

                <div className="flex items-center gap-2 text-blue-400 text-sm font-semibold">
                  Continuer
                  <ChevronRight size={16} />
                </div>
              </div>
            </Link>
          </motion.div>
        ) : (
          <motion.div variants={stagger.item} className="mb-6">
            <Link href="/session" className="block">
              <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 p-5 flex items-center justify-between active:scale-[0.98] transition-all shadow-[0_8px_32px_-4px_rgba(59,130,246,0.4)]">
                <div>
                  <p className="text-sm text-blue-100/70 mb-0.5">Commencer</p>
                  <h2 className="text-lg font-bold text-white">Nouvelle session</h2>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Sparkles size={20} className="text-white" />
                </div>
              </div>
            </Link>
          </motion.div>
        )}

        {/* STATISTIQUES */}
        <motion.div variants={stagger.item} className="mb-6">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 mb-3 px-1">Statistiques</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-4 text-center">
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center mx-auto mb-2">
                <Hash size={14} className="text-blue-400" />
              </div>
              <p className="text-xl font-bold text-white">{mounted && hasHydrated ? stats?.totalSessions || 0 : "–"}</p>
              <p className="text-[10px] text-slate-500 font-medium mt-0.5">Sessions</p>
            </div>
            <div className="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-4 text-center">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-2">
                <RotateCcw size={14} className="text-emerald-400" />
              </div>
              <p className="text-xl font-bold text-white">{mounted && hasHydrated ? stats?.totalRepetitions || 0 : "–"}</p>
              <p className="text-[10px] text-slate-500 font-medium mt-0.5">Répétitions</p>
            </div>
            <div className="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-4 text-center">
              <div className="w-8 h-8 rounded-xl bg-orange-500/10 flex items-center justify-center mx-auto mb-2">
                <Flame size={14} className="text-orange-400" />
              </div>
              <p className="text-xl font-bold text-white">{mounted && hasHydrated ? stats?.streak || 0 : "–"}</p>
              <p className="text-[10px] text-slate-500 font-medium mt-0.5">Jours de suite</p>
            </div>
          </div>
        </motion.div>

        {/* BIBLIOTHÈQUE */}
        <motion.div variants={stagger.item} className="mb-6">
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Bibliothèque</h3>
            <Link href="/library" className="text-[11px] text-blue-400 font-semibold">Voir tout</Link>
          </div>
          <div className="space-y-2">
            {prayerPresets.map((p) => (
              <Link
                key={p.id}
                href="/session"
                onClick={() => useSessionStore.getState().setPreset(p)}
                className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] active:scale-[0.98] transition-all"
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

            <Link
              href="/library"
              className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] active:scale-[0.98] transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center shrink-0">
                <BookOpen size={16} className="text-indigo-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-white">Invocations personnalisées</h4>
                <p className="text-[11px] text-slate-500">Créer & gérer vos chapelets</p>
              </div>
              <ChevronRight size={16} className="text-slate-600 shrink-0" />
            </Link>
          </div>
        </motion.div>

        {/* FOOTER */}
        <motion.div variants={stagger.item} className="flex items-center justify-center gap-6 pt-4 pb-8">
          <Link href="/privacy" className="text-[11px] text-slate-700 uppercase font-bold tracking-[0.15em] hover:text-blue-400 transition-colors">
            Confidentialité
          </Link>
          <span className="w-1 h-1 rounded-full bg-slate-800" />
          <Link href="/support" className="text-[11px] text-slate-700 uppercase font-bold tracking-[0.15em] hover:text-blue-400 transition-colors">
            Support
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
