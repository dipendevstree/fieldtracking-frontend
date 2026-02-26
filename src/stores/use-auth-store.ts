import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ROUTE_PERMISSIONS } from "@/components/layout/data/sidebar-data";
import { AuthState, UserRole, Permission } from "@/components/layout/types";
import { LoginUser } from "@/features/auth/sign-in/types";

// Auth storage keys
const AUTH_STORAGE_KEYS = {
  ACCESS_TOKEN: "access_token",
  USER_DATA: "user_data",
  FCM_TOKEN: "fcm_token",
} as const;

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isLoading: false,
      isAuthenticated: false,
      isPasswordChanged: false,
      refreshTrigger: 0,

      // Actions
      login: (data: LoginUser) => {
        set({ isLoading: true });

        try {
          if (data?.access_token) {
            console.log("Login successful:", data);
            if (data?.superAdminId) {
              data = {
                ...data,
                user_id: data.superAdminId,
                name: data.userName,
              };
            }
            // Store token in localStorage for API requests
            if (typeof window !== "undefined") {
              localStorage.setItem(
                AUTH_STORAGE_KEYS.ACCESS_TOKEN,
                data.access_token,
              );
              localStorage.setItem(
                AUTH_STORAGE_KEYS.USER_DATA,
                JSON.stringify(data),
              );
            }

            set({
              user: data,
              isAuthenticated: true,
              isLoading: false,
              isPasswordChanged: data.isPasswordChanged || false,
            });
          } else {
            throw new Error(
              "Invalid login data: missing access token or user ID",
            );
          }
        } catch (error) {
          set({ isLoading: false });
          // Clear any stored data on error
          if (typeof window !== "undefined") {
            localStorage.removeItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
            localStorage.removeItem(AUTH_STORAGE_KEYS.USER_DATA);
          }
          throw error;
        }
      },

      logout: () => {
        // Clear stored authentication data
        if (typeof window !== "undefined") {
          localStorage.removeItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
          localStorage.removeItem(AUTH_STORAGE_KEYS.USER_DATA);
          localStorage.removeItem(AUTH_STORAGE_KEYS.FCM_TOKEN);
        }

        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          isPasswordChanged: false,
        });
      },

      setIsPasswordChanged: (isPasswordChanged: boolean) => {
        set({ isPasswordChanged });
      },

      updateUser: (userData: Partial<LoginUser>) => {
        set((state) => {
          if (!state.user) return state;

          const updatedUser = { ...state.user, ...userData };

          // Update localStorage with new user data
          if (typeof window !== "undefined") {
            localStorage.setItem(
              AUTH_STORAGE_KEYS.USER_DATA,
              JSON.stringify(updatedUser),
            );
          }

          return {
            user: updatedUser,
          };
        });
      },

      // Permission helpers - Updated for nested permission structure
      hasPermission: (permissionName: string) => {
        const { user } = get();
        if (!user?.permissions) return false;

        return user.permissions.some((group) =>
          group.children.some(
            (permission: Permission) =>
              permission?.name?.toLowerCase() === permissionName?.toLowerCase(),
          ),
        );
      },

      hasPermissionGroup: (groupName: string) => {
        const { user } = get();
        if (!user?.permissions) return false;

        return user.permissions.some(
          (group) => group.name.toLowerCase() === groupName.toLowerCase(),
        );
      },

      hasAnyPermission: (permissionNames: string[]) => {
        const { user } = get();
        if (!user?.permissions) return false;

        return permissionNames.some((permissionName) =>
          user.permissions?.some((group) =>
            group.children.some(
              (permission: Permission) =>
                permission.name.toLowerCase() === permissionName.toLowerCase(),
            ),
          ),
        );
      },

      hasAnyPermissionGroup: (groupNames: string[]) => {
        const { user } = get();
        if (!user?.permissions) return false;

        return groupNames.some((groupName) =>
          user.permissions?.some(
            (group) => group.name.toLowerCase() === groupName.toLowerCase(),
          ),
        );
      },

      // User role helpers (implement based on your business logic)
      getUserRole: () => {
        const { user } = get();
        if (!user) return null;

        // Determine role based on user data roleName or role mapping
        const roleName = user.role?.roleName?.toLowerCase() || "";
        if (roleName.includes("admin")) return "admin";

        // Fallback to permission groups if role name is not descriptive
        const { hasPermissionGroup } = get();
        if (hasPermissionGroup("Admin")) return "admin";

        return (roleName as UserRole) || "user";
      },

      hasRole: (roleName: string) => {
        const { getUserRole } = get();
        const userRole = getUserRole();
        return userRole?.toLowerCase() === roleName.toLowerCase();
      },

      hasAnyRole: (roleNames: string[]) => {
        const { getUserRole } = get();
        const userRole = getUserRole();
        if (!userRole) return false;

        return roleNames.some(
          (roleName) => userRole.toLowerCase() === roleName.toLowerCase(),
        );
      },

      // Navigation helpers - Updated for new permission structure
      getAccessibleRoutes: () => {
        const { hasPermission, hasPermissionGroup } = get();

        return Object.keys(ROUTE_PERMISSIONS).filter((route) => {
          const permission = ROUTE_PERMISSIONS[route];

          // Check if route requires specific permissions
          if (permission.requiredPermissions) {
            return permission.requiredPermissions.some((perm) =>
              hasPermission(perm),
            );
          }

          // Check if route requires specific permission groups
          if (permission.requiredPermissionGroups) {
            return permission.requiredPermissionGroups.some((group) =>
              hasPermissionGroup(group),
            );
          }

          // Check if route requires specific roles
          if (permission.requiredRoles) {
            const { hasAnyRole } = get();
            return hasAnyRole(permission.requiredRoles as UserRole[]);
          }

          return true; // Allow routes without specific permissions
        });
      },

      canAccessRoute: (route: string) => {
        const { hasPermission, hasPermissionGroup, hasAnyRole } = get();
        const permission = ROUTE_PERMISSIONS[route];

        if (!permission) return true; // Allow routes without specific permissions

        // Check permissions (OR logic by default)
        if (permission.requiredPermissions?.length) {
          const hasRequiredPermission = permission.requireAll
            ? permission.requiredPermissions.every((perm) =>
                hasPermission(perm),
              )
            : permission.requiredPermissions.some((perm) =>
                hasPermission(perm),
              );

          if (!hasRequiredPermission) return false;
        }

        // Check permission groups
        if (permission.requiredPermissionGroups?.length) {
          const hasRequiredGroup = permission.requireAll
            ? permission.requiredPermissionGroups.every((group) =>
                hasPermissionGroup(group),
              )
            : permission.requiredPermissionGroups.some((group) =>
                hasPermissionGroup(group),
              );

          if (!hasRequiredGroup) return false;
        }

        // Check roles
        if (permission.requiredRoles?.length) {
          const hasRequiredRole = permission.requireAll
            ? permission.requiredRoles.every((role) =>
                hasAnyRole([role as UserRole]),
              )
            : hasAnyRole(permission.requiredRoles as UserRole[]);

          if (!hasRequiredRole) return false;
        }

        return true;
      },

      // Token management helpers
      getToken: () => {
        const { user } = get();
        return user?.access_token || null;
      },

      isTokenValid: () => {
        const { user } = get();
        return !!(user?.access_token && user?.user_id);
      },

      // Refresh user data from API
      refreshUser: async () => {
        try {
          set((state) => ({
            ...state,
            refreshTrigger: Date.now(),
          }));
        } catch (error) {
          console.error("Error refreshing user data:", error);
          throw error;
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        isPasswordChanged: state.isPasswordChanged,
      }),
      // Hydrate state from localStorage on app start
      onRehydrateStorage: () => (state) => {
        if (state?.user && typeof window !== "undefined") {
          // Ensure localStorage is in sync
          const storedToken = localStorage.getItem(
            AUTH_STORAGE_KEYS.ACCESS_TOKEN,
          );
          const storedUser = localStorage.getItem(AUTH_STORAGE_KEYS.USER_DATA);

          if (!storedToken || !storedUser) {
            // Clear state if localStorage is inconsistent
            state.user = null;
            state.isAuthenticated = false;
          }
        }
      },
    },
  ),
);

// Utility hooks for common auth operations
export const useAuth = () => {
  const store = useAuthStore();

  return {
    // State
    user: store.user,
    isLoading: store.isLoading,
    isAuthenticated: store.isAuthenticated,
    refreshTrigger: store.refreshTrigger,

    // Actions
    login: store.login,
    logout: store.logout,
    updateUser: store.updateUser,
    refreshUser: store.refreshUser,

    // Permission helpers
    hasPermission: store.hasPermission,
    hasPermissionGroup: store.hasPermissionGroup,
    hasAnyPermission: store.hasAnyPermission,
    hasAnyPermissionGroup: store.hasAnyPermissionGroup,

    // Role helpers
    getUserRole: store.getUserRole,
    hasRole: store.hasRole,
    hasAnyRole: store.hasAnyRole,

    // Navigation helpers
    getAccessibleRoutes: store.getAccessibleRoutes,
    canAccessRoute: store.canAccessRoute,

    // Token helpers
    getToken: store.getToken,
    isTokenValid: store.isTokenValid,
  };
};

// Utility function to get auth header for API requests
export const getAuthHeader = () => {
  const token = useAuthStore.getState().getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Utility function to check if user is authenticated
export const isAuthenticated = () => {
  const { isAuthenticated, isTokenValid } = useAuthStore.getState();
  return isAuthenticated && isTokenValid();
};
