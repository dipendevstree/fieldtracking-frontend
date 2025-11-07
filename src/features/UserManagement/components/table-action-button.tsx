import { IconCalendarPlus, IconEdit, IconTrash } from "@tabler/icons-react";
import { PermissionGate } from "@/permissions/components/PermissionGate";
import { useUsersStore } from "../store/users.store";
import CustomTooltip from "@/components/shared/custom-tooltip";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export function DataTableRowActions({ row }: any) {
  const navigate = useNavigate();
  const { setOpen, setCurrentRow } = useUsersStore();

  const handleEdit = (row: any) => {
    setOpen("edit");
    setCurrentRow(row.original);
  };

  const handleDelete = (row: any) => {
    setOpen("delete");
    setCurrentRow(row.original);
  };

  const handleVisit = (row: any) => {
    navigate({
      to: `/calendar/schedule-visit`,
      search: { salesRepId: row.original.id },
    });
  };

  return (
    <div className="flex items-center space-x-2">
      <PermissionGate requiredPermission="calender_view" action="add">
        <CustomTooltip title="Add Visit">
          <Button
            onClick={() => handleVisit(row)}
            variant="outline"
            className="h-8 w-8 p-0"
          >
            <IconCalendarPlus size={16} />
          </Button>
        </CustomTooltip>
      </PermissionGate>
      <PermissionGate requiredPermission="all_users" action="edit">
        <CustomTooltip title="Edit">
          <Button
            variant="outline"
            className="h-8 w-8 p-0 text-green-600 hover:bg-green-50 hover:text-green-700"
            onClick={() => handleEdit(row)}
          >
            <IconEdit size={16} />
          </Button>
        </CustomTooltip>
      </PermissionGate>
      <PermissionGate requiredPermission="all_users" action="delete">
        <CustomTooltip title="Delete">
          <Button
            variant="outline"
            onClick={() => handleDelete(row)}
            className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <IconTrash size={16} />
          </Button>
        </CustomTooltip>
      </PermissionGate>
    </div>
  );
}
