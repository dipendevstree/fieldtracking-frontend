import { Navigate, Outlet } from "@tanstack/react-router";
import { useAppStore } from "@/stores/use-app-store";
import { useAuthStore } from "@/stores/use-auth-store";
import { cn } from "@/lib/utils";
import { SearchProvider } from "@/context/search-context";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import SkipToMain from "@/components/skip-to-main";
import { ProfileDropdown } from "../profile-dropdown";
import { Search } from "../search";
import { Header } from "./header";
// import { ThemeSelector } from "../theme-selector";
import { NotificationList } from "../../features/notifications/components/notification-list";

export function AuthenticatedLayout({
  children,
}: Readonly<{ children?: React.ReactNode }>) {
  const { user, isLoading, isPasswordChanged } = useAuthStore();
  const { sidebarOpen } = useAppStore();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user || !isPasswordChanged) {
    return <Navigate to="/sign-in" />;
  }

  return (
    <SearchProvider>
      <SidebarProvider defaultOpen={sidebarOpen}>
        <SkipToMain />
        <AppSidebar />
        <div
          id="content"
          className={cn(
            "ml-auto w-full max-w-full",
            "peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon)-1rem)]",
            "peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width))]",
            "sm:transition-[width] sm:duration-200 sm:ease-linear",
            "flex h-svh flex-col",
            "group-data-[scroll-locked=1]/body:h-full",
            "has-[main.fixed-main]:group-data-[scroll-locked=1]/body:h-svh"
          )}
        >
          <Header fixed className="shadow">
            <div className="ml-auto flex items-center space-x-2">
              <Search />
              <NotificationList />
              {/* <ThemeSelector /> */}
              <ProfileDropdown user={user} avatarSize="md" />
            </div>
          </Header>

          {children ?? <Outlet />}
        </div>
      </SidebarProvider>
    </SearchProvider>
  );
}
