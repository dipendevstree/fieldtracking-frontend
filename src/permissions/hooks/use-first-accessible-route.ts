import { useMemo } from "react";
import { sidebarData } from "@/components/layout/data/sidebar-data";
import { usePermission } from "./use-permission";

/**
 * Walks the sidebar menu items in order and returns
 * the first route URL the current user has permission to access.
 *
 * Falls back to "/settings/general-settings" if no menu item is accessible
 * (every logged-in user can view their own profile/general settings).
 */
export function useFirstAccessibleRoute(): string {
  const { hasAccess } = usePermission();

  const firstRoute = useMemo(() => {
    for (const group of sidebarData.navGroups) {
      for (const item of group.items) {
        // Top-level item with a direct URL (e.g. Dashboard, Live Tracking)
        if (item.url && item.menuKey && hasAccess(item.menuKey)) {
          return item.url as string;
        }

        // Collapsible item with children (e.g. Customers, Calendar)
        if (item.items && item.menuKey && hasAccess(item.menuKey)) {
          for (const child of item.items) {
            if (child.url && child.menuKey && hasAccess(child.menuKey)) {
              return child.url as string;
            }
          }
        }
      }
    }

    // Ultimate fallback – general settings (user's own profile page)
    return "/settings/general-settings";
  }, [hasAccess]);

  return firstRoute;
}
