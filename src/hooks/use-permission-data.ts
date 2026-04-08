import instance from "@/config/instance/instance";
import { EnhancedError } from "@/types";
import { extractErrorInfo } from "@/utils/error-response";
import { useMutation } from "@tanstack/react-query";
import API from "@/config/api/api";
import { toast } from "sonner";
import { TOAST_CONFIG } from "@/config/toastConfig";

export const usePermissionData = ({
  onSuccess,
  onError,
  toastPosition = TOAST_CONFIG.position,
  toastDuration = TOAST_CONFIG.duration,
}: {
  onSuccess?: (data: any) => void;
  onError?: (error: EnhancedError) => void;
  toastPosition?:
    | "top-center"
    | "top-right"
    | "top-left"
    | "bottom-center"
    | "bottom-right"
    | "bottom-left";
  toastDuration?: number;
}) => {
  return useMutation({
    mutationFn: async () => {
      const response = await instance.get({
        url: API.auth.getPermissions,
      });

      if (response?.statusCode === 200) {
        return response.data;
      }

      const errorMessage = response?.message || "Failed to fetch data";
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
    onSuccess: (data: any) => {
      if (onSuccess) {
        onSuccess(data);
      }
    },
    onError: (error: EnhancedError) => {
      const errorInfo = extractErrorInfo(error);
      // Display user-friendly toast notification
      toast.error(errorInfo.message, {
        duration: toastDuration,
        position: toastPosition,
      });

      // Call additional error handler if provided
      if (onError) {
        onError(error);
      }
    },
  });
};
