import { SidebarData, SidebarItem } from "../types";

export function filterSidebarByPermissions(
  sidebarData: SidebarData,
  hasAccess: (menuKey: string) => boolean,
  backendPermissions: { menuName: string; menuKey: string; children: any[] }[],
  user: any
): SidebarData {
  // Create a map of menuKey to menuName for quick lookup
  const menuNameMap = new Map<string, string>();
  backendPermissions?.forEach((perm) => {
    menuNameMap.set(perm?.menuKey, perm?.menuName);
    perm?.children?.forEach((child: any) => {
      menuNameMap.set(child?.menuKey, child?.menuName);
    });
  });

  const filteredNavGroups = sidebarData.navGroups
    .map((group) => ({
      ...group,
      items: filterSidebarItems(group?.items, hasAccess, menuNameMap, user),
    }))
    .filter((group) => group?.items?.length > 0); // Remove empty groups

  return {
    ...sidebarData,
    navGroups: filteredNavGroups,
  };
}

function filterSidebarItems(
  items: SidebarItem[],
  hasAccess: (menuKey: string) => boolean,
  menuNameMap: Map<string, string>,
  user: any
): SidebarItem[] {
  return items
    .filter((item) => {
      // If item has menuKey, check permission
      // Note: Never Change MenuKey In The Backend. Only Change Title
      // if (item?.menuKey === "settings" && user?.superAdminCreatedBy === null) return false; // Hide settings menu entirely
      if (item.menuKey) {
        return hasAccess(item?.menuKey);
      }
      // If no menuKey, include by default
      return true;
    })
    .map((item) => ({
      ...item,
      title:
        item?.menuKey && menuNameMap.get(item?.menuKey)
          ? menuNameMap.get(item?.menuKey)!
          : item.title,
      // Recursively filter nested items
      items: item.items
        ? filterSidebarItems(item?.items, hasAccess, menuNameMap, user)
        : undefined,
    }))
    .filter((item) => {
      // Remove items that have nested items but all nested items were filtered out
      if (item?.items) {
        return item?.items?.length > 0;
      }
      return true;
    });
}
