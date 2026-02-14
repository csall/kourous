"use client";

import { useSessionStore } from "@/lib/store/sessionStore";
import { motion } from "framer-motion";
import { TrendingUp, Calendar, Flame, ArrowRight, Sparkles, BookOpen } from "lucide-react";
import Link from "next/link";

const sessions = [
  {
    id: "chapelet-33",
    title: "Chapelet 33",
    subtitle: "Subḥān Allāh • Alḥamdu lillāh",
    icon: Sparkles,
    color: "from-rose-500/20 to-pink-500/20",
    borderColor: "border-rose-500/30",
    href: "/session?preset=tasbih-33"
  },
  {
    id: "chapelet-99",
    title: "Chapelet 99",
    subtitle: "Les 99 noms d'Allah",
    icon: Sparkles,
    color: "from-emerald-500/20 to-teal-500/20",
    borderColor: "border-emerald-500/30",
    href: "/session?preset=tasbih-99"
  },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-y-auto overflow-x-hidden" style={{ WebkitOverflowScrolling: 'touch' }}>
      <div className="max-w-4xl mx-auto px-6 py-8 pb-32 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <h1 className="text-3xl font-light">Bienvenue</h1>
          <p className="text-slate-400">Continuez votre pratique spirituelle</p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-4"
        >
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-4">
            <div className="flex flex-col items-center text-center gap-2">
              <TrendingUp size={24} className="text-blue-400" />
              <div className="text-2xl font-light text-white">12</div>
              <div className="text-xs text-slate-400">Sessions</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 backdrop-blur-xl border border-emerald-500/20 rounded-2xl p-4">
            <div className="flex flex-col items-center text-center gap-2">
              <Calendar size={24} className="text-emerald-400" />
              <div className="text-2xl font-light text-white">396</div>
              <div className="text-xs text-slate-400">Prières</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 backdrop-blur-xl border border-orange-500/20 rounded-2xl p-4">
            <div className="flex flex-col items-center text-center gap-2">
              <Flame size={24} className="text-orange-400" />
              <div className="text-2xl font-light text-white">7</div>
              <div className="text-xs text-slate-400">Jours</div>
            </div>
          </div>
        </motion.div>

        {/* Recent Sessions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-light">Sessions récentes</h2>
            <Link href="/library" className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-1">
              Voir tout
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="space-y-3">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center">
                  <Sparkles size={18} className="text-rose-400" />
                </div>
                <div>
                  <div className="text-sm font-medium text-white">Chapelet 33</div>
                  <div className="text-xs text-slate-400">Il y a 2 heures</div>
                </div>
              </div>
              <div className="text-xs text-slate-500">Terminé</div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                  <BookOpen size={18} className="text-amber-400" />
                </div>
                <div>
                  <div className="text-sm font-medium text-white">Douha du matin</div>
                  <div className="text-xs text-slate-400">Hier</div>
                </div>
              </div>
              <div className="text-xs text-slate-500">Terminé</div>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <h2 className="text-xl font-light">Commencer une session</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sessions.map((session) => {
              const Icon = session.icon;
              return (
                <Link key={session.id} href={session.href}>
                  <motion.div
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className={`
                      group relative overflow-hidden rounded-2xl p-6
                      bg-gradient-to-br ${session.color}
                      backdrop-blur-xl border ${session.borderColor}
                      hover:shadow-xl transition-all cursor-pointer
                    `}
                  >
                    <div className="absolute inset-0 bg-white/[0.02]" />

                    <div className="relative z-10 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1 flex-1">
                          <h3 className="text-lg font-light text-white">
                            {session.title}
                          </h3>
                          <p className="text-xs text-slate-400">
                            {session.subtitle}
                          </p>
                        </div>
                        <div className="p-2 rounded-lg bg-white/5">
                          <Icon size={20} className="text-white/70" />
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-400 group-hover:text-white/70 transition-colors">
                        <span>Commencer</span>
                        <ArrowRight size={14} />
                      </div>
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
