import { LoginUser as BaseLoginUser } from "@/components/layout/types";

export interface LoginRequest {
  readonly email: string;
  readonly password: string;
}

// User data structure from login response
export type LoginUser = BaseLoginUser;

// Complete login response structure
export interface LoginResponse {
  readonly data: LoginUser;
  readonly message?: string;
  readonly success?: boolean;
}
