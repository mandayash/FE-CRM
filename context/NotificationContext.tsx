"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { feedbackService } from "@/services/feedback_service";

interface NotificationContextType {
  newFeedbackIds: string[];
  markFeedbackAsRead: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType>({
  newFeedbackIds: [],
  markFeedbackAsRead: () => {},
});

export const useNotifications = () => useContext(NotificationContext);

// Fix the children parameter type
export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [newFeedbackIds, setNewFeedbackIds] = useState<string[]>([]);

  useEffect(() => {
    const fetchNewFeedbacks = async () => {
      try {
        // Get all feedbacks
        const result = await feedbackService.getAllFeedbacks();

        // Get already viewed feedback IDs from localStorage
        const viewedFeedbackIds = getViewedFeedbackIds();

        // Identify new feedbacks (ones not in viewedFeedbackIds)
        const newIds = result.feedbacks
          .filter((feedback) => !viewedFeedbackIds.includes(feedback.id))
          .map((feedback) => feedback.id);

        setNewFeedbackIds(newIds);
      } catch (error) {
        console.error("Error fetching new feedbacks:", error);
      }
    };

    fetchNewFeedbacks();
  }, []);

  const markFeedbackAsRead = (id: string) => {
    // Remove from newFeedbackIds state
    setNewFeedbackIds((prev) => prev.filter((feedbackId) => feedbackId !== id));

    // Add to viewed feedbacks in localStorage
    addToViewedFeedbacks(id);
  };

  return (
    <NotificationContext.Provider
      value={{
        newFeedbackIds,
        markFeedbackAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

// Helper functions for localStorage
const getViewedFeedbackIds = (): string[] => {
  if (typeof window === "undefined") return [];

  const stored = localStorage.getItem("viewedFeedbacks");
  if (!stored) return [];

  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
};

const addToViewedFeedbacks = (id: string): void => {
  if (typeof window === "undefined") return;

  const current = getViewedFeedbackIds();
  if (!current.includes(id)) {
    localStorage.setItem("viewedFeedbacks", JSON.stringify([...current, id]));
  }
};
