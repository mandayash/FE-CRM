export interface Feedback {
  id: number;
  user_id: number;
  title: string;
  content: string;
  response: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  user?: {
    name: string;
    email: string;
  };
}

export interface FeedbackResponse {
  response: string;
}
