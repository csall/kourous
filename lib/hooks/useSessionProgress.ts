import { useSessionStore } from "@/lib/store/sessionStore";
import { useMemo } from "react";

export function useSessionProgress() {
    // GRANULAR selectors: only re-render when these specific values change.
    // Previously used useSessionStore() without selector → subscribed to ENTIRE store
    // → toggling sound/haptics/color caused unnecessary re-renders here.
    const preset = useSessionStore(state => state.preset);
    const totalCount = useSessionStore(state => state.totalCount);
    const isActuallyComplete = useSessionStore(state => state.isComplete);

    const progress = useMemo(() => {
        if (!preset) return null;

        let accumulatedBeads = 0;
        let currentItem = preset.sequence[0];
        let currentCycleIndex = 0;
        let isTransition = false;

        // Find which sequence item we are currently in, accounting for transition clicks
        for (let i = 0; i < preset.sequence.length; i++) {
            const item = preset.sequence[i];
            const startOfItem = accumulatedBeads + i; // Offset by i for transition dead clicks
            const endOfItem = startOfItem + item.repetitions;

            if (totalCount <= endOfItem) {
                currentItem = item;
                currentCycleIndex = i;
                // If it's a new item (not the first) and we're at the very first click of its span
                if (i > 0 && totalCount === startOfItem) {
                    isTransition = true;
                }
                break;
            }

            accumulatedBeads += item.repetitions;

            // Handle end state logic
            if (i === preset.sequence.length - 1) {
                currentItem = item;
                currentCycleIndex = i;
            }
        }

        const beadsInCurrentCycle = isTransition ? 0 : totalCount - (accumulatedBeads + currentCycleIndex);

        return {
            label: currentItem.label,
            sublabel: currentItem.transliteration,
            cycleTotal: currentItem.repetitions,
            // If complete, show the full total of the last item.
            cycleProgress: isActuallyComplete ? currentItem.repetitions : beadsInCurrentCycle,
            cycleIndex: currentCycleIndex,
            totalCycles: preset.sequence.length
        };
    }, [preset, totalCount, isActuallyComplete]);

    return progress;
}
