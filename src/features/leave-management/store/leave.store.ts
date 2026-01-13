import { create } from "zustand";
import { LeaveType } from "../data/schema";

type DialogType = "add" | "edit" | "delete" | null;

interface LeaveStoreState {
  open: DialogType;
  setOpen: (open: DialogType) => void;
  currentRow: LeaveType | null;
  setCurrentRow: (row: LeaveType | null) => void;
}

export const useLeaveStore = create<LeaveStoreState>((set) => ({
  open: null,
  setOpen: (open) => set({ open }),
  currentRow: null,
  setCurrentRow: (row) => set({ currentRow: row }),
}));
