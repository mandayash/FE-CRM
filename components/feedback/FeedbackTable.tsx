// components/feedback/FeedbackTable.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  Star,
  Pencil,
  Trash,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  FileText,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { useRouter } from "next/navigation";
import DeleteModal from "./DeleteModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import { feedbackService, UiFeedback } from "@/services/feedback_service";
import { ColumnVisibility } from "./FilterSearch";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export interface FeedbackTableProps {
  filter?: string;
  searchQuery?: string;
  visibleColumns: ColumnVisibility;
  newFeedbackIds?: string[]; // Add this for tracking new feedback
  onFeedbackResponded?: (id: string) => void; // Add this for marking feedback as read
}

// Define sort directions
type SortDirection = "asc" | "desc" | "none";

// Define sort keys
type SortKey =
  | "id"
  | "date"
  | "user"
  | "type"
  | "lrtDate"
  | "station"
  | "feedback"
  | "documentation"
  | "rating"
  | "status";

const FeedbackTable = ({
  filter = "all",
  searchQuery = "",
  visibleColumns,
  newFeedbackIds = [], // Default to empty array
  onFeedbackResponded, // Function to call when feedback is acted upon
}: FeedbackTableProps) => {
  const router = useRouter();
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [selectedFeedbacks, setSelectedFeedbacks] = useState<UiFeedback[]>([]);
  const [feedbacks, setFeedbacks] = useState<UiFeedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [sortKey, setSortKey] = useState<SortKey>("id");
  const [sortDirection, setSortDirection] = useState<SortDirection>("none");

  // Helper function to extract file name from URL or path
  const getFileNameFromUrl = (url: string): string => {
    if (!url) return "";

    // For URLs, extract the file name
    if (url.includes("/")) {
      const parts = url.split("/");
      return parts[parts.length - 1];
    }

    // If it's already just a filename, return it as is
    return url;
  };

  // Format feedback ID to LRT-XXXX format
  const formatFeedbackId = (id: string): string => {
    if (!id) return "LRT-0000";
    const idPart = id.length >= 4 ? id.substring(0, 4) : id.padEnd(4, "0");
    return `LRT-${idPart}`;
  };

  const fetchFeedbacks = useCallback(async () => {
    setLoading(true);
    console.log(`Fetching feedbacks with filter: ${filter}`); // Add logging

    try {
      const result = await feedbackService.getAllFeedbacks(filter);
      console.log(`Received ${result.feedbacks.length} feedbacks from API`); // Add logging

      // Apply search filter if needed
      let filteredFeedbacks = result.feedbacks;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filteredFeedbacks = filteredFeedbacks.filter(
          (feedback) =>
            // Check multiple fields for the search query
            feedback.message.toLowerCase().includes(query) ||
            feedback.user.email.toLowerCase().includes(query) ||
            feedback.user.name.toLowerCase().includes(query) ||
            feedback.id.toLowerCase().includes(query) ||
            feedback.stationName.toLowerCase().includes(query) || // Search by station name
            feedback.type.toLowerCase().includes(query) || // Search by feedback type
            feedback.date.toLowerCase().includes(query) || // Search by date
            getFileNameFromUrl(feedback.documentation)
              .toLowerCase()
              .includes(query) || // Search by documentation
            feedback.status.toLowerCase().includes(query) // Search by status
        );
      }

      setTotalResults(filteredFeedbacks.length);

      // Apply sorting if active
      if (sortDirection !== "none") {
        filteredFeedbacks = sortFeedbacks(
          filteredFeedbacks,
          sortKey,
          sortDirection
        );
      }

      // Apply pagination
      const startIndex = (currentPage - 1) * itemsPerPage;
      const paginatedFeedbacks = filteredFeedbacks.slice(
        startIndex,
        startIndex + itemsPerPage
      );

      setFeedbacks(paginatedFeedbacks);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
      setLoading(false);
      setFeedbacks([]);
    }
  }, [filter, searchQuery, currentPage, itemsPerPage, sortKey, sortDirection]);

  // Function to handle sorting
  const sortFeedbacks = (
    data: UiFeedback[],
    key: SortKey,
    direction: SortDirection
  ) => {
    return [...data].sort((a, b) => {
      let valueA, valueB;

      // Extract the correct values based on the sort key
      switch (key) {
        case "id":
          valueA = a.id;
          valueB = b.id;
          break;
        case "date":
          valueA = new Date(a.date).getTime();
          valueB = new Date(b.date).getTime();
          break;
        case "user":
          valueA = a.user.name.toLowerCase();
          valueB = b.user.name.toLowerCase();
          break;
        case "type":
          valueA = a.type.toLowerCase();
          valueB = b.type.toLowerCase();
          break;
        case "lrtDate":
          valueA = new Date(a.date).getTime();
          valueB = new Date(b.date).getTime();
          break;
        case "station":
          valueA = a.stationName.toLowerCase();
          valueB = b.stationName.toLowerCase();
          break;
        case "feedback":
          valueA = a.message.toLowerCase();
          valueB = b.message.toLowerCase();
          break;
        case "documentation":
          valueA = getFileNameFromUrl(a.documentation).toLowerCase();
          valueB = getFileNameFromUrl(b.documentation).toLowerCase();
          break;
        case "rating":
          valueA = a.rating;
          valueB = b.rating;
          break;
        case "status":
          valueA = a.status;
          valueB = b.status;
          break;
        default:
          valueA = a.id;
          valueB = b.id;
      }

      // Compare values based on direction
      if (direction === "asc") {
        return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
      } else {
        return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
      }
    });
  };

  // Function to handle sort click
  const handleSort = (key: SortKey) => {
    // If clicking the same column, cycle through sort directions
    if (key === sortKey) {
      const nextDirections: Record<SortDirection, SortDirection> = {
        none: "asc",
        asc: "desc",
        desc: "none",
      };
      setSortDirection(nextDirections[sortDirection]);
    } else {
      // If clicking a different column, set it as the sort key and default to ascending
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  // Get sort icon based on current state
  const getSortIcon = (key: SortKey) => {
    if (sortKey !== key) {
      return <ArrowUpDown size={12} className="text-[#080808]" />;
    }

    if (sortDirection === "asc") {
      return <ArrowUp size={12} className="text-[#080808]" />;
    }

    if (sortDirection === "desc") {
      return <ArrowDown size={12} className="text-[#080808]" />;
    }

    return <ArrowUpDown size={12} className="text-[#080808]" />;
  };

  useEffect(() => {
    fetchFeedbacks();
  }, [fetchFeedbacks]);

  const handleDeleteClick = (feedback: UiFeedback) => {
    setSelectedFeedbacks([feedback]);
    setShowDeleteConfirmation(true);
  };

  const handleConfirmDelete = async () => {
    try {
      for (const feedback of selectedFeedbacks) {
        await feedbackService.deleteFeedback(feedback.id);
      }
      setShowDeleteConfirmation(false);
      setShowDeleteSuccess(true);
      fetchFeedbacks();
    } catch (error) {
      console.error("Error deleting feedback:", error);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // Generate pagination array
  const getPaginationArray = () => {
    const totalPages = Math.ceil(totalResults / itemsPerPage);
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 3) {
      return [1, 2, 3, 4, "...", totalPages];
    }

    if (currentPage >= totalPages - 2) {
      return [
        1,
        "...",
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPages,
    ];
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-[400px] bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader className="bg-[#EAEAEA]">
          <TableRow>
            <TableCell className="w-[15px] p-2.5">
              <input
                type="checkbox"
                className="w-[15px] h-[15px] border-[#C0C0C0] rounded"
              />
            </TableCell>
            {visibleColumns.id && (
              <TableHead className="cursor-pointer">
                <div className="flex items-center gap-1.5 text-[#080808] font-medium">
                  Feedback Id
                </div>
              </TableHead>
            )}
            {visibleColumns.date && (
              <TableHead className="cursor-pointer">
                <div className="flex items-center gap-1.5 text-[#080808] font-medium">
                  Tanggal
                </div>
              </TableHead>
            )}
            {visibleColumns.user && (
              <TableHead className="cursor-pointer">
                <div className="flex items-center gap-1.5 text-[#080808] font-medium">
                  User
                </div>
              </TableHead>
            )}
            {visibleColumns.type && (
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("type")}
              >
                <div className="flex items-center gap-1.5 text-[#080808] font-medium">
                  Jenis Feedback
                  {getSortIcon("type")}
                </div>
              </TableHead>
            )}
            {visibleColumns.station && (
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("station")}
              >
                <div className="flex items-center gap-1.5 text-[#080808] font-medium">
                  Stasiun
                  {getSortIcon("station")}
                </div>
              </TableHead>
            )}
            {visibleColumns.feedback && (
              <TableHead className="cursor-pointer">
                <div className="flex items-center gap-1.5 text-[#080808] font-medium">
                  Feedback
                </div>
              </TableHead>
            )}
            {visibleColumns.documentation && (
              <TableHead className="cursor-pointer w-[100px]">
                <div className="flex items-center gap-1.5 text-[#080808] font-medium">
                  Dokumentasi
                </div>
              </TableHead>
            )}
            {visibleColumns.rating && (
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("rating")}
              >
                <div className="flex items-center gap-1.5 text-[#080808] font-medium">
                  Penilaian
                  {getSortIcon("rating")}
                </div>
              </TableHead>
            )}
            {visibleColumns.status && (
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("status")}
              >
                <div className="flex items-center gap-1.5 text-[#080808] font-medium">
                  Status
                  {getSortIcon("status")}
                </div>
              </TableHead>
            )}
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {feedbacks.map((feedback) => (
            <TableRow key={feedback.id} className="h-[50px]">
              <TableCell className="p-2.5">
                <input
                  type="checkbox"
                  className="w-[15px] h-[15px] border-[#C0C0C0] rounded"
                />
              </TableCell>
              {visibleColumns.id && (
                <TableCell>
                  <div className="flex items-center gap-2">
                    {formatFeedbackId(feedback.id)}
                    {newFeedbackIds.includes(feedback.id) && (
                      <span className="w-2 h-2 bg-red-500 rounded-full inline-block" />
                    )}
                  </div>
                </TableCell>
              )}
              {visibleColumns.date && <TableCell>{feedback.date}</TableCell>}
              {visibleColumns.user && (
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Image
                      src={feedback.user.avatar}
                      alt={feedback.user.name}
                      width={30}
                      height={30}
                      className="rounded-full"
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        {feedback.user.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {feedback.user.email}
                      </span>
                    </div>
                  </div>
                </TableCell>
              )}
              {visibleColumns.type && <TableCell>{feedback.type}</TableCell>}
              {visibleColumns.station && (
                <TableCell>{feedback.stationName}</TableCell>
              )}
              {visibleColumns.feedback && (
                <TableCell
                  className="max-w-[200px] truncate"
                  title={feedback.message}
                >
                  {feedback.message}
                </TableCell>
              )}
              {visibleColumns.documentation && (
                <TableCell
                  className="max-w-[100px] truncate"
                  title={feedback.documentation}
                >
                  {getFileNameFromUrl(feedback.documentation)}
                </TableCell>
              )}
              {visibleColumns.rating && (
                <TableCell>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={20}
                        className={
                          i < feedback.rating
                            ? "fill-[#E5B12F] text-[#E5B12F]"
                            : "fill-gray-200 text-gray-200"
                        }
                      />
                    ))}
                  </div>
                </TableCell>
              )}
              {visibleColumns.status && (
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded text-xs
              ${
                feedback.status === "Selesai"
                  ? "bg-[#EEFBD1] text-[#1F5305]"
                  : "bg-[#FCE6CF] text-[#CF0000]"
              }`}
                  >
                    {feedback.status}
                  </span>
                </TableCell>
              )}
              <TableCell>
                <div className="flex items-center gap-1.5">
                  {feedback.status === "Selesai" ? (
                    <button
                      onClick={() => {
                        router.push(`/feedback/${feedback.id}/reply`);
                        // Mark as viewed when clicking to view response
                        if (
                          newFeedbackIds.includes(feedback.id) &&
                          onFeedbackResponded
                        ) {
                          onFeedbackResponded(feedback.id);
                        }
                      }}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <FileText size={18} className="text-gray-600" />
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          router.push(`/feedback/${feedback.id}`);
                          // Mark as viewed when clicking to respond
                          if (
                            newFeedbackIds.includes(feedback.id) &&
                            onFeedbackResponded
                          ) {
                            onFeedbackResponded(feedback.id);
                          }
                        }}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <Pencil size={18} className="text-gray-600" />
                      </button>
                      <button
                        onClick={() => {
                          handleDeleteClick(feedback);
                          // Mark as viewed when clicking to delete
                          if (
                            newFeedbackIds.includes(feedback.id) &&
                            onFeedbackResponded
                          ) {
                            onFeedbackResponded(feedback.id);
                          }
                        }}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <Trash size={18} className="text-gray-600" />
                      </button>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex items-center justify-between py-4">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-gray-500">Show</span>
          <select
            className="bg-[#EAEAEA] px-2 py-1.5 rounded"
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
          >
            <option value="12">12</option>
            <option value="24">24</option>
            <option value="36">36</option>
          </select>
          <span className="text-gray-500">
            out of {totalResults.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="p-1.5 bg-[#EAEAEA] rounded-lg"
            onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft
              size={16}
              className={`${
                currentPage === 1 ? "text-gray-400" : "text-[#080808]"
              }`}
            />
          </button>

          {getPaginationArray().map((page, i) => (
            <button
              key={i}
              onClick={() => typeof page === "number" && handlePageChange(page)}
              className={`w-[30px] h-[30px] flex items-center justify-center rounded-lg text-xs
                ${
                  page === currentPage
                    ? "bg-[#CF0000] text-white"
                    : "bg-[#EAEAEA] text-[#080808]"
                }`}
            >
              {page}
            </button>
          ))}

          <button
            className="p-1.5 bg-[#EAEAEA] rounded-lg"
            onClick={() =>
              currentPage < Math.ceil(totalResults / itemsPerPage) &&
              handlePageChange(currentPage + 1)
            }
            disabled={currentPage === Math.ceil(totalResults / itemsPerPage)}
          >
            <ChevronRight
              size={16}
              className={`${
                currentPage === Math.ceil(totalResults / itemsPerPage)
                  ? "text-gray-400"
                  : "text-[#080808]"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Modals */}
      <DeleteConfirmationModal
        isOpen={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        onConfirm={handleConfirmDelete}
        selectedCount={selectedFeedbacks.length}
      />

      <DeleteModal
        isOpen={showDeleteSuccess}
        onClose={() => setShowDeleteSuccess(false)}
      />
    </div>
  );
};

export default FeedbackTable;
