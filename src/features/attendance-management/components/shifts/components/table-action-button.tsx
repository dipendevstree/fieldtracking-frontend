import { Button } from "@/components/ui/button";
import { useShiftStore } from "@/features/attendance-management/store/shift.store";
import CustomTooltip from "@/components/shared/custom-tooltip";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { PermissionGate } from "@/permissions/components/PermissionGate";

export function ShiftRowActions({
  row,
  totalShifts,
}: {
  row: any;
  totalShifts: number;
}) {
  const { setOpen, setCurrentRow } = useShiftStore();

  const handleEdit = (r: any) => {
    setCurrentRow(r.original);
    setOpen("edit");
  };

  const handleDelete = (r: any) => {
    setCurrentRow(r.original);
    setOpen("delete");
  };

  // Check if this shift is the default shift
  const isDefaultShift = row.original?.isDefault;
  // Disable delete if it's the only shift OR if it's the default shift
  const canDelete = totalShifts > 1 && !isDefaultShift;

  return (
    <div className="flex items-center space-x-2">
      <PermissionGate requiredPermission="attendance_shifts" action="edit">
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

      <PermissionGate requiredPermission="attendance_shifts" action="delete">
        <CustomTooltip
          title={
            !canDelete
              ? isDefaultShift
                ? "Cannot delete default shift"
                : "Cannot delete - at least one shift must exist"
              : "Delete"
          }
        >
          <Button
            variant="ghost"
            onClick={() => handleDelete(row)}
            disabled={!canDelete}
            className={`h-8 w-8 p-0 ${
              !canDelete
                ? "text-gray-400 cursor-not-allowed"
                : "text-red-600 hover:bg-red-50 hover:text-red-700"
            }`}
          >
            <IconTrash size={16} />
          </Button>
        </CustomTooltip>
      </PermissionGate>
    </div>
  );
}

export default ShiftRowActions;
