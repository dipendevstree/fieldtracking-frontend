import { create } from 'zustand';
import { User } from '../types';

// Define the dialog types
export type DialogType = 'add' | 'edit' | 'delete' | null;



// Define the generic store interface
interface StoreState<T> {
    open: DialogType;
    setOpen: (open: DialogType) => void;
    currentRow: T | null;
    setCurrentRow: (row: T | null) => void;
}

// Create the generic Zustand store
export const useUsersStore = create<StoreState<User>>((set) => ({
    open: null,
    setOpen: (open) => set({ open }),
    currentRow: null,
    setCurrentRow: (row) => set({ currentRow: row }),
}));