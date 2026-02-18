import Link from "next/link";
import { ArrowLeft, Shield, Lock, EyeOff, Server, FileText, Mail } from "lucide-react";

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-emerald-500/30">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px]" />
            </div>

            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-3xl mx-auto px-6 h-16 flex items-center gap-4">
                    <Link
                        href="/settings"
                        className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all active:scale-95 text-slate-400 hover:text-white"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <h1 className="text-lg font-bold text-white tracking-tight">Politique de Confidentialité</h1>
                </div>
            </header>

            {/* Content */}
            <main className="relative max-w-3xl mx-auto px-6 pt-28 pb-16 space-y-12">

                {/* Intro Section */}
                <div className="space-y-6 text-center">
                    <div className="w-20 h-20 bg-gradient-to-tr from-emerald-500/20 to-blue-500/20 rounded-3xl border border-white/10 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-emerald-500/10">
                        <Shield size={32} className="text-emerald-400" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold text-white tracking-tight">Votre vie privée est sacrée.</h2>
                        <p className="text-lg text-slate-400 max-w-lg mx-auto leading-relaxed">
                            Kourous est conçu pour la paix de l'esprit, sans compromis sur votre confidentialité.
                        </p>
                    </div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        Mise à jour : 18 février 2026
                    </div>
                </div>

                <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                {/* 1. Introduction */}
                <section className="space-y-4">
                    <div className="flex items-center gap-3 text-white">
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/5">
                            <span className="font-bold text-sm">1</span>
                        </div>
                        <h3 className="text-xl font-bold">Introduction</h3>
                    </div>
                    <div className="pl-11 space-y-4 text-slate-400 leading-relaxed">
                        <p>
                            La présente Politique de Confidentialité décrit la manière dont l’application Kourous respecte votre vie privée.
                        </p>
                        <p>
                            Kourous est une application de compteur de dhikr fonctionnant <span className="text-white font-medium">sans création de compte</span> et <span className="text-white font-medium">sans collecte de données personnelles</span>.
                        </p>
                    </div>
                </section>

                {/* 2. Données collectées */}
                <section className="space-y-4">
                    <div className="flex items-center gap-3 text-white">
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/5">
                            <span className="font-bold text-sm">2</span>
                        </div>
                        <h3 className="text-xl font-bold">Données collectées</h3>
                    </div>
                    <div className="pl-11 space-y-4 text-slate-400 leading-relaxed">
                        <p>
                            Kourous ne collecte, ne stocke, ni ne transmet aucune donnée personnelle.
                        </p>
                        <div className="grid sm:grid-cols-3 gap-4 mt-4">
                            <div className="bg-white/[0.03] border border-white/5 p-4 rounded-xl space-y-2">
                                <EyeOff size={20} className="text-slate-500" />
                                <p className="text-sm font-medium text-white">Aucune inscription</p>
                            </div>
                            <div className="bg-white/[0.03] border border-white/5 p-4 rounded-xl space-y-2">
                                <FileText size={20} className="text-slate-500" />
                                <p className="text-sm font-medium text-white">Zéro formulaire</p>
                            </div>
                            <div className="bg-white/[0.03] border border-white/5 p-4 rounded-xl space-y-2">
                                <Server size={20} className="text-slate-500" />
                                <p className="text-sm font-medium text-white">Pas de serveur</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 3. Données stockées localement */}
                <section className="space-y-4">
                    <div className="flex items-center gap-3 text-white">
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/5">
                            <span className="font-bold text-sm">3</span>
                        </div>
                        <h3 className="text-xl font-bold">Données stockées localement</h3>
                    </div>
                    <div className="pl-11 space-y-4 text-slate-400 leading-relaxed">
                        <p>
                            Certaines informations peuvent être enregistrées uniquement sur votre appareil pour le bon fonctionnement de l'application :
                        </p>
                        <ul className="space-y-2">
                            {[
                                "Nombre de dhikr",
                                "Objectif quotidien",
                                "Préférences (son, vibration, langue, thème)"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-4 flex gap-3 items-start mt-2">
                            <Lock size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                            <p className="text-sm text-emerald-100/80">Ces données restent strictement locales sur votre téléphone et ne sont jamais partagées.</p>
                        </div>
                    </div>
                </section>

                {/* 4. Services tiers */}
                <section className="space-y-4">
                    <div className="flex items-center gap-3 text-white">
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/5">
                            <span className="font-bold text-sm">4</span>
                        </div>
                        <h3 className="text-xl font-bold">Services tiers</h3>
                    </div>
                    <div className="pl-11 space-y-4 text-slate-400 leading-relaxed">
                        <p>
                            L’application :
                        </p>
                        <ul className="space-y-2">
                            {[
                                "N’utilise aucun service d’analyse",
                                "N’intègre aucune publicité",
                                "N’utilise aucun service tiers de suivi"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm">
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>

                {/* 5. Sécurité */}
                <section className="space-y-4">
                    <div className="flex items-center gap-3 text-white">
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/5">
                            <span className="font-bold text-sm">5</span>
                        </div>
                        <h3 className="text-xl font-bold">Sécurité</h3>
                    </div>
                    <div className="pl-11 text-slate-400 leading-relaxed">
                        <p>
                            Toutes les données éventuelles sont stockées localement et de manière sécurisée par le système d'exploitation de votre appareil (iOS/Android).
                        </p>
                    </div>
                </section>

                {/* 6. Modifications */}
                <section className="space-y-4">
                    <div className="flex items-center gap-3 text-white">
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/5">
                            <span className="font-bold text-sm">6</span>
                        </div>
                        <h3 className="text-xl font-bold">Modifications</h3>
                    </div>
                    <div className="pl-11 text-slate-400 leading-relaxed space-y-2">
                        <p>
                            Cette politique peut être mise à jour si des fonctionnalités nouvelles sont ajoutées (par exemple : compte utilisateur ou statistiques en ligne).
                        </p>
                        <p>
                            La date de mise à jour en haut de cette page sera modifiée en conséquence.
                        </p>
                    </div>
                </section>

                <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                {/* 7. Contact */}
                <section className="space-y-6 pt-4">
                    <div className="text-center space-y-2">
                        <h3 className="text-2xl font-bold text-white">Une question ?</h3>
                        <p className="text-slate-400">N'hésitez pas à nous contacter concernant cette politique.</p>
                    </div>

                    <div className="bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/10 rounded-2xl p-6 text-center max-w-sm mx-auto hover:border-white/20 transition-all group">
                        <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-white/10 transition-colors">
                            <Mail size={20} className="text-white" />
                        </div>
                        <p className="font-bold text-white text-lg mb-1">Cheikh Sall</p>
                        <a href="mailto:chekh.sall@icloud.com" className="text-emerald-400 hover:text-emerald-300 transition-colors font-medium">chekh.sall@icloud.com</a>
                    </div>
                </section>

                {/* Footer Logo */}
                <div className="pt-8 flex flex-col items-center opacity-30">
                    <Shield size={24} className="mb-4" />
                    <p className="text-xs font-bold tracking-[0.3em] uppercase">Kourous</p>
                </div>

            </main>
        </div>
    );
}
