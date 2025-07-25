import { IconEdit, IconTrash } from "@tabler/icons-react";
import { PermissionGate } from "@/permissions/components/PermissionGate";
import Button from "@/components/shared/custom-button";
import CustomTooltip from "@/components/shared/custom-tooltip";
import { useCategoryStore } from "../../../store/expenses-category.store";

export function DataTableRowActions({ row }: any) {
  const { setOpen, setCurrentRow } = useCategoryStore();

  const handleEdit = (row: any) => {
    setOpen("edit");
    setCurrentRow(row.original);
  };

  const handleDelete = (row: any) => {
    setOpen("delete");
    setCurrentRow(row.original);
  };

  return (
    <div className="flex items-center space-x-2">
      <PermissionGate requiredPermission="expense_category" action="edit">
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

      <PermissionGate requiredPermission="expense_category" action="delete">
        <CustomTooltip title="Delete">
          <Button
            variant="ghost"
            onClick={() => handleDelete(row)}
            className="h-8 w-8 p-0 text-red-600 hover:bg-green-50 hover:text-red-700"
          >
            <IconTrash size={16} />
          </Button>
        </CustomTooltip>
      </PermissionGate>
    </div>
  );
}
