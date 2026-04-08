import { create } from "zustand";

interface AttendanceApprovalStore {
  open: string | null;
  setOpen: (open: string | null) => void;
  currentRow: any;
  setCurrentRow: (row: any) => void;
  handleAction: (row: any, action: "APPROVED" | "REJECTED") => void;
  handleApprove: (row: any) => void;
  handleReject: (row: any) => void;
  closeModal: () => void;
}

export const useAttendanceApprovalStoreState = create<AttendanceApprovalStore>(
  (set) => ({
    open: null,
    setOpen: (open) => set({ open }),
    currentRow: null,
    setCurrentRow: (row) => set({ currentRow: row }),
    handleAction: (row, action) => {
      set({ currentRow: { ...row, actionType: action }, open: "action" });
    },
    handleApprove: (row) => {
      set({ currentRow: row, open: "confirm-approve" });
    },
    handleReject: (row) => {
      set({ currentRow: { ...row, actionType: "REJECTED" }, open: "action" });
    },
    closeModal: () => {
      set({ open: null, currentRow: null });
    },
  })
);
