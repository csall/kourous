"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { LayoutDashboard, Sparkles, BookOpen, Settings, MoreHorizontal } from "lucide-react";
import { useSessionStore } from "@/lib/store/sessionStore";

const navItems = [
    { href: "/", label: "Accueil", icon: LayoutDashboard },
    { href: "/session", label: "Session", icon: Sparkles },
    { href: "/library", label: "Bibliothèque", icon: BookOpen },
    { href: "/settings", label: "Autre", icon: MoreHorizontal },
];

export function BottomNav() {
    const pathname = usePathname();
    const { hapticsEnabled } = useSessionStore();

    const handleHaptic = () => {
        if (hapticsEnabled && typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate(10); // Léger retour haptique
        }
    };

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-t border-white/10 pb-[env(safe-area-inset-bottom)] pt-2 md:pb-6 touch-none">
            <div className="max-w-md mx-auto flex items-center justify-around px-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href || (item.href === "/session" && pathname.startsWith("/session"));

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={handleHaptic}
                            className="relative flex flex-col items-center justify-center gap-1 min-w-[64px] py-1 group touch-manipulation"
                        >
                            {/* Icon avec transition de couleur */}
                            <motion.div
                                whileTap={{ scale: 0.9 }}
                                className={`relative z-10 transition-colors duration-300 ${isActive ? "text-white" : "text-slate-500 group-hover:text-slate-400"}`}
                            >
                                <Icon
                                    size={26}
                                    strokeWidth={isActive ? 2.5 : 2}
                                    className={`${isActive ? "fill-white/10" : "fill-transparent"}`}
                                />
                            </motion.div>

                            {/* Label */}
                            <span
                                className={`text-[10px] font-medium transition-colors duration-300 ${isActive
                                    ? "text-white"
                                    : "text-slate-500 group-hover:text-slate-400"
                                    }`}
                            >
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
