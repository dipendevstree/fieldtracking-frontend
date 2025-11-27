import { useRoleBasedNavigation } from "@/permissions/hooks/use-role-base-navigation";
import { useAuthStore } from "@/stores/use-auth-store";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavGroup } from "@/components/layout/nav-group";
import { NavUser } from "@/components/layout/nav-user";
import { TeamSwitcher } from "@/components/layout/team-switcher";
import { SUPER_ADMIN_SIDEBAR_DATA } from "./data/sidebar-data";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuthStore();

  const { sidebarData } = useRoleBasedNavigation(user?.role, {
    allowAddUsersBasedOnTerritories:
      user?.organization?.allowAddUsersBasedOnTerritories,
  });
  const isSuperAdmin = user?.isSuperAdmin;
  const SIDEBAR_DATA = isSuperAdmin ? SUPER_ADMIN_SIDEBAR_DATA : sidebarData;
  return (
    <Sidebar collapsible="icon" variant="floating" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={SIDEBAR_DATA.teams} />
      </SidebarHeader>
      <SidebarContent>
        {SIDEBAR_DATA.navGroups.map((props: any) => (
          <NavGroup
            key={props.title}
            title={props.title}
            items={props.items}
            {...props}
          />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
