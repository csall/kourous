"use client";

import { motion } from "framer-motion";
import { Volume2, VolumeX, Vibrate, Moon, Info, Palette } from "lucide-react";
import { useSessionStore } from "@/lib/store/sessionStore";

export function SettingsContent() {
    const { soundEnabled, hapticsEnabled, toggleSound, toggleHaptics, beadColor, setBeadColor } = useSessionStore();

    const colors = [
        { name: "Rose", value: "#fb7185" },
        { name: "Émeraude", value: "#10b981" },
        { name: "Saphir", value: "#3b82f6" },
        { name: "Or", value: "#fbbf24" },
        { name: "Ardoise", value: "#94a3b8" },
        { name: "Améthyste", value: "#a855f7" }
    ];

    return (
        <div className="max-w-4xl mx-auto px-6 pt-4 pb-32 space-y-8">
            {/* Preferences Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
            >
                <h2 className="text-lg font-light text-slate-300">Préférences</h2>

                {/* Sound Toggle */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {soundEnabled ? (
                                <Volume2 size={20} style={{ color: beadColor }} />
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
                            onPointerDown={(e) => e.stopPropagation()}
                            onPointerUp={(e) => e.stopPropagation()}
                            className="w-12 h-6 rounded-full transition-all"
                            style={{ backgroundColor: soundEnabled ? beadColor : '#334155' }}
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
                            <Vibrate size={20} style={{ color: hapticsEnabled ? beadColor : '#94a3b8' }} />
                            <div>
                                <div className="text-sm font-medium text-white">Vibrations</div>
                                <div className="text-xs text-slate-400">Retour haptique lors des interactions</div>
                            </div>
                        </div>

                        <button
                            onClick={toggleHaptics}
                            onPointerDown={(e) => e.stopPropagation()}
                            onPointerUp={(e) => e.stopPropagation()}
                            className="w-12 h-6 rounded-full transition-all"
                            style={{ backgroundColor: hapticsEnabled ? beadColor : '#334155' }}
                        >
                            <div className={`w-5 h-5 rounded-full bg-white shadow-lg transform transition-transform ${hapticsEnabled ? 'translate-x-6' : 'translate-x-0.5'
                                }`} />
                        </button>
                    </div>
                </div>


                {/* Color Selection */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Palette size={20} style={{ color: beadColor }} />
                            <div>
                                <div className="text-sm font-medium text-white">Couleur des perles</div>
                                <div className="text-xs text-slate-400">Personnalisez l'aspect de votre chapelet</div>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3 pt-2">
                            {colors.map((c) => (
                                <button
                                    key={c.value}
                                    onClick={() => setBeadColor(c.value)}
                                    onPointerDown={(e) => e.stopPropagation()}
                                    onPointerUp={(e) => e.stopPropagation()}
                                    className={`relative w-8 h-8 rounded-full transition-all active:scale-90 ${beadColor === c.value ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900 scale-110' : 'opacity-70 hover:opacity-100'
                                        }`}
                                    style={{ backgroundColor: c.value }}
                                    aria-label={c.name}
                                >
                                    {beadColor === c.value && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-2 h-2 rounded-full bg-white" />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>


            </motion.div>

            {/* About Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
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
            </motion.div>
        </div>
    );
}
