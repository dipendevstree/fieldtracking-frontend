import { create } from "zustand";
import { TermsAndConditions } from "../types";

type ModalState = "add" | "edit" | "delete" | null;

interface TermsState {
  open: ModalState;
  setOpen: (modalState: ModalState) => void;
  currentRow: TermsAndConditions | null;
  setCurrentRow: (row: TermsAndConditions | null) => void;
}

export const useTermsStore = create<TermsState>((set) => ({
  open: null,
  setOpen: (modalState) => set({ open: modalState }),
  currentRow: null,
  setCurrentRow: (row) => set({ currentRow: row }),
}));
