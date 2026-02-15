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

    // Hide BottomNav on legal pages and the immersive session
    const hiddenRoutes = ["/privacy", "/support"];
    if (hiddenRoutes.includes(pathname) || pathname.startsWith("/session")) return null;

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 pb-[env(safe-area-inset-bottom,1.5rem)]">
            <div className="bg-slate-900/80 backdrop-blur-xl border-t border-white/10 px-4 pt-2 pb-2 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] flex items-center justify-around">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href || (item.href === "/session" && pathname.startsWith("/session"));

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="relative flex flex-col items-center gap-1 px-4 py-2 min-w-[4rem] group"
                        >
                            {/* Active indicator */}
                            {isActive && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-white/5 rounded-xl"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}

                            {/* Icon */}
                            <div className="relative z-10">
                                <Icon
                                    size={22}
                                    className={`transition-colors ${isActive
                                        ? "text-blue-400"
                                        : "text-slate-400 group-hover:text-slate-300"
                                        }`}
                                />
                            </div>

                            {/* Label */}
                            <span
                                className={`relative z-10 text-[10px] font-medium transition-colors ${isActive
                                    ? "text-blue-400"
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
