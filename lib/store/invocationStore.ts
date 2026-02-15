import { create } from "zustand";
import { persist } from "zustand/middleware";

// Une invocation simple
export interface Invocation {
    id: string;
    name: string;
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
    _hasLoadedDefaults?: boolean; // Internal flag to track if defaults were loaded

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

    // Utility
    loadDefaultData: () => void;
}

export const useInvocationStore = create<InvocationStoreState>()(
    persist(
        (set, get) => ({
            invocations: [],
            groups: [],
            _hasLoadedDefaults: false,

            // Invocations
            addInvocation: (invocation) => {
                const newInvocation: Invocation = {
                    ...invocation,
                    id: `inv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    createdAt: new Date().toISOString(),
                };
                set((state) => ({
                    invocations: [...state.invocations, newInvocation],
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
                }));
            },

            getGroupById: (id) => {
                return get().groups.find((grp) => grp.id === id);
            },

            // Load default data
            loadDefaultData: () => {
                const { defaultInvocations, defaultGroups } = require("@/lib/data/defaultInvocations");

                // Add default invocations
                const invocationMap = new Map<string, string>();
                const newInvocations: Invocation[] = [];

                defaultInvocations.forEach((inv: any) => {
                    const id = `inv-default-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                    newInvocations.push({
                        ...inv,
                        id,
                        createdAt: new Date().toISOString(),
                    });
                    invocationMap.set(inv.name, id);
                });

                // Add default groups
                const newGroups: InvocationGroup[] = [];
                defaultGroups.forEach((grp: any) => {
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
        }),
        {
            name: "kourous-invocations",
            onRehydrateStorage: () => (state) => {
                // Load defaults automatically if never loaded before
                if (state && !state._hasLoadedDefaults) {
                    const { defaultInvocations, defaultGroups } = require("@/lib/data/defaultInvocations");

                    // Add default invocations
                    const invocationMap = new Map<string, string>();
                    defaultInvocations.forEach((inv: any) => {
                        const id = `inv-default-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                        state.invocations.push({
                            ...inv,
                            id,
                            createdAt: new Date().toISOString(),
                        });
                        invocationMap.set(inv.name, id);
                    });

                    // Add default groups
                    defaultGroups.forEach((grp: any) => {
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
                            state.groups.push({
                                id: `grp-default-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                                name: grp.name,
                                description: grp.description,
                                invocations,
                                createdAt: new Date().toISOString(),
                            });
                        }
                    });

                    state._hasLoadedDefaults = true;
                }
            },
        }
    )
);
