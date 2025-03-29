// services/userService.ts
import apiClient from "@/lib/api";

export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  created_at: string;
  updated_at: string;
  points?: number;
}

export interface UserListResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
}

export interface UserPointsInfo {
  user_id: number;
  total: number;
  level: string;
  next_level: string;
  to_next: number;
}

export const userService = {
  // Get a specific user by ID
  getUserById: async (userId: number): Promise<User> => {
    try {
      const response = await apiClient.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching user with ID ${userId}:`, error);
      throw error;
    }
  },

  // Get all customers with pagination
  getAllCustomers: async (page = 1, limit = 10): Promise<UserListResponse> => {
    try {
      const response = await apiClient.get(
        `/users/customer?page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching customers:", error);
      throw error;
    }
  },

  // Get customer points information
  getCustomerPoints: async (userId: number): Promise<UserPointsInfo> => {
    try {
      const response = await apiClient.get(`/users/customer/${userId}/points`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching points for user ${userId}:`, error);
      throw error;
    }
  },

  // Get current user profile (for auth context)
  getProfile: async (): Promise<User | null> => {
    try {
      const userData = localStorage.getItem("user_data");
      if (!userData) return null;

      const user = JSON.parse(userData);
      const userId = user.id;

      if (!userId) return null;

      const response = await apiClient.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
  },
};
