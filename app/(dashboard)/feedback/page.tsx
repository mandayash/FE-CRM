"use client";
import { useState, useEffect } from "react";
import StatisticsCards from "@/components/feedback/stats/StatisticsCards";
import FilterSearch, {
  ColumnVisibility,
} from "@/components/feedback/FilterSearch";
import FeedbackTable from "@/components/feedback/FeedbackTable";
import { feedbackService } from "@/services/feedbackService";

export default function FeedbackPage() {
  // State untuk data feedback
  const [feedbacks, setFeedbacks] = useState([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State untuk pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [totalItems, setTotalItems] = useState(0);

  // State untuk filtering dan sorting
  const [statusFilter, setStatusFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState("id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // State untuk visibilitas kolom
  const [columns, setColumns] = useState<ColumnVisibility>({
    id: true,
    date: true,
    userId: true,
    title: true,
    content: true,
    status: true,
    action: true,
  });

  // Fungsi untuk memuat data feedback
  const loadFeedbacks = async () => {
    try {
      setLoading(true);

      // Ambil data dari API
      const response = await feedbackService.getAllFeedbacks(
        currentPage,
        itemsPerPage
      );

      // Simpan total items dan feedback
      setFeedbacks(response.feedbacks);
      setTotalItems(response.total);

      // Terapkan filter dan sorting pada data
      applyFilters(response.feedbacks);

      setError(null);
    } catch (err) {
      console.error("Failed to fetch feedbacks:", err);
      setError("Gagal memuat data feedback");
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk menerapkan filter dan sorting
  const applyFilters = (data) => {
    if (!Array.isArray(data) || data.length === 0) return;

    let filtered = [...data];

    // Filter berdasarkan status
    if (statusFilter) {
      console.log("Filtering by status:", statusFilter);
      filtered = filtered.filter((item) => item.status === statusFilter);
    }

    // Filter berdasarkan pencarian
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      console.log("Filtering by search:", query);
      filtered = filtered.filter(
        (item) =>
          `FB-${item.id}`.toLowerCase().includes(query) ||
          item.title?.toLowerCase().includes(query) ||
          item.content?.toLowerCase().includes(query)
      );
    }

    // Sortir berdasarkan field yang dipilih
    console.log("Sorting by field:", sortField, "in order:", sortOrder);

    filtered.sort((a, b) => {
      if (sortField === "id") {
        // Sorting numerik untuk ID
        return sortOrder === "asc" ? a.id - b.id : b.id - a.id;
      } else if (sortField === "status") {
        // Memastikan kedua status ada dan bisa diproses
        const statusA = a.status || "";
        const statusB = b.status || "";

        // Untuk status, sorted "RESPONDED" (Selesai) dan "PENDING" (Belum)
        if (sortOrder === "asc") {
          return statusA.localeCompare(statusB);
        } else {
          return statusB.localeCompare(statusA);
        }
      }
      // Default sort by id descending
      return b.id - a.id;
    });

    console.log("Filtered and sorted feedbacks:", filtered.length);
    setFilteredFeedbacks(filtered);
  };

  // Load data saat komponen mount atau parameter pagination berubah
  useEffect(() => {
    loadFeedbacks();
  }, [currentPage, itemsPerPage]);

  // Terapkan filter dan sorting saat parameter berubah
  useEffect(() => {
    if (feedbacks.length > 0) {
      applyFilters(feedbacks);
    }
  }, [statusFilter, searchQuery, sortField, sortOrder]);

  // Handler untuk perubahan filter status
  const handleFilterChange = (filter) => {
    setStatusFilter(filter);
    setCurrentPage(1); // Reset ke halaman pertama saat filter berubah
  };

  // Handler untuk pencarian
  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset ke halaman pertama saat pencarian berubah
  };

  // Handler untuk perubahan kolom yang ditampilkan
  const handleColumnChange = (newColumns) => {
    setColumns(newColumns);
  };

  // Handler untuk sorting
  const handleSort = (field) => {
    if (field === sortField) {
      // Jika field sama, toggle urutan sort
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // Jika field berbeda, set field baru dan default ke desc
      setSortField(field);
      setSortOrder("desc");
    }
  };

  // Handler untuk refresh data
  const handleRefresh = () => {
    loadFeedbacks();
  };

  return (
    <div className="space-y-6">
      <StatisticsCards />
      <FilterSearch
        onFilterChange={handleFilterChange}
        onSearch={handleSearch}
        columns={columns}
        onColumnChange={handleColumnChange}
      />
      <FeedbackTable
        feedbacks={filteredFeedbacks}
        loading={loading}
        error={error}
        columns={columns}
        currentPage={currentPage}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        sortField={sortField}
        sortOrder={sortOrder}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={setItemsPerPage}
        onSort={handleSort}
        onRefresh={handleRefresh}
      />
    </div>
  );
}
