"use client";
import FeedbackDetail from "./FeedbackDetail";
import ReplyForm from "./ReplyForm";

interface FeedbackDetailProps {
  id?: string;
  user?: {
    name: string;
    email: string;
    avatar: string;
  };
  type?: string;
  date?: string;
  station?: string;
  message?: string;
  image?: {
    url: string;
    name: string;
  };
  rating?: number;
  apiData?: any; // Original API data
}

interface FeedbackReplyWrapperProps {
  feedbackData: FeedbackDetailProps;
  onSubmitReply: (data: { title: string; content: string }) => Promise<void>;
}

const FeedbackReplyWrapper = ({
  feedbackData,
  onSubmitReply,
}: FeedbackReplyWrapperProps) => {
  const handleSubmit = async (data: { title: string; content: string }) => {
    try {
      await onSubmitReply(data);
    } catch (error) {
      console.error("Error submitting reply:", error);
    }
  };

  const handleSave = (data: { title: string; content: string }) => {
    console.log("Save draft:", data);
    // Implement save draft functionality if needed
    // For example, store in localStorage
    localStorage.setItem(
      "feedback_draft_" + feedbackData.id,
      JSON.stringify(data)
    );
  };

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
        {/* Feedback Detail Section */}
        <div className="w-full lg:w-auto lg:min-w-[443px]">
          <FeedbackDetail {...feedbackData} />
        </div>
        {/* Reply Form Section */}
        <div className="w-full lg:flex-1">
          <ReplyForm onSubmit={handleSubmit} onSave={handleSave} />
        </div>
      </div>
    </div>
  );
};

export default FeedbackReplyWrapper;
