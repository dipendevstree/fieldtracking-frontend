import { useMemo } from "react";
import { useAuthStore } from "@/stores/use-auth-store";
import { Permission } from "../types";
import { PermissionManager } from "../utils/permission-utils";
import { usePlanStatus } from "./use-plan-status";

export function usePermission() {
  const { user } = useAuthStore();
  const { canPerformPlanAction } = usePlanStatus();
  const permissions = user?.role?.permissions as any;

  const permissionManager = useMemo(() => {
    // If user is super admin, we don't need permission manager
    if (user?.isSuperAdmin) return null;

    if (!permissions) return null;
    return new PermissionManager(permissions as unknown as Permission[]);
  }, [permissions, user?.isSuperAdmin]);

  const hasAccess = (menuKey: string): boolean => {
    // If user is super admin, only allow access to 'super_admin' menu
    if (user?.isSuperAdmin) {
      return menuKey === "super_admin";
    }

    return permissionManager?.hasMenuAccess(menuKey) ?? false;
  };

  // ROLE ONLY (pure RBAC)
  const hasRolePermission = (
    menuKey: string,
    action: "add" | "edit" | "viewOwn" | "viewGlobal" | "delete",
  ): boolean => {
    if (user?.isSuperAdmin) return true;

    return permissionManager?.canPerformAction(menuKey, action) ?? false;
  };

  // FINAL DECISION (Plan + Role)
  const canPerformAction = (
    menuKey: string,
    action: "add" | "edit" | "viewOwn" | "viewGlobal" | "delete",
  ): boolean => {
    // 1. Plan restriction
    if (!canPerformPlanAction(action as any)) return false;

    // 2. Super admin override
    if (user?.isSuperAdmin) {
      return menuKey === "super_admin";
    }

    // 3. Role permission
    return hasRolePermission(menuKey, action);
  };

  const getAccessibleMenuKeys = (): string[] => {
    // If user is super admin, return only 'super_admin' menu key
    if (user?.isSuperAdmin) {
      return ["super_admin"];
    }

    return permissionManager?.getAccessibleMenuKeys() ?? [];
  };

  return {
    hasAccess,
    hasRolePermission,
    canPerformAction,
    getAccessibleMenuKeys,
    isAuthenticated: !!user,
    user,
  };
}
