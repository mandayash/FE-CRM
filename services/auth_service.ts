import { LoginRequest, LoginResponse } from "@/types/auth";

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
};
