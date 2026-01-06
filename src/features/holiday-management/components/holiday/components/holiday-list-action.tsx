import { Button } from "@/components/ui/button";
import { PermissionGate } from "@/permissions/components/PermissionGate";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { useHolidayStore } from "../../../store/holiday-type.store";

export const HolidayListAction = ({ currentRow }: { currentRow: any }) => {
  const { setOpen, setCurrentRow } = useHolidayStore();
  const handleEdit = () => {
    setOpen("edit");
    setCurrentRow(currentRow);
  };
  const handleDelete = () => {
    setOpen("delete");
    setCurrentRow(currentRow);
  };

  return (
    <div className="flex items-center gap-2">
      <PermissionGate requiredPermission="list_of_holidays" action="edit">
        <Button
          variant="ghost"
          className="h-8 w-8 p-0 text-green-600 hover:bg-green-50 hover:text-green-700"
          onClick={handleEdit}
        >
          <IconEdit size={16} />
        </Button>
      </PermissionGate>
      <PermissionGate requiredPermission="list_of_holidays" action="delete">
        <Button
          variant="ghost"
          onClick={handleDelete}
          className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700"
        >
          <IconTrash size={16} />
        </Button>
      </PermissionGate>
    </div>
  );
};
