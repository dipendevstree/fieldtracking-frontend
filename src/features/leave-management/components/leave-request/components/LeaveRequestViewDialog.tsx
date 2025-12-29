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
import { formatDropDownLabel } from "@/utils/commonFunction";
import moment from "moment";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useCreateLeaveApproval } from "@/features/leave-management/services/leave-request.hook";
import { LEAVE_STATUS } from "@/data/app.data";

interface Props {
  open: boolean;
  onClose: () => void;
  currentRow: any;
}

export default function LeaveRequestViewDialog({
  open,
  onClose,
  currentRow,
}: Props) {
  const [reason, setReason] = useState("");

  const { mutate: createLeaveApproval, isPending } = useCreateLeaveApproval(
    () => {
      closeDialog();
    }
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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>View Leave Request</DialogTitle>
          <DialogDescription>
            View & Approve/Reject Leave Request
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 mt-2">
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
                currentRow.user?.firstName + " " + currentRow.user?.lastName
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
                " - " +
                moment(currentRow.endDate).format("DD/MM/YYYY") +
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
          <Button
            className="bg-green-500 text-white hover:bg-green-600"
            disabled={isPending}
            onClick={handleApprove}
          >
            Approve
          </Button>
          <Button
            className="bg-red-500 text-white hover:bg-red-600"
            disabled={isPending}
            onClick={handleReject}
          >
            Reject
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
