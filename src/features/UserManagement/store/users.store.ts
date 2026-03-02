import { create } from "zustand";

// Define the dialog types
type DialogType = "add" | "edit" | "delete" | "import" | null;

// Define the filters interface
interface UserFilters {
  search: string;
  territoryId: string;
  roleId: string;
}

// Define the generic store interface
interface StoreState<T> {
  open: DialogType;
  setOpen: (open: DialogType) => void;
  currentRow: T | null;
  setCurrentRow: (row: T | null) => void;
  filters: UserFilters;
  setFilters: (filters: Partial<UserFilters>) => void;
}

// Create the generic Zustand store
export const useUsersStore = create<StoreState<any>>((set) => ({
  open: null,
  setOpen: (open) => set({ open }),
  currentRow: null,
  setCurrentRow: (row) => set({ currentRow: row }),
  filters: {
    search: "",
    territoryId: "",
    roleId: "",
  },
  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),
}));
