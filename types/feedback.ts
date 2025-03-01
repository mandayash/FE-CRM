// types/feedback.ts
export interface Station {
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: null | string;
  ID: string;
  Name: string;
}

export interface FeedbackType {
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: null | string;
  ID: string;
  Name: string;
}

export interface FeedbackResponse {
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: null | string;
  ID: string;
  FeedbackID: string;
  Response: string;
  ResponseDate: string;
  Feedback: Feedback | null;
}

export interface Feedback {
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: null | string;
  ID: string;
  UserID: string;
  UserEmail: string;
  FeedbackDate: string;
  FeedbackTypeID: string;
  StationID: string;
  Feedback: string;
  Documentation: string;
  Rating: number;
  Status: number; // 1 = pending (Belum), 2 = solved (Selesai)
  FeedbackType: FeedbackType;
  Station: Station;
  Response: FeedbackResponse | null;
}

export interface FeedbackStats {
  totalFeedback: number;
  solvedFeedback: number;
  pendingFeedback: number;
  monthlyChangePercentage: {
    total: number;
    solved: number;
    pending: number;
  };
}

export interface FeedbackApiResponse {
  data: Feedback[];
}

export interface FeedbackRequest {
  meta: {
    action: string;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}
