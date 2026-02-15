import Link from "next/link";

export default function SupportPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-200">
            <div className="max-w-lg mx-auto px-6 py-20 pb-32">
                <Link
                    href="/"
                    className="inline-flex items-center text-xs font-bold uppercase tracking-[0.2em] mb-12 text-slate-500 hover:text-white transition-colors"
                >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Retour
                </Link>

                <div className="mb-16">
                    <h1 className="text-4xl font-black text-white mb-3 tracking-tighter">Support</h1>
                    <p className="text-slate-500 text-sm font-light uppercase tracking-widest leading-relaxed">À votre écoute.</p>
                </div>

                <section className="space-y-12">
                    <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
                        <h2 className="text-xl font-bold text-white mb-4">Besoin d'aide ?</h2>
                        <p className="text-slate-400 font-light leading-relaxed mb-8">
                            Vous avez un problème technique ou une suggestion pour améliorer votre expérience ?
                            Contactez-moi directement.
                        </p>
                        <a
                            href="mailto:support@kourous.app"
                            className="inline-flex w-full h-14 items-center justify-center bg-white text-slate-950 rounded-2xl font-bold text-sm tracking-wide active:scale-95 transition-all"
                        >
                            Envoyer un email
                        </a>
                    </div>

                    <div className="px-4 space-y-8">
                        <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-600">FAQ Rapide</h2>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <h3 className="text-white font-bold">L'application coûte-t-elle quelque chose ?</h3>
                                <p className="text-sm text-slate-500 font-light leading-relaxed">Kourous est gratuit dans sa version de base pour accompagner votre pratique quotidienne.</p>
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-white font-bold">Où sont mes perles ?</h3>
                                <p className="text-sm text-slate-500 font-light leading-relaxed">Vos chapelets sont accessibles via l'onglet "Bibliothèque" en bas de l'écran principal de l'app.</p>
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-white font-bold">Comment modifier le son ?</h3>
                                <p className="text-sm text-slate-500 font-light leading-relaxed">Rendez-vous dans les "Réglages" pour ajuster l'intensité du retour haptique et sonore.</p>
                            </div>
                        </div>
                    </div>

                    <footer className="pt-20 text-center text-xs text-slate-600 font-medium tracking-wide">
                        Kourous &bull; support@kourous.app
                    </footer>
                </section>
            </div>
        </div>
    );
}
