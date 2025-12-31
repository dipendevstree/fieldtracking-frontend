import { Button } from "@/components/ui/button";
import CustomTooltip from "@/components/shared/custom-tooltip";
import { Eye } from "lucide-react";
import { useLeaveRequestStore } from "@/features/leave-management/store/leave-request.store";
import { PermissionGate } from "@/permissions/components/PermissionGate";

export function PendingLeaveRowActions({ row }: { row: any }) {
  const { setOpen, setCurrentRow } = useLeaveRequestStore();

  const handleView = (r: any) => {
    setCurrentRow(r.original);
    setOpen("view");
  };

  return (
    <div className="flex items-center space-x-2">
      <PermissionGate requiredPermission="leave_request" action="viewOwn">
        <CustomTooltip title="View">
          <Button
            variant="ghost"
            className="h-8 w-8 p-0 text-green-600 hover:bg-green-50 hover:text-green-700"
            onClick={() => handleView(row)}
          >
            <Eye size={16} />
          </Button>
        </CustomTooltip>
      </PermissionGate>
    </div>
  );
}

export default PendingLeaveRowActions;
