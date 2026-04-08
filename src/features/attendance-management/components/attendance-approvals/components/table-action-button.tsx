import { CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import CustomTooltip from "@/components/shared/custom-tooltip";
import { useAttendanceApprovalStoreState } from "../../../store/attendance-approval.store";
import { PermissionGate } from "@/permissions/components/PermissionGate";

type RowProps = {
  row: {
    original: {
      correctionId: string;
      status: string;
      [key: string]: any;
    };
  };
};

export function DataTableRowActions({ row }: RowProps) {
  const { handleApprove, handleReject } = useAttendanceApprovalStoreState();
  const isPending = row?.original?.status === "PENDING";

  if (!isPending) {
    return null; // Actions only available for pending corrections
  }

  return (
    <div className="flex items-center gap-2">
      <PermissionGate requiredPermission="attendance_approvals" action="edit">
        <CustomTooltip title="Approve">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleApprove(row.original)}
            className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
          >
            <CheckCircle size={16} />
          </Button>
        </CustomTooltip>
      </PermissionGate>

      <PermissionGate requiredPermission="attendance_approvals" action="edit">
        <CustomTooltip title="Reject">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleReject(row.original)}
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <XCircle size={16} />
          </Button>
        </CustomTooltip>
      </PermissionGate>
    </div>
  );
}
