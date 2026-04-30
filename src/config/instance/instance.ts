import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { StorageEnum } from "@/types";
import { useAuthStore } from "@/stores/use-auth-store";
import { setItem } from "@/utils/storage";
import { ENV } from "../env";

export const BASE_URL = ENV.API_URL;
// export const BASE_URL = 'http://localhost:4001/api/v1'
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 50000,
  headers: { "Content-Type": "application/json;charset=utf-8" },
});

// Define a general API response structure
interface ApiResponse<T> {
  statusCode: number;
  error: boolean;
  message?: string;
  messageCode?: string;
  data: T;
}

// Extend AxiosRequestConfig to allow passing a custom token
export interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  customToken?: string;
}

// Interceptor for request
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Use the custom token if provided in config
    const customConfig = config as CustomAxiosRequestConfig;
    const token =
      customConfig.customToken || useAuthStore.getState().getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (config.data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    } else if (config.data) {
      config.headers["Content-Type"] = "application/json;charset=utf-8";
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  <T>(res: AxiosResponse<ApiResponse<T>>) => {
    if (!res.data) throw new Error("Error in response");
    const { statusCode, error } = res.data;
    const hasSuccess =
      (statusCode === 200 || statusCode === 201) && error === false;
    if (hasSuccess) {
      return res;
    }
    throw new Error(res.data.message || "Unknown API error");
  },
  (error: AxiosError) => {
    const status = error.response?.status;
    if (status === 401) {
      setItem(StorageEnum.TOKEN, null);
      useAuthStore.getState().logout();
      // window.localStorage.clear(); // Prevent to delete deviceId value
    }

    if (!error.response) {
      return Promise.reject({
        response: {
          data: {
            statusCode: 500,
            error: true,
            message: "Something went wrong. Please try again later.",
            data: null,
          },
        },
      });
    }

    return Promise.reject(error);
  },
);

class Instance {
  get<T>(config: CustomAxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<ApiResponse<T>>({ ...config, method: "GET" });
  }

  post<T>(config: CustomAxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<ApiResponse<T>>({ ...config, method: "POST" });
  }

  put<T>(config: CustomAxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<ApiResponse<T>>({ ...config, method: "PUT" });
  }

  patch<T>(config: CustomAxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<ApiResponse<T>>({ ...config, method: "PATCH" });
  }

  delete<T>(config: CustomAxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<ApiResponse<T>>({ ...config, method: "DELETE" });
  }

  request<T>(config: CustomAxiosRequestConfig): Promise<T> {
    return axiosInstance.request<T>(config).then((res) => res.data);
  }
}

export default new Instance();
