"use client";

import { useSessionStore } from "@/lib/store/sessionStore";
import { motion } from "framer-motion";
import { Volume2, VolumeX, Vibrate, Moon, Sun, Info } from "lucide-react";

export default function Settings() {
    const { soundEnabled, hapticsEnabled, toggleSound, toggleHaptics } = useSessionStore();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-y-auto overflow-x-hidden" style={{ WebkitOverflowScrolling: 'touch' }}>
            <div className="max-w-4xl mx-auto px-6 py-8 pb-32 space-y-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-2"
                >
                    <h1 className="text-3xl font-light">Réglages</h1>
                    <p className="text-slate-400">Personnalisez votre expérience</p>
                </motion.div>

                {/* Preferences Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="space-y-4"
                >
                    <h2 className="text-lg font-light text-slate-300">Préférences</h2>

                    {/* Sound Toggle */}
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                {soundEnabled ? (
                                    <Volume2 size={20} className="text-rose-400" />
                                ) : (
                                    <VolumeX size={20} className="text-slate-400" />
                                )}
                                <div>
                                    <div className="text-sm font-medium text-white">Son</div>
                                    <div className="text-xs text-slate-400">Feedback audio lors des interactions</div>
                                </div>
                            </div>

                            <button
                                onClick={toggleSound}
                                className={`w-12 h-6 rounded-full transition-all ${soundEnabled ? 'bg-rose-500' : 'bg-slate-700'
                                    }`}
                            >
                                <div className={`w-5 h-5 rounded-full bg-white shadow-lg transform transition-transform ${soundEnabled ? 'translate-x-6' : 'translate-x-0.5'
                                    }`} />
                            </button>
                        </div>
                    </div>

                    {/* Haptics Toggle */}
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Vibrate size={20} className={hapticsEnabled ? "text-rose-400" : "text-slate-400"} />
                                <div>
                                    <div className="text-sm font-medium text-white">Vibrations</div>
                                    <div className="text-xs text-slate-400">Retour haptique lors des interactions</div>
                                </div>
                            </div>

                            <button
                                onClick={toggleHaptics}
                                className={`w-12 h-6 rounded-full transition-all ${hapticsEnabled ? 'bg-rose-500' : 'bg-slate-700'
                                    }`}
                            >
                                <div className={`w-5 h-5 rounded-full bg-white shadow-lg transform transition-transform ${hapticsEnabled ? 'translate-x-6' : 'translate-x-0.5'
                                    }`} />
                            </button>
                        </div>
                    </div>

                    {/* Theme (Coming Soon) */}
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 opacity-50">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Moon size={20} className="text-slate-400" />
                                <div>
                                    <div className="text-sm font-medium text-white">Thème</div>
                                    <div className="text-xs text-slate-400">Mode sombre (bientôt disponible)</div>
                                </div>
                            </div>

                            <div className="text-xs text-slate-500">Sombre</div>
                        </div>
                    </div>
                </motion.div>

                {/* About Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-4"
                >
                    <h2 className="text-lg font-light text-slate-300">À propos</h2>

                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 space-y-3">
                        <div className="flex items-center gap-3">
                            <Info size={20} className="text-slate-400" />
                            <div>
                                <div className="text-sm font-medium text-white">Kourous</div>
                                <div className="text-xs text-slate-400">Version 1.0.0</div>
                            </div>
                        </div>

                        <div className="text-xs text-slate-500 leading-relaxed">
                            Kourous est votre compagnon spirituel pour la pratique du chapelet et des invocations.
                            Une expérience immersive en 3D pour accompagner votre méditation.
                        </div>
                    </div>

                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
                        <div className="text-sm text-white">Mentions légales</div>
                        <div className="text-xs text-slate-400 mt-1">Conditions d'utilisation et politique de confidentialité</div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
