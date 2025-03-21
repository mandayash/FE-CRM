"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { feedbackService, Feedback } from "@/services/feedbackService";

const combineClasses = (...classes: string[]) =>
  classes.filter(Boolean).join(" ");

const FeedbackTable = () => {
  const [feedbackStats, setFeedbackStats] = useState({
    total: 0,
    responded: 0,
    pending: 0,
  });
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 5; // Hanya tampilkan 5 item

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Ambil statistik feedback
        const stats = await feedbackService.getFeedbackStats();
        setFeedbackStats(stats);

        // Pastikan kita hanya meminta 5 item dengan parameter yang benar
        const response = await feedbackService.getAllFeedbacks(
          currentPage,
          itemsPerPage
        );

        // Batasi array feedbacks hanya sampai 5 item
        // Ini adalah pengaman tambahan jika API mengembalikan lebih dari yang diminta
        const limitedFeedbacks = response.feedbacks.slice(0, itemsPerPage);
        setFeedbacks(limitedFeedbacks);

        // Hitung total halaman
        setTotalPages(Math.ceil(stats.total / itemsPerPage));
      } catch (err) {
        console.error("Failed to fetch feedback data:", err);
      }
    };

    fetchData();
  }, [currentPage]); // Reload saat halaman berubah

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const StatCard = ({
    label,
    value,
    className,
  }: {
    label: string;
    value: number;
    className?: string;
  }) => (
    <div
      className={combineClasses(
        "flex-1 px-3 sm:px-4 py-3 rounded min-w-[180px]",
        className || "bg-[#F0F1F3]"
      )}
    >
      <p className="text-xs sm:text-sm text-gray-600 font-bold line-clamp-1">
        {label}
      </p>
      <p className="text-xl sm:text-2xl lg:text-[30px] font-bold mt-1">
        {value.toLocaleString()}
      </p>
    </div>
  );

  return (
    <Card className="w-full overflow-hidden">
      <CardHeader className="px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-2">
          <div className="min-w-0 w-full sm:w-auto">
            <CardTitle className="text-base sm:text-lg font-medium text-primary truncate">
              5 Feedback Terbaru
            </CardTitle>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6 overflow-x-auto pb-2">
          <StatCard label="Total Feedback" value={feedbackStats.total} />
          <StatCard
            label="Total Feedback Selesai"
            value={feedbackStats.responded}
            className="!bg-[#EEFBD1]"
          />
          <StatCard
            label="Total Feedback Belum"
            value={feedbackStats.pending}
            className="!bg-[#FCE6CF]"
          />
        </div>

        <div className="w-full overflow-auto rounded-lg border border-[#EAEAEA]">
          <table className="w-full min-w-[1000px] text-sm">
            <thead className="bg-[#EAEAEA]">
              <tr>
                <th className="text-left px-4 py-2.5 font-medium">
                  Feedback ID
                </th>
                <th className="text-left px-4 py-2.5 font-medium">Tanggal</th>
                <th className="text-left px-4 py-2.5 font-medium">
                  Judul Feedback
                </th>
                <th className="text-left px-4 py-2.5 font-medium">Konten</th>
                <th className="text-left px-4 py-2.5 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {feedbacks.length > 0 ? (
                feedbacks.map((fb) => (
                  <tr
                    key={fb.id}
                    className="h-[50px] border-t border-[#EAEAEA]"
                  >
                    <td className="px-4">FB-{fb.id}</td>
                    <td className="px-4 whitespace-nowrap">
                      {new Date(fb.created_at).toLocaleDateString("id-ID")}
                    </td>
                    <td className="px-4 max-w-[300px] truncate">{fb.title}</td>
                    <td className="px-4 max-w-[300px] truncate">
                      {fb.content}
                    </td>
                    <td className="px-4">
                      <span
                        className={combineClasses(
                          "px-2 py-1 rounded text-xs",
                          fb.status === "RESPONDED"
                            ? "bg-[#EEFBD1] text-[#1F5305]"
                            : "bg-[#FCE6CF] text-[#CF0000]"
                        )}
                      >
                        {fb.status === "RESPONDED" ? "Selesai" : "Belum"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-4">
                    Tidak ada data feedback
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-600">
            Menampilkan{" "}
            {feedbacks.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}-
            {Math.min(currentPage * itemsPerPage, feedbackStats.total)} dari{" "}
            {feedbackStats.total} feedback
          </div>
          <div className="flex gap-2">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className={combineClasses(
                "p-2 rounded border",
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "hover:bg-gray-100 text-gray-600"
              )}
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={combineClasses(
                "p-2 rounded border",
                currentPage === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "hover:bg-gray-100 text-gray-600"
              )}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeedbackTable;
