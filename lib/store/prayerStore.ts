import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CustomPrayer {
    id: string;
    name: string;
    goal: number;
    category: "Chapelet" | "Douha" | "Tasbih";
    createdAt: string;
    isCustom: true;
}

interface PrayerStoreState {
    customPrayers: CustomPrayer[];
    addPrayer: (prayer: Omit<CustomPrayer, "id" | "createdAt" | "isCustom">) => void;
    updatePrayer: (id: string, updates: Partial<Omit<CustomPrayer, "id" | "isCustom">>) => void;
    deletePrayer: (id: string) => void;
    getPrayersByCategory: (category: string) => CustomPrayer[];
}

export const usePrayerStore = create<PrayerStoreState>()(
    persist(
        (set, get) => ({
            customPrayers: [],

            addPrayer: (prayer) => {
                const newPrayer: CustomPrayer = {
                    ...prayer,
                    id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    createdAt: new Date().toISOString(),
                    isCustom: true,
                };
                set((state) => ({
                    customPrayers: [...state.customPrayers, newPrayer],
                }));
            },

            updatePrayer: (id, updates) => {
                set((state) => ({
                    customPrayers: state.customPrayers.map((prayer) =>
                        prayer.id === id ? { ...prayer, ...updates } : prayer
                    ),
                }));
            },

            deletePrayer: (id) => {
                set((state) => ({
                    customPrayers: state.customPrayers.filter((prayer) => prayer.id !== id),
                }));
            },

            getPrayersByCategory: (category) => {
                return get().customPrayers.filter((prayer) => prayer.category === category);
            },
        }),
        {
            name: "kourous-prayers",
        }
    )
);
