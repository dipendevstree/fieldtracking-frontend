import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { useAuthStore } from "@/stores/use-auth-store";
import { StorageEnum } from "@/types";
import { setItem } from "@/utils/storage";

export const LIVE_BASE_URL =
  "https://userfieldtracking-api.devstree.in/api/v1/";

const liveTrackingInstance = axios.create({
  baseURL: LIVE_BASE_URL,
  timeout: 50000,
  headers: { "Content-Type": "application/json;charset=utf-8" },
});

interface ApiResponse<T> {
  statusCode: number;
  error: boolean;
  message?: string;
  messageCode?: string;
  data: T;
}

liveTrackingInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().getToken();
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

liveTrackingInstance.interceptors.response.use(
  <T>(res: AxiosResponse<ApiResponse<T>>) => {
    if (!res.data) throw new Error("Error in response");
    const { statusCode, error } = res.data;
    if ((statusCode === 200 || statusCode === 201) && !error) {
      return res;
    }
    throw new Error(res.data.message || "Unknown API error");
  },
  (error: AxiosError) => {
    const status = error.response?.status;
    if (status === 401) {
      setItem(StorageEnum.TOKEN, null);
      useAuthStore.getState().logout();
      window.localStorage.clear();
    }
    return Promise.reject(error);
  }
);

class LiveInstance {
  get<T>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<ApiResponse<T>>({ ...config, method: "GET" });
  }

  request<T>(config: AxiosRequestConfig): Promise<T> {
    return liveTrackingInstance.request<T>(config).then((res) => res.data);
  }
}

export default new LiveInstance();
