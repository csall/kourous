import Link from "next/link";
import { ArrowLeft, HelpCircle, Mail, MessageCircle, Smartphone, Volume2 } from "lucide-react";

export default function SupportPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-300 font-sans selection:bg-cyan-500/30">
            {/* Background Effects (Dark Mode Only) */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-0 dark:opacity-100 transition-opacity duration-500">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px]" />
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
                    <div className="w-20 h-20 bg-cyan-100 dark:bg-transparent bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 rounded-3xl border border-cyan-200 dark:border-white/10 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-cyan-500/10">
                        <HelpCircle size={32} className="text-cyan-600 dark:text-cyan-400" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Support & Aide</h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
                            Nous sommes là pour vous aider à tirer le meilleur parti de Kourous.
                        </p>
                    </div>
                </div>

                <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-white/10 to-transparent" />

                {/* Contact Section */}
                <section className="space-y-6">
                    <div className="text-center space-y-2">
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Nous contacter</h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm">Une question, une suggestion ou un problème ?</p>
                    </div>

                    <div className="bg-white dark:bg-gradient-to-b dark:from-white/[0.08] dark:to-white/[0.02] border border-slate-200 dark:border-white/10 rounded-2xl p-8 text-center max-w-sm mx-auto hover:shadow-lg dark:hover:border-white/20 transition-all group relative overflow-hidden">
                        <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-cyan-500/10 dark:group-hover:bg-white/10 transition-colors">
                                <Mail size={20} className="text-slate-900 dark:text-white" />
                            </div>
                            <h4 className="font-bold text-slate-900 dark:text-white text-lg mb-2">Envoyer un email</h4>
                            <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 leading-relaxed">
                                Je lis tous les messages et m'efforce de répondre le plus rapidement possible.
                            </p>
                            <a
                                href="mailto:cheikh.sall@icloud.com"
                                className="inline-flex items-center justify-center px-6 py-2 rounded-full bg-cyan-500 hover:bg-cyan-400 text-white font-bold text-sm transition-colors"
                            >
                                cheikh.sall@icloud.com
                            </a>
                        </div>
                    </div>
                </section>

                <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                {/* FAQ Section */}
                <section className="space-y-8">
                    <div className="text-center">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">FAQ Rapide</h3>
                    </div>

                    <div className="grid gap-6">
                        {/* FAQ Item 1 */}
                        <div className="bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 rounded-2xl p-6 space-y-3 shadow-sm dark:shadow-none">
                            <div className="flex items-center gap-3 text-slate-900 dark:text-white">
                                <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                    <MessageCircle size={18} />
                                </div>
                                <h4 className="font-bold">L'application est-elle gratuite ?</h4>
                            </div>
                            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed pl-[3.25rem]">
                                Oui, Kourous est gratuite dans sa version de base pour accompagner votre pratique quotidienne sans publicité intrusive.
                            </p>
                        </div>

                        {/* FAQ Item 2 */}
                        <div className="bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 rounded-2xl p-6 space-y-3 shadow-sm dark:shadow-none">
                            <div className="flex items-center gap-3 text-slate-900 dark:text-white">
                                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400">
                                    <Smartphone size={18} />
                                </div>
                                <h4 className="font-bold">Où sont mes perles ?</h4>
                            </div>
                            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed pl-[3.25rem]">
                                Vos chapelets sont accessibles via l'onglet "Bibliothèque" en bas de l'écran principal de l'application.
                            </p>
                        </div>

                        {/* FAQ Item 3 */}
                        <div className="bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 rounded-2xl p-6 space-y-3 shadow-sm dark:shadow-none">
                            <div className="flex items-center gap-3 text-slate-900 dark:text-white">
                                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400">
                                    <Volume2 size={18} />
                                </div>
                                <h4 className="font-bold">Comment modifier le son ?</h4>
                            </div>
                            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed pl-[3.25rem]">
                                Rendez-vous dans les "Réglages" (icône engrenage) pour ajuster l'intensité du retour haptique et sonore selon vos préférences.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Footer Logo */}
                <div className="pt-8 flex flex-col items-center opacity-30">
                    <HelpCircle size={24} className="mb-4" />
                    <p className="text-xs font-bold tracking-[0.3em] uppercase">Kourous</p>
                </div>

            </main>
        </div>
    );
}
