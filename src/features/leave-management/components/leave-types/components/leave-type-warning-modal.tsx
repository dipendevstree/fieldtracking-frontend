import { ConfirmDialog } from "@/components/confirm-dialog";

interface LeaveTypeWarningModalProps {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onConfirm: () => void;
}

export function LeaveTypeWarningModal({
  open,
  onOpenChange,
  onConfirm,
}: LeaveTypeWarningModalProps) {
  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="⚠️ Leave Balance Policy Impact"
      desc={`Please review the following carefully before saving changes:`}
      confirmText="Submit"
      cancelBtnText="Cancel"
      destructive={false}
      handleConfirm={onConfirm}
    >
      <div className="space-y-4 text-sm text-gray-700">
        <p>
          If you assign a{" "}
          <span className="font-semibold text-gray-900">
            positive leave balance
          </span>{" "}
          to this Leave Type:
        </p>

        <div className="rounded-lg bg-gray-50 p-3">
          <p className="font-semibold text-gray-900">
            Under General Policy:
          </p>
          <p>
            The specified balance will be automatically credited to{" "}
            <span className="font-medium">
              all existing user in this organization
            </span>{" "}
            who currently do not have a balance for this leave type.
          </p>
        </div>

        <div className="rounded-lg bg-gray-50 p-3">
          <p className="font-semibold text-gray-900">
            Under Tier-Based Policy:
          </p>
          <p>
            The specified balance will be automatically credited to{" "}
            <span className="font-medium">
              user whose tier matches this policy
            </span>
            , but only if they currently do not have a balance for this leave type.
          </p>
        </div>

        <p>
          If the balance is set to{" "}
          <span className="font-semibold text-gray-900">0</span>, no changes
          will be applied to user leave balances.
        </p>

        <p className="font-medium text-red-600">
          These changes may affect multiple user. Please confirm that you want to proceed.
        </p>
      </div>
    </ConfirmDialog>
  );
}

export default LeaveTypeWarningModal;
