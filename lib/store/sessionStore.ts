import { create } from "zustand";
import { persist } from "zustand/middleware";
import { prayerPresets, type PrayerPreset } from "@/lib/data/prayerPresets";
import { usePrayerStore } from "./prayerStore";

export type SessionState = {
  preset: PrayerPreset | null;
  beadIndex: number; // Current bead in the cycle (0 to totalBeads - 1)
  totalCount: number; // Cumulative count
  isComplete: boolean;
  hapticsEnabled: boolean;
  soundEnabled: boolean;
  beadColor: string;
  showTitle: boolean;

  setPreset: (preset: PrayerPreset) => void;
  setPresetById: (id: string) => void;
  setPresetByGroupId: (groupId: string) => void;
  setPresetByInvocationId: (invocationId: string) => void;
  advance: () => void;
  reset: () => void;
  toggleHaptics: () => void;
  toggleSound: () => void;
  toggleShowTitle: () => void;
  setBeadColor: (color: string) => void;
  isUiOpen: boolean;
  setIsUiOpen: (isOpen: boolean) => void;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
};

export const useSessionStore = create<SessionState>()(
  persist(
    (set, get) => ({
      preset: prayerPresets[0], // Default to first preset
      beadIndex: 0,
      totalCount: 0,
      isComplete: false,
      hapticsEnabled: true,
      soundEnabled: true,
      beadColor: "#3b82f6", // Default Saphir blue

      setPreset: (preset) =>
        set({ preset, beadIndex: 0, totalCount: 0, isComplete: false }),

      setPresetById: (id) => {
        // First check default presets
        let found = prayerPresets.find((p) => p.id === id);

        // If not found, check custom prayers (legacy)
        if (!found) {
          const customPrayer = usePrayerStore.getState().customPrayers.find((p) => p.id === id);
          if (customPrayer) {
            // Create a dynamic preset from custom prayer
            found = {
              id: customPrayer.id,
              name: customPrayer.name,
              description: `${customPrayer.goal} répétitions`,
              totalBeads: customPrayer.goal,
              cycles: 1,
              sequence: [
                {
                  label: customPrayer.name,
                  repetitions: customPrayer.goal,
                },
              ],
            };
          }
        }

        if (found) {
          set({ preset: found, beadIndex: 0, totalCount: 0, isComplete: false });
        }
      },

      setPresetByGroupId: (groupId: string) => {
        const { preset: currentPreset } = get();
        if (currentPreset?.id === groupId) return;

        // Import at runtime to avoid circular dependencies
        const { useInvocationStore } = require("./invocationStore");
        const { groups, getInvocationById } = useInvocationStore.getState();

        const group = groups.find((g: any) => g.id === groupId);
        if (!group) return;

        // Build sequence from group invocations
        const sequence = group.invocations.map((inv: any) => {
          const invocation = getInvocationById(inv.invocationId);
          return {
            label: invocation?.name || "Invocation",
            repetitions: inv.repetitions,
          };
        });

        const totalBeads = group.invocations.reduce((sum: number, inv: any) => sum + inv.repetitions, 0);

        const preset: PrayerPreset = {
          id: group.id,
          name: group.name,
          description: group.description || `${group.invocations.length} invocations`,
          totalBeads,
          cycles: group.invocations.length,
          sequence,
        };

        set({ preset, beadIndex: 0, totalCount: 0, isComplete: false });
      },

      setPresetByInvocationId: (invocationId: string) => {
        const { preset: currentPreset } = get();
        if (currentPreset?.id === invocationId) return;

        // Import at runtime to avoid circular dependencies
        const { useInvocationStore } = require("./invocationStore");
        const { getInvocationById } = useInvocationStore.getState();

        const invocation = getInvocationById(invocationId);
        if (!invocation) return;

        // Create a preset from a single invocation
        const preset: PrayerPreset = {
          id: invocation.id,
          name: invocation.name,
          description: `${invocation.repetitions} répétitions`,
          totalBeads: invocation.repetitions,
          cycles: 1,
          sequence: [
            {
              label: invocation.name,
              repetitions: invocation.repetitions,
            },
          ],
        };

        set({ preset, beadIndex: 0, totalCount: 0, isComplete: false });
      },

      advance: () => {
        const { preset, totalCount, isComplete } = get();
        if (!preset || isComplete) return;

        const nextTotal = totalCount + 1;
        const completed = nextTotal >= preset.totalBeads;

        set({
          totalCount: nextTotal,
          beadIndex: nextTotal % preset.totalBeads, // Simplified for now, can be complex for multi-cycle
          isComplete: completed,
        });
      },

      reset: () => set({ totalCount: 0, beadIndex: 0, isComplete: false }),

      toggleHaptics: () => set((state) => ({ hapticsEnabled: !state.hapticsEnabled })),
      toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
      setBeadColor: (color: string) => set({ beadColor: color }),

      showTitle: true,
      toggleShowTitle: () => set((state) => ({ showTitle: !state.showTitle })),

      isUiOpen: false,
      setIsUiOpen: (isOpen: boolean) => set({ isUiOpen: isOpen }),

      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),
    }),
    {
      name: "kourous-session-storage",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

