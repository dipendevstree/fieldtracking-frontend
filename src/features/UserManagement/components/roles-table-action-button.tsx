import { useNavigate } from "@tanstack/react-router";
import { IconEdit} from "@tabler/icons-react";
import CustomTooltip from "@/components/shared/custom-tooltip";
import { useRolesStore } from "../store/roles.store";
import { Button } from "@/components/ui/button";

export function DataTableRowActions({ row }: any) {
  const { setCurrentRow } = useRolesStore();
  const navigate = useNavigate()

  const handleEditRole = (row: any) => {
    setCurrentRow(row.original);
    console.log("Edit Role button clicked", row.original);
    navigate({
      to: `/user-management/edit-roles-permission/${row.original.roleId}`,
    });
  };

  return (
    <div className="flex items-center space-x-2">
      <CustomTooltip title="Edit Role">
        <Button
          variant="outline"
          className="h-8 w-8 p-0 text-green-600 hover:bg-green-50 hover:text-green-700"
          onClick={() => handleEditRole(row)}
        >
          <IconEdit size={16} />
        </Button>
      </CustomTooltip>
    </div>
  );
}
