"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { LayoutDashboard, Sparkles, BookOpen, Settings } from "lucide-react";

const navItems = [
    { href: "/", label: "Accueil", icon: LayoutDashboard },
    { href: "/session", label: "Session", icon: Sparkles },
    { href: "/library", label: "Bibliothèque", icon: BookOpen },
    { href: "/settings", label: "Réglages", icon: Settings },
];

export function BottomNav() {
    const pathname = usePathname();

    // Hide BottomNav on legal pages only
    const hiddenRoutes = ["/privacy", "/support"];
    if (hiddenRoutes.includes(pathname)) return null;

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-[calc(env(safe-area-inset-bottom,0px)+8px)] pointer-events-none">
            <div className="max-w-md mx-auto pointer-events-auto">
                <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center justify-around px-2 py-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href || (item.href === "/session" && pathname.startsWith("/session"));

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="relative flex flex-col items-center gap-1.5 px-4 py-2.5 group touch-manipulation min-w-[72px]"
                            >
                                {/* Active background indicator */}
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-white/10 rounded-[1.5rem]"
                                        transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                                    />
                                )}

                                {/* Icon avec scale effect au tap */}
                                <motion.div
                                    className="relative z-10"
                                    whileTap={{ scale: 0.85 }}
                                >
                                    <Icon
                                        size={22}
                                        className={`transition-all duration-300 ${isActive
                                            ? "text-white stroke-[2.5px]"
                                            : "text-slate-500 group-hover:text-slate-400 stroke-[1.5px]"
                                            }`}
                                    />
                                </motion.div>

                                {/* Label */}
                                <span
                                    className={`relative z-10 text-[10px] font-black uppercase tracking-[0.05em] transition-colors duration-300 ${isActive
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
            </div>
        </nav>
    );
}
