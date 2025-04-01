import apiClient from "@/lib/api";

// =======================
// Type Definitions
// =======================

export type ClaimStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";

export interface Reward {
  id: number;
  name: string;
  description: string;
  point_cost: number;
  stock: number;
  image_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateRewardPayload {
  name: string;
  description?: string;
  point_cost: number;
  stock: number;
  image?: File;
}

export interface UpdateRewardPayload {
  name?: string;
  description?: string;
  point_cost?: number;
  stock?: number;
  is_active?: boolean;
  image?: File;
}

export interface RewardListResponse {
  rewards: Reward[];
  total: number;
  page: number;
  limit: number;
}

// =======================
// Claim Types
// =======================

export interface RewardClaim {
  id: number;
  user_id: number;
  reward_id: number;
  point_cost: number;
  status: ClaimStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
  reward: Reward;
}

export interface ClaimRewardPayload {
  reward_id: number;
}

export interface UpdateClaimStatusPayload {
  status: ClaimStatus;
  notes?: string;
}

export interface ClaimListResponse {
  claims: RewardClaim[];
  total: number;
  page: number;
  limit: number;
}

// =======================
// Service Functions
// =======================

export const rewardService = {
  // ======= REWARD =======

  getAllRewards: async (
    page = 1,
    limit = 10,
    activeOnly = false
  ): Promise<RewardListResponse> => {
    const response = await apiClient.get(
      `/rewards?page=${page}&limit=${limit}&active_only=${activeOnly}`
    );
    return response.data;
  },

  getRewardById: async (id: number): Promise<Reward> => {
    const response = await apiClient.get(`/rewards/${id}`);
    return response.data;
  },

  createReward: async (formData: FormData): Promise<Reward> => {
    const response = await apiClient.post(`/rewards`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  updateReward: async (
    id: number,
    payload: UpdateRewardPayload | FormData
  ): Promise<Reward> => {
    const isFormData = payload instanceof FormData;
    const response = await apiClient.put(`/rewards/${id}`, payload, {
      headers: isFormData
        ? { "Content-Type": "multipart/form-data" }
        : undefined,
    });
    return response.data;
  },

  deleteReward: async (id: number): Promise<void> => {
    await apiClient.delete(`/rewards/${id}`);
  },

  // ======= CLAIM =======

  claimReward: async (payload: ClaimRewardPayload): Promise<RewardClaim> => {
    const response = await apiClient.post(`/claims`, payload);
    return response.data;
  },

  getClaimById: async (id: number): Promise<RewardClaim> => {
    const response = await apiClient.get(`/claims/${id}`);
    return response.data;
  },

  updateClaimStatus: async (
    id: number,
    payload: UpdateClaimStatusPayload
  ): Promise<RewardClaim> => {
    const response = await apiClient.put(`/claims/${id}/status`, payload);
    return response.data;
  },

  getUserClaims: async (
    userId?: number,
    page = 1,
    limit = 10
  ): Promise<ClaimListResponse> => {
    const url = userId
      ? `/claims/user/${userId}?page=${page}&limit=${limit}`
      : `/claims/user?page=${page}&limit=${limit}`;
    const response = await apiClient.get(url);
    return response.data;
  },

  getAllClaims: async (page = 1, limit = 10): Promise<ClaimListResponse> => {
    const response = await apiClient.get(`/claims?page=${page}&limit=${limit}`);
    return response.data;
  },

  getClaimsByStatus: async (
    status: ClaimStatus,
    page = 1,
    limit = 10
  ): Promise<ClaimListResponse> => {
    const response = await apiClient.get(
      `/claims/status/${status}?page=${page}&limit=${limit}`
    );
    return response.data;
  },

  // ======= UTIL =======
  getImageUrl: (imagePath: string | null): string => {
    if (!imagePath) return "";
    return `${process.env.NEXT_PUBLIC_API_URL}${imagePath}`;
  },
};
