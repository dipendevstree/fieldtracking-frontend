import instance from "@/config/instance/instance";
import { EnhancedError } from "@/types";
import { extractErrorInfo } from "@/utils/error-response";
import {
  UseMutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { TOAST_CONFIG } from "@/config/toastConfig";

interface PatchDataOptions<TData, TVariables> {
  url: string;
  refetchQueries?: string[];
  headers?: Record<string, string>;
  onSuccess?: (data: TData) => void;
  onError?: (error: EnhancedError) => void;
  mutationOptions?: UseMutationOptions<TData, Error, TVariables>;
  toastDuration?: number;
  toastPosition?:
    | "top-center"
    | "top-right"
    | "top-left"
    | "bottom-center"
    | "bottom-right"
    | "bottom-left";
}

const usePutData = <TData = unknown, TVariables = unknown>({
  url,
  refetchQueries = [],
  headers,
  mutationOptions,
  onSuccess,
  onError,
  toastDuration = TOAST_CONFIG.duration,
  toastPosition = TOAST_CONFIG.position,
}: PatchDataOptions<TData, TVariables>) => {
  const queryClient = useQueryClient();

  return useMutation<TData, Error, TVariables>({
    mutationFn: async (variables: TVariables) => {
      const response = await instance.put({ url, data: variables, headers });

      if (response?.statusCode === 200) {
        return response.data as TData;
      }

      const errorMessage = response?.message || "Failed to update data";
      const error = new Error(errorMessage);

      if (response?.statusCode === 400) {
        throw Object.assign(error, { statusCode: 400 });
      }
      if (response?.statusCode === 401) {
        throw Object.assign(error, {
          statusCode: 401,
          message: "Unauthorized",
        });
      }

      throw error;
    },
    onSuccess: (data: TData) => {
      refetchQueries.forEach((query) =>
        queryClient.invalidateQueries({ queryKey: [query] }),
      );
      if (onSuccess) {
        onSuccess(data);
      }
      toast.success("Data updated successfully", {
        position: toastPosition,
        duration: toastDuration,
      });
    },
    onError: (error: EnhancedError) => {
      const errorInfo = extractErrorInfo(error);
      // Display user-friendly toast notification
      toast.error(errorInfo.message, {
        position: toastPosition,
        duration: toastDuration,
      });

      // Call additional error handler if provided
      if (onError) {
        onError(error);
      }
    },
    ...mutationOptions,
  });
};

export default usePutData;
