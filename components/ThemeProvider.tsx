"use client";

import { useEffect } from "react";
import { useSessionStore } from "@/lib/store/sessionStore";

export function ThemeProvider() {
    const theme = useSessionStore((state) => state.theme);

    useEffect(() => {
        const root = document.documentElement;

        const applyTheme = (mode: 'dark' | 'light') => {
            root.classList.remove('dark', 'light');
            root.classList.add(mode);
            root.setAttribute('data-theme', mode);
            root.style.backgroundColor = mode === 'light' ? '#eeeef2' : '#05070c';
            document.body.style.backgroundColor = mode === 'light' ? '#eeeef2' : '#05070c';
        };

        if (theme === 'dark') {
            applyTheme('dark');
        } else if (theme === 'light') {
            applyTheme('light');
        } else {
            // Auto: follow system preference
            const mq = window.matchMedia('(prefers-color-scheme: dark)');
            applyTheme(mq.matches ? 'dark' : 'light');

            // Listen for system changes
            const handler = (e: MediaQueryListEvent) => applyTheme(e.matches ? 'dark' : 'light');
            mq.addEventListener('change', handler);
            return () => mq.removeEventListener('change', handler);
        }
    }, [theme]);

    return null;
}
