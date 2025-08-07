import { IconEdit, IconTrash } from "@tabler/icons-react";
import CustomTooltip from "@/components/shared/custom-tooltip";
import { useCustomerTypeStore } from "../store/customer-type.store";
import { CustomerType } from "../type/type";
import { Button } from "@/components/ui/button";

interface DataTableRowActionsProps {
  row: {
    original: CustomerType;
  };
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const { setOpen, setCurrentRow } = useCustomerTypeStore();

  const handleEdit = () => {
    if (!row.original) return;

    setCurrentRow(row.original);
    setOpen("edit");
  };

  const handleDelete = () => {
    if (!row.original) return;

    setCurrentRow(row.original);
    setOpen("delete");
  };

  return (
    <div className="flex items-center space-x-2">
      <CustomTooltip title="Edit">
        <Button
          variant="ghost"
          className="h-8 w-8 p-0 text-green-600 hover:bg-green-50 hover:text-green-700"
          onClick={handleEdit}
        >
          <IconEdit size={16} />
        </Button>
      </CustomTooltip>

      <CustomTooltip title="Delete">
        <Button
          variant="ghost"
          onClick={handleDelete}
          className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700"
        >
          <IconTrash size={16} />
        </Button>
      </CustomTooltip>
    </div>
  );
}
