// services/feedbackService.ts
import apiClient from "@/lib/api";

export interface Feedback {
  id: number;
  user_id: number;
  title: string;
  content: string;
  response: string | null;
  status: "PENDING" | "RESPONDED";
  created_at: string;
  updated_at: string;
}

export interface FeedbackListResponse {
  feedbacks: Feedback[];
  total: number;
  page: number;
  limit: number;
}

export const feedbackService = {
  // Mendapatkan semua feedback
  getAllFeedbacks: async (
    page = 1,
    limit = 10
  ): Promise<FeedbackListResponse> => {
    try {
      const response = await apiClient.get(
        `/feedbacks?page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
      throw error;
    }
  },

  // Mendapatkan feedback berdasarkan ID
  getFeedbackById: async (id: number): Promise<Feedback> => {
    try {
      const response = await apiClient.get(`/feedbacks/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching feedback with ID ${id}:`, error);
      throw error;
    }
  },

  // Mendapatkan feedback berdasarkan user ID
  getFeedbacksByUserId: async (
    userId: number,
    page = 1,
    limit = 10
  ): Promise<FeedbackListResponse> => {
    try {
      const response = await apiClient.get(
        `/feedbacks/user/${userId}?page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching feedbacks for user ${userId}:`, error);
      throw error;
    }
  },

  // Merespon feedback
  respondToFeedback: async (
    id: number,
    responseText: string
  ): Promise<Feedback> => {
    try {
      const response = await apiClient.put(`/feedbacks/${id}/respond`, {
        response: responseText,
      });
      return response.data;
    } catch (error) {
      console.error(`Error responding to feedback with ID ${id}:`, error);
      throw error;
    }
  },

  // Menghapus feedback (jika API mendukung)
  deleteFeedback: async (id: number): Promise<void> => {
    try {
      await apiClient.delete(`/feedbacks/${id}`);
    } catch (error) {
      console.error(`Error deleting feedback with ID ${id}:`, error);
      throw error;
    }
  },

  // Mendapatkan statistik feedback (hitung dari data yang ada)
  getFeedbackStats: async (): Promise<{
    total: number;
    responded: number;
    pending: number;
  }> => {
    try {
      const response = await apiClient.get("/feedbacks");
      const feedbacks = response.data.feedbacks;
      const total = response.data.total;

      // Hitung jumlah feedback yang sudah direspon dan yang belum
      const responded = feedbacks.filter(
        (feedback: Feedback) => feedback.status === "RESPONDED"
      ).length;

      const pending = feedbacks.filter(
        (feedback: Feedback) => feedback.status === "PENDING"
      ).length;

      return {
        total,
        responded,
        pending,
      };
    } catch (error) {
      console.error("Error calculating feedback stats:", error);
      throw error;
    }
  },
};
