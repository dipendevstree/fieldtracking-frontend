import { useEffect } from "react";
import { create } from "zustand";

// --- 1. Define Types ---
interface UnsavedChangesState {
  isDirty: boolean;
  actions: {
    setDirty: (status: boolean) => void;
    reset: () => void;
  };
}

// --- 2. Create Store ---
export const useUnsavedChangesStore = create<UnsavedChangesState>((set) => ({
  isDirty: false,
  actions: {
    setDirty: (status) => set({ isDirty: status }),
    reset: () => set({ isDirty: false }),
  },
}));

// Use this inside your Forms (Approvers, General, etc.)
export const useDirtyTracker = (isLocalDirty: boolean) => {
  const { setDirty } = useUnsavedChangesStore((state) => state.actions);

  useEffect(() => {
    // Sync local form state to global store
    setDirty(isLocalDirty);

    // Cleanup: When tab unmounts, automatically reset global dirty state
    return () => setDirty(false);
  }, [isLocalDirty, setDirty]);
};
