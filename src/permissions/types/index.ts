import { ViewType } from "@/components/layout/types";

export interface Permission {
  organizationMenuId: string;
  menuName: string;
  menuKey: string;
  parentMenuId: string | null;
  add: boolean;
  edit: boolean;
  viewOwn: boolean;
  viewGlobal: boolean;
  delete: boolean;
  children: Permission[];
}

export interface Role {
  roleId: string;
  roleName: string;
  createdBy: string | null;
  superAdminCreatedBy: string;
  updatedBy: string | null;
  isActive: boolean;
  organizationID: string;
  deletedDate: string | null;
  createdDate: string;
  modifiedDate: string;
  permissions: Permission[];
}

export interface LoginUser {
  name: string;
  email: string;
  avatar: string;
  role?: Role;
  permissions?: Permission[];
}

export interface SidebarItem {
  title: string;
  url?: string;
  icon?: any;
  items?: SidebarItem[];
  menuKey?: string; // Add menu key for permission checking
  requiredPermissions?: string[]; // Alternative: array of required permissions
  viewType?: ViewType | null;
}

export interface SidebarData {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
  teams: Array<{
    name: string;
    logo: any;
    plan: string;
  }>;
  navGroups: Array<{
    title: string;
    items: SidebarItem[];
  }>;
}
