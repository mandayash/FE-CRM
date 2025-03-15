"use client";
import { useEffect, useState } from "react";
import FeedbackReplyWrapper from "@/components/feedback/reply/FeedbackReplyWrapper";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { feedbackService } from "@/services/feedbackService";
import { useParams } from "next/navigation";

export default function FeedbackReplyPage() {
  const router = useRouter();
  const params = useParams();
  const feedbackId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedbackData, setFeedbackData] = useState<any>(null);

  useEffect(() => {
    const loadFeedbackDetail = async () => {
      try {
        setLoading(true);
        const data = await feedbackService.getFeedbackById(Number(feedbackId));

        // Transform API data to match the component's expected format
        const transformedData = {
          id: `FB-${data.id}`,
          user: {
            name: data.user?.name || "Unknown User",
            email: data.user?.email || "No email provided",
            avatar: "/images/profile-placeholder.png", // Default avatar
          },
          type: data.title || "No type specified",
          date: new Date(data.created_at).toLocaleString("id-ID"),
          station: "N/A", // Placeholder, adjust if your API provides this
          message: data.content,
          image: {
            url: "/images/profile-placeholder.png", // Placeholder, adjust if your API provides this
            name: "No image",
          },
          rating: 3, // Placeholder, adjust if your API provides this
          apiData: data, // Keep original API data for reference
        };

        setFeedbackData(transformedData);
        setError(null);
      } catch (err) {
        console.error("Failed to load feedback details:", err);
        setError("Gagal memuat detail feedback");
      } finally {
        setLoading(false);
      }
    };

    if (feedbackId) {
      loadFeedbackDetail();
    }
  }, [feedbackId]);

  const handleSubmitReply = async (data: {
    title: string;
    content: string;
  }) => {
    try {
      await feedbackService.respondToFeedback(Number(feedbackId), data.content);
      // Success! Redirect back to feedback list
      setTimeout(() => {
        router.push("/feedback");
      }, 2000);
    } catch (err) {
      console.error("Failed to submit reply:", err);
      alert("Gagal mengirim balasan. Silakan coba lagi.");
    }
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 max-w-[1200px] mx-auto">
        <div className="animate-pulse bg-gray-200 h-6 w-32 mb-4"></div>
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
          <div className="w-full lg:w-auto lg:min-w-[443px]">
            <div className="animate-pulse bg-gray-200 h-96 rounded-2xl"></div>
          </div>
          <div className="w-full lg:flex-1">
            <div className="animate-pulse bg-gray-200 h-96 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !feedbackData) {
    return (
      <div className="p-4 sm:p-6 max-w-[1200px] mx-auto">
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={() => router.back()}
            className="hover:bg-gray-100 p-1.5 sm:p-2 rounded-lg transition-colors"
          >
            <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
          </button>
          <h2 className="text-base sm:text-lg font-medium">Kembali</h2>
        </div>
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error || "Feedback tidak ditemukan"}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-[1200px] mx-auto">
      {/* Back Button */}
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => router.back()}
          className="hover:bg-gray-100 p-1.5 sm:p-2 rounded-lg transition-colors"
        >
          <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
        </button>
        <h2 className="text-base sm:text-lg font-medium">Balas Feedback</h2>
      </div>

      {/* Wrapper Content */}
      <FeedbackReplyWrapper
        feedbackData={feedbackData}
        onSubmitReply={handleSubmitReply}
      />
    </div>
  );
}
