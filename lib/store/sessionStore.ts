import { create } from "zustand";
import { persist } from "zustand/middleware";
import { prayerPresets, type PrayerPreset } from "@/lib/data/prayerPresets";
import { usePrayerStore } from "./prayerStore";

export type SessionState = {
  preset: PrayerPreset | null;
  beadIndex: number; // Current bead in the cycle (0 to totalBeads - 1)
  totalCount: number; // Cumulative count
  currentCycle: number; // Current loop number (starts at 1)
  isComplete: boolean;
  hapticsEnabled: boolean;
  soundEnabled: boolean;
  beadColor: string;
  showTitle: boolean;
  theme: 'dark' | 'light' | 'auto';
  language: 'fr' | 'en';

  // Stats
  stats: {
    totalSessions: number;
    totalRepetitions: number;
    lastSessionDate: string | null;
    streak: number;
  };

  setPreset: (preset: PrayerPreset) => void;
  setPresetById: (id: string) => void;
  setPresetByGroupId: (groupId: string) => void;
  setPresetByInvocationId: (invocationId: string) => void;
  setFreeSession: (target?: number) => void;
  updateFreeSession: (name: string, target: number) => void;
  advance: () => void;
  reset: () => void;
  toggleHaptics: () => void;
  toggleSound: () => void;
  toggleShowTitle: () => void;
  setBeadColor: (color: string) => void;
  setTheme: (theme: 'dark' | 'light' | 'auto') => void;
  setLanguage: (lang: 'fr' | 'en') => void;
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
      currentCycle: 1,
      isComplete: false,
      hapticsEnabled: true,
      soundEnabled: true,
      beadColor: "#10b981", // Default Emerald Green
      theme: 'auto' as const,
      language: 'fr' as const,
      stats: {
        totalSessions: 0,
        totalRepetitions: 0,
        lastSessionDate: null,
        streak: 0,
      },

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

      setFreeSession: (target: number = 33) => {
        const preset: PrayerPreset = {
          id: "free-session",
          name: "Session Libre",
          description: "Mode libre. Touchez le titre pour modifier.",
          totalBeads: target,
          cycles: 999, // Infinite loop
          sequence: [
            {
              label: "Tasbih Libre",
              repetitions: target,
            },
          ],
        };
        set({ preset, beadIndex: 0, totalCount: 0, currentCycle: 1, isComplete: false });
      },

      updateFreeSession: (name: string, target: number) => {
        const { preset, totalCount } = get();
        if (!preset || preset.id !== "free-session") return;

        const newPreset: PrayerPreset = {
          ...preset,
          name,
          totalBeads: target,
          sequence: [
            {
              ...preset.sequence[0],
              repetitions: target,
            }
          ]
        };

        // If we reduce the bead count below current progress during a cycle, detailed logic might be needed
        // For now, we update the preset which drives the view.
        set({ preset: newPreset, beadIndex: 0, totalCount: 0, currentCycle: 1 });
      },

      advance: () => {
        const { preset, totalCount, isComplete, stats, currentCycle } = get();
        if (!preset || isComplete) return;

        const nextTotal = totalCount + 1;

        // Custom Logic for Free Session (Infinite Loop)
        if (preset.id === "free-session") {
          let nextTotal = totalCount + 1;
          let nextCycle = currentCycle || 1;
          const target = preset.totalBeads;

          // If we exceed target, wrap around to 1 (new loop)
          if (nextTotal > target) {
            nextTotal = 1;
            nextCycle += 1;
          }

          const updates: Partial<SessionState> = {
            totalCount: nextTotal,
            beadIndex: nextTotal,
            currentCycle: nextCycle,
          };

          // Stats update logic
          const today = new Date().toISOString().split('T')[0];

          // Only increment streak daily logic here...
          // For simplicity, we just add repetition.
          updates.stats = {
            ...stats,
            totalRepetitions: stats.totalRepetitions + 1,
            lastSessionDate: today,
          };

          set(updates);
          return;
        }

        // Regular Session Logic
        // Total steps = Sum of repetitions (no transition/dead clicks)
        const totalSteps = preset.totalBeads;
        const completed = nextTotal >= totalSteps;
        // If we want the last bead to be clickable, then isComplete is when nextTotal > totalSteps? 
        // No, usually isComplete is true when we reach the end.
        // Let's say 3 beads.
        // 1, 2, 3.
        // If nextTotal is 3, it's the last bead.
        // If nextTotal is 4, we are done.

        // Actually, if we want to stop exactly AT the end, we might need isComplete = nextTotal > totalSteps.
        // But usually we set isComplete = true when we finish the last bead.
        // Let's stick to existing logic but corrected.

        const updates: Partial<SessionState> = {
          totalCount: nextTotal,
          beadIndex: nextTotal,
          isComplete: completed,
        };

        // Update stats on completion
        if (completed) {
          const today = new Date().toISOString().split('T')[0];
          const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
          const newStreak = stats.lastSessionDate === yesterday || stats.lastSessionDate === today
            ? (stats.lastSessionDate === today ? stats.streak : stats.streak + 1)
            : 1;

          updates.stats = {
            totalSessions: stats.totalSessions + 1,
            totalRepetitions: stats.totalRepetitions + preset.totalBeads, // This adds the whole batch? Wait, existing logic added batch at end.
            lastSessionDate: today,
            streak: newStreak,
          };
        }

        set(updates);
      },

      reset: () => set({ totalCount: 0, beadIndex: 0, currentCycle: 1, isComplete: false }),

      toggleHaptics: () => set((state) => ({ hapticsEnabled: !state.hapticsEnabled })),
      toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
      setBeadColor: (color: string) => set({ beadColor: color }),
      setTheme: (theme: 'dark' | 'light' | 'auto') => set({ theme }),
      setLanguage: (lang: 'fr' | 'en') => set({ language: lang }),

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

