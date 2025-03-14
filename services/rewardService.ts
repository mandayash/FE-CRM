import apiClient from "@/lib/api";
import { Reward, RewardClaim } from "@/types/reward";

export const rewardService = {
  createReward: async (
    data: Omit<Reward, "id" | "created_at" | "updated_at">
  ): Promise<Reward> => {
    const response = await apiClient.post("/rewards", data);
    return response.data;
  },

  updateReward: async (id: number, data: Partial<Reward>): Promise<Reward> => {
    const response = await apiClient.put(`/rewards/${id}`, data);
    return response.data;
  },

  getAllRewards: async (): Promise<Reward[]> => {
    const response = await apiClient.get("/rewards");
    return response.data;
  },

  getRewardById: async (id: number): Promise<Reward> => {
    const response = await apiClient.get(`/rewards/${id}`);
    return response.data;
  },

  getAllClaims: async (): Promise<RewardClaim[]> => {
    const response = await apiClient.get("/rewards/claims");
    return response.data;
  },

  getClaimsByUserId: async (userId: number): Promise<RewardClaim[]> => {
    const response = await apiClient.get(`/rewards/claims/user/${userId}`);
    return response.data;
  },
};
