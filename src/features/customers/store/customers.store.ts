import { create } from "zustand";
import { Customer } from "../types";

type DialogType = "add" | "edit" | "delete" | null;

interface StoreState {
  open: DialogType;
  setOpen: (open: DialogType) => void;
  currentRow: Customer | null;
  setCurrentRow: (row: Customer | null) => void;
  filters: {
    search: string;
    customerTypeId: string;
    industryId: string;
  };
  setFilters: (filters: Partial<StoreState["filters"]>) => void;
}

export const useCustomersStore = create<StoreState>((set) => ({
  open: null,
  setOpen: (open) => set({ open }),
  currentRow: null,
  setCurrentRow: (row) => set({ currentRow: row }),
  filters: {
    search: "",
    customerTypeId: "",
    industryId: "",
  },
  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),
}));
