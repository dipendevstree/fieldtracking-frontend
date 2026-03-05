import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/shared/common-status-badge";
import { formatDropDownLabel, isImage } from "@/utils/commonFunction";
import moment from "moment";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useCreateLeaveApproval } from "@/features/leave-management/services/leave-request.hook";
import { LEAVE_STATUS } from "@/data/app.data";
import {
  IconFileWord,
  IconFileTypePdf,
  IconFileTypeXls,
  IconFileSpreadsheet,
  IconArchive,
  IconJson,
  IconFile,
} from "@tabler/icons-react";
import { FileDown } from "lucide-react";
import { PermissionGate } from "@/permissions/components/PermissionGate";
import { useDirtyTracker } from "@/features/settings/store/use-unsaved-changes-store";
import { useUnsavedChanges } from "@/hooks/use-unsaved-changes";
import { ConfirmDialog } from "@/components/confirm-dialog";

interface Props {
  open: boolean;
  onClose: () => void;
  currentRow: any;
}

const getFileIcon = (file: string) => {
  const ext = file.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "pdf":
      return <IconFileTypePdf className="h-12 w-12 text-red-600" />;
    case "doc":
    case "docx":
      return <IconFileWord className="h-12 w-12 text-blue-600" />;
    case "xls":
    case "xlsx":
      return <IconFileTypeXls className="h-12 w-12 text-green-600" />;
    case "csv":
      return <IconFileSpreadsheet className="h-12 w-12 text-emerald-600" />;
    case "zip":
    case "rar":
      return <IconArchive className="h-12 w-12 text-yellow-600" />;
    case "js":
    case "ts":
    case "json":
      return <IconJson className="h-12 w-12 text-purple-600" />;
    default:
      return <IconFile className="h-12 w-12 text-gray-600" />;
  }
};

export default function LeaveRequestViewDialog({
  open,
  onClose,
  currentRow,
}: Props) {
  const [reason, setReason] = useState("");
  const [reasonError, setReasonError] = useState("");
  const [showLocalWarning, setShowLocalWarning] = useState(false);
  const { mutate: createLeaveApproval, isPending } = useCreateLeaveApproval(
    () => {
      closeDialog();
    },
  );

  const handleApprove = () => {
    createLeaveApproval({
      leaveId: currentRow.id,
      comment: reason,
      status: LEAVE_STATUS.APPROVED,
      actionDate: new Date(),
    });
  };

  const handleReject = () => {
    if (!reason) {
      setReasonError("Please enter a reason.");
      return;
    }
    createLeaveApproval({
      leaveId: currentRow.id,
      comment: reason,
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
          <DialogTitle>View Leave Request</DialogTitle>
          <DialogDescription>
            View & Approve/Reject Leave Request
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 mt-2 w-full min-w-0">
          <div className="flex flex-col gap-2">
            <Label>Leave Type</Label>
            <Input
              className="text-gray-700 border p-2 rounded"
              value={currentRow.leaveType?.name}
              readOnly
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>User Name</Label>
            <Input
              className="text-gray-700 border p-2 rounded"
              value={
                currentRow.user ? currentRow.user?.firstName + " " + currentRow.user?.lastName : "Unknown User"
              }
              readOnly
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Date</Label>
            <Input
              className="text-gray-700 border p-2 rounded"
              value={
                moment(currentRow.startDate).format("DD/MM/YYYY") +
                (!currentRow.halfDay
                  ? " - " + moment(currentRow.endDate).format("DD/MM/YYYY")
                  : "") +
                (currentRow.halfDay
                  ? " (" + formatDropDownLabel(currentRow.halfDayType) + ")"
                  : "") +
                " " +
                (currentRow.halfDay
                  ? "0.5 Day"
                  : `(${(() => {
                      const startDate = moment(currentRow.startDate);
                      const endDate = moment(currentRow.endDate);
                      const duration = endDate.diff(startDate, "days") + 1;
                      return `${duration} ${duration > 1 ? "Days" : "Day"}`;
                    })()})`)
              }
              readOnly
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Reason</Label>
            <Input
              className="text-gray-700 border p-2 rounded"
              value={currentRow.reason}
              readOnly
            />
          </div>
          <div className="flex gap-2 mb-2">
            <Label>Status</Label>
            <StatusBadge status={currentRow.status} />
          </div>
          {currentRow.attachments?.length > 0 && (
            <div className="flex flex-col gap-2">
              <Label>Attachments</Label>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {currentRow.attachments?.map((file: string, idx: number) => {
                  if (isImage(file)) {
                    return (
                      <Dialog key={idx}>
                        <DialogTrigger asChild>
                          <img
                            src={file}
                            alt={`Leave Request Attachment ${idx + 1}`}
                            className="h-30 min-w-30 flex-shrink-0 cursor-pointer rounded border object-cover"
                          />
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl p-0">
                          <img
                            src={file}
                            alt={`Leave Request Attachment Full ${idx + 1}`}
                            className="h-auto min-w-30 w-full rounded"
                          />
                        </DialogContent>
                      </Dialog>
                    );
                  } else {
                    return (
                      <div
                        key={idx}
                        className="flex flex-col items-center justify-between h-30 min-w-30 flex-shrink-0 rounded border bg-gray-50 p-2"
                      >
                        <div className="flex-1 flex items-center justify-center">
                          {getFileIcon(file)}
                        </div>
                        <Button
                          asChild
                          size="sm"
                          variant="outline"
                          className="w-full mt-2"
                        >
                          <a
                            href={file}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <FileDown className="h-4 w-4 mr-1" />
                          </a>
                        </Button>
                      </div>
                    );
                  }
                })}
              </div>
            </div>
          )}
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
