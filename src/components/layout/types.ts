import { LinkProps } from "@tanstack/react-router";

interface Team {
  name: string;
  logo: React.ElementType;
  plan: string;
}

interface BaseNavItem {
  title: string;
  badge?: string;
  icon?: React.ElementType;
  menuKey?: string;
  viewType?: ViewType | null;
}

type NavLink = BaseNavItem & {
  url: LinkProps["to"];
  items?: never;
};

type NavCollapsible = BaseNavItem & {
  items: (BaseNavItem & { url: LinkProps["to"] })[];
  url?: never;
};

type NavItem = NavCollapsible | NavLink;

interface NavGroup {
  items: NavItem[];
  title: string;
}

interface UserProfile {
  name: string;
  avatar: string;
  email: string;
  role: string;
}

interface SidebarData {
  user: UserProfile;
  teams: Team[];
  navGroups: NavGroup[];
}

export type { NavCollapsible, NavGroup, NavItem, NavLink, SidebarData };

// types/auth.ts
// Updated types based on your login response structure

// Base permission interface (leaf permission)
export interface Permission {
  readonly id: string;
  readonly name: string;
}

// Permission group (contains child permissions)
export interface PermissionGroup {
  readonly id: string;
  readonly name: string;
  readonly children: readonly Permission[];
}

export interface Role {
  roleId: string;
  roleName: string;
  tierkey: string;
  isActive: boolean;
  permissions?: PermissionGroup[];
}

export interface Organization {
  organizationID: string;
  organizationName: string;
  organizationIcon?: string | null;
  currency?: string;
  time_zone?: string;
  isAutoExpense?: boolean;
  isFixedDayExpense?: boolean;
  rsPerKm?: string;
  organizationTypeId?: string;
  industryId?: string;
  website?: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  allowAddUsersBasedOnTerritories?: boolean;
  allowWorkFromHome?: boolean;
  allowUserInProbationPeriod?: boolean;
  probationPeriod?: number;
  probationPeriodUnit?: string;
  isProbationPeriod?: boolean;
  probationPeriodValue?: number;
  isActive?: boolean;
  planEndDate?: string;
  employeeRang?: EmployeeRange;
  organizationType?: OrganizationType;
  planStatus?: OrganizationPlanStatus;
  currentPlan?: {
    status: OrganizationPlanStatus;
    gracePeriodEndDate: string;
    planEndDate: string;
    planStartDate: string;
    planType: string;
  };
}

export interface OrganizationType {
  organizationTypeId: string;
  organizationTypeName: string;
  organizationTypeKey: string;
  isActive: boolean;
}

export interface EmployeeRange {
  employeeRangeId: string;
  employeeRange: string;
  isActive: boolean;
}

export interface Shift {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  thresholdTimeInMin?: number | null;
}

export interface Territory {
  id: string;
  name: string;
}

// User data from login response
export interface LoginUser {
  id: string;
  roleId?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  countryCode?: string;
  departmentId?: string;
  user_id?: string;
  name?: string;
  email?: string;
  isSuperAdmin?: boolean;
  mobile?: string | null;
  access_token: string;
  profileUrl?: string | null;
  role?: Role;
  readonly permissions?: readonly PermissionGroup[];
  organizationID?: string;
  organization?: Organization;
  userName?: string;
  fcm_token?: string | null;
  superAdminCreatedBy?: string | null;
  territoryId?: string | null;
  shift?: Shift | null;
  readonly reportingTo?: readonly LoginUser[];
  territory?: Territory | null;
  isPasswordChanged?: boolean;
  superAdminId?: string;
  joiningDate?: string;
}

// Complete login response
export interface LoginResponse {
  readonly data: LoginUser;
  readonly message?: string;
  readonly success?: boolean;
}

// User roles based on your system (you can extend this as needed)
export type UserRole = "admin" | "user";

export const USER_ROLES = {
  ADMIN: "admin",
  USER: "user",
} as const;

// Auth state interface updated to match your login response
export interface AuthState {
  // State
  user: LoginUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isPasswordChanged: boolean;
  refreshTrigger: number;

  // Actions
  login: (userData: LoginUser) => void;
  logout: () => void;
  updateUser: (userData: Partial<LoginUser>) => void;
  setIsPasswordChanged: (value: boolean) => void;
  refreshUser: () => Promise<void>;

  // Permission helpers - Updated to work with nested permission structure
  hasPermission: (permissionName: string) => boolean;
  hasPermissionGroup: (groupName: string) => boolean;
  hasAnyPermission: (permissionNames: string[]) => boolean;
  hasAnyPermissionGroup: (groupNames: string[]) => boolean;

  // User role helpers (you might determine role from permissions or add role field)
  getUserRole: () => UserRole | null;
  hasRole: (roleName: UserRole) => boolean;
  hasAnyRole: (roleNames: UserRole[]) => boolean;

  // Navigation helpers
  getAccessibleRoutes: () => string[];
  canAccessRoute: (route: string) => boolean;

  // Token management
  getToken: () => string | null;
  isTokenValid: () => boolean;
}

// Route permission configuration
export interface RoutePermission {
  readonly path: string;
  readonly requiredPermissions?: string[];
  readonly requiredPermissionGroups?: string[];
  readonly requiredRoles?: UserRole[];
  readonly requireAll?: boolean; // true = AND logic, false = OR logic (default)
}

// Permission check options
export interface PermissionCheckOptions {
  readonly requireAll?: boolean;
  readonly caseSensitive?: boolean;
}

// Auth store actions
export interface AuthActions {
  login: (userData: LoginUser) => void;
  logout: () => void;
  updateUser: (userData: Partial<LoginUser>) => void;
  setIsPasswordChanged: (value: boolean) => void;
  refreshToken: () => Promise<void>;
  checkPermission: (
    permissionName: string,
    options?: PermissionCheckOptions,
  ) => boolean;
  checkPermissionGroup: (
    groupName: string,
    options?: PermissionCheckOptions,
  ) => boolean;
}

// Helper utility types
export type PermissionName = string;
export type PermissionGroupName = string;

// Route configuration with permissions
export interface ProtectedRoute {
  readonly path: string;
  readonly component: React.ComponentType;
  readonly permissions?: {
    readonly groups?: PermissionGroupName[];
    readonly permissions?: PermissionName[];
    readonly roles?: UserRole[];
    readonly requireAll?: boolean;
  };
}

// Auth context type
export interface AuthContextType extends AuthState {
  // Additional context-specific methods
  refreshUser: () => Promise<void>;
  validateSession: () => Promise<boolean>;
}

// Login credentials
export interface LoginCredentials {
  readonly email: string;
  readonly password: string;
}

// Error types
export interface AuthError {
  readonly message: string;
  readonly code?: string;
  readonly statusCode?: number;
}

// Permission utility functions type definitions
export type PermissionChecker = (
  user: LoginUser | null,
  permissionName: string,
  options?: PermissionCheckOptions,
) => boolean;

export type PermissionGroupChecker = (
  user: LoginUser | null,
  groupName: string,
  options?: PermissionCheckOptions,
) => boolean;

export type RoleChecker = (user: LoginUser | null, role: UserRole) => boolean;

// Auth storage keys
export const AUTH_STORAGE_KEYS = {
  ACCESS_TOKEN: "access_token",
  USER_DATA: "user_data",
  REFRESH_TOKEN: "refresh_token",
  TOKEN_EXPIRY: "token_expiry",
  VIEW_TYPE_STORAGE_KEY: "view_type",
} as const;

// Permission checking results
export interface PermissionCheckResult {
  readonly hasAccess: boolean;
  readonly missingPermissions?: string[];
  readonly missingGroups?: string[];
  readonly missingRoles?: UserRole[];
}

// Route access result
export interface RouteAccessResult extends PermissionCheckResult {
  readonly canAccess: boolean;
  readonly redirectTo?: string;
}

// Updated auth state with better typing
export interface EnhancedAuthState {
  // Core state
  user: LoginUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isInitialized: boolean;

  // Token state
  token: string | null;
  tokenExpiry: Date | null;

  // Actions with better typing
  login: (userData: LoginUser) => void;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<LoginUser>) => void;
  refreshToken: () => Promise<string | null>;

  // Enhanced permission helpers
  checkPermission: (
    permissionName: string,
    options?: PermissionCheckOptions,
  ) => PermissionCheckResult;

  checkPermissionGroup: (
    groupName: string,
    options?: PermissionCheckOptions,
  ) => PermissionCheckResult;

  checkMultiplePermissions: (
    permissions: string[],
    options?: PermissionCheckOptions,
  ) => PermissionCheckResult;

  // Route access
  checkRouteAccess: (route: string) => RouteAccessResult;
  getAccessibleRoutes: (routes: ProtectedRoute[]) => ProtectedRoute[];

  // User role detection (you might need to implement logic based on permissions)
  getUserRole: () => UserRole | null;
  hasRole: (role: UserRole) => boolean;
}

// Export utility type for type guards
export type AuthUser = NonNullable<AuthState["user"]>;

// Type guard functions
export const isAuthenticatedUser = (
  user: LoginUser | null,
): user is LoginUser => {
  return user !== null && !!user.access_token && !!user.user_id;
};

export const hasValidToken = (user: LoginUser | null): boolean => {
  return isAuthenticatedUser(user) && !!user.access_token;
};

// Default auth state
export const defaultAuthState: Omit<AuthState, keyof AuthActions> = {
  user: null,
  isLoading: false,
  isAuthenticated: false,
  isPasswordChanged: false,
  refreshTrigger: 0,
  refreshUser: async () => {},
  // Default implementations for missing methods
  hasPermission: () => false,
  hasPermissionGroup: () => false,
  hasAnyPermission: () => false,
  hasAnyPermissionGroup: () => false,
  getUserRole: () => null,
  hasRole: () => false,
  hasAnyRole: () => false,
  getAccessibleRoutes: () => [],
  canAccessRoute: () => false,
  getToken: () => null,
  isTokenValid: () => false,
};

export enum ViewType {
  Admin = "Admin View",
  Self = "Self View",
}

export enum OrganizationPlanStatus {
  TRIAL = "TRIAL",
  ACTIVE = "ACTIVE",
  UPCOMING = "UPCOMING",
  GRACE_PERIOD = "GRACE_PERIOD",
  EXPIRED = "EXPIRED",
  SUSPENDED = "SUSPENDED",
}
