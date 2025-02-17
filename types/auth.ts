// Authentication Request Types
export interface LoginRequest {
  email: string;
  password: string;
}

// Authentication Response Types
export interface LoginResponse {
  token: string;
}

// User Types (can be expanded based on your needs)
export interface User {
  email: string;
  // Add other user fields as needed
}

// Auth State Types
export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
}

// Forgot Password Types
export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

// Verify OTP Types
export interface VerifyOTPRequest {
  email: string;
  otp: string;
}

export interface VerifyOTPResponse {
  message: string;
}

// Reset Password Types
export interface ResetPasswordRequest {
  email: string;
  new_password: string;
  confirm_password: string;
}

export interface ResetPasswordResponse {
  message: string;
}
