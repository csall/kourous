import { create } from "zustand";
import { persist } from "zustand/middleware";

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
    invocations: Invocation[];
    groups: InvocationGroup[];
    favoriteIds: string[];
    _hasLoadedDefaults?: boolean;

    // Invocations CRUD
    addInvocation: (invocation: Omit<Invocation, "id" | "createdAt">) => void;
    updateInvocation: (id: string, updates: Partial<Omit<Invocation, "id" | "createdAt">>) => void;
    deleteInvocation: (id: string) => void;
    getInvocationById: (id: string) => Invocation | undefined;

    // Groups CRUD
    addGroup: (group: Omit<InvocationGroup, "id" | "createdAt">) => void;
    updateGroup: (id: string, updates: Partial<Omit<InvocationGroup, "id" | "createdAt">>) => void;
    deleteGroup: (id: string) => void;
    // Favorites
    toggleFavorite: (id: string) => void;
    isFavorite: (id: string) => boolean;

    // Utility
    loadDefaultData: () => void;
    resetStore: () => void;
}

export const useInvocationStore = create<InvocationStoreState>()(
    persist(
        (set, get) => ({
            invocations: [],
            groups: [],
            favoriteIds: [],
            _hasLoadedDefaults: false,

            // Invocations
            addInvocation: (invocation) => {
                const newInvocation: Invocation = {
                    ...invocation,
                    id: `inv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    createdAt: new Date().toISOString(),
                };
                set((state) => ({
                    invocations: [newInvocation, ...state.invocations],
                }));
            },

            updateInvocation: (id, updates) => {
                set((state) => ({
                    invocations: state.invocations.map((inv) =>
                        inv.id === id ? { ...inv, ...updates } : inv
                    ),
                }));
            },

            deleteInvocation: (id) => {
                set((state) => ({
                    invocations: state.invocations.filter((inv) => inv.id !== id),
                    // Also remove from groups
                    groups: state.groups.map((group) => ({
                        ...group,
                        invocations: group.invocations.filter((inv) => inv.invocationId !== id),
                    })),
                    // Remove from favorites if present
                    favoriteIds: state.favoriteIds.filter((favId) => favId !== id),
                }));
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
                    groups: [newGroup, ...state.groups],
                }));
            },

            updateGroup: (id, updates) => {
                set((state) => ({
                    groups: state.groups.map((grp) =>
                        grp.id === id ? { ...grp, ...updates } : grp
                    ),
                }));
            },

            deleteGroup: (id) => {
                set((state) => ({
                    groups: state.groups.filter((grp) => grp.id !== id),
                    // Remove from favorites if present
                    favoriteIds: state.favoriteIds.filter((favId) => favId !== id),
                }));
            },

            getGroupById: (id: string) => {
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

            // Utility
            loadDefaultData: () => {
                const { defaultInvocations, defaultGroups } = require("@/lib/data/defaultInvocations");

                // Add default invocations (Idempotent: Check by name)
                const currentInvocations = get().invocations;
                const currentGroups = get().groups;

                const invocationMap = new Map<string, string>();
                const newInvocations: Invocation[] = [];

                // 1. Create a map of EXISTING invocations to reuse IDs
                currentInvocations.forEach(inv => {
                    invocationMap.set(inv.name, inv.id);
                });

                defaultInvocations.forEach((inv: any) => {
                    // Only add if it doesn't exist
                    if (!invocationMap.has(inv.name)) {
                        const id = `inv-default-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                        const newInv = {
                            ...inv,
                            id,
                            createdAt: new Date().toISOString(),
                        };
                        newInvocations.push(newInv);
                        invocationMap.set(inv.name, id);
                    }
                });

                // Add default groups (Idempotent: Check by name)
                const newGroups: InvocationGroup[] = [];
                defaultGroups.forEach((grp: any) => {
                    // Check if group already exists
                    if (currentGroups.some(g => g.name === grp.name)) return;

                    const invocations = grp.invocationNames
                        .map((invName: any) => {
                            const invId = invocationMap.get(invName.name);
                            return invId ? {
                                invocationId: invId,
                                repetitions: invName.repetitions,
                            } : null;
                        })
                        .filter(Boolean);

                    if (invocations.length > 0) {
                        newGroups.push({
                            id: `grp-default-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                            name: grp.name,
                            description: grp.description,
                            invocations,
                            createdAt: new Date().toISOString(),
                        });
                    }
                });

                set((state) => ({
                    invocations: [...state.invocations, ...newInvocations],
                    groups: [...state.groups, ...newGroups],
                    _hasLoadedDefaults: true,
                }));
            },

            resetStore: () => {
                set({ invocations: [], groups: [], favoriteIds: [], _hasLoadedDefaults: true });
            },
        }),
        {
            name: "kourous-invocations",
            onRehydrateStorage: () => (state) => {
                // Ensure defaults aren't loaded automatically if we just reset
                // But allow if we want them back
                if (state && !state._hasLoadedDefaults) {
                    // We'll let the component call loadDefaultData or rehydrate
                }
            },
        }
    )
);
