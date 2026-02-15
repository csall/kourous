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
            const nextAccumulated = accumulatedBeads + item.repetitions;

            // If totalCount is within this item's range OR exactly matches its end
            if (totalCount <= nextAccumulated) {
                currentItem = item;
                currentCycleIndex = i;
                break;
            }

            accumulatedBeads = nextAccumulated;

            // Handle case where we are at the very end (completed)
            if (i === preset.sequence.length - 1) {
                currentItem = item;
                currentCycleIndex = i;
            }
        }

        const beadsInCurrentCycle = totalCount - accumulatedBeads;
        const isActuallyComplete = useSessionStore.getState().isComplete;

        return {
            label: currentItem.label,
            sublabel: currentItem.transliteration,
            cycleTotal: currentItem.repetitions,
            // If complete, show the full total of the last item. 
            // Also, if we just finished a cycle and haven't clicked to the next, 
            // we should probably see the full count of that cycle.
            cycleProgress: isActuallyComplete ? currentItem.repetitions : beadsInCurrentCycle,
            cycleIndex: currentCycleIndex,
            totalCycles: preset.sequence.length
        };
    }, [preset, totalCount]);

    return progress;
}
