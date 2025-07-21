import { useMemo } from 'react';

import { useAuthStore } from '@/stores/use-auth-store';
import { sidebarData } from '@/components/layout/data/sidebar-data';

// Define navigation item interface for TypeScript
interface NavItem {
    url?: string;
    items?: NavItem[];
    [key: string]: any; // Allow other properties like name, icon, etc.
}

// Define navigation group interface
export interface NavGroup {
    name: string;
    items: NavItem[];
}

export function useRoleBasedNavigation() {
    const { canAccessRoute, user } = useAuthStore();

    const filteredNavigation = useMemo(() => {
        if (!user) return { navGroups: [] };

        // Recursively filter navigation items based on route permissions
        const filterNavItems = (items: NavItem[]): NavItem[] => {
            return items
                .filter((item) => {
                    // Handle items with subitems (nested navigation)
                    if (item.items) {
                        const filteredSubItems = filterNavItems(item.items);
                        return filteredSubItems.length > 0;
                    }

                    // Check permission for the route
                    if (item.url) {
                        return canAccessRoute(item.url);
                    }

                    // Allow items without a URL (e.g., headers or dividers)
                    return true;
                })
                .map((item) => {
                    if (item.items) {
                        return { ...item, items: filterNavItems(item.items) };
                    }
                    return item;
                });
        };

        // Filter navigation groups, keeping only those with accessible items
        const filteredGroups: any[] = sidebarData.navGroups
            .map((group) => ({
                name: group.title, // Map 'title' to 'name'
                items: filterNavItems(group.items),
            }))
            .filter((group) => group.items.length > 0);

        return { navGroups: filteredGroups };
    }, [user, canAccessRoute]);

    return filteredNavigation;
}