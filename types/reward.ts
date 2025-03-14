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

export interface RewardClaim {
  id: number;
  user_id: number;
  reward_id: number;
  status: string;
  claimed_at: string;
  user?: {
    name: string;
    email: string;
  };
  reward?: Reward;
}
