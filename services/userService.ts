import apiClient from "@/lib/api";
import { Customer, User } from "@/types/user";

export const userService = {
  getProfile: async (): Promise<User> => {
    const response = await apiClient.get("/users/profile");
    return response.data;
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response = await apiClient.put("/users/profile", data);
    return response.data;
  },

  getAllCustomers: async (): Promise<Customer[]> => {
    const response = await apiClient.get("/users/customer");
    return response.data;
  },

  getCustomerPoint: async (userId: number): Promise<{ points: number }> => {
    const response = await apiClient.get(`/users/customer/${userId}/points`);
    return response.data;
  },
};
