
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function TermsPage() {
    return (
        <div className="h-[100dvh] max-h-[100dvh] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col overflow-hidden touch-none p-6 pt-[calc(env(safe-area-inset-top)+2rem)] pb-[calc(env(safe-area-inset-bottom)+2rem)]">
            <div className="flex-1 flex flex-col">
                <Link href="/settings" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8">
                    <ArrowLeft size={20} />
                    <span>Retour</span>
                </Link>

                <div className="space-y-2 mb-8">
                    <h1 className="text-3xl font-light text-white">Conditions Générales</h1>
                </div>

                <div className="space-y-6 text-slate-300 logging-relaxed font-light">
                    <section className="space-y-2">
                        <h2 className="text-xl font-medium text-white">1. Utilisation</h2>
                        <p>
                            Kourous est une application gratuite destinée à un usage personnel et spirituel.
                            Vous êtes libre de l'utiliser autant que vous le souhaitez.
                        </p>
                    </section>

                    <section className="space-y-2">
                        <h2 className="text-xl font-medium text-white">2. Responsabilité</h2>
                        <p>
                            L'application est fournie "telle quelle". Bien que nous nous efforcions de garantir une expérience parfaite,
                            nous ne pouvons être tenus responsables d'éventuels bugs ou interruptions de service.
                        </p>
                    </section>

                    <section className="space-y-2">
                        <h2 className="text-xl font-medium text-white">3. Contenu</h2>
                        <p>
                            Les textes et contenus présents dans l'application sont fournis à titre informatif et spirituel.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
