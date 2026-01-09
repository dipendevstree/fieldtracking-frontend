import instance from "@/config/instance/instance";
import { EnhancedError } from "@/types";
import { extractErrorInfo } from "@/utils/error-response";
import {
  UseMutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

interface DeleteDataOptions<TData, TVariables = void> {
  url: string;
  refetchQueries?: string[];
  onSuccess?: (data: TData) => void;
  onError?: (error: EnhancedError) => void;
  mutationOptions?: UseMutationOptions<TData, Error, TVariables>;
  skipToast?: boolean;
}

const useDeleteData = <TData = unknown, TVariables = void>({
  url,
  refetchQueries = [],
  mutationOptions,
  onSuccess,
  onError,
  skipToast = false,
}: DeleteDataOptions<TData, TVariables>) => {
  const queryClient = useQueryClient();

  return useMutation<TData, Error, TVariables>({
    mutationFn: async (variables?: TVariables): Promise<TData> => {
      const response = await instance.delete({
        url,
        data: variables,
      });

      if (response?.statusCode === 200) {
        if (!skipToast)
          toast.success(response.message || "Deleted successfully", {
            position: "top-center",
            duration: 2000,
          });
        return response.data as TData;
      }

      const errorMessage = response?.message || "Failed to delete data";
      if (response?.statusCode === 400) {
        throw Object.assign(new Error(errorMessage), { statusCode: 400 });
      }
      if (response?.statusCode === 401) {
        throw Object.assign(new Error("Unauthorized"), { statusCode: 401 });
      }

      throw new Error(errorMessage);
    },
    onSuccess: (data) => {
      refetchQueries.forEach((query) =>
        queryClient.invalidateQueries({ queryKey: [query] })
      );
      if (onSuccess) {
        onSuccess(data);
      }
    },
    onError: (error: EnhancedError) => {
      const errorInfo = extractErrorInfo(error);
      if (!skipToast)
        toast.error(errorInfo.title, {
          description: errorInfo.description,
          duration: errorInfo.duration,
          position: "top-right",
        });

      if (onError) {
        onError(error);
      }
    },
    ...mutationOptions,
  });
};

export default useDeleteData;
