// services/feedback_service.ts
import { authService } from "./auth_service";

const BASE_URL = "http://localhost:8082";
const ADMIN_URL = `${BASE_URL}/api/admin/feedback`;

// Types
export interface FeedbackType {
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: null | string;
  ID: string;
  Name: string;
}

export interface Station {
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: null | string;
  ID: string;
  Name: string;
}

export interface FeedbackResponseData {
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: null | string;
  ID: string;
  FeedbackID: string;
  Response: string;
  ResponseDate: string;
  Feedback: ApiFeedback | null;
}

export interface ApiFeedback {
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
  Response: FeedbackResponseData | null;
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
  data: ApiFeedback[];
}

export interface UiFeedback {
  id: string;
  date: string;
  user: {
    name: string;
    email: string;
    avatar: string;
  };
  type: string;
  message: string;
  documentation: string;
  rating: number;
  status: "Selesai" | "Belum";
  stationName: string;
}

export interface FeedbackNotification {
  id: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  feedbackId?: string;
}

// Helper to map API response to our UI format
const formatFeedbackForUI = (feedback: ApiFeedback): UiFeedback => ({
  id: feedback.ID,
  date: new Date(feedback.FeedbackDate).toLocaleString(),
  user: {
    name: feedback.UserEmail.split("@")[0], // Use email name as user name for now
    email: feedback.UserEmail,
    avatar: "/images/profile-placeholder.png",
  },
  type: feedback.FeedbackType.Name,
  message: feedback.Feedback,
  documentation: feedback.Documentation || "No documentation",
  rating: Math.floor(feedback.Rating),
  status: feedback.Status === 2 ? "Selesai" : "Belum",
  stationName: feedback.Station.Name,
});

// Calculate stats from feedback data
const calculateStats = (feedbacks: ApiFeedback[]): FeedbackStats => {
  const totalFeedback = feedbacks.length;
  const solvedFeedback = feedbacks.filter(
    (feedback) => feedback.Status === 2
  ).length;
  const pendingFeedback = feedbacks.filter(
    (feedback) => feedback.Status === 1
  ).length;

  // Calculate monthly changes
  const today = new Date();
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(today.getDate() - 30);

  const sixtyDaysAgo = new Date(thirtyDaysAgo);
  sixtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // Current month feedbacks
  const currentFeedbacks = feedbacks.filter(
    (feedback) => new Date(feedback.FeedbackDate) >= thirtyDaysAgo
  );

  const currentSolved = currentFeedbacks.filter(
    (feedback) => feedback.Status === 2
  ).length;
  const currentPending = currentFeedbacks.filter(
    (feedback) => feedback.Status === 1
  ).length;

  // Previous month feedbacks
  const previousFeedbacks = feedbacks.filter(
    (feedback) =>
      new Date(feedback.FeedbackDate) >= sixtyDaysAgo &&
      new Date(feedback.FeedbackDate) < thirtyDaysAgo
  );

  const previousTotal = previousFeedbacks.length;
  const previousSolved = previousFeedbacks.filter(
    (feedback) => feedback.Status === 2
  ).length;
  const previousPending = previousFeedbacks.filter(
    (feedback) => feedback.Status === 1
  ).length;

  // Calculate percentage changes
  const calculatePercentage = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  return {
    totalFeedback,
    solvedFeedback,
    pendingFeedback,
    monthlyChangePercentage: {
      total: calculatePercentage(currentFeedbacks.length, previousTotal),
      solved: calculatePercentage(currentSolved, previousSolved),
      pending: calculatePercentage(currentPending, previousPending),
    },
  };
};

export const feedbackService = {
  // Get all feedback with optional filtering
  getAllFeedbacks: async (filter: string = "all") => {
    try {
      console.log(`Service received filter: ${filter}`);

      // Create request body
      const requestBody = {
        meta: {
          action: "get_all_feedbacks",
        },
        data: {},
      };

      // Add client-side filtering as a fallback
      const response = await fetch(ADMIN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authService.getToken()}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch feedbacks");
      }

      const result = await response.json();
      let feedbacks = result.data || [];

      // Apply client-side filtering based on status
      if (filter === "solved") {
        console.log("Client-side filtering for solved feedbacks (Status=2)");
        feedbacks = feedbacks.filter((feedback) => feedback.Status === 2);
      } else if (filter === "pending") {
        console.log("Client-side filtering for pending feedbacks (Status=1)");
        feedbacks = feedbacks.filter((feedback) => feedback.Status === 1);
      }

      console.log(`After filtering: ${feedbacks.length} feedbacks`);

      const stats = calculateStats(feedbacks);
      const formattedFeedbacks = feedbacks.map(formatFeedbackForUI);

      return {
        feedbacks: formattedFeedbacks,
        stats,
      };
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
      return {
        feedbacks: [],
        stats: {
          totalFeedback: 0,
          solvedFeedback: 0,
          pendingFeedback: 0,
          monthlyChangePercentage: {
            total: 0,
            solved: 0,
            pending: 0,
          },
        },
      };
    }
  },

  // Delete feedback
  deleteFeedback: async (feedbackId: string) => {
    try {
      const response = await fetch(ADMIN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authService.getToken()}`,
        },
        body: JSON.stringify({
          meta: {
            action: "delete_feedback",
          },
          data: { feedbackId },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete feedback");
      }

      return await response.json();
    } catch (error) {
      console.error("Error deleting feedback:", error);
      throw error;
    }
  },

  // Respond to feedback
  respondToFeedback: async (feedbackId: string, responseText: string) => {
    try {
      const response = await fetch(ADMIN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authService.getToken()}`,
        },
        body: JSON.stringify({
          meta: {
            action: "respond_to_feedback",
          },
          data: { feedbackId, response: responseText },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to respond to feedback");
      }

      return await response.json();
    } catch (error) {
      console.error("Error responding to feedback:", error);
      throw error;
    }
  },

  // Get feedback by ID
  getFeedbackById: async (id: string) => {
    try {
      const response = await fetch(ADMIN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authService.getToken()}`,
        },
        body: JSON.stringify({
          meta: {
            action: "get_feedback_by_id",
          },
          data: { id },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch feedback");
      }

      const result = await response.json();
      return {
        feedback: result.data ? formatFeedbackForUI(result.data) : null,
      };
    } catch (error) {
      console.error("Error fetching feedback by ID:", error);
      throw error;
    }
  },

  // Get notifications
  // services/feedback_service.ts
  getNotifications: async (): Promise<FeedbackNotification[]> => {
    try {
      // Get list of already read notifications
      const readNotificationIds = getReadNotificationIds();
      // Fetch feedbacks from API or mock data
      const result = await feedbackService.getAllFeedbacks();
      // Sort feedbacks by creation date (newest first)
      const sortedFeedbacks = [...result.feedbacks].sort((a, b) => {
        return (
          new Date(b.CreatedAt).getTime() - new Date(a.CreatedAt).getTime()
        );
      });
      // Take the 5 most recent feedbacks
      const recentFeedbacks = sortedFeedbacks.slice(0, 5);
      return recentFeedbacks.map((feedback, index) => {
        const notificationId = `notif-${feedback.ID}`;
        // Use the actual feedback creation date for the notification timestamp
        let timestamp: Date;
        try {
          // Parse the feedback creation date
          timestamp = new Date(feedback.CreatedAt);
          // Validate the timestamp
          if (isNaN(timestamp.getTime())) {
            console.warn(
              `Invalid date found for feedback ${feedback.ID}: ${feedback.CreatedAt}`
            );
            timestamp = new Date(); // Fallback to current time if invalid
          }
        } catch (error) {
          console.error(
            `Error parsing date for feedback ${feedback.ID}:`,
            error
          );
          timestamp = new Date(); // Fallback to current time if parsing fails
        }
        return {
          id: notificationId,
          message: `New feedback received: "${feedback.Feedback.substring(
            0,
            30
          )}${feedback.Feedback.length > 30 ? "..." : ""}"`,
          timestamp,
          isRead: readNotificationIds.includes(notificationId) || index > 2,
          feedbackId: feedback.ID,
        };
      });
    } catch (error) {
      console.error("Error fetching notifications:", error);
      return [];
    }
  },

  markNotificationAsRead: async (notificationId: string): Promise<boolean> => {
    try {
      // Store in localStorage for persistence
      saveReadNotificationId(notificationId);
      return true;
    } catch (error) {
      console.error("Error marking notification as read:", error);
      return false;
    }
  },

  markAllNotificationsAsRead: async (
    notificationIds: string[]
  ): Promise<boolean> => {
    try {
      // Store all IDs in localStorage
      notificationIds.forEach((id) => saveReadNotificationId(id));
      return true;
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      return false;
    }
  },
};

// Helper function to get read notification IDs from localStorage
const getReadNotificationIds = (): string[] => {
  if (typeof window === "undefined") return [];

  const stored = localStorage.getItem("readNotifications");
  if (!stored) return [];

  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
};

// Helper function to save read notification IDs to localStorage
const saveReadNotificationId = (id: string): void => {
  if (typeof window === "undefined") return;

  const current = getReadNotificationIds();
  if (!current.includes(id)) {
    localStorage.setItem("readNotifications", JSON.stringify([...current, id]));
  }
};
