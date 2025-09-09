import API from "@/config/api/api";
import useFetchData from "@/hooks/use-fetch-data";
import usePostData from "@/hooks/use-post-data";
import useDeleteData from "@/hooks/use-delete-data";
import usePatchData from "@/hooks/use-patch-data";
import { ExpenseLimit } from "../type/type";

const LIMITS_CONTROLS_QUERY = API.expenseLimit.list;

export interface IListParams {
  sort?: string;
  limit: number;
  page: number;
  searchFor?: string;
  [key: string]: unknown;
}

// Expense Limits
export interface ExpenseLimitPayload {
  tierKey: string;
  expenseCategoryId: string;
  dailyLimit: number;
  monthlyLimit: number;
  isActive: boolean;
}

export interface ExpenseLimitResponse {
  data: ExpenseLimit;
  message: string;
  statusCode: number;
}

export const useCreateExpenseLimit = (onSuccess?: () => void) => {
  return usePostData<ExpenseLimitResponse, ExpenseLimitPayload>({
    url: API.expenseLimit.create,
    refetchQueries: [LIMITS_CONTROLS_QUERY],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess()
      }
    },
  })
}

export const useUpdateExpenseLimit = (id: string, onSuccess?: () => void) => {
  return usePatchData<ExpenseLimitResponse, ExpenseLimitPayload>({
    url: `${API.expenseLimit.update}/${id}`,
    refetchQueries: [LIMITS_CONTROLS_QUERY],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess()
      }
    },
  })
}

export const useDeleteExpenseLimit = (id: string, onSuccess?: () => void) => {
  const deleteHook = useDeleteData({
    url: id ? `${API.expenseLimit.delete}/${id}` : API.expenseLimit.delete,
    refetchQueries: [LIMITS_CONTROLS_QUERY],
    onSuccess: () => {
      if (onSuccess && id) onSuccess()
    },
  })
  if (!id) {
    return {
      ...deleteHook,
      mutate: () => {
      },
    }
  }
  return deleteHook
}

// Data fetching hooks
export interface LimitsControlsListResponse {
  list: ExpenseLimit[];
  totalCount: number;
}

export const useGetLimitsControlsData = (
  params: IListParams,
  options?: { enabled?: boolean }
) => {
  const query = useFetchData<LimitsControlsListResponse>({
    url: LIMITS_CONTROLS_QUERY,
    params,
    enabled: options?.enabled ?? true,
  });

  return {
    ...query,
    expenseLimits: query.data?.list ?? [],
    totalCount: query.data?.totalCount ?? 0,
    isLoading: query.isLoading,
    error: query.error,
};
};