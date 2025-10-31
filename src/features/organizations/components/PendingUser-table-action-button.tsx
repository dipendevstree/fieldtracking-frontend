import { useState } from "react";
// import { useNavigate } from "@tanstack/react-router";
import { Row } from "@tanstack/react-table";
import { IconCheck, IconX } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import CustomTooltip from "@/components/shared/custom-tooltip";
import { useUpdateStatus } from "../services/organization.hook";
import { useUsersStore } from "../store/organizations.store";

interface DataTableRowActionsProps {
  row: Row<any>;
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const { setCurrentRow } = useUsersStore();
  // const navigate = useNavigate();
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    type: "verified" | "rejected" | null;
    title: string;
    description: string;
  }>({
    isOpen: false,
    type: null,
    title: "",
    description: "",
  });

  const [reason, setReason] = useState("");

  const { mutate: updateStatus } = useUpdateStatus();

  const handleUpdateStatus = (values: any) => {
    const payload = {
      userId: values.userId,
      status: values.status,
      reason: values.reason || undefined,
    };
    updateStatus(payload);
  };

  const handleApprove = () => {
    setConfirmDialog({
      isOpen: true,
      type: "verified",
      title: "Verify Item",
      description:
        "Are you sure you want to verify this request? This action cannot be undone.",
    });
    setReason("");
  };

  const handleReject = () => {
    setConfirmDialog({
      isOpen: true,
      type: "rejected",
      title: "Reject Item",
      description:
        "Please provide a reason for rejecting this request. This action cannot be undone.",
    });
    setReason("");
  };

  const handleConfirm = () => {
    setCurrentRow(row.original);

    if (confirmDialog.type === "verified") {
      handleUpdateStatus({ userId: row.original.id, status: "verified" });
    } else if (confirmDialog.type === "rejected") {
      handleUpdateStatus({
        userId: row.original.id,
        status: "rejected",
        reason,
      });
    }

    setConfirmDialog({ isOpen: false, type: null, title: "", description: "" });
  };

  const handleCancel = () => {
    setConfirmDialog({ isOpen: false, type: null, title: "", description: "" });
    setReason("");
  };

  // const gotoLivetrackingPage = () => {
  //   const userId = row.original.id // update if userId key is different
  //   navigate({ to: `/livetracking?userId=${userId}` })
  // }

  return (
    <>
      <div className="flex items-center gap-2">
        <CustomTooltip title="Verify">
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0 text-green-600 hover:bg-green-50 hover:text-green-700"
            onClick={handleApprove}
          >
            <IconCheck size={16} />
          </Button>
        </CustomTooltip>

        <CustomTooltip title="Reject">
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700"
            onClick={handleReject}
          >
            <IconX size={16} />
          </Button>
        </CustomTooltip>

        {/* <CustomTooltip title='Live Tracking'>
          <Button
            variant='outline'
            size='sm'
            className='h-8 w-8 p-0 text-blue-600 hover:bg-blue-50 hover:text-blue-700'
            onClick={gotoLivetrackingPage}
          >
            <IconMapPin size={16} />
          </Button>
        </CustomTooltip> */}
      </div>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.isOpen}
        onOpenChange={(open) => !open && handleCancel()}
      >
        <DialogContent className="sm:max-w-[425px] space-y-2">
          <DialogHeader>
            <DialogTitle>{confirmDialog.title}</DialogTitle>
            <DialogDescription>{confirmDialog.description}</DialogDescription>
          </DialogHeader>
          {confirmDialog.type === "rejected" && (
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason..."
              rows={3}
            />
          )}

          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              variant={
                confirmDialog.type === "verified" ? "default" : "destructive"
              }
              disabled={
                confirmDialog.type === "rejected" && reason.trim().length === 0
              }
            >
              {confirmDialog.type === "verified" ? "Verify" : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
