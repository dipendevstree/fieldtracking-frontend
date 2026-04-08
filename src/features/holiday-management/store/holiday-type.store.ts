import { create } from "zustand";
import { HolidayType, Holiday } from "../data/schema";

type DialogType = "add" | "edit" | "delete" | null;

interface HolidayTypeStoreState {
  open: DialogType;
  setOpen: (open: DialogType) => void;
  currentRow: HolidayType | null;
  setCurrentRow: (row: HolidayType | null) => void;
}

export const useHolidayTypeStore = create<HolidayTypeStoreState>((set) => ({
  open: null,
  setOpen: (open) => set({ open }),
  currentRow: null,
  setCurrentRow: (row) => set({ currentRow: row }),
}));

// holiday store
interface HolidayStoreState {
  open: DialogType;
  setOpen: (open: DialogType) => void;
  currentRow: Holiday | null;
  setCurrentRow: (row: Holiday | null) => void;
}

export const useHolidayStore = create<HolidayStoreState>((set) => ({
  open: null,
  setOpen: (open) => set({ open }),
  currentRow: null,
  setCurrentRow: (row) => set({ currentRow: row }),
}));
