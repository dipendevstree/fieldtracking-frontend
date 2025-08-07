import API from "@/config/api/api";
import usePostData from "@/hooks/use-post-data";

export const useForgotPassword = (onSuccess?: (data: any) => void) => {
  return usePostData({
    url: API.auth.forgotPassword,
    onSuccess: (data: any) => {
      if (onSuccess) {
        onSuccess(data);
      }
    },
  });
};

export const useResetPassword = (onSuccess?: (data: any) => void) => {
  return usePostData({
    url: API.auth.resetPassword,
    onSuccess: (data: any) => {
      if (onSuccess) {
        onSuccess(data);
      }
    },
  });
};
