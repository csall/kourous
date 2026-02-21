"use client";

import { useEffect } from "react";
import { useInvocationStore } from "@/lib/store/invocationStore";

export function DataInitializer() {
    const { invocations, groups, loadDefaultData } = useInvocationStore();

    useEffect(() => {
        // Load defaults if store is empty OR if new defaults are missing (migration)
        // We check for 'Āyat al-Kursī' which is part of the new batch
        const hasNewDefaults = invocations.some(inv => inv.name === "Āyat al-Kursī");

        if ((invocations.length === 0 && groups.length === 0) || !hasNewDefaults) {
            console.log("Initializing/Updating default library data...");
            loadDefaultData();
        }
    }, [invocations.length, groups.length, loadDefaultData, invocations]);

    return null;
}
