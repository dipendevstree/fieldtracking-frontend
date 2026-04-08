import { IconEdit, IconTrash } from "@tabler/icons-react";
import { Row } from "@tanstack/react-table";
import { PermissionGate } from "@/permissions/components/PermissionGate";
import Button from "@/components/shared/custom-button";
import CustomTooltip from "@/components/shared/custom-tooltip";
import { TermsAndConditions } from "../types";
import { useTermsStore } from "./termsAndConditions.store";

interface DataTableRowActionsProps {
  row: Row<TermsAndConditions>;
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const { setOpen, setCurrentRow } = useTermsStore();

  const handleEdit = () => {
    setOpen("edit");
    setCurrentRow(row.original);
  };

  const handleDelete = () => {
    setOpen("delete");
    setCurrentRow(row.original);
  };

  return (
    <div className="flex items-center space-x-2">
      <PermissionGate requiredPermission="terms_and_conditions" action="edit">
        <CustomTooltip title="Edit">
          <Button
            variant="ghost"
            className="h-8 w-8 p-0 text-green-600 hover:bg-green-50 hover:text-green-700"
            onClick={handleEdit}
          >
            <IconEdit size={16} />
          </Button>
        </CustomTooltip>
      </PermissionGate>

      <PermissionGate requiredPermission="terms_and_conditions" action="delete">
        <CustomTooltip title="Delete">
          <Button
            variant="ghost"
            onClick={handleDelete}
            className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <IconTrash size={16} />
          </Button>
        </CustomTooltip>
      </PermissionGate>
    </div>
  );
}
