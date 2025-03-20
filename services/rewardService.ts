import apiClient from "@/lib/api";

// Interface untuk data reward
export interface Reward {
  id: number;
  name: string;
  description: string;
  point_cost: number;
  stock: number;
  image_url: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Interface untuk response list reward
export interface RewardListResponse {
  rewards: Reward[];
  total: number;
  page: number;
  limit: number;
}

// Interface untuk data claim reward
export interface RewardClaim {
  id: number;
  user_id: number;
  reward_id: number;
  point_cost: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
  created_at: string;
  updated_at: string;
  reward: Reward;
}

// Interface untuk response list claim reward
export interface ClaimListResponse {
  claims: RewardClaim[];
  total: number;
  page: number;
  limit: number;
}

// Interface untuk request create reward
export interface CreateRewardRequest {
  name: string;
  description: string;
  point_cost: number;
  stock: number;
  image_url: string;
}

// Interface untuk request update reward
export interface UpdateRewardRequest {
  name: string;
  description: string;
  point_cost: number;
  stock: number;
  image_url: string;
  is_active: boolean;
}

// Interface untuk request update claim status
export interface UpdateClaimStatusRequest {
  status: "APPROVED" | "REJECTED";
}

export const rewardService = {
  // Get all rewards with pagination
  getAllRewards: async (page = 1, limit = 10): Promise<RewardListResponse> => {
    try {
      const response = await apiClient.get(
        `/rewards?page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching rewards:", error);
      throw error;
    }
  },

  // Get a specific reward by ID
  getRewardById: async (rewardId: number): Promise<Reward> => {
    try {
      const response = await apiClient.get(`/rewards/${rewardId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching reward with ID ${rewardId}:`, error);
      throw error;
    }
  },

  // Create a new reward
  createReward: async (rewardData: CreateRewardRequest): Promise<Reward> => {
    try {
      const response = await apiClient.post("/rewards", rewardData);
      return response.data;
    } catch (error) {
      console.error("Error creating reward:", error);
      throw error;
    }
  },

  // Update an existing reward
  updateReward: async (
    rewardId: number,
    rewardData: UpdateRewardRequest
  ): Promise<Reward> => {
    try {
      const response = await apiClient.put(`/rewards/${rewardId}`, rewardData);
      return response.data;
    } catch (error) {
      console.error(`Error updating reward with ID ${rewardId}:`, error);
      throw error;
    }
  },

  // Get all reward claims with pagination
  getAllClaims: async (page = 1, limit = 10): Promise<ClaimListResponse> => {
    try {
      const response = await apiClient.get(
        `/claims?page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching reward claims:", error);
      throw error;
    }
  },

  // Update claim status (approve/reject)
  updateClaimStatus: async (
    claimId: number,
    statusData: UpdateClaimStatusRequest
  ): Promise<RewardClaim> => {
    try {
      const response = await apiClient.put(
        `/claims/${claimId}/status`,
        statusData
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error updating claim status for claim ID ${claimId}:`,
        error
      );
      throw error;
    }
  },

  // Get reward claims by reward ID (filtering from getAllClaims)
  getClaimsByRewardId: async (
    rewardId: number,
    page = 1,
    limit = 10
  ): Promise<ClaimListResponse> => {
    try {
      // Since there's no direct endpoint, we'll get all claims and filter
      const response = await apiClient.get(
        `/claims?page=${page}&limit=${limit}`
      );
      const allClaims = response.data;

      // Filter claims by reward_id
      const filteredClaims = {
        claims: allClaims.claims.filter(
          (claim) => claim.reward_id === rewardId
        ),
        total: allClaims.claims.filter((claim) => claim.reward_id === rewardId)
          .length,
        page: page,
        limit: limit,
      };

      return filteredClaims;
    } catch (error) {
      console.error(`Error fetching claims for reward ID ${rewardId}:`, error);
      throw error;
    }
  },
};
