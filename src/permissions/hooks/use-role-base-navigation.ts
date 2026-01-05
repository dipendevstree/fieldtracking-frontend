import { useMemo } from "react";
import { sidebarData as fullSidebarData } from "@/components/layout/data/sidebar-data";
import { filterSidebarByPermissions } from "../utils/sidebar-filter";
import { usePermission } from "./use-permission";

export function useRoleBasedNavigation(
  backendPermissions: any,
  options?: { allowAddUsersBasedOnTerritories?: boolean }
) {
  const { hasAccess, canPerformAction, isAuthenticated, user } =
    usePermission();

  const sidebarData = useMemo(() => {
    if (!isAuthenticated) {
      return { ...fullSidebarData, navGroups: [] };
    }

    let filteredSidebar = filterSidebarByPermissions(
      fullSidebarData,
      hasAccess,
      backendPermissions?.permissions,
      user
    );

    // ✅ Extra filtering based on org settings flags
    if (!options?.allowAddUsersBasedOnTerritories) {
      filteredSidebar = {
        ...filteredSidebar,
        navGroups: filteredSidebar.navGroups.map((group) => ({
          ...group,
          items: group.items.map((item) =>
            item.menuKey === "User_Management"
              ? {
                  ...item,
                  items: item.items?.filter(
                    (sub) => sub.menuKey !== "user_territory"
                  ),
                }
              : item
          ),
        })),
      };
    }

    return filteredSidebar;
  }, [hasAccess, isAuthenticated, backendPermissions]);

  return {
    sidebarData,
    hasAccess,
    canPerformAction,
    isAuthenticated,
  };
}
