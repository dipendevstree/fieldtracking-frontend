import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/shared/common-status-badge";
import moment from "moment";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useCreateLeaveEncashmentApproval } from "@/features/leave-management/services/leave-request.hook";
import { LEAVE_STATUS } from "@/data/app.data";
import { toast } from "sonner";
import { PermissionGate } from "@/permissions/components/PermissionGate";
import { useDirtyTracker } from "@/features/settings/store/use-unsaved-changes-store";
import { useUnsavedChanges } from "@/hooks/use-unsaved-changes";
import { ConfirmDialog } from "@/components/confirm-dialog";

interface Props {
  open: boolean;
  onClose: () => void;
  currentRow: any;
}

export default function LeaveEncashmentRequestViewDialog({
  open,
  onClose,
  currentRow,
}: Props) {
  const [reason, setReason] = useState("");
  const [showLocalWarning, setShowLocalWarning] = useState(false);
  const { mutate: createLeaveEncashmentApproval, isPending } =
    useCreateLeaveEncashmentApproval(() => {
      closeDialog();
    });

  const handleApprove = () => {
    createLeaveEncashmentApproval({
      leaveEncashmentId: currentRow.id,
      comment: reason || "",
      status: LEAVE_STATUS.APPROVED,
      actionDate: new Date(),
    });
  };

  const handleReject = () => {
    if (!reason) {
      toast.error("Please enter a reason.", {
        position: "top-right",
      });
      return;
    }
    createLeaveEncashmentApproval({
      leaveEncashmentId: currentRow.id,
      comment: reason || "",
      status: LEAVE_STATUS.REJECTED,
      actionDate: new Date(),
    });
  };

  const closeDialog = () => {
    onClose();
    setReason("");
  };

  const handleDialogChange = (state: boolean) => {
    if (state) {
      return;
    }
    if (reason !== "") {
      setShowLocalWarning(true);
    } else {
      actualClose();
    }
  };

  const actualClose = () => {
    setReason("");
    onClose();
  };

  useDirtyTracker(reason !== "");

  const { showExitPrompt, confirmExit, cancelExit } = useUnsavedChanges(
    reason !== "",
  );

  const isWarningOpen = showLocalWarning || showExitPrompt;

  const handleCancelDiscard = (isOpen: boolean) => {
    if (!isOpen) {
      setShowLocalWarning(false);
      if (showExitPrompt) cancelExit();
    }
  };

  const handleConfirmDiscard = () => {
    setReason("");
    setShowLocalWarning(false);
    actualClose();

    if (showExitPrompt) {
      setTimeout(() => {
        confirmExit();
      }, 0);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <ConfirmDialog
        open={isWarningOpen}
        onOpenChange={handleCancelDiscard}
        title="Unsaved Changes"
        desc="You have unsaved changes. Are you sure you want to discard them? Your changes will be lost."
        confirmText="Discard Changes"
        cancelBtnText="Keep Editing"
        destructive={true}
        handleConfirm={handleConfirmDiscard}
      />

      <DialogContent
        className="max-h-[80vh] !max-w-xl overflow-y-auto overflow-x-hidden"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>View Leave Encashment Request</DialogTitle>
          <DialogDescription>
            View & Approve/Reject Leave Encashment Request
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 mt-2 w-full min-w-0">
          <div className="flex flex-col gap-2">
            <Label>Leave Type</Label>
            <Input
              className="text-gray-700 border p-2 rounded"
              value={currentRow?.leaveType?.name}
              readOnly
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>User Name</Label>
            <Input
              className="text-gray-700 border p-2 rounded"
              value={
                currentRow?.user?.firstName + " " + currentRow?.user?.lastName
              }
              readOnly
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Date</Label>
            <Input
              className="text-gray-700 border p-2 rounded"
              value={moment(currentRow?.createdDate).format("DD/MM/YYYY")}
              readOnly
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>No. of Days</Label>
            <Input
              className="text-gray-700 border p-2 rounded"
              value={currentRow?.daysEncashed || 0}
              readOnly
            />
          </div>
          <div className="flex gap-2 mb-2">
            <Label>Status</Label>
            <StatusBadge status={currentRow?.status} />
          </div>
          <hr />
          <div className="flex flex-col gap-2">
            <Label className="text-sm">Approve/Reject Reason</Label>
            <Textarea
              className="w-full resize-none border border-gray-300 p-2"
              name="reason"
              placeholder="Enter reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            ></Textarea>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isPending}>
              Cancel
            </Button>
          </DialogClose>
          <PermissionGate requiredPermission="leave_request" action="add">
            <Button
              className="bg-green-500 text-white hover:bg-green-600"
              disabled={isPending}
              onClick={handleApprove}
            >
              Approve
            </Button>
          </PermissionGate>
          <PermissionGate requiredPermission="leave_request" action="add">
            <Button
              className="bg-red-500 text-white hover:bg-red-600"
              disabled={isPending}
              onClick={handleReject}
            >
              Reject
            </Button>
          </PermissionGate>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
