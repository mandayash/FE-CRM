// app/(main)/feedback/page.tsx
// Update the handleFilterChange function and console logging

"use client";
import { useState, useEffect } from "react";
import FilterSearch, {
  ColumnVisibility,
} from "@/components/feedback/FilterSearch";
import FeedbackTable from "@/components/feedback/FeedbackTable";
import StatisticsCards from "@/components/feedback/stats/StatisticsCards";
import { useNotifications } from "@/context/NotificationContext";

export default function FeedbackPage() {
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleColumns, setVisibleColumns] = useState<ColumnVisibility>({
    id: true,
    date: true,
    user: true,
    type: true,
    lrtDate: true,
    station: true,
    feedback: true,
    documentation: true,
    rating: true,
    status: true,
    action: true,
  });

  // Get new feedback IDs and the function to mark them as read
  const { newFeedbackIds, markFeedbackAsRead } = useNotifications();

  const handleFilterChange = (newFilter: string) => {
    console.log(`Page received filter change: ${newFilter}`); // Add logging
    setFilter(newFilter);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleColumnChange = (columns: ColumnVisibility) => {
    setVisibleColumns(columns);
  };

  const handleFeedbackResponded = (feedbackId: string) => {
    // Mark feedback as read when any action is taken
    markFeedbackAsRead(feedbackId);
  };

  // Add useEffect to log when filter changes
  useEffect(() => {
    console.log(`Filter state changed to: ${filter}`);
  }, [filter]);

  return (
    <div className="container mx-auto px-4">
      {/* Statistics Cards */}
      <StatisticsCards />

      {/* Filter and Search */}
      <div className="mt-8 mb-6">
        <FilterSearch
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
          columns={visibleColumns}
          onColumnChange={handleColumnChange}
        />
      </div>

      {/* Feedback Table */}
      <FeedbackTable
        filter={filter}
        searchQuery={searchQuery}
        visibleColumns={visibleColumns}
        newFeedbackIds={newFeedbackIds}
        onFeedbackResponded={handleFeedbackResponded}
      />
    </div>
  );
}
