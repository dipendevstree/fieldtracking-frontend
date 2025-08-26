import API from "@/config/api/api";
import useFetchData from "@/hooks/use-fetch-data";
import usePatchData from "@/hooks/use-patch-data";
import usePostData from "@/hooks/use-post-data";
import useDeleteData from "@/hooks/use-delete-data";
import { Customer } from "../types";

const CUSTOMERS_QUERY = API.customerMain.list;
const CUSTOMER_STATUS_COUNTS_QUERY = API.customerMain.statusCounts;

// Define create customer payload type
export interface CreateCustomerPayload {
  companyName: string;
  phoneNumber: string;
  industryId?: string;
  customerTypeId?: string;
  streetAddress?: string;
  city?: string;
  state?: string;
  zipCode?: number;
  latitude?: number;
  longitude?: number;
  country?: string;
  customerContacts: Array<{
    customerName: string;
    email: string;
    designation?: string;
    phoneNumber: string;
    isPrimary: boolean;
    assignUserId?: string | null;
  }>;
}

export interface IListParams {
  sort?: string;
  limit: number;
  page: number;
  search?: string;
  status?: string;
  customerTypeId?: string;
  [key: string]: unknown;
}

interface CustomerStatusCounts {
  customerStatusCounts: Record<string, number>;
  totalCustomers: number;
}

interface EmployeeRange {
  employeeRangeId: string;
  employeeRange: string;
}

interface Industry {
  industryId: string;
  industryName: string;
}

interface CustomerFilter {
  customerTypeId: string;
  typeName: string;
}

interface Menu {
  menuId: string;
  menuName: string;
  parentMenuId?: string;
}

export const useGetCustomers = (params: IListParams) => {
  const query = useFetchData<{ list: Customer[]; totalCount: number }>({
    url: CUSTOMERS_QUERY,
    params,
  });

  return {
    ...query,
    Customer: query.data?.list ?? [],
    totalCount: query.data?.totalCount ?? 0,
    isLoading: query.isLoading,
    error: query.error,
  };
};

export const useCustomerStatusCounts = () => {
  const query = useFetchData<CustomerStatusCounts>({
    url: CUSTOMER_STATUS_COUNTS_QUERY,
  });
  return {
    ...query,
    customerStatusCounts: query.data?.customerStatusCounts ?? {},
    totalCustomers: query.data?.totalCustomers ?? 0,
    isLoading: query.isLoading,
    error: query.error,
  };
};

export const useGetEmployeeRange = () => {
  const query = useFetchData<{ list: EmployeeRange[]; totalCount: number }>({
    url: API.employeeRange.list,
  });
  return {
    ...query,
    data: query.data?.list,
    totalCount: query.data?.totalCount ?? 0,
    isLoading: query.isLoading,
    error: query.error,
  };
};

export const useGetIndustry = () => {
  const query = useFetchData<{ list: Industry[]; totalCount: number }>({
    url: API.industry.list,
  });
  return {
    ...query,
    data: query.data?.list,
    totalCount: query.data?.totalCount ?? 0,
    isLoading: query.isLoading,
    error: query.error,
  };
};

export const useGetCustomerFilter = () => {
  const query = useFetchData<{ list: CustomerFilter[]; totalCount: number }>({
    url: API.customerType.list,
  });
  return {
    ...query,
    data: query.data?.list,
    totalCount: query.data?.totalCount ?? 0,
    isLoading: query.isLoading,
    error: query.error,
  };
};

export const useGetMenu = () => {
  const query = useFetchData<{ list: Menu[]; totalCount: number }>({
    url: API.menu.list,
  });
  return {
    ...query,
    data: query.data?.list,
    totalCount: query.data?.totalCount ?? 0,
    isLoading: query.isLoading,
    error: query.error,
  };
};

export const useGetUsersByRole = (roleId: string, enabled: boolean = false) => {
  const query = useFetchData<any>({
    url: API.users.list,
    params: { roleId },
    enabled: enabled && !!roleId,
  });
  return {
    ...query,
    data: query.data?.list ?? [],
    totalCount: query.data?.totalCount ?? 0,
    isLoading: query.isLoading,
    error: query.error,
  };
};

export const useCreateCustomer = (onSuccess?: () => void) => {
  return usePostData<CreateCustomerPayload, any>({
    url: API.customerMain.create,
    refetchQueries: [CUSTOMERS_QUERY, CUSTOMER_STATUS_COUNTS_QUERY],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }
    },
  });
};

export const useGetCustomerById = (customerId: string, enabled: boolean) => {
  const query = useFetchData<any>({
    url: `${API.customerMain.getCustomerById}/${customerId}`,
    enabled,
  });
  return {
    ...query,
    Customer: query.data ?? {},
    totalCount: query.data?.totalCount ?? 0,
    isLoading: query.isLoading,
    error: query.error,
  };
};

export const useUpdateCustomer = (
  customerId: string,
  onSuccess?: () => void
) => {
  return usePatchData({
    url: `${API.customerMain.update}/${customerId}`,
    refetchQueries: [CUSTOMERS_QUERY],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }
    },
  });
};

export const useDeleteCustomer = (
  customerId: string,
  onSuccess?: () => void
) => {
  return useDeleteData({
    url: `${API.customerMain.delete}/${customerId}`,
    refetchQueries: [CUSTOMERS_QUERY, CUSTOMER_STATUS_COUNTS_QUERY],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }
    },
  });
};
