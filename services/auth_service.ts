import {
  LoginData,
  LoginResponse,
  ForgotPasswordData,
  ForgotPasswordResponse,
  VerifyOTPData,
  VerifyOTPResponse,
  ResetPasswordData,
  ResetPasswordResponse,
} from "@/types/auth";

const BASE_URL = "http://localhost:8080";

export const authService = {
  login: async (credentials: LoginData): Promise<LoginResponse> => {
    try {
      const response = await fetch(`${BASE_URL}/auth`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          meta: {
            action: "login",
          },
          data: credentials,
        }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  forgotPassword: async (
    data: ForgotPasswordData
  ): Promise<ForgotPasswordResponse> => {
    try {
      const response = await fetch(`${BASE_URL}/auth`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          meta: {
            action: "forgot_password",
          },
          data,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send reset request");
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  verifyOTP: async (data: VerifyOTPData): Promise<VerifyOTPResponse> => {
    try {
      const response = await fetch(`${BASE_URL}/auth`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          meta: {
            action: "verify_otp",
          },
          data,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to verify OTP");
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  resetPassword: async (
    data: ResetPasswordData
  ): Promise<ResetPasswordResponse> => {
    try {
      const response = await fetch(`${BASE_URL}/auth`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          meta: {
            action: "reset_password",
          },
          data,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to reset password");
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  // Token management methods remain the same
  setToken: (token: string): void => {
    localStorage.setItem("auth_token", token);
    document.cookie = `auth_token=${token}; path=/; max-age=86400`;
  },

  getToken: (): string | null => {
    return localStorage.getItem("auth_token");
  },

  removeToken: (): void => {
    localStorage.removeItem("auth_token");
    document.cookie =
      "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem("auth_token");
  },

  logout: (): void => {
    try {
      // Remove token from both localStorage and cookie
      localStorage.removeItem("auth_token");
      document.cookie =
        "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    } catch (error) {
      console.error("Logout error:", error);
    }
  },
};
