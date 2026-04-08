import { useNavigate } from "@tanstack/react-router";
import { IconEdit } from "@tabler/icons-react";
import CustomTooltip from "@/components/shared/custom-tooltip";
import { useRolesStore } from "../store/roles.store";
import { Button } from "@/components/ui/button";
import { PermissionGate } from "@/permissions/components/PermissionGate";
import { useAuthStore } from "@/stores/use-auth-store";

export function DataTableRowActions({ row }: any) {
  const { setCurrentRow } = useRolesStore();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const handleEditRole = (row: any) => {
    setCurrentRow(row.original);
    navigate({
      to: `/user-management/edit-roles-permission/${row.original.roleId}`,
    });
  };

  const isAdminRole = row.original?.roleName?.toLowerCase() === "admin";
  const isUserOwnRole = user?.role?.roleId === row.original?.roleId;

  const isDisabled = isAdminRole || isUserOwnRole;

  return (
    <div className="flex items-center space-x-2">
      <PermissionGate requiredPermission="roles_permission" action="edit">
        <CustomTooltip
          title={
            isAdminRole
              ? "Admin role cannot be edited"
              : isUserOwnRole
                ? "You cannot edit your own role"
                : "Edit Role"
          }
        >
          <Button
            variant="outline"
            className="h-8 w-8 p-0 text-green-600 hover:bg-green-50 hover:text-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => handleEditRole(row)}
            disabled={isDisabled}
          >
            <IconEdit size={16} />
          </Button>
        </CustomTooltip>
      </PermissionGate>
    </div>
  );
}
