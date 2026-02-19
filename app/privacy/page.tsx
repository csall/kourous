import Link from "next/link";
import { ArrowLeft, Shield, Lock, EyeOff, Server, FileText, Mail, CheckCircle2 } from "lucide-react";

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-300 font-sans selection:bg-emerald-500/30">
            {/* Background Effects (Dark Mode Only) */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-0 dark:opacity-100 transition-opacity duration-500">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px]" />
            </div>

            {/* Content */}
            <main className="relative max-w-3xl mx-auto px-6 pt-[calc(env(safe-area-inset-top)+2rem)] pb-16 space-y-12">
                <Link href="/settings" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors mb-8">
                    <ArrowLeft size={20} />
                    <span>Retour</span>
                </Link>

                {/* Intro Section */}
                <div className="space-y-6 text-center">
                    <div className="w-20 h-20 bg-emerald-100 dark:bg-transparent bg-gradient-to-tr from-emerald-500/20 to-blue-500/20 rounded-3xl border border-emerald-200 dark:border-white/10 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-emerald-500/10">
                        <Shield size={32} className="text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Votre vie privée est sacrée.</h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
                            Kourous est conçu pour la paix de l'esprit, sans compromis sur votre confidentialité.
                        </p>
                    </div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        Mise à jour : 19 février 2026
                    </div>
                </div>

                <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-white/10 to-transparent" />

                {/* 1. Introduction */}
                <section className="space-y-4">
                    <div className="flex items-center gap-3 text-slate-900 dark:text-white">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center border border-slate-200 dark:border-white/5">
                            <span className="font-bold text-sm">1</span>
                        </div>
                        <h3 className="text-xl font-bold">Introduction</h3>
                    </div>
                    <div className="pl-11 space-y-4 text-slate-600 dark:text-slate-400 leading-relaxed">
                        <p>
                            La présente Politique de Confidentialité décrit la manière dont l’application Kourous respecte votre vie privée.
                        </p>
                        <div className="bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 rounded-2xl p-6 shadow-sm dark:shadow-none">
                            <p className="font-medium text-slate-900 dark:text-white mb-2">En résumé</p>
                            <p className="text-sm">
                                Kourous est une application de compteur de dhikr fonctionnant <span className="text-slate-900 dark:text-white font-medium">sans création de compte</span> et <span className="text-slate-900 dark:text-white font-medium">sans collecte de données personnelles</span>.
                            </p>
                        </div>
                    </div>
                </section>

                {/* 2. Données collectées */}
                <section className="space-y-4">
                    <div className="flex items-center gap-3 text-slate-900 dark:text-white">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center border border-slate-200 dark:border-white/5">
                            <span className="font-bold text-sm">2</span>
                        </div>
                        <h3 className="text-xl font-bold">Données collectées</h3>
                    </div>
                    <div className="pl-11 space-y-6 text-slate-600 dark:text-slate-400 leading-relaxed">
                        <p>
                            Kourous ne collecte, ne stocke, ni ne transmet aucune donnée personnelle.
                        </p>
                        <div className="grid sm:grid-cols-3 gap-4">
                            <div className="bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 p-5 rounded-2xl space-y-3 hover:shadow-lg dark:hover:bg-white/[0.05] transition-all group">
                                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <EyeOff size={20} className="text-slate-500 dark:text-slate-400" />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900 dark:text-white">Aucune inscription</p>
                                    <p className="text-xs text-slate-500 mt-1">Utilisation immédiate</p>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 p-5 rounded-2xl space-y-3 hover:shadow-lg dark:hover:bg-white/[0.05] transition-all group">
                                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <FileText size={20} className="text-slate-500 dark:text-slate-400" />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900 dark:text-white">Zéro formulaire</p>
                                    <p className="text-xs text-slate-500 mt-1">Rien à remplir</p>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 p-5 rounded-2xl space-y-3 hover:shadow-lg dark:hover:bg-white/[0.05] transition-all group">
                                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Server size={20} className="text-slate-500 dark:text-slate-400" />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900 dark:text-white">Pas de serveur</p>
                                    <p className="text-xs text-slate-500 mt-1">Tout est sur votre appareil</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 3. Données stockées localement */}
                <section className="space-y-4">
                    <div className="flex items-center gap-3 text-slate-900 dark:text-white">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center border border-slate-200 dark:border-white/5">
                            <span className="font-bold text-sm">3</span>
                        </div>
                        <h3 className="text-xl font-bold">Données stockées localement</h3>
                    </div>
                    <div className="pl-11 space-y-4 text-slate-600 dark:text-slate-400 leading-relaxed">
                        <p>
                            Certaines informations sont enregistrées uniquement sur votre appareil pour le bon fonctionnement de l'application :
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {[
                                "Nombre de dhikr",
                                "Objectif quotidien",
                                "Préférences sonores",
                                "Préférences haptiques",
                                "Choix de la langue",
                                "Thème (Sombre/Clair)"
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/5 border border-emerald-500/10 text-emerald-700 dark:text-emerald-200/80 text-sm font-medium">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    {item}
                                </div>
                            ))}
                        </div>
                        <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-4 flex gap-4 items-center mt-2">
                            <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                                <Lock size={18} className="text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <p className="text-sm text-emerald-800 dark:text-emerald-100/80 font-medium">Ces données restent strictement locales sur votre téléphone. Nous n'y avons pas accès.</p>
                        </div>
                    </div>
                </section>

                {/* 4. Services tiers */}
                <section className="space-y-4">
                    <div className="flex items-center gap-3 text-slate-900 dark:text-white">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center border border-slate-200 dark:border-white/5">
                            <span className="font-bold text-sm">4</span>
                        </div>
                        <h3 className="text-xl font-bold">Services tiers</h3>
                    </div>
                    <div className="pl-11 space-y-4 text-slate-600 dark:text-slate-400 leading-relaxed">
                        <p>
                            L’application respecte votre tranquillité :
                        </p>
                        <div className="space-y-3">
                            {[
                                "Aucun service d’analyse comportementale",
                                "Aucune publicité intégrée",
                                "Aucun traceur publicitaire"
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                                    <CheckCircle2 size={16} className="text-teal-500" />
                                    <span>{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 5. Sécurité */}
                <section className="space-y-4">
                    <div className="flex items-center gap-3 text-slate-900 dark:text-white">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center border border-slate-200 dark:border-white/5">
                            <span className="font-bold text-sm">5</span>
                        </div>
                        <h3 className="text-xl font-bold">Sécurité</h3>
                    </div>
                    <div className="pl-11 text-slate-600 dark:text-slate-400 leading-relaxed">
                        <p>
                            Toutes les données éventuelles sont stockées localement et de manière sécurisée par le système d'exploitation de votre appareil (iOS/Android).
                        </p>
                    </div>
                </section>

                {/* 6. Modifications */}
                <section className="space-y-4">
                    <div className="flex items-center gap-3 text-slate-900 dark:text-white">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center border border-slate-200 dark:border-white/5">
                            <span className="font-bold text-sm">6</span>
                        </div>
                        <h3 className="text-xl font-bold">Modifications</h3>
                    </div>
                    <div className="pl-11 text-slate-600 dark:text-slate-400 leading-relaxed space-y-2">
                        <p>
                            Cette politique peut être mise à jour si des fonctionnalités nouvelles sont ajoutées (par exemple : compte utilisateur ou statistiques en ligne). La date de mise à jour en haut de cette page sera modifiée en conséquence.
                        </p>
                    </div>
                </section>

                <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-white/10 to-transparent" />

                {/* 7. Contact */}
                <section className="space-y-6 pt-4">
                    <div className="text-center space-y-2">
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Une question ?</h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm">N'hésitez pas à nous contacter concernant cette politique.</p>
                    </div>

                    <div className="bg-white dark:bg-gradient-to-b dark:from-white/[0.08] dark:to-white/[0.02] border border-slate-200 dark:border-white/10 rounded-2xl p-8 text-center max-w-sm mx-auto hover:shadow-lg dark:hover:border-white/20 transition-all group relative overflow-hidden">
                        <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-500/10 dark:group-hover:bg-white/10 transition-colors">
                                <Mail size={20} className="text-slate-900 dark:text-white" />
                            </div>
                            <h4 className="font-bold text-slate-900 dark:text-white text-lg mb-2">Cheikh Sall</h4>
                            <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 leading-relaxed">
                                Développeur de l'application
                            </p>
                            <a
                                href="mailto:chekh.sall@icloud.com"
                                className="inline-flex items-center justify-center px-6 py-2 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-colors"
                            >
                                chekh.sall@icloud.com
                            </a>
                        </div>
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
