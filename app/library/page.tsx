"use client";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { LibraryContent } from "@/components/library/LibraryContent";

export default function Library() {
    return (
        <div className="min-h-[100dvh] bg-[#05070c]">
            {/* Header with back button — same style as FullscreenModal */}
            <div className="flex items-center gap-4 px-6 py-4 border-b border-white/5 bg-[#05070c]/50 backdrop-blur-xl sticky top-0 z-50">
                <Link
                    href="/"
                    className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-colors active:scale-90"
                    aria-label="Retour"
                >
                    <ChevronLeft size={24} />
                </Link>
                <h2 className="text-xl font-light text-white">Bibliothèque</h2>
            </div>

            <LibraryContent />
        </div>
    );
}
