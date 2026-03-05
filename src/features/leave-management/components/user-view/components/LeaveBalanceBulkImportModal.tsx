import { useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import LeaveBalanceBulkImport from "./LeaveBalanceBulkImport";

interface LeaveBalanceBulkImportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LeaveBalanceBulkImportModal({
  open,
  onOpenChange,
}: LeaveBalanceBulkImportModalProps) {
  useEffect(() => {
    if (open) {
      document.body.setAttribute("data-scroll-locked", "1");
    } else {
      document.body.removeAttribute("data-scroll-locked");
    }

    return () => {
      document.body.removeAttribute("data-scroll-locked");
    };
  }, [open]);

  return (
    <Dialog
      modal={true}
      open={open}
      onOpenChange={(val) => !val && onOpenChange(false)}
    >
      <DialogContent
        className="max-w-3xl max-h-[90vh]"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <LeaveBalanceBulkImport />
      </DialogContent>
    </Dialog>
  );
}
