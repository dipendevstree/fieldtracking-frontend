import { FilterConfig } from "@/components/global-filter-section";
import { TRoleFormSchema } from "../data/roles-schema";

// Role interface
interface Role {
  role_id: string;
  name: string;
}

// Merchant interface
interface Merchant {
  merchant_id: string;
  user_id: string;
  name: string;
  email: string;
  mobile: string;
  profile_pic: string;
  gender: "male" | "female" | "other" | string;
  language: string;
  status: boolean;
  created_at: string;
  updated_at: string;
  role: Role;
}

// API Response interface
interface MerchantResponse {
  list: Merchant[];
  totalCount: number;
}
``;
interface CommonResponse {
  list: any[];
  totalCount: number;
}

// For pagination and filtering
interface MerchantListParams {
  page?: number;
  limit?: number;
  search?: string;
}

interface PaginatedMerchantResponse extends MerchantResponse {
  page?: number;
  limit?: number;
  total_pages?: number;
  has_next_page?: boolean;
  has_prev_page?: boolean;
}

export interface MerchantForm {
  name?: string;
  email?: string;
  mobile?: string;
  gender?: string;
  password?: string;
  user_name?: string;
  merchant_id?: string;
}

// Export all types
export type {
  Merchant,
  MerchantListParams,
  MerchantResponse,
  PaginatedMerchantResponse,
  CommonResponse,
  Role,
};

export type ErrorResponse = {
  response?: {
    data?: {
      statusCode?: number;
      message?: string;
    };
  };
};

export interface MenuItem {
  organizationMenuId: string;
  menuName: string;
  menuKey: string;
  parentId?: string | null;
  isParent: boolean;
  hasChildren?: boolean;
  children?: MenuItem[];
  level: number;
}

export interface Permission {
  permissionId: string;
  roleId: string;
  organizationId: string;
  organizationMenuId: string;
  viewOwn: boolean;
  viewGlobal: boolean;
  add: boolean;
  edit: boolean;
  delete: boolean;
  createdDate: string;
  modifiedDate: string;
  deletedDate: string | null;
  createdBy: string;
  updatedBy: string | null;
  organizationMenu: {
    organizationMenuId: string;
    menuName: string;
    menuKey: string;
    parentMenuId: string | null;
    organizationId: string;
    masterMenuId: string;
    createdBy: string;
    updatedBy: string | null;
    isActive: boolean;
    deletedDate: string | null;
    createdDate: string;
    modifiedDate: string;
  };
}

export interface OrganizationMenu {
  organizationMenuId: string;
  menuName: string;
  menuKey: string;
  parentMenuId: string | null;
  organizationId: string;
  masterMenuId: string;
  createdBy: string;
  updatedBy: string | null;
  isActive: boolean;
  deletedDate: string | null;
  createdDate: string;
  modifiedDate: string;
}

export interface Props {
  currentRow?: Partial<TRoleFormSchema>;
  isEdit?: boolean;
}

export interface SearchFilterConfig extends FilterConfig {
  type: "search";
  placeholder: string;
  value: string | undefined;
  onChange: (value: string | undefined) => void;
}

export interface SelectFilterConfig extends FilterConfig {
  type: "select";
  placeholder: string;
  value: string | undefined;
  onChange: (value: string | undefined) => void;
  options: { label: string; value: string }[];
}
