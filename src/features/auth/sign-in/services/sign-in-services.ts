import API from "@/config/api/api";
import usePostData from "@/hooks/use-post-data";
import { LoginUser } from "../types";
import usePatchData from "@/hooks/use-patch-data";

export const useLogin = (onSuccess: (data: LoginUser) => void) => {
  return usePostData({
    url: API.auth.login,
    onSuccess: (data: LoginUser) => {
      onSuccess(data);
    },
  });
};

export const useSendOpt = (onSuccess: (data: any) => void) => {
  return usePostData({
    url: API.auth.sendOtp,
    onSuccess: (data: any) => {
      onSuccess(data);
    },
  });
};
export const useAdminLogin = (
  onSuccess: (data: any) => void,
  onFailure: (error: any) => void,
) => {
  return usePostData({
    url: API.auth.adminLogin,
    onSuccess: (data: any) => {
      onSuccess(data);
    },
    onError: (error: any) => {
      onFailure(error);
    },
  });
};

export const useSetPassword = (onSuccess: (data: any) => void) => {
  return usePostData({
    url: API.auth.setPassword,
    onSuccess: (data: any) => {
      onSuccess(data);
    },
  });
};

export const useLogout = (onSuccess: (data: any) => void) => {
  return usePostData({
    url: API.auth.logout,
    onSuccess: (data: any) => {
      onSuccess(data);
    },
  });
};

export const useLogoutDevice = (id: string, onSuccess: (data: any) => void) => {
  return usePatchData({
    url: `${API.userDevice.logoutFromOtherDevices}/${id}`,
    onSuccess: (data: any) => {
      onSuccess(data);
    },
  });
};
