import { useSessionStore } from "@/lib/store/sessionStore";
import { useMemo } from "react";

export function useSessionProgress() {
    // GRANULAR selectors: only re-render when these specific values change.
    // Previously used useSessionStore() without selector → subscribed to ENTIRE store
    // → toggling sound/haptics/color caused unnecessary re-renders here.
    const preset = useSessionStore(state => state.preset);
    const totalCount = useSessionStore(state => state.totalCount);

    const progress = useMemo(() => {
        if (!preset) return null;

        let accumulatedBeads = 0;
        let currentItem = preset.sequence[0];
        let currentCycleIndex = 0;

        // Find which sequence item we are currently in
        for (let i = 0; i < preset.sequence.length; i++) {
            const item = preset.sequence[i];
            if (totalCount < accumulatedBeads + item.repetitions) {
                currentItem = item;
                currentCycleIndex = i;
                break;
            }
            accumulatedBeads += item.repetitions;

            // Handle case where we are at the very end (completed)
            if (i === preset.sequence.length - 1 && totalCount >= accumulatedBeads) {
                currentItem = item; // Stick to last item
                currentCycleIndex = i;
            }
        }

        const beadsInCurrentCycle = totalCount - accumulatedBeads;

        return {
            label: currentItem.label,
            sublabel: currentItem.transliteration,
            cycleTotal: currentItem.repetitions,
            cycleProgress: beadsInCurrentCycle, // Start at 0
            cycleIndex: currentCycleIndex,
            totalCycles: preset.sequence.length
        };
    }, [preset, totalCount]);

    return progress;
}
