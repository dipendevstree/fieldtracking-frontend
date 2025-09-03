import useFetchData from "@/hooks/use-fetch-data";
import usePostData from "@/hooks/use-post-data";
import useDeleteData from "@/hooks/use-delete-data";
import usePatchData from "@/hooks/use-patch-data";
import { ExpenseLimit } from "../type/type";
import { toast } from "sonner";

const LIMITS_CONTROLS_QUERY = "expenseLimits/list";

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

export const useCreateExpenseLimit = () => {
  return usePostData<ExpenseLimitResponse, ExpenseLimitPayload>({
    url: "expenseLimits/create",
    refetchQueries: [LIMITS_CONTROLS_QUERY],
    onSuccess: () => {
      console.log("Expense limit created successfully, refetching data...");
      toast.success("Expense limit created successfully!");
    },
    onError: (error) => {
      console.error("Error creating expense limit:", error);
      toast.error("Failed to create expense limit. Please try again.");
    },
  });
};

export const useUpdateExpenseLimit = (id: string) => {
  if (!id) {
    return {
      mutate: () => {
        toast.error("Cannot update: Expense limit ID is missing");
      },
      isPending: false,
      isSuccess: false,
      isError: false,
    };
  }

  return usePatchData<ExpenseLimitResponse, ExpenseLimitPayload>({
    url: `expenseLimits/patch/${id}`,
    refetchQueries: [LIMITS_CONTROLS_QUERY],
    onSuccess: () => {
      toast.success("Expense limit updated successfully!");
    },
    onError: () => {
      toast.error("Failed to update expense limit. Please try again.");
    },
  });
};

export const useDeleteExpenseLimit = (id: string) => {
  if (!id) {
    return {
      mutate: () => {
        toast.error("Cannot delete: Expense limit ID is missing");
      },
      isPending: false,
      isSuccess: false,
      isError: false,
    };
  }

  return useDeleteData({
    url: `expenseLimits/delete/${id}`,
    refetchQueries: [LIMITS_CONTROLS_QUERY],
    onSuccess: () => {
      toast.success("Expense limit deleted successfully!");
    },
    onError: () => {
      toast.error("Failed to delete expense limit. Please try again.");
    },
  });
};

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
