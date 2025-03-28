"use client";

import { useState } from "react";
import StatisticsCards from "@/components/feedback/stats/StatisticsCards";
import FilterSearch, {
  ColumnVisibility,
} from "@/components/feedback/FilterSearch";
import FeedbackTable from "@/components/feedback/FeedbackTable";

export default function FeedbackPage() {
  const [filterStatus, setFilterStatus] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [columns, setColumns] = useState<ColumnVisibility>({
    id: true,
    date: true,
    userId: true,
    title: true,
    content: true,
    station: true,
    rating: true,
    image: true,
    category: true,
    status: true,
    action: true,
  });

  const [sortField, setSortField] = useState("id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  return (
    <div className="space-y-6">
      <StatisticsCards />

      <FilterSearch
        onFilterChange={setFilterStatus}
        onSearch={setSearchQuery}
        columns={columns}
        onColumnChange={setColumns}
      />

      <FeedbackTable
        filterStatus={filterStatus}
        searchQuery={searchQuery}
        columns={columns}
        sortOrder={sortOrder}
        sortField={sortField}
        onSort={(field) => {
          if (field === sortField) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
          } else {
            setSortField(field);
            setSortOrder("desc");
          }
        }}
        onSortToggle={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
      />
    </div>
  );
}
