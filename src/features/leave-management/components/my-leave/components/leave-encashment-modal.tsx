import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useCreateLeaveEncashment,
  useUpdateLeaveEncashment,
} from "@/features/leave-management/services/leave-request.hook";
import { useLeaveRequestStore } from "@/features/leave-management/store/leave-request.store";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rulesData: any;
  myLeavesList: any;
}

export default function LeaveEncashmentModal({
  open,
  onOpenChange,
  rulesData,
  myLeavesList,
}: Props) {
  const { currentRow } = useLeaveRequestStore();
  const [leaveEncashmentDays, setLeaveEncashmentDays] = useState("");
  const { mutate: createLeaveEncashment, isPending } = useCreateLeaveEncashment(
    () => {
      onOpenChange(false);
      setLeaveEncashmentDays("");
    },
  );
  const { mutate: updateLeaveEncashment, isPending: isUpdating } =
    useUpdateLeaveEncashment(currentRow?.id || "", () => {
      onOpenChange(false);
      setLeaveEncashmentDays("");
    });

  const handleClose = () => {
    setLeaveEncashmentDays("");
    onOpenChange(false);
  };

  const totalBalance = open
    ? myLeavesList?.reduce((acc: number, item: any) => {
        return acc + parseFloat(item?.leaveBalance?.remaining || "0");
      }, 0)
    : 0;

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
      daysEncashed: leaveEncashmentDays.toString(),
    };
    if (currentRow?.id) {
      updateLeaveEncashment(payload);
    } else {
      createLeaveEncashment(payload);
    }
  };

  useEffect(() => {
    setLeaveEncashmentDays(currentRow?.daysEncashed || "");
  }, [currentRow]);

  const overDayError = parseFloat(leaveEncashmentDays) > totalBalance;
  const maxDayError =
    parseFloat(leaveEncashmentDays) >
    parseFloat(rulesData?.maximumEncashmentDays || "0");

  const hasError = overDayError || maxDayError;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="max-h-[80vh] !max-w-md overflow-y-auto"
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader className="mb-5">
          <DialogTitle>{`${currentRow?.id ? "Edit" : "Apply for"} Leave Encashment Request`}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>No of Days *</Label>
            <Input
              type="number"
              placeholder="Enter leave encashment days"
              value={leaveEncashmentDays}
              onChange={(e) => setLeaveEncashmentDays(e.target.value)}
            />
            {hasError && (
              <ul className="bg-red-50 border-red-100 rounded border p-2 text-sm text-red-500 mt-5 list-disc list-inside">
                You have to address this following errors
                {overDayError && (
                  <li className="text-red-500">
                    No of days cannot be more than total balance
                  </li>
                )}
                {maxDayError && (
                  <li className="text-red-500">
                    No of days cannot be more than maximum encashment days
                  </li>
                )}
              </ul>
            )}
          </div>
          <div className="space-y-2 mb-6">
            <p className="text-sm text-slate-800 font-medium">
              Available: {totalBalance} | Maximum Encashment Days:{" "}
              {rulesData?.maximumEncashmentDays}
            </p>
          </div>
          <div className="flex items-center justify-end gap-2">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={
                isPending ||
                !leaveEncashmentDays ||
                parseFloat(leaveEncashmentDays) >
                  parseFloat(rulesData?.maximumEncashmentDays || "0") ||
                parseFloat(leaveEncashmentDays) > totalBalance
              }
            >
              {currentRow?.id
                ? isUpdating
                  ? "Updating..."
                  : "Update"
                : isPending
                  ? "Submitting..."
                  : "Submit"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
