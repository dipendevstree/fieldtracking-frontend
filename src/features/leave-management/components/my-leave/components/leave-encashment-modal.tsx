import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateLeaveEncashment } from "@/features/leave-management/services/leave-request.hook";
import { useLeaveRequestStore } from "@/features/leave-management/store/leave-request.store";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rulesData: any;
}

export default function LeaveEncashmentModal({
  open,
  onOpenChange,
  rulesData: _rulesData,
}: Props) {
  const { currentRow } = useLeaveRequestStore();
  const [leaveEncashmentDays, setLeaveEncashmentDays] = useState("");
  const { mutate: createLeaveEncashment, isPending } = useCreateLeaveEncashment(
    () => {
      onOpenChange(false);
    },
  );
  const handleClose = () => {
    setLeaveEncashmentDays("");
    onOpenChange(false);
  };
  const totalBalance = parseFloat(currentRow?.leaveBalance.remaining || "0");
  const handleSubmit = () => {
    if (!leaveEncashmentDays) {
      toast.error("Invalid Action", {
        description: "Please enter leave encashment days",
        position: "top-right",
        duration: 5000,
      });
      return;
    }
    if (parseFloat(leaveEncashmentDays) > totalBalance) {
      toast.error("Invalid Action", {
        description: "Leave encashment days cannot be more than total balance",
        position: "top-right",
        duration: 5000,
      });
      return;
    }
    const payload = {
      leaveTypeId: currentRow?.id,
      daysEncashed: leaveEncashmentDays.toString(),
    };
    createLeaveEncashment(payload);
    onOpenChange(false);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[80vh] !max-w-md overflow-y-auto"
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader className="mb-2">
          <DialogTitle>
            Leave Encashment Request for {currentRow?.name}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-base font-medium">
              Available Balance: {totalBalance}
            </p>
          </div>
          <div className="space-y-2">
            <Label>Leave Encashment Days *</Label>
            <Input
              type="number"
              placeholder="Enter leave encashment days"
              value={leaveEncashmentDays}
              onChange={(e) => setLeaveEncashmentDays(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-end gap-2">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isPending}>
              {isPending ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
