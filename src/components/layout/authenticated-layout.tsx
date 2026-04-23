import { useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "@tanstack/react-router";
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
import { useFcmTokenUpdateUser } from "@/features/UserManagement/services/AllUsers.hook";
import WorkDaySession from "@/features/attendance-management/components/attendance/components/WorkDaySession";
import { usePermissionData } from "@/hooks/use-permission-data";
import { PermissionGate } from "@/permissions/components/PermissionGate";
import { useDeviceInfo } from "@/hooks/use-device-info";
import { sanitizePayload } from "@/utils/commonFunction";
// import ProcessLeaveBalance from "@/features/leave-management/components/leave-balance/ProcessLeaveBalance";

export function AuthenticatedLayout({
  children,
}: {
  children?: React.ReactNode;
}) {
  const deviceInfo = useDeviceInfo();
  const { user, isLoading, isPasswordChanged, updateUser } = useAuthStore();
  const { sidebarOpen } = useAppStore();
  const { mutate: updateUserToken } = useFcmTokenUpdateUser((data) => {
    updateUser({ fcm_token: data?.fcmToken });
  }, true);
  const { token, requestPermission, permissionGranted } = useFcm();
  const navigate = useNavigate();
  const { mutate: updatePermission } = usePermissionData({
    onSuccess(data) {
      updateUser({
        ...user,
        ...data,
        role: {
          ...user?.role,
          ...data?.role,
        },
        organization: {
          ...user?.organization,
          ...data.organization,
        },
      });
    },
  });

  // ✅ Ask for permission once after login
  useEffect(() => {
    if (user && !user.isSuperAdmin && !permissionGranted) {
      requestPermission();
    }
  }, [user, permissionGranted, requestPermission]);

  // ✅ Save FCM token to backend
  useEffect(() => {
    const cachedFcmToken = localStorage.getItem("fcm_token");

    if (
      user &&
      !user.isSuperAdmin &&
      token &&
      user?.id &&
      cachedFcmToken !== token // Only call API if token actually changed
    ) {
      let deviceId = localStorage.getItem("deviceId");

      // Cache the token to prevent repeated API calls
      localStorage.setItem("fcm_token", token);

      updateUserToken(
        sanitizePayload({
          fcmToken: token,
          isWeb: true,
          deviceId: deviceId,
          ...deviceInfo,
        }),
      );
    }
  }, [token, user]);

  useEffect(() => {
    if (user && !user.isSuperAdmin) {
      updatePermission();
    }
  }, []);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      const handler = (event: any) => {
        if (event.data?.type === "navigate" && event.data.url) {
          // Focus the window and navigate internally
          window.focus();
          navigate({ to: event.data.url });
        }
      };
      navigator.serviceWorker.addEventListener("message", handler);

      // Optional cleanup
      return () => {
        navigator.serviceWorker.removeEventListener("message", handler);
      };
    }
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user || !isPasswordChanged) {
    const wasSuperAdmin = localStorage.getItem("was_super_admin") === "true";
    return <Navigate to={wasSuperAdmin ? "/superadmin-sign-in" : "/sign-in"} />;
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
            "has-[main.fixed-main]:group-data-[scroll-locked=1]/body:h-svh",
          )}
        >
          <Header fixed className="shadow">
            <div className="ml-auto flex items-center space-x-2">
              {/* {user?.superAdminCreatedBy && <ProcessLeaveBalance />} */}

              {user && !user.isSuperAdmin && (
                <PermissionGate
                  requiredPermission="attendance_management"
                  action="add"
                >
                  <WorkDaySession />
                </PermissionGate>
              )}

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
