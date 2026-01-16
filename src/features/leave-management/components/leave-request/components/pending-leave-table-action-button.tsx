import { Button } from "@/components/ui/button";
import CustomTooltip from "@/components/shared/custom-tooltip";
import { Eye } from "lucide-react";
import { useLeaveRequestStore } from "@/features/leave-management/store/leave-request.store";
import { PermissionGate } from "@/permissions/components/PermissionGate";
import { useViewType } from "@/context/view-type-context";
import { ViewType } from "@/components/layout/types";
import { IconEdit, IconX } from "@tabler/icons-react";
import { LEAVE_STATUS } from "@/data/app.data";
import { useLocation } from "@tanstack/react-router";
import { toast } from "sonner";
import { format } from "date-fns";
import { parseISO } from "date-fns";

export function PendingLeaveRowActions({ row }: { row: any }) {
  const { setOpen, setCurrentRow } = useLeaveRequestStore();
  // get uri segment from the tankstack router
  const { pathname } = useLocation();
  const { viewType } = useViewType();

  const handleView = (r: any) => {
    setCurrentRow(r.original);
    setOpen("view");
  };

  const showEditAndCancelButton =
    viewType === ViewType.Self &&
    row.original.status === LEAVE_STATUS.PENDING &&
    pathname.includes("my-leave");

  const handleEditClick = (leaveData: any) => {
    if (leaveData.status?.toLowerCase() === "approved") {
      toast.error("Cannot edit approved leave requests.");
      return;
    }
    setOpen("edit");
    setCurrentRow(leaveData);
  };

  const handleCancelClick = (leaveData: any) => {
    if (leaveData.status?.toLowerCase() === "approved") {
      toast.error("Cannot cancel approved leave requests.");
      return;
    }
    const typeName = leaveData.leaveType?.name;
    const dateStr = format(parseISO(leaveData.startDate), "MMM dd, yyyy");
    setOpen("cancel");
    setCurrentRow({
      ...leaveData,
      displayLabel: `${typeName} on ${dateStr}`,
      typeName,
      dateStr,
    });
  };

  return (
    <div className="flex items-center space-x-2">
      {showEditAndCancelButton ? (
        <div className="flex items-center space-x-2">
          <PermissionGate requiredPermission="leave_balance" action="edit">
            <CustomTooltip title="Edit">
              <Button
                variant="ghost"
                className="h-8 w-8 p-0 text-green-600 hover:bg-green-50"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditClick(row.original);
                }}
              >
                <IconEdit size={16} />
              </Button>
            </CustomTooltip>
          </PermissionGate>
          <PermissionGate requiredPermission="leave_balance" action="delete">
            <CustomTooltip title="Cancel">
              <Button
                variant="ghost"
                className="h-8 w-8 p-0 text-red-600 hover:bg-red-50"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCancelClick(row.original);
                }}
              >
                <IconX size={18} stroke={3} />
              </Button>
            </CustomTooltip>
          </PermissionGate>
        </div>
      ) : (
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
      )}
    </div>
  );
}

export default PendingLeaveRowActions;
