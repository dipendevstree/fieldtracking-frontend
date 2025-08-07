import { useNavigate } from "@tanstack/react-router";
import { IconEdit, IconTrash, IconUser } from "@tabler/icons-react";
import { PermissionGate } from "@/permissions/components/PermissionGate";
import Button from "@/components/shared/custom-button";
import CustomTooltip from "@/components/shared/custom-tooltip";
import { useUserTerritoryStore } from "../store/users-territory.store";

export function DataTableRowActions({ row }: any) {
  const { setOpen, setCurrentRow } = useUserTerritoryStore();
  const navigate = useNavigate();
  console.log("row", row);
  const handleEdit = (row: any) => {
    setOpen("edit");
    setCurrentRow(row.original);
  };

  const handleDelete = (row: any) => {
    setOpen("delete");
    setCurrentRow(row.original);
  };

  const handleViewUsers = (row: any) => {
    const territoryId = row.original.id || row.original.territoryId;
    if (territoryId) {
      navigate({
        to: "/user-territory/view-territorywise-user/$territoyId",
        params: { territoyId: territoryId.toString() },
      });
    }
  };

  return (
    <div className="flex items-center space-x-2">
      {row.original.userCount > 0 && (
        <PermissionGate requiredPermission="user_territory" action="viewOwn">
          <CustomTooltip title="View Users">
            <Button
              variant="ghost"
              onClick={() => handleViewUsers(row)}
              className="h-8 w-8 p-0"
            >
              <IconUser size={16} />
            </Button>
          </CustomTooltip>
        </PermissionGate>
      )}
      <PermissionGate requiredPermission="user_territory" action="edit">
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
      <PermissionGate requiredPermission="user_territory" action="delete">
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
