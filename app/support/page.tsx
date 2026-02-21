import Link from "next/link";
import { ArrowLeft, HelpCircle, Mail, Smartphone, Volume2, Sparkles, BookOpen, Palette } from "lucide-react";

export default function SupportPage() {
    return (
        <div className="h-[100dvh] bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 font-sans selection:bg-cyan-500/30 overflow-hidden flex flex-col">
            {/* Background Effects (Dark Mode Only) */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-0 dark:opacity-100 transition-opacity duration-500">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px]" />
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto no-scrollbar touch-pan-y">
                <main className="relative max-w-3xl mx-auto px-6 pt-[calc(env(safe-area-inset-top)+2rem)] pb-32 space-y-8">
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
                            <p className="text-lg text-slate-700 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
                                Nous sommes là pour vous aider à tirer le meilleur parti de Kourous.
                            </p>
                        </div>
                    </div>

                    <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-white/10 to-transparent" />

                    <div className="space-y-12">
                        {/* Contact Section */}
                        <section className="space-y-6">
                            <div className="bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 rounded-3xl p-8 text-center max-w-sm mx-auto shadow-sm dark:shadow-none transition-all">
                                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                                    <Mail size={22} className="text-slate-900 dark:text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Une question ?</h3>
                                <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 leading-relaxed">
                                    N'hésitez pas à m'écrire pour toute suggestion ou problème rencontré.
                                </p>
                                <a
                                    href="mailto:cheikh.sall@icloud.com"
                                    className="inline-flex items-center justify-center w-full px-6 py-3 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm transition-colors shadow-lg shadow-cyan-500/20"
                                >
                                    cheikh.sall@icloud.com
                                </a>
                            </div>
                        </section>

                        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                        {/* FAQ Section */}
                        <section className="space-y-6">
                            <div className="text-center">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">FAQ Rapide</h3>
                            </div>

                            <div className="grid gap-6">
                                {/* FAQ Item 1 */}
                                <div className="bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 rounded-2xl p-6 space-y-3 shadow-sm dark:shadow-none">
                                    <div className="flex items-center gap-3 text-slate-900 dark:text-white">
                                        <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                            <Sparkles size={18} />
                                        </div>
                                        <h4 className="font-bold">Créer une collection ou invocation</h4>
                                    </div>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed pl-[3.25rem]">
                                        Utilisez le bouton "+" dans la bibliothèque pour ajouter une invocation ou créer une collection. Les collections vous permettent de grouper vos invocations préférées.
                                    </p>
                                </div>

                                {/* FAQ Item 2 */}
                                <div className="bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 rounded-2xl p-6 space-y-3 shadow-sm dark:shadow-none">
                                    <div className="flex items-center gap-3 text-slate-900 dark:text-white">
                                        <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400">
                                            <BookOpen size={18} />
                                        </div>
                                        <h4 className="font-bold">Personnalisation des éléments</h4>
                                    </div>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed pl-[3.25rem]">
                                        Vous pouvez modifier à tout moment le nom, la description ou les répétitions de vos invocations et collections pour qu'elles correspondent parfaitement à votre pratique.
                                    </p>
                                </div>

                                {/* FAQ Item 3 */}
                                <div className="bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 rounded-2xl p-6 space-y-3 shadow-sm dark:shadow-none">
                                    <div className="flex items-center gap-3 text-slate-900 dark:text-white">
                                        <div className="p-2 rounded-lg bg-cyan-100 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                                            <Smartphone size={18} />
                                        </div>
                                        <h4 className="font-bold">Support du mode clair</h4>
                                    </div>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed pl-[3.25rem]">
                                        Kourous s'adapte automatiquement au thème de votre iPhone. Les textes et l'interface ont été optimisés pour une lecture confortable de jour comme de nuit.
                                    </p>
                                </div>

                                {/* FAQ Item 4 */}
                                <div className="bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 rounded-2xl p-6 space-y-3 shadow-sm dark:shadow-none">
                                    <div className="flex items-center gap-3 text-slate-900 dark:text-white">
                                        <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400">
                                            <Volume2 size={18} />
                                        </div>
                                        <h4 className="font-bold">Son et Vibration</h4>
                                    </div>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed pl-[3.25rem]">
                                        Vous pouvez activer ou désactiver le retour haptique et les sons de clic dans les "Réglages" pour une expérience qui vous ressemble.
                                    </p>
                                </div>

                                {/* FAQ Item 5 */}
                                <div className="bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 rounded-2xl p-6 space-y-3 shadow-sm dark:shadow-none">
                                    <div className="flex items-center gap-3 text-slate-900 dark:text-white">
                                        <div className="p-2 rounded-lg bg-rose-100 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400">
                                            <Palette size={18} />
                                        </div>
                                        <h4 className="font-bold">Modifier la couleur des perles</h4>
                                    </div>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed pl-[3.25rem]">
                                        Personnalisez votre chapelet en changeant la couleur des perles dans les "Réglages". Choisissez parmi plusieurs teintes pour rendre votre pratique unique.
                                    </p>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Footer Logo */}
                    <div className="pt-8 flex flex-col items-center opacity-30">
                        <HelpCircle size={24} className="mb-4" />
                        <p className="text-xs font-bold tracking-[0.3em] uppercase">Kourous</p>
                    </div>

                </main>
            </div>
        </div>
    );
}
