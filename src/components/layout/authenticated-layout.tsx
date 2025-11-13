import { useEffect } from "react";
import { Navigate, Outlet } from "@tanstack/react-router";
import { useAppStore } from "@/stores/use-app-store";
import { useAuthStore } from "@/stores/use-auth-store";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { Header } from "./header";
import { ProfileDropdown } from "../profile-dropdown";
import { Search } from "../search";
import { NotificationList } from "../../features/notifications/components/notification-list";
import { SearchProvider } from "@/context/search-context";
import SkipToMain from "@/components/skip-to-main";
import { cn } from "@/lib/utils";
import { useFcm } from "@/hooks/use-fcm";
import { useUpdateUser } from "@/features/UserManagement/services/AllUsers.hook";

export function AuthenticatedLayout({
  children,
}: {
  children?: React.ReactNode;
}) {
  const { user, isLoading, isPasswordChanged, updateUser } = useAuthStore();
  const { sidebarOpen } = useAppStore();
  const { mutate: updateUserToken } = useUpdateUser(
    user?.id || "",
    () => {},
    true
  );
  const { token, requestPermission, permissionGranted } = useFcm();

  // ✅ Ask for permission once after login
  useEffect(() => {
    if (user && !user.isSuperAdmin && !permissionGranted) {
      requestPermission();
    }
  }, [user, permissionGranted, requestPermission]);

  // ✅ Save FCM token to backend
  useEffect(() => {
    if (
      user &&
      !user.isSuperAdmin &&
      token &&
      user?.id &&
      (!user.fcm_token || user.fcm_token !== token)
    ) {
      updateUserToken(
        {
          email: user.email,
          fcm_token: token,
          phoneNumber: user.phoneNumber,
        },
        {
          onSuccess: () => {
            updateUser({ ...user, fcm_token: token });
          },
        }
      );
    }
  }, [token, user?.id]);

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
              {!user?.isSuperAdmin && <NotificationList />}
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
