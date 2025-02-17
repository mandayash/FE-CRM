// src/types/auth.ts

// Base types for request structure
interface RequestMeta {
  action: "login" | "forgot_password" | "verify_otp" | "reset_password";
}

export interface BaseRequest<T> {
  meta: RequestMeta;
  data: T;
}

// Login types
export interface LoginData {
  email: string;
  password: string;
}

export type LoginRequest = BaseRequest<LoginData>;

export interface LoginResponse {
  token: string;
}

// Forgot password types
export interface ForgotPasswordData {
  email: string;
}

export type ForgotPasswordRequest = BaseRequest<ForgotPasswordData>;

export interface ForgotPasswordResponse {
  message: string;
}

// Verify OTP types
export interface VerifyOTPData {
  email: string;
  otp: string;
}

export type VerifyOTPRequest = BaseRequest<VerifyOTPData>;

export interface VerifyOTPResponse {
  message: string;
}

// Reset password types
export interface ResetPasswordData {
  email: string;
  new_password: string;
  confirm_password: string;
}

export type ResetPasswordRequest = BaseRequest<ResetPasswordData>;

export interface ResetPasswordResponse {
  message: string;
}
