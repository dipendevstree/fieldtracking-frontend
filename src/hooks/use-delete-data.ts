import instance from "@/config/instance/instance";
import { EnhancedError } from "@/types";
import { extractErrorInfo } from "@/utils/error-response";
import {
  UseMutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { TOAST_CONFIG } from "@/data/app.data";

interface DeleteDataOptions<TData, TVariables = void> {
  url: string;
  refetchQueries?: string[];
  onSuccess?: (data: TData) => void;
  onError?: (error: EnhancedError) => void;
  mutationOptions?: UseMutationOptions<TData, Error, TVariables>;
  skipToast?: boolean;
  toastDuration?: number;
  toastPosition?:
    | "top-center"
    | "top-right"
    | "top-left"
    | "bottom-center"
    | "bottom-right"
    | "bottom-left";
}

const useDeleteData = <TData = unknown, TVariables = void>({
  url,
  refetchQueries = [],
  mutationOptions,
  onSuccess,
  onError,
  skipToast = false,
  toastDuration = TOAST_CONFIG.duration,
  toastPosition = TOAST_CONFIG.position,
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
            position: toastPosition,
            duration: toastDuration,
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
        queryClient.invalidateQueries({ queryKey: [query] }),
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
          position: toastPosition,
          duration: TOAST_CONFIG.errorDuration,
        });

      if (onError) {
        onError(error);
      }
    },
    ...mutationOptions,
  });
};

export default useDeleteData;
