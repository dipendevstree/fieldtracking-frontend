import { create } from "zustand";
import { Shift } from "../data/schema";

type DialogType = "add" | "edit" | "delete" | null;

interface ShiftStoreState {
  open: DialogType;
  setOpen: (open: DialogType) => void;
  currentRow: Shift | null;
  setCurrentRow: (row: Shift | null) => void;
}

export const useShiftStore = create<ShiftStoreState>((set) => ({
  open: null,
  setOpen: (open) => set({ open }),
  currentRow: null,
  setCurrentRow: (row) => set({ currentRow: row }),
}));
