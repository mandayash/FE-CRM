// services/feedbackService.ts
import apiClient from "@/lib/api";

export interface Feedback {
  id: number;
  user_id: number;
  category: string;
  station: string;
  title: string;
  content: string;
  rating: number;
  image_path: string | null;
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

export interface CreateFeedbackPayload {
  category: string;
  station: string;
  title: string;
  content: string;
  rating: number;
  image?: File;
}

export const FeedbackCategoryMap = {
  SARAN_KRITIK: "Saran & Kritik",
  PEMBAYARAN_TIKET: "Pembayaran Tiket",
  MASALAH_FASILITAS: "Masalah Fasilitas",
  KELUHAN_PELAYANAN: "Keluhan Pelayanan",
};

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

  // Mendapatkan feedback yang masih pending
  getPendingFeedbacks: async (
    page = 1,
    limit = 10
  ): Promise<FeedbackListResponse> => {
    try {
      const response = await apiClient.get(
        `/feedbacks/pending?page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching pending feedbacks:", error);
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

  // Mendapatkan feedback untuk pengguna saat ini
  // getMyFeedbacks: async (
  //   page = 1,
  //   limit = 10
  // ): Promise<FeedbackListResponse> => {
  //   try {
  //     const response = await apiClient.get(
  //       `/feedbacks/user?page=${page}&limit=${limit}`
  //     );
  //     return response.data;
  //   } catch (error) {
  //     console.error("Error fetching my feedbacks:", error);
  //     throw error;
  //   }
  // },

  // Membuat feedback baru
  // createFeedback: async (
  //   feedbackData: CreateFeedbackPayload
  // ): Promise<Feedback> => {
  //   try {
  //     const formData = new FormData();
  //     formData.append("category", feedbackData.category);
  //     formData.append("station", feedbackData.station);
  //     formData.append("title", feedbackData.title);
  //     formData.append("content", feedbackData.content);
  //     formData.append("rating", feedbackData.rating.toString());

  //     if (feedbackData.image) {
  //       formData.append("image", feedbackData.image);
  //     }

  //     const response = await apiClient.post("/feedbacks", formData, {
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //       },
  //     });

  //     return response.data;
  //   } catch (error) {
  //     console.error("Error creating feedback:", error);
  //     throw error;
  //   }
  // },

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

  // Mendapatkan URL gambar
  getImageUrl: (imagePath: string | null): string => {
    if (!imagePath) return "";
    return `${process.env.NEXT_PUBLIC_API_URL}/feedbacks/uploads/${imagePath}`;
  },

  searchFeedbacks: async (
    query: string,
    status: string = "",
    page = 1,
    limit = 10
  ): Promise<FeedbackListResponse> => {
    const url = `/feedbacks/search?q=${query}&page=${page}&limit=${limit}${
      status ? `&status=${status}` : ""
    }`;
    const response = await apiClient.get(url);
    return response.data;
  },

  // Get by status only
  getByStatus: async (
    status: string,
    page = 1,
    limit = 10
  ): Promise<FeedbackListResponse> => {
    const url = `/feedbacks?status=${status}&page=${page}&limit=${limit}`;
    const response = await apiClient.get(url);
    return response.data;
  },

  // Mendapatkan statistik feedback
  getFeedbackStats: async (): Promise<{
    total: number;
    responded: number;
    pending: number;
    categories: Record<string, number>;
    stations: Record<string, number>;
    ratings: Record<number, number>;
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

      // Hitung jumlah feedback per kategori
      const categories = feedbacks.reduce(
        (acc: Record<string, number>, feedback: Feedback) => {
          acc[feedback.category] = (acc[feedback.category] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      );

      // Hitung jumlah feedback per stasiun
      const stations = feedbacks.reduce(
        (acc: Record<string, number>, feedback: Feedback) => {
          acc[feedback.station] = (acc[feedback.station] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      );

      // Hitung jumlah feedback per rating
      const ratings = feedbacks.reduce(
        (acc: Record<number, number>, feedback: Feedback) => {
          acc[feedback.rating] = (acc[feedback.rating] || 0) + 1;
          return acc;
        },
        {} as Record<number, number>
      );

      return {
        total,
        responded,
        pending,
        categories,
        stations,
        ratings,
      };
    } catch (error) {
      console.error("Error calculating feedback stats:", error);
      throw error;
    }
  },
};
