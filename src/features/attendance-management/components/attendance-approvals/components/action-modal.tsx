import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCancel: () => void;
  handleConfirm: (reason: string) => void;
  isUpdating: boolean;
}

export function ActionModal({
  open,
  onOpenChange,
  onCancel,
  handleConfirm,
  isUpdating,
}: Props) {
  const [reason, setReason] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    // Reset reason and error when modal opens
    if (open) {
      setReason("");
      setError("");
    }
  }, [open]);

  const validateAndSubmit = () => {
    if (!reason.trim()) {
      setError("Reason is required when rejecting");
      return;
    }

    setError("");
    handleConfirm(reason);
  };

  const handleReasonChange = (value: string) => {
    setReason(value);
    if (error && value.trim()) {
      setError("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] space-y-2">
        <DialogHeader>
          <DialogTitle>Reject Attendance Correction</DialogTitle>
          <DialogDescription>
            This action will reject the attendance correction request. A reason
            is required.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Textarea
            value={reason}
            onChange={(e) => handleReasonChange(e.target.value)}
            placeholder="Add Reason (Required)"
            rows={3}
            className={error ? "border-red-500" : ""}
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onCancel} disabled={isUpdating}>
            Cancel
          </Button>
          <Button
            disabled={isUpdating}
            onClick={validateAndSubmit}
            variant="destructive"
          >
            Reject
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
