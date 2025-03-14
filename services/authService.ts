import apiClient from "@/lib/api";
import {
  AdminCredentials,
  AdminRegisterData,
  AuthResponse,
} from "@/types/auth";
import { User } from "@/types/user";

export const authService = {
  login: async (credentials: AdminCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post("/auth/admin/login", credentials);
    return response.data;
  },

  register: async (data: AdminRegisterData): Promise<AuthResponse> => {
    const response = await apiClient.post("/auth/admin/register", data);
    return response.data;
  },

  verifyOtp: async (
    code: string,
    newPassword: string
  ): Promise<{ message: string }> => {
    const response = await apiClient.post("/auth/admin/verify-otp", {
      code,
      new_password: newPassword,
    });
    return response.data;
  },

  validateToken: async (): Promise<{ valid: boolean }> => {
    const response = await apiClient.get("/validate");
    return response.data;
  },

  getProfile: async (userId: number): Promise<User> => {
    const response = await apiClient.get(`/users/${userId}`);
    return response.data;
  },

  getUserIdFromToken: (token: string): number => {
    try {
      const payload = token.split(".")[1];
      const decodedPayload = atob(payload);
      const parsedPayload = JSON.parse(decodedPayload);
      return parsedPayload.user_id || parsedPayload.userId || parsedPayload.sub;
    } catch (error) {
      console.error("Error decoding token:", error);
      return 0;
    }
  },

  // Request reset password (langkah 1)
  requestResetPassword: async (email: string): Promise<{ message: string }> => {
    try {
      // Gunakan URL lengkap atau apiClient dengan baseURL yang benar
      // Atau jika menggunakan apiClient:
      const response = await apiClient.post("/auth/admin/reset-password", {
        email,
      });
      return response.data;
    } catch (error) {
      console.error("Error requesting reset password:", error);
      throw error;
    }
  },

  // Verify OTP and set new password (langkah 2)
  verifyOtpAndResetPassword: async (
    code: string,
    new_password: string
  ): Promise<{ message: string }> => {
    try {
      // Gunakan URL lengkap atau apiClient dengan baseURL yang benar
      // Atau jika menggunakan apiClient:
      const response = await apiClient.post("/auth/admin/verify-otp", {
        code,
        new_password,
      });
      return response.data;
    } catch (error) {
      console.error("Error verifying OTP:", error);
      throw error;
    }
  },
};
