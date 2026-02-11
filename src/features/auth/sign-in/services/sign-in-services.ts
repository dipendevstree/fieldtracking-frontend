import API from "@/config/api/api";
import usePostData from "@/hooks/use-post-data";
import { LoginUser } from "../types";

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
export const useAdminLogin = (onSuccess: (data: any) => void, onFailure: (error: any) => void) => {
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
