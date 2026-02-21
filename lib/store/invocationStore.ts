import { create } from "zustand";
import { persist } from "zustand/middleware";
import { defaultInvocations, defaultGroups } from "@/lib/data/defaultInvocations";

// Une invocation simple
export interface Invocation {
    id: string;
    name: string;
    description?: string;
    repetitions: number; // Nombre de répétitions par défaut
    createdAt: string;
}

// Un groupe d'invocations (session complète)
export interface InvocationGroup {
    id: string;
    name: string;
    description?: string;
    invocations: Array<{
        invocationId: string; // Référence à une invocation
        repetitions: number; // Peut surcharger le nombre par défaut
    }>;
    createdAt: string;
}

interface InvocationStoreState {
    // These are merged views (derived)
    invocations: Invocation[];
    groups: InvocationGroup[];

    // Pure state (persisted)
    userInvocations: Invocation[];
    userGroups: InvocationGroup[];
    favoriteIds: string[];
    hiddenSystemIds: string[];

    // Invocations CRUD
    addInvocation: (invocation: Omit<Invocation, "id" | "createdAt">) => void;
    updateInvocation: (id: string, updates: Partial<Omit<Invocation, "id" | "createdAt">>) => void;
    deleteInvocation: (id: string) => void;
    getInvocationById: (id: string) => Invocation | undefined;

    // Groups CRUD
    addGroup: (group: Omit<InvocationGroup, "id" | "createdAt">) => void;
    updateGroup: (id: string, updates: Partial<Omit<InvocationGroup, "id" | "createdAt">>) => void;
    deleteGroup: (id: string) => void;
    getGroupById: (id: string) => InvocationGroup | undefined;

    // Favorites
    toggleFavorite: (id: string) => void;
    isFavorite: (id: string) => boolean;

    // Utility
    refreshMergedData: () => void;
    resetStore: () => void;
}

export const useInvocationStore = create<InvocationStoreState>()(
    persist(
        (set, get) => ({
            invocations: [],
            groups: [],
            userInvocations: [],
            userGroups: [],
            favoriteIds: [],
            hiddenSystemIds: [],

            // Helper to merge system and user data
            refreshMergedData: () => {
                const { userInvocations, userGroups, hiddenSystemIds } = get();

                const mergedInvocations = [
                    ...userInvocations,
                    ...defaultInvocations.filter(inv => !hiddenSystemIds.includes(inv.id))
                ];

                const mergedGroups = [
                    ...userGroups,
                    ...defaultGroups.filter(grp => !hiddenSystemIds.includes(grp.id))
                ];

                set({ invocations: mergedInvocations, groups: mergedGroups });
            },

            // Invocations
            addInvocation: (invocation) => {
                const newInvocation: Invocation = {
                    ...invocation,
                    id: `inv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    createdAt: new Date().toISOString(),
                };
                set((state) => ({
                    userInvocations: [newInvocation, ...state.userInvocations],
                }));
                get().refreshMergedData();
            },

            updateInvocation: (id, updates) => {
                if (id.startsWith('sys-')) {
                    // System items are read-only for now, or we could support overrides
                    // For now, let's just ignore or warn
                    return;
                }
                set((state) => ({
                    userInvocations: state.userInvocations.map((inv) =>
                        inv.id === id ? { ...inv, ...updates } : inv
                    ),
                }));
                get().refreshMergedData();
            },

            deleteInvocation: (id) => {
                if (id.startsWith('sys-')) {
                    set((state) => ({
                        hiddenSystemIds: [...state.hiddenSystemIds, id],
                    }));
                } else {
                    set((state) => ({
                        userInvocations: state.userInvocations.filter((inv) => inv.id !== id),
                    }));
                }
                // Cleanup favorites and groups
                set((state) => ({
                    favoriteIds: state.favoriteIds.filter((favId) => favId !== id),
                }));
                get().refreshMergedData();
            },

            getInvocationById: (id) => {
                return get().invocations.find((inv) => inv.id === id);
            },

            // Groups
            addGroup: (group) => {
                const newGroup: InvocationGroup = {
                    ...group,
                    id: `grp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    createdAt: new Date().toISOString(),
                };
                set((state) => ({
                    userGroups: [newGroup, ...state.userGroups],
                }));
                get().refreshMergedData();
            },

            updateGroup: (id, updates) => {
                if (id.startsWith('sys-')) return;
                set((state) => ({
                    userGroups: state.userGroups.map((grp) =>
                        grp.id === id ? { ...grp, ...updates } : grp
                    ),
                }));
                get().refreshMergedData();
            },

            deleteGroup: (id) => {
                if (id.startsWith('sys-')) {
                    set((state) => ({
                        hiddenSystemIds: [...state.hiddenSystemIds, id],
                    }));
                } else {
                    set((state) => ({
                        userGroups: state.userGroups.filter((grp) => grp.id !== id),
                    }));
                }
                set((state) => ({
                    favoriteIds: state.favoriteIds.filter((favId) => favId !== id),
                }));
                get().refreshMergedData();
            },

            getGroupById: (id) => {
                return get().groups.find((grp) => grp.id === id);
            },

            // Favorites
            toggleFavorite: (id) => {
                set((state) => ({
                    favoriteIds: state.favoriteIds.includes(id)
                        ? state.favoriteIds.filter((favId) => favId !== id)
                        : [...state.favoriteIds, id],
                }));
            },

            isFavorite: (id) => {
                return get().favoriteIds.includes(id);
            },

            loadDefaultData: () => {
                // Obsolete, but kept for compatibility during migration if needed
                get().refreshMergedData();
            },

            resetStore: () => {
                set({ userInvocations: [], userGroups: [], favoriteIds: [], hiddenSystemIds: [] });
                get().refreshMergedData();
            },
        }),
        {
            name: "kourous-invocations",
            partialize: (state) => ({
                userInvocations: state.userInvocations,
                userGroups: state.userGroups,
                favoriteIds: state.favoriteIds,
                hiddenSystemIds: state.hiddenSystemIds,
            }),
            onRehydrateStorage: () => (state) => {
                if (state) {
                    state.refreshMergedData();
                }
            },
        }
    )
);
