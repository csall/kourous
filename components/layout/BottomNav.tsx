"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { LayoutDashboard, Sparkles, BookOpen, Settings, MoreHorizontal } from "lucide-react";
import { useSessionStore } from "@/lib/store/sessionStore";

const navItems = (t: any) => [
    { href: "/", label: t.nav.home, icon: LayoutDashboard },
    { href: "/session", label: t.nav.session, icon: Sparkles },
    { href: "/library", label: t.nav.library, icon: BookOpen },
    { href: "/settings?view=preferences", label: t.nav.preferences, icon: Settings },
    { href: "/settings", label: t.nav.more, icon: MoreHorizontal },
];

import { Suspense } from "react";
import { useTranslation } from "@/lib/hooks/useTranslation";

function BottomNavContent() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { hapticsEnabled } = useSessionStore();
    const { t } = useTranslation();

    const items = navItems(t);

    const handleHaptic = () => {
        if (hapticsEnabled && typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate(10); // Léger retour haptique
        }
    };

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/75 dark:bg-slate-950/80 backdrop-blur-2xl border-t border-slate-200/50 dark:border-white/5 pb-[env(safe-area-inset-bottom,20px)] pt-3 touch-none overscroll-none select-none">
            <div className="max-w-md mx-auto flex items-center justify-around px-4">
                {items.map((item) => {
                    const Icon = item.icon;
                    // Check if current path matches item.href base path
                    // Special handling for preferences to distinguish from /settings
                    const isPreferences = item.href.includes("view=preferences");
                    const isSettings = pathname === "/settings";
                    const hasPreferencesParam = searchParams.get('view') === 'preferences';

                    let isActive = false;
                    if (item.href === "/" && pathname === "/") isActive = true;
                    else if (item.href === "/session" && pathname.startsWith("/session")) isActive = true;
                    else if (item.href === "/library" && pathname.startsWith("/library")) isActive = true;
                    else if (isPreferences) isActive = isSettings && hasPreferencesParam;
                    else if (item.href === "/settings") isActive = isSettings && !hasPreferencesParam;

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
                                className={`relative z-10 transition-colors duration-300 ${isActive ? "text-indigo-600 dark:text-white" : "text-slate-600 dark:text-slate-500 group-hover:text-slate-900 dark:group-hover:text-slate-400"}`}
                            >
                                <Icon
                                    size={26}
                                    strokeWidth={isActive ? 2.5 : 2}
                                    className={`${isActive ? "fill-indigo-500/10 dark:fill-white/10" : "fill-transparent"}`}
                                />
                            </motion.div>

                            {/* Label */}
                            <span
                                className={`text-[10px] font-medium transition-colors duration-300 ${isActive
                                    ? "text-indigo-600 dark:text-white"
                                    : "text-slate-600 dark:text-slate-500 group-hover:text-slate-900 dark:group-hover:text-slate-400"
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

export function BottomNav() {
    return (
        <Suspense fallback={<nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-t border-slate-200 dark:border-white/10 pb-[env(safe-area-inset-bottom)] pt-2 md:pb-6 touch-none overscroll-none select-none" />}>
            <BottomNavContent />
        </Suspense>
    );
}
