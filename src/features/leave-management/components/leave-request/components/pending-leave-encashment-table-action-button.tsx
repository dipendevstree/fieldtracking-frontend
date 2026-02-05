import { Button } from "@/components/ui/button";
import CustomTooltip from "@/components/shared/custom-tooltip";
import { Eye } from "lucide-react";
import { useLeaveRequestStore } from "@/features/leave-management/store/leave-request.store";
import { PermissionGate } from "@/permissions/components/PermissionGate";
import { useLocation } from "@tanstack/react-router";
import { LEAVE_ENCASHMENT_STATUS } from "@/data/app.data";
import { toast } from "sonner";
import { IconEdit, IconX } from "@tabler/icons-react";
import { format, parseISO } from "date-fns";

export function PendingLeaveEncashmentRowActions({ row }: { row: any }) {
  const { setOpen, setCurrentRow } = useLeaveRequestStore();
  // get uri segment from the tankstack router
  const { pathname } = useLocation();

  const handleView = (r: any) => {
    setCurrentRow(r.original);
    setOpen("view-leave-encashment");
  };

  const showActionButton = !pathname.includes("my-leave");
  const showEditAndCancelButton =
    row?.original?.status === LEAVE_ENCASHMENT_STATUS.PENDING &&
    pathname.includes("my-leave");

  const handleEditClick = (leaveEncashmentData: any) => {
    if (
      leaveEncashmentData.status?.toLowerCase() ===
      LEAVE_ENCASHMENT_STATUS.APPROVED
    ) {
      toast.error("Cannot edit approved leave requests.");
      return;
    }
    setOpen("edit-leave-encashment");
    setCurrentRow(leaveEncashmentData);
    console.log("leaveEncashmentData", leaveEncashmentData);
  };

  const handleCancelClick = (leaveEncashmentData: any) => {
    if (
      leaveEncashmentData.status?.toLowerCase() ===
      LEAVE_ENCASHMENT_STATUS.APPROVED
    ) {
      toast.error("Cannot cancel approved leave requests.");
      return;
    }
    const dateStr = format(
      parseISO(leaveEncashmentData.createdDate),
      "MMM dd, yyyy",
    );
    setOpen("cancel-leave-encashment");
    setCurrentRow({
      ...leaveEncashmentData,
      displayLabel: `${dateStr}`,
      dateStr,
    });
  };

  return (
    <div className="flex items-center space-x-2">
      {showEditAndCancelButton ? (
        <>
          <PermissionGate requiredPermission="my_leave" action="edit">
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
          <PermissionGate requiredPermission="my_leave" action="edit">
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
        </>
      ) : (
        showActionButton && (
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
        )
      )}
    </div>
  );
}

export default PendingLeaveEncashmentRowActions;
