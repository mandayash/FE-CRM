import apiClient from "@/lib/api";
import { Feedback } from "@/types/feedback";

export const feedbackService = {
  getAllFeedbacks: async (): Promise<Feedback[]> => {
    const response = await apiClient.get("/feedbacks");
    return response.data;
  },

  getFeedbackById: async (id: number): Promise<Feedback> => {
    const response = await apiClient.get(`/feedbacks/${id}`);
    return response.data;
  },

  getFeedbacksByUserId: async (userId: number): Promise<Feedback[]> => {
    const response = await apiClient.get(`/feedbacks/user/${userId}`);
    return response.data;
  },

  respondToFeedback: async (
    id: number,
    responseText: string
  ): Promise<Feedback> => {
    const response = await apiClient.put(`/feedbacks/${id}/respond`, {
      response: responseText,
    });
    return response.data;
  },
};
