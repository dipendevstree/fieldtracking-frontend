import {
  UseMutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import instance from "@/config/instance/instance";
import { EnhancedError } from "@/types";
import { toast } from "sonner";
import { extractErrorInfo } from "@/utils/error-response";
import { TOAST_CONFIG } from "@/data/app.data";

interface PatchDataOptions<TData, TVariables> {
  url: string;
  refetchQueries?: string[];
  headers?: Record<string, string>;
  token?: string;
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

const usePatchData = <TData = unknown, TVariables = unknown>({
  url,
  refetchQueries = [],
  headers,
  mutationOptions,
  onSuccess,
  onError,
  token,
  skipToast = false,
  toastDuration = TOAST_CONFIG.duration,
  toastPosition = TOAST_CONFIG.position,
}: PatchDataOptions<TData, TVariables>) => {
  const queryClient = useQueryClient();

  return useMutation<TData, Error, TVariables>({
    mutationFn: async (variables: TVariables): Promise<TData> => {
      const response = await instance.patch({
        url,
        data: variables,
        headers,
        customToken: token,
      });

      if (response?.statusCode === 200) {
        if (!skipToast)
          toast.success(response?.message || "Data updated successfully", {
            position: toastPosition,
            duration: toastDuration,
          });
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

export default usePatchData;
