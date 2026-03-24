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

export interface Plan {
  id: string;
  name: string;
}

export interface PlanAssignmentPayload {
  planId: string;
  planStartDate: string;
  frequency: string;
  notes: string;
}

export interface SuspendPayload {
  suspendReason: string;
}

export interface ExtendGracePeriodPayload {
  extendByDays: number;
  notes: string;
}
