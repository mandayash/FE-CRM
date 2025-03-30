// services/qrService.ts
import apiClient from "@/lib/api";

export interface QRFeedback {
  id: number;
  qr_code: string;
  station: string;
  created_at: string;
}

export interface CreateQRPayload {
  station: string;
}

export interface QRFeedbackListResponse {
  qr_feedbacks: QRFeedback[];
  total: number;
  page: number;
  limit: number;
}

export const qrService = {
  createQR: async (payload: CreateQRPayload): Promise<QRFeedback> => {
    const response = await apiClient.post("/qr-feedbacks", payload);
    return response.data;
  },

  downloadQRImage: async (id: number): Promise<Blob> => {
    const response = await apiClient.get(`/qr-feedbacks/${id}/download`, {
      responseType: "blob",
    });
    return response.data;
  },

  getQRCodeObjectUrl: async (id: number): Promise<string> => {
    const blob = await qrService.downloadQRImage(id);
    return URL.createObjectURL(blob);
  },

  listQRFeedbacks: async (
    page = 1,
    limit = 10
  ): Promise<QRFeedbackListResponse> => {
    const response = await apiClient.get("/qr-feedbacks", {
      params: { page, limit },
    });
    return response.data;
  },
};
