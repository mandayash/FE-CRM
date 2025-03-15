// components/feedback/FeedbackTable.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  Pencil,
  Trash,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  FileText,
} from "lucide-react";
import { useRouter } from "next/navigation";
import DeleteModal from "./DeleteModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import { ColumnVisibility } from "./FilterSearch";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface FeedbackTableProps {
  feedbacks: any[];
  loading: boolean;
  error: string | null;
  columns: ColumnVisibility;
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  sortOrder: "asc" | "desc";
  onSort: (field: string) => void; // Pastikan ini ada
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (size: number) => void;
  onSortToggle: () => void;
}

const FeedbackTable: React.FC<FeedbackTableProps> = ({
  feedbacks,
  loading,
  error,
  columns,
  currentPage,
  totalItems,
  itemsPerPage,
  sortField,
  onSort,
  onPageChange,
  onItemsPerPageChange,
}) => {
  const router = useRouter();
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [viewedFeedbacks, setViewedFeedbacks] = useState<number[]>([]);

  // Load viewed feedbacks from localStorage
  useEffect(() => {
    const storedViewed = localStorage.getItem("viewed_feedbacks");
    if (storedViewed) {
      setViewedFeedbacks(JSON.parse(storedViewed));
    }
  }, []);

  // Fungsi untuk menghapus feedback
  const handleDeleteClick = (feedback) => {
    setSelectedFeedback(feedback);
    setShowDeleteConfirmation(true);
  };

  const handleConfirmDelete = async () => {
    try {
      // Implementasi penghapusan feedback di sini
      setShowDeleteConfirmation(false);
      setShowDeleteSuccess(true);
    } catch (err) {
      console.error("Error deleting feedback:", err);
    }
  };

  // Fungsi untuk format tanggal
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("id-ID", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  // Fungsi untuk menandai feedback telah dilihat
  const handleViewFeedback = (id) => {
    if (!viewedFeedbacks.includes(id)) {
      const newViewedFeedbacks = [...viewedFeedbacks, id];
      setViewedFeedbacks(newViewedFeedbacks);
      localStorage.setItem(
        "viewed_feedbacks",
        JSON.stringify(newViewedFeedbacks)
      );
    }
  };

  // Cek apakah feedback baru
  const isNewFeedback = (feedback) => {
    const createdDate = new Date(feedback.created_at);
    const now = new Date();
    const diffHours =
      (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60);

    return (
      diffHours < 24 &&
      feedback.status === "PENDING" &&
      !viewedFeedbacks.includes(feedback.id)
    );
  };

  // Hitung total halaman
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Calculate starting index for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;

  // Generate pagination numbers
  const getPaginationNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first page, last page, and pages around current page
      pages.push(1);

      // Add middle pages around current page
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      if (startPage > 2) pages.push("...");

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  if (loading) {
    return (
      <div className="animate-pulse p-4 bg-gray-100 rounded-lg">
        Loading feedback data...
      </div>
    );
  }

  if (error) {
    return <div className="p-4 bg-red-50 text-red-600 rounded-lg">{error}</div>;
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader className="bg-[#EAEAEA]">
          <TableRow>
            <TableHead className="w-[50px] text-center">No</TableHead>
            {columns.id && (
              <TableHead
                onClick={() => onSort("id")}
                className="flex items-center gap-1.5 text-[#080808] font-medium cursor-pointer"
              >
                <div className="flex items-center gap-1.5">
                  Feedback Id
                  <ArrowUpDown
                    size={12}
                    className={
                      sortField === "id" ? "text-[#CF0000]" : "text-[#080808]"
                    }
                  />
                </div>
              </TableHead>
            )}
            {columns.date && <TableHead>Tanggal</TableHead>}
            {columns.userId && <TableHead>User ID</TableHead>}
            {columns.title && <TableHead>Judul Feedback</TableHead>}
            {columns.content && <TableHead>Konten Feedback</TableHead>}
            {columns.status && (
              <TableHead
                onClick={() => onSort("status")}
                className="cursor-pointer"
              >
                <div className="flex items-center gap-1.5 text-[#080808] font-medium">
                  Status
                  <ArrowUpDown
                    size={12}
                    className={
                      sortField === "status"
                        ? "text-[#CF0000]"
                        : "text-[#080808]"
                    }
                  />
                </div>
              </TableHead>
            )}
            {columns.action && <TableHead>Aksi</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {feedbacks.map((feedback, index) => {
            const isNew = isNewFeedback(feedback);
            // Calculate the row number based on current page and index
            const rowNumber = startIndex + index + 1;

            return (
              <TableRow key={feedback.id} className="h-[50px] relative">
                <TableCell className="text-center font-medium text-gray-500">
                  {rowNumber}
                </TableCell>
                {columns.id && (
                  <TableCell className="relative">
                    {/* Red dot for new feedback */}
                    {isNew && (
                      <span className="absolute w-2 h-2 bg-red-500 rounded-full -left-1 top-1/2 transform -translate-y-1/2"></span>
                    )}
                    FB-{feedback.id}
                  </TableCell>
                )}
                {columns.date && (
                  <TableCell>{formatDate(feedback.created_at)}</TableCell>
                )}
                {columns.userId && <TableCell>{feedback.user_id}</TableCell>}
                {columns.title && (
                  <TableCell className="max-w-[200px] truncate">
                    {feedback.title}
                  </TableCell>
                )}
                {columns.content && (
                  <TableCell className="max-w-[200px] truncate">
                    {feedback.content}
                  </TableCell>
                )}
                {columns.status && (
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded text-xs
                      ${
                        feedback.status === "RESPONDED"
                          ? "bg-[#EEFBD1] text-[#1F5305]"
                          : "bg-[#FCE6CF] text-[#CF0000]"
                      }`}
                    >
                      {feedback.status === "RESPONDED" ? "Selesai" : "Belum"}
                    </span>
                  </TableCell>
                )}
                {columns.action && (
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      {feedback.status === "RESPONDED" ? (
                        // Ikon untuk feedback yang sudah direspon
                        <button
                          onClick={() => {
                            handleViewFeedback(feedback.id);
                            router.push(`/feedback/${feedback.id}/reply`);
                          }}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <FileText size={18} className="text-gray-600" />
                        </button>
                      ) : (
                        // Ikon untuk feedback yang belum direspon
                        <>
                          <button
                            onClick={() => {
                              handleViewFeedback(feedback.id);
                              router.push(`/feedback/${feedback.id}`);
                            }}
                            className="p-1 hover:bg-gray-100 rounded"
                          >
                            <Pencil size={18} className="text-gray-600" />
                          </button>
                          {/* <button
                            onClick={() => handleDeleteClick(feedback)}
                            className="p-1 hover:bg-gray-100 rounded"
                          >
                            <Trash size={18} className="text-gray-600" />
                          </button> */}
                        </>
                      )}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex items-center justify-between py-4">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-gray-500">Show</span>
          <select
            className="bg-[#EAEAEA] px-2 py-1.5 rounded"
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(parseInt(e.target.value))}
          >
            <option>12</option>
            <option>24</option>
            <option>36</option>
          </select>
          <span className="text-gray-500">
            out of {totalItems.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="p-1.5 bg-[#EAEAEA] rounded-lg disabled:opacity-50"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={16} className="text-[#080808]" />
          </button>

          {getPaginationNumbers().map((page, i) => (
            <button
              key={i}
              onClick={() =>
                typeof page === "number" ? onPageChange(page) : null
              }
              className={`w-[30px] h-[30px] flex items-center justify-center rounded-lg text-xs
                ${
                  page === currentPage
                    ? "bg-[#CF0000] text-white"
                    : page === "..."
                    ? "bg-transparent cursor-default"
                    : "bg-[#EAEAEA] text-[#080808]"
                }`}
            >
              {page}
            </button>
          ))}

          <button
            className="p-1.5 bg-[#EAEAEA] rounded-lg disabled:opacity-50"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight size={16} className="text-[#080808]" />
          </button>
        </div>
      </div>

      {/* Modals */}
      <DeleteConfirmationModal
        isOpen={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        onConfirm={handleConfirmDelete}
        selectedCount={selectedFeedback ? 1 : 0}
      />

      <DeleteModal
        isOpen={showDeleteSuccess}
        onClose={() => setShowDeleteSuccess(false)}
      />
    </div>
  );
};

export default FeedbackTable;
