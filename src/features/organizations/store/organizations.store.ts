import { create } from "zustand";

// Define all dialog types
export type DialogType =
  | "add"
  | "edit"
  | "delete"
  | "activatePlan"
  | "renewPlan"
  | "suspendOrganization"
  | "extendGracePeriod"
  | "planHistory"
  | null;

// Generic store interface
interface StoreState<T> {
  open: DialogType;
  setOpen: (open: DialogType) => void;
  currentRow: T | null;
  setCurrentRow: (row: T | null) => void;
}

// Zustand store
export const useOrganizationStore = create<StoreState<any>>((set) => ({
  open: null,
  setOpen: (open) => set({ open }),
  currentRow: null,
  setCurrentRow: (row) => set({ currentRow: row }),
}));
