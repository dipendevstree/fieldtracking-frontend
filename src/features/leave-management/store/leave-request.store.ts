import { create } from "zustand";

type DialogType = "view" | "edit" | "cancel" | null;

interface LeaveRequestStoreState {
  open: DialogType;
  setOpen: (open: DialogType) => void;
  currentRow: any | null;
  setCurrentRow: (row: any | null) => void;
}

export const useLeaveRequestStore = create<LeaveRequestStoreState>((set) => ({
  open: null,
  setOpen: (open) => set({ open }),
  currentRow: null,
  setCurrentRow: (row) => set({ currentRow: row }),
}));
