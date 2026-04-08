import { create } from "zustand";
import { Category } from "../type/type";

// Define the dialog types
type DialogType = "add" | "edit" | "delete" | null;

// Define the store interface
interface ExpensesCategoryStoreState {
  open: DialogType;
  setOpen: (open: DialogType) => void;
  currentRow: Category | null;
  setCurrentRow: (row: Category | null) => void;
}

// Create the Zustand store
export const useCategoryStore = create<ExpensesCategoryStoreState>((set) => ({
  open: null,
  setOpen: (open) => set({ open }),
  currentRow: null,
  setCurrentRow: (row) => set({ currentRow: row }),
}));
