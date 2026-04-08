import { useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import UserBulkImport from "./bulk-import";
import { useUsersStore } from "../store/users.store";

export function BulkImportModal() {
  const { open, setOpen } = useUsersStore();
  const isOpen = open === "import";

  useEffect(() => {
    if (isOpen) {
      document.body.setAttribute("data-scroll-locked", "1");
    } else {
      document.body.removeAttribute("data-scroll-locked");
    }

    return () => {
      document.body.removeAttribute("data-scroll-locked");
    };
  }, [isOpen]);

  return (
    <Dialog
      modal={true}
      open={isOpen}
      onOpenChange={(val) => !val && setOpen(null)}
    >
      <DialogContent
        className="max-w-3xl max-h-[90vh]"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <UserBulkImport />
      </DialogContent>
    </Dialog>
  );
}
