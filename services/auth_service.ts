import {
  LoginRequest,
  LoginResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  VerifyOTPRequest,
  VerifyOTPResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
} from "@/types/auth";

const BASE_URL = "http://localhost:8080";

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  },

  setToken: (token: string): void => {
    // Store in localStorage
    localStorage.setItem("auth_token", token);

    // Also set in cookie for middleware
    document.cookie = `auth_token=${token}; path=/; max-age=1800`;
  },

  getToken: (): string | null => {
    return localStorage.getItem("auth_token");
  },

  removeToken: (): void => {
    try {
      localStorage.removeItem("auth_token");
      document.cookie =
        "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax";
    } catch (error) {
      console.error("Error removing token:", error);
    }
  },

  logout: async (): Promise<void> => {
    try {
      authService.removeToken();
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout error:", error);
    }
  },

  // Forgot Password
  forgotPassword: async (
    data: ForgotPasswordRequest
  ): Promise<ForgotPasswordResponse> => {
    try {
      const response = await fetch(`${BASE_URL}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to send reset request");
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  // Verify OTP
  verifyOTP: async (data: VerifyOTPRequest): Promise<VerifyOTPResponse> => {
    try {
      const response = await fetch(`${BASE_URL}/auth/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to verify OTP");
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  // Reset Password
  resetPassword: async (
    data: ResetPasswordRequest
  ): Promise<ResetPasswordResponse> => {
    try {
      const response = await fetch(`${BASE_URL}/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to reset password");
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },
};
