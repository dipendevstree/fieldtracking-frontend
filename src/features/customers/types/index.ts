// Role interface
interface Role {
  role_id: string
  name: string
}

// Merchant interface
interface Merchant {
  merchant_id: string
  user_id: string
  name: string
  email: string
  mobile: string
  profile_pic: string
  gender: 'male' | 'female' | 'other' | string
  language: string
  status: boolean
  created_at: string
  updated_at: string
  role: Role
}

// API Response interface
interface MerchantResponse {
  list: Merchant[]
  totalCount: number
}

interface CommonResponse<T = unknown> {
  list: T[]
  totalCount: number
}

// For pagination and filtering
interface MerchantListParams {
  page?: number
  limit?: number
  search?: string
}

interface PaginatedMerchantResponse extends MerchantResponse {
  page?: number
  limit?: number
  total_pages?: number
  has_next_page?: boolean
  has_prev_page?: boolean
}

export interface MerchantForm {
  name?: string
  email?: string
  mobile?: string
  gender?: string
  password?: string
  user_name?: string
  merchant_id?: string
}

// Define the dialog types
export type DialogType = 'add' | 'edit' | 'delete' | null

// Customer filters interface
export interface CustomerFilters {
  search: string
  status: string
  customerTypeId: string
}

// Customer store state interface
export interface CustomerStoreState {
  open: DialogType
  setOpen: (open: DialogType) => void
  currentRow: Customer | null
  setCurrentRow: (row: Customer | null) => void
  filters: CustomerFilters
  setFilters: (filters: Partial<CustomerFilters>) => void
}

export interface Customer {
  customerId: string
  CustomerName: string
  industry: {
    industryId: string
    industryName: string
  }
  employeeRange: {
    employeeRangeId: string
    employeeRange: string
  }
  adminData?: {
    firstName: string
    lastName: string
    email: string
    phoneNumber: string
  }
  adminName: string
  adminEmail: string
  adminPhone: string
  adminJobTitle?: string
  adminPhoneCountryCode?: string
  isActive: boolean
  userCount: number
  createdDate: string
  menuIds: string[]
  is_separate_schema: boolean
}

export interface CustomerResponse {
  list: Customer[]
  totalCount: number
}

export interface CustomerListParams {
  page?: number
  limit?: number
  search?: string
  status?: string
  customerTypeId?: string
}

export interface ErrorResponse {
  response?: {
    data?: {
      statusCode?: number
      message?: string
    }
  }
}

// Export all types
export type {
  Merchant,
  MerchantListParams,
  MerchantResponse,
  PaginatedMerchantResponse,
  CommonResponse,
  Role,
}
