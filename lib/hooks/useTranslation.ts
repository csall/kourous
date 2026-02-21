"use client";

import { useSessionStore } from "@/lib/store/sessionStore";
import { translations, type Translations } from "@/lib/translations";

export function useTranslation() {
    const language = useSessionStore((state) => state.language) || 'fr';
    const t = translations[language as keyof typeof translations] as Translations;

    const resolve = (obj: any): string => {
        if (!obj) return "";
        if (typeof obj === "string") return obj;
        return obj[language] || obj["fr"] || "";
    };

    return { t, language, resolve };
}
