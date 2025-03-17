// app/feedback/[id]/reply/page.tsx

"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Download, Maximize2, Minimize2 } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { feedbackService } from "@/services/feedbackService";
import DOMPurify from "isomorphic-dompurify";

export default function FeedbackReplyDetail() {
  const router = useRouter();
  const params = useParams();
  const feedbackId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<any>(null);
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    const loadFeedbackDetail = async () => {
      try {
        setLoading(true);
        const data = await feedbackService.getFeedbackById(Number(feedbackId));
        setFeedback(data);
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

  // Function to download response as a text file
  const handleDownload = () => {
    if (!feedback) return;

    // Create the content for the text file
    const title = `LRT SUMSEL: Tindak Lanjut atas ${feedback.title}`;
    const date = new Date(feedback.updated_at).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    // Create plain text content from HTML response
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = feedback.response;
    const responseText = tempDiv.textContent || tempDiv.innerText || "";

    // Format the content
    const content = `${title}\n${date}\n\n${responseText}\n\n---\n\nFeedback ID: FB-${
      feedback.id
    }\nUser ID: ${feedback.user_id}\nJenis Umpan Balik: ${
      feedback.title
    }\nTanggal: ${new Date(feedback.created_at).toLocaleDateString(
      "id-ID"
    )}\nFeedback: ${feedback.content}`;

    // Create a blob with the content
    const blob = new Blob([content], { type: "text/plain" });

    // Create a URL for the blob
    const url = URL.createObjectURL(blob);

    // Create a temporary link element
    const a = document.createElement("a");
    a.href = url;
    a.download = `feedback-response-${feedback.id}.txt`;

    // Trigger the download
    document.body.appendChild(a);
    a.click();

    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Function to toggle maximize/minimize view
  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  if (loading) {
    return (
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 animate-pulse">
        <div className="flex-1 bg-white rounded-lg p-4 sm:p-8">
          <div className="bg-gray-200 h-8 w-40 mb-4"></div>
          <div className="bg-gray-200 h-10 w-full mb-2"></div>
          <div className="bg-gray-200 h-4 w-32 mb-6"></div>
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-200 h-4 w-full"></div>
            ))}
          </div>
        </div>
        <div className="w-[443px] bg-white rounded-lg p-6">
          <div className="bg-gray-200 h-6 w-32 mb-6"></div>
          <div className="space-y-6">
            {[...Array(7)].map((_, i) => (
              <div key={i}>
                <div className="bg-gray-200 h-4 w-32 mb-2"></div>
                <div className="bg-gray-200 h-20 w-full rounded-lg"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !feedback) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        {error || "Feedback tidak ditemukan"}
      </div>
    );
  }

  // Format tanggal untuk tampilan
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // HTML sanitasi untuk konten respons
  const sanitizedResponse = DOMPurify.sanitize(feedback.response || "");

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
      {/* Left Section - Message Content */}
      <div
        className={`flex-1 bg-white rounded-lg p-4 sm:p-8 transition-all duration-300 ease-in-out ${
          isMaximized ? "lg:w-full" : ""
        }`}
      >
        {/* Header with back button */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.back()}
              className="hover:bg-gray-100 p-1.5 sm:p-2 rounded-lg transition-colors"
            >
              <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
            </button>
            <h2 className="text-base sm:text-lg font-medium">
              Balasan Feedback
            </h2>
          </div>
          <div className="flex gap-1 sm:gap-2">
            <button
              onClick={handleDownload}
              className="hover:bg-gray-100 p-1.5 sm:p-2 rounded-lg transition-colors"
              title="Download as text file"
            >
              <Download size={18} className="sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={toggleMaximize}
              className="hover:bg-gray-100 p-1.5 sm:p-2 rounded-lg transition-colors"
              title={isMaximized ? "Minimize" : "Maximize"}
            >
              {isMaximized ? (
                <Minimize2 size={18} className="sm:w-5 sm:h-5" />
              ) : (
                <Maximize2 size={18} className="sm:w-5 sm:h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Message Title */}
        <h1 className="text-2xl font-bold mb-2">
          LRT SUMSEL: Tindak Lanjut atas {feedback.title}
        </h1>
        <p className="text-gray-500 mb-6">{formatDate(feedback.updated_at)}</p>

        {/* Message Content */}
        <div
          className="space-y-3 sm:space-y-4 text-sm sm:text-base text-justify"
          dangerouslySetInnerHTML={{ __html: sanitizedResponse }}
        />
      </div>

      {/* Right Section - Feedback Detail */}
      <div
        className={`w-[443px] bg-white rounded-lg p-6 transition-all duration-300 ease-in-out ${
          isMaximized ? "lg:w-0 lg:opacity-0 lg:overflow-hidden lg:p-0" : ""
        }`}
      >
        <h2 className="font-medium mb-6">Feedback</h2>

        <div className="space-y-6">
          <div>
            <p className="text-sm font-medium mb-2">
              Feedback ID: FB-{feedback.id}
            </p>
          </div>

          {/* user */}

          {/* <div>
            <p className="text-sm font-medium mb-2">User</p>
            <div className="flex items-center gap-3 bg-[#EAEAEA] p-2.5 rounded-lg">
              <Image
                src="/images/profile-placeholder.png"
                alt="User"
                width={30}
                height={30}
                className="rounded-full"
              />
              <div>
                <p className="text-sm">User ID: {feedback.user_id}</p>
                <p className="text-xs text-gray-500">Customer</p>
              </div>
            </div>
          </div> */}

          <div>
            <p className="text-sm font-medium mb-2">Jenis Umpan Balik</p>
            <div className="bg-[#EAEAEA] p-2.5 rounded-lg">
              <p className="text-sm">{feedback.title}</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">
              Tanggal dan Waktu Perjalanan
            </p>
            <div className="bg-[#EAEAEA] p-2.5 rounded-lg">
              <p className="text-sm">{formatDate(feedback.created_at)}</p>
            </div>
          </div>

          {/* stasiun keberangkatan */}

          {/* <div>
            <p className="text-sm font-medium mb-2">Stasiun Keberangkatan</p>
            <div className="bg-[#EAEAEA] p-2.5 rounded-lg">
              <p className="text-sm">Tidak Tersedia</p>
            </div>
          </div> */}

          <div>
            <p className="text-sm font-medium mb-2">Feedback</p>
            <div className="bg-[#EAEAEA] p-2.5 rounded-lg">
              <p className="text-sm">{feedback.content}</p>
            </div>
          </div>

          {/* file pendukung */}

          {/* <div>
            <p className="text-sm font-medium mb-2">File Pendukung</p>
            <div className="bg-[#EAEAEA] p-2.5 rounded-lg">
              <div className="relative w-full aspect-[2/1] mb-2">
                <Image
                  src="/images/profile-placeholder.png"
                  alt="Supporting Document"
                  fill
                  className="rounded-lg object-cover"
                />
              </div>
              <p className="text-xs text-center text-gray-500">
                Tidak Ada File
              </p>
            </div>
          </div> */}

          {/* rating feedback */}

          {/* <div>
            <p className="text-sm font-medium mb-2">Penilaian</p>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={32}
                  className={
                    star <= 3
                      ? "fill-yellow-400 text-yellow-400"
                      : "fill-gray-200 text-gray-200"
                  }
                />
              ))}
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}
