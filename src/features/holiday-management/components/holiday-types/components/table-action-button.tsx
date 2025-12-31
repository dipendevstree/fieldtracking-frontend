import { Button } from "@/components/ui/button";
import CustomTooltip from "@/components/shared/custom-tooltip";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { useHolidayTypeStore } from "@/features/holiday-management/store/holiday-type.store";
import { PermissionGate } from "@/permissions/components/PermissionGate";

export function HolidayTypeRowActions({ row }: { row: any }) {
  const { setOpen, setCurrentRow } = useHolidayTypeStore();

  const handleEdit = (r: any) => {
    setCurrentRow(r.original);
    setOpen("edit");
  };

  const handleDelete = (r: any) => {
    setCurrentRow(r.original);
    setOpen("delete");
  };

  return (
    <div className="flex items-center space-x-2">
      <PermissionGate requiredPermission="holiday_types" action="edit">
        <CustomTooltip title="Edit">
          <Button
            variant="ghost"
            className="h-8 w-8 p-0 text-green-600 hover:bg-green-50 hover:text-green-700"
            onClick={() => handleEdit(row)}
          >
            <IconEdit size={16} />
          </Button>
        </CustomTooltip>
      </PermissionGate>

      <PermissionGate requiredPermission="holiday_types" action="delete">
        <CustomTooltip title="Delete">
          <Button
            variant="ghost"
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

export default HolidayTypeRowActions;
