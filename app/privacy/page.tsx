import Link from "next/link";

export default function PrivacyPage() {
    return (
        <div className="h-[100dvh] max-h-[100dvh] bg-slate-950 text-slate-200 selection:bg-blue-500/30 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto overflow-x-hidden px-6 py-20 pb-32">
                <div className="max-w-lg mx-auto">
                    <Link
                        href="/settings"
                        className="inline-flex items-center text-xs font-bold uppercase tracking-[0.2em] mb-12 text-slate-500 hover:text-white transition-colors"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Retour
                    </Link>

                    <div className="mb-16">
                        <h1 className="text-4xl font-black text-white mb-3 tracking-tighter">Confidentialité</h1>
                        <p className="text-slate-500 text-sm font-light uppercase tracking-widest leading-relaxed">Mise à jour : 15 fév. 2026</p>
                    </div>

                    <section className="space-y-16">
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold text-white flex items-center gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                                Vie Privée
                            </h2>
                            <p className="text-slate-400 font-light leading-relaxed">
                                Kourous est conçu pour être un sanctuaire. Vos moments de méditation sont sacrés et vous appartiennent exclusivement.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-xl font-bold text-white flex items-center gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                                Zéro Donnée
                            </h2>
                            <p className="text-slate-400 font-light leading-relaxed">
                                <strong>Nous ne collectons absolument rien.</strong> Pas de compte, pas d'email, pas de localisation. L'application est totalement anonyme.
                            </p>
                        </div>

                        <div className="space-y-4 text-center py-12 px-6 bg-white/5 rounded-[2.5rem] border border-white/5">
                            <h2 className="text-lg font-bold text-white mb-2">Tout est Local</h2>
                            <p className="text-slate-400 text-sm font-light leading-relaxed">
                                Vos réglages et vos progrès sont stockés uniquement sur votre iPhone. Rien ne quitte votre appareil.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-xl font-bold text-white flex items-center gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                                Sécurité
                            </h2>
                            <p className="text-slate-400 font-light leading-relaxed">
                                Aucun SDK tiers, aucun traqueur publicitaire. Kourous est une zone neutre et sécurisée.
                            </p>
                        </div>

                        <footer className="pt-20 text-center border-t border-white/5">
                            <p className="text-xs text-slate-600 font-medium tracking-wide">
                                Kourous App &bull; Fabriqué pour la paix.
                            </p>
                        </footer>
                    </section>
                </div>
            </div>
        </div>
    );
}
