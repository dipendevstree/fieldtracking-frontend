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
import { PermissionGate } from "@/permissions/components/PermissionGate";
import { useDirtyTracker } from "@/features/settings/store/use-unsaved-changes-store";
import { useUnsavedChanges } from "@/hooks/use-unsaved-changes";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { useGetMyLeaves } from "@/features/leave-management/services/leave-action.hook";
import { Info } from "lucide-react";
import CustomTooltip from "@/components/shared/custom-tooltip";

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
  const [reasonError, setReasonError] = useState("");
  const [showLocalWarning, setShowLocalWarning] = useState(false);
  const { mutate: createLeaveEncashmentApproval, isPending } =
    useCreateLeaveEncashmentApproval(() => {
      closeDialog();
    });
  const { data: myLeavesList } = useGetMyLeaves(
    {
      userId: currentRow?.userId,
    },
    {
      enabled: open && !!currentRow.id,
    },
  );

  const totalBalance = open
    ? myLeavesList?.reduce((acc: number, item: any) => {
        return acc + parseFloat(item?.leaveBalance?.remaining || "0");
      }, 0)
    : 0;

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
      setReasonError("Please enter a reason.");
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
          <div className="flex gap-2 font-semibold">
            <Label>Available Balance:</Label>
            <span
              className={`text-${totalBalance < currentRow?.daysEncashed ? "red-500" : "green-500"}`}
            >
              {totalBalance || 0} Days
            </span>
            {totalBalance < currentRow?.daysEncashed && (
              <span
                className={`text-${totalBalance < currentRow?.daysEncashed ? "red-500" : "green-500"}`}
              >
                <CustomTooltip title="Available balance is less than the number of days encashed">
                  <Info size={15} className="mt-1" />
                </CustomTooltip>
              </span>
            )}
          </div>
          <hr />
          <div className="flex flex-col gap-2">
            <Label className="text-sm">Approve/Reject Reason</Label>
            <Textarea
              className={`w-full resize-none border p-2 ${
                reasonError ? "border-red-500" : "border-gray-300"
              }`}
              name="reason"
              placeholder="Enter reason"
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (reasonError) setReasonError("");
              }}
            ></Textarea>
            {reasonError && (
              <p className="text-xs text-red-500">{reasonError}</p>
            )}
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
              disabled={isPending || totalBalance < currentRow?.daysEncashed}
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
