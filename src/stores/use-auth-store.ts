import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ROUTE_PERMISSIONS } from "@/components/layout/data/sidebar-data";
import { AuthState, UserRole } from "@/components/layout/types";
import { LoginUser } from "@/features/auth/sign-in/types";

// Auth storage keys
const AUTH_STORAGE_KEYS = {
  ACCESS_TOKEN: "access_token",
  USER_DATA: "user_data",
} as const;

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isLoading: false,
      isAuthenticated: false,
      isPasswordChanged: false,

      // Actions
      login: (data: any) => {
        set({ isLoading: true });

        try {
          console.log("Login data received:", data);
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
                data.access_token
              );
              localStorage.setItem(
                AUTH_STORAGE_KEYS.USER_DATA,
                JSON.stringify(data)
              );
            }

            set({
              user: data,
              isAuthenticated: true,
              isLoading: false,
              isPasswordChanged: data.isPasswordChanged,
            });
          } else {
            throw new Error(
              "Invalid login data: missing access token or user ID"
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
              JSON.stringify(updatedUser)
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
            (permission) =>
              permission?.name?.toLowerCase() === permissionName?.toLowerCase()
          )
        );
      },

      hasPermissionGroup: (groupName: string) => {
        const { user } = get();
        if (!user?.permissions) return false;

        return user.permissions.some(
          (group) => group.name.toLowerCase() === groupName.toLowerCase()
        );
      },

      hasAnyPermission: (permissionNames: string[]) => {
        const { user } = get();
        if (!user?.permissions) return false;

        return permissionNames.some((permissionName) =>
          user.permissions.some((group) =>
            group.children.some(
              (permission) =>
                permission.name.toLowerCase() === permissionName.toLowerCase()
            )
          )
        );
      },

      hasAnyPermissionGroup: (groupNames: string[]) => {
        const { user } = get();
        if (!user?.permissions) return false;

        return groupNames.some((groupName) =>
          user.permissions.some(
            (group) => group.name.toLowerCase() === groupName.toLowerCase()
          )
        );
      },

      // User role helpers (implement based on your business logic)
      getUserRole: () => {
        const { user } = get();
        if (!user) return null;

        // Example: Determine role based on permissions or user data
        // You might need to adjust this based on your actual role determination logic
        if (user.email === "admin@gmail.com") return "admin";

        // Or determine based on permissions
        const { hasPermissionGroup } = get();
        if (hasPermissionGroup("Admin")) return "admin";
        if (hasPermissionGroup("Merchant")) return "merchant";
        if (hasPermissionGroup("Driver")) return "driver";
        if (hasPermissionGroup("Business")) return "business";

        return "user";
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
          (roleName) => userRole.toLowerCase() === roleName.toLowerCase()
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
              hasPermission(perm)
            );
          }

          // Check if route requires specific permission groups
          if (permission.requiredPermissionGroups) {
            return permission.requiredPermissionGroups.some((group) =>
              hasPermissionGroup(group)
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
                hasPermission(perm)
              )
            : permission.requiredPermissions.some((perm) =>
                hasPermission(perm)
              );

          if (!hasRequiredPermission) return false;
        }

        // Check permission groups
        if (permission.requiredPermissionGroups?.length) {
          const hasRequiredGroup = permission.requireAll
            ? permission.requiredPermissionGroups.every((group) =>
                hasPermissionGroup(group)
              )
            : permission.requiredPermissionGroups.some((group) =>
                hasPermissionGroup(group)
              );

          if (!hasRequiredGroup) return false;
        }

        // Check roles
        if (permission.requiredRoles?.length) {
          const hasRequiredRole = permission.requireAll
            ? permission.requiredRoles.every((role) =>
                hasAnyRole([role as UserRole])
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
            AUTH_STORAGE_KEYS.ACCESS_TOKEN
          );
          const storedUser = localStorage.getItem(AUTH_STORAGE_KEYS.USER_DATA);

          if (!storedToken || !storedUser) {
            // Clear state if localStorage is inconsistent
            state.user = null;
            state.isAuthenticated = false;
          }
        }
      },
    }
  )
);

// Utility hooks for common auth operations
export const useAuth = () => {
  const store = useAuthStore();

  return {
    // State
    user: store.user,
    isLoading: store.isLoading,
    isAuthenticated: store.isAuthenticated,

    // Actions
    login: store.login,
    logout: store.logout,
    updateUser: store.updateUser,

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
