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
import { useState } from "react";
import { EXPENSE_STATUS } from "@/data/app.data";

interface Props<T> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRow: T & { actionType: string };
  onDelete: () => void;
  onCancel: () => void;
  handleConfirm: (actionType: EXPENSE_STATUS, reason: string) => void;
  isUpdating: boolean;
}

export function ActionModal<T>({
  open,
  onOpenChange,
  currentRow,
  onCancel,
  handleConfirm,
  isUpdating,
}: Props<T>) {
  const [reason, setReason] = useState<string>("");
  
  const action: Record<string, string> = {
    [EXPENSE_STATUS.APPROVED]: "Approve",
    [EXPENSE_STATUS.REJECT]: "Reject",
    [EXPENSE_STATUS.REVIEWED]: "Review",
    [[EXPENSE_STATUS.APPROVED, EXPENSE_STATUS.REVIEWED].join(",")]: "Approve/Review"
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] space-y-2">
        <DialogHeader>
          <DialogTitle>Expense {action[currentRow.actionType]}</DialogTitle>
          <DialogDescription>{({
            [EXPENSE_STATUS.APPROVED]: "This action will approve the submitted expense and mark it as ready for processing.",
            [EXPENSE_STATUS.REJECT]: "The expense will not move forward until corrections or clarifications are provided.",
            [EXPENSE_STATUS.REVIEWED]: "You are reviewing the details of this expense before making a decision.",
            [[EXPENSE_STATUS.APPROVED, EXPENSE_STATUS.REVIEWED].join(",")]: "This action will approve/review the submitted expense and mark it as ready."
          })[currentRow.actionType]}</DialogDescription>
        </DialogHeader>
        <Textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Add Comment (Optional)"
          rows={3}
        />
        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onCancel} disabled={isUpdating}>
            Cancel
          </Button>
          <Button
            disabled={isUpdating}
            onClick={() => handleConfirm(currentRow.actionType as EXPENSE_STATUS, reason)}
            className={currentRow.actionType !== EXPENSE_STATUS.REJECT ?`bg-green-600 text-white hover:bg-green-700`: ``}
            variant={currentRow.actionType === EXPENSE_STATUS.REJECT ? "destructive" : "default"}
          >
            {action[currentRow.actionType]}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
