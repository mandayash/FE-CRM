"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";
import {
  MessageSquare,
  Menu,
  Trophy,
  Filter,
  Table,
  Search,
  Star,
  Check,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  FileText,
  Pencil,
  ArrowLeft,
} from "lucide-react";
import Image from "next/image";
import { userService } from "@/services/userService";
import { feedbackService, Feedback } from "@/services/feedbackService";
import {
  Table as UITable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";

// Interface untuk data yang dibutuhkan
interface UserInfo {
  id: number;
  name: string;
  email: string;
  phone: string;
  points: number;
  level: string;
  feedbackCount: number;
}

interface ColumnVisibility {
  id: boolean;
  date: boolean;
  type: boolean;
  date_lrt: boolean;
  station: boolean;
  content: boolean;
  document: boolean;
  rating: boolean;
  status: boolean;
  action: boolean;
}

// User Info Card Component
const UserInfoSection = ({ userInfo }: { userInfo: UserInfo }) => {
  // Gradient styles untuk level badge
  const getLevelGradient = (level: string) => {
    switch (level) {
      case "Bronze Level":
        return "linear-gradient(198deg, #CD7F32 20.34%, #E9967A 29.06%, #B87333 50.52%, #CD7F32 58.25%, #A46628 86.63%)";
      case "Silver Level":
        return "linear-gradient(198deg, #ADADAD 20.34%, #D2D2D2 29.06%, #BBB 50.52%, #A0A0A0 58.25%, #959595 86.63%)";
      case "Gold Level":
        return "linear-gradient(179deg, #FFD23D 35.57%, #EFD787 42.04%, #E1B831 57.97%, #EFD787 63.71%, rgba(242, 186, 0, 0.47) 84.77%)";
      case "Platinum Level":
        return "linear-gradient(244deg, #B09FFF 37.63%, #8C7BDB 41.94%, #BEB0FF 52.54%, #8C7BDB 56.36%, #CBC0FF 70.38%)";
      default:
        return "linear-gradient(198deg, #CD7F32 20.34%, #E9967A 29.06%, #B87333 50.52%, #CD7F32 58.25%, #A46628 86.63%)";
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
      {/* User Info Card */}
      <Card className="lg:col-span-2 overflow-hidden">
        <CardContent className="p-4 sm:p-6">
          <div className="space-y-4">
            {/* Header */}
            <h2 className="text-xl text-primary font-medium text-gray-800">
              Informasi User
            </h2>

            {/* Content Container */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              {/* Profile Image */}
              <div className="relative w-12 h-12 flex-shrink-0">
                <Image
                  src="/images/profile-placeholder.png"
                  alt="User Profile"
                  fill
                  className="rounded-full object-cover"
                />
              </div>

              {/* User Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                {/* <div>
                  <p className="text-xs sm:text-sm text-gray-500">Nama:</p>
                  <p className="text-sm sm:text-base font-medium truncate">
                    {userInfo.name}
                  </p>
                </div> */}
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">User Id:</p>
                  <p className="text-sm sm:text-base font-medium">
                    US-{userInfo.id}
                  </p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">Email:</p>
                  <p className="text-sm sm:text-base font-medium truncate">
                    {userInfo.email}
                  </p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">
                    No Telepon:
                  </p>
                  <p className="text-sm sm:text-base font-medium">
                    {userInfo.phone}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
        <Card className="bg-white overflow-hidden">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 flex items-center justify-center rounded-full bg-red-50 shadow-sm">
                <MessageSquare className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-lg text-primary font-medium text-gray-800">
                  Total Feedback
                </p>
                <p className="text-lg sm:text-xl lg:text-2xl font-semibold">
                  {userInfo.feedbackCount}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white overflow-hidden">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 flex items-center justify-center rounded-full bg-red-50 shadow-sm">
                <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
              </div>
              <div>
                <p className="text-lg text-primary font-medium text-gray-800">
                  Poin Level
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-lg sm:text-xl lg:text-2xl font-semibold">
                    {userInfo.points.toLocaleString()}
                  </p>
                  <div
                    className="px-2 py-1 text-xs rounded-lg font-medium"
                    style={{
                      background: getLevelGradient(userInfo.level),
                      color: "#303030",
                    }}
                  >
                    {userInfo.level}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Feedback Status Filter
const FeedbackFilter = ({
  onFilterChange,
  onSearch,
  columns,
  onColumnChange,
}) => {
  const [activeStatus, setActiveStatus] = useState("Semua");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isColumnMenuOpen, setIsColumnMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const statuses = ["Semua", "Selesai", "Belum"];

  const handleStatusChange = (status) => {
    setActiveStatus(status);

    // Map UI status names to API status values
    let apiStatus;
    if (status === "Selesai") {
      apiStatus = "RESPONDED";
    } else if (status === "Belum") {
      apiStatus = "PENDING";
    } else {
      apiStatus = "";
    }

    onFilterChange(apiStatus);
  };

  // Toggle column visibility
  const toggleColumn = (columnName) => {
    const updatedColumns = {
      ...columns,
      [columnName]: !columns[columnName],
    };
    onColumnChange(updatedColumns);
  };

  // Handle search with debounce
  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      onSearch(searchQuery);
    }, 300);

    return () => clearTimeout(debounceTimeout);
  }, [searchQuery, onSearch]);

  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4 sm:items-center">
      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
        {statuses.map((status) => (
          <button
            key={status}
            onClick={() => handleStatusChange(status)}
            className={`h-8 px-3 sm:px-4 flex-shrink-0 flex items-center justify-center text-xs font-medium tracking-wider rounded-lg transition-colors
              ${
                activeStatus === status
                  ? "bg-[#CF0000] text-[#FBFBFC]"
                  : "bg-gray-100 text-[#080808] hover:bg-gray-200"
              }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Search and Tools */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        <div className="relative flex-grow sm:flex-grow-0">
          <input
            type="text"
            placeholder="Cari berdasarkan judul, konten..."
            className="w-full sm:w-[283px] h-8 pl-10 pr-4 rounded-[20px] bg-[#E5E6E6] text-xs"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
            size={18}
          />
        </div>

        {/* Desktop Buttons */}
        <div className="hidden sm:flex items-center gap-2.5">
          <div className="relative">
            <button
              onClick={() => setIsColumnMenuOpen(!isColumnMenuOpen)}
              className="flex items-center gap-1.5 px-3 h-8 bg-white rounded-lg border text-xs hover:bg-gray-50 transition-colors"
            >
              <Table size={18} />
              Tampilkan Tabel
            </button>

            {/* Column Selection Dropdown */}
            {isColumnMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-1 z-10">
                <div className="px-2 py-1 text-xs font-semibold text-gray-600 border-b">
                  Toggle Columns
                </div>

                <div className="column-toggle-menu">
                  <div
                    className="flex items-center justify-between px-4 py-2 text-xs hover:bg-gray-50 cursor-pointer"
                    onClick={() => toggleColumn("id")}
                  >
                    <span>Feedback ID</span>
                    {columns.id && (
                      <Check size={16} className="text-green-600" />
                    )}
                  </div>

                  <div
                    className="flex items-center justify-between px-4 py-2 text-xs hover:bg-gray-50 cursor-pointer"
                    onClick={() => toggleColumn("date")}
                  >
                    <span>Tanggal</span>
                    {columns.date && (
                      <Check size={16} className="text-green-600" />
                    )}
                  </div>

                  {/* <div
                    className="flex items-center justify-between px-4 py-2 text-xs hover:bg-gray-50 cursor-pointer"
                    onClick={() => toggleColumn("type")}
                  >
                    <span>Jenis Feedback</span>
                    {columns.type && (
                      <Check size={16} className="text-green-600" />
                    )}
                  </div>

                  <div
                    className="flex items-center justify-between px-4 py-2 text-xs hover:bg-gray-50 cursor-pointer"
                    onClick={() => toggleColumn("date_lrt")}
                  >
                    <span>Tanggal LRT</span>
                    {columns.date_lrt && (
                      <Check size={16} className="text-green-600" />
                    )}
                  </div>

                  <div
                    className="flex items-center justify-between px-4 py-2 text-xs hover:bg-gray-50 cursor-pointer"
                    onClick={() => toggleColumn("station")}
                  >
                    <span>Stasiun</span>
                    {columns.station && (
                      <Check size={16} className="text-green-600" />
                    )}
                  </div> */}

                  <div
                    className="flex items-center justify-between px-4 py-2 text-xs hover:bg-gray-50 cursor-pointer"
                    onClick={() => toggleColumn("content")}
                  >
                    <span>Feedback</span>
                    {columns.content && (
                      <Check size={16} className="text-green-600" />
                    )}
                  </div>

                  {/* <div
                    className="flex items-center justify-between px-4 py-2 text-xs hover:bg-gray-50 cursor-pointer"
                    onClick={() => toggleColumn("document")}
                  >
                    <span>Dokumentasi</span>
                    {columns.document && (
                      <Check size={16} className="text-green-600" />
                    )}
                  </div>

                  <div
                    className="flex items-center justify-between px-4 py-2 text-xs hover:bg-gray-50 cursor-pointer"
                    onClick={() => toggleColumn("rating")}
                  >
                    <span>Penilaian</span>
                    {columns.rating && (
                      <Check size={16} className="text-green-600" />
                    )}
                  </div> */}

                  <div
                    className="flex items-center justify-between px-4 py-2 text-xs hover:bg-gray-50 cursor-pointer"
                    onClick={() => toggleColumn("status")}
                  >
                    <span>Status</span>
                    {columns.status && (
                      <Check size={16} className="text-green-600" />
                    )}
                  </div>

                  <div
                    className="flex items-center justify-between px-4 py-2 text-xs hover:bg-gray-50 cursor-pointer"
                    onClick={() => toggleColumn("action")}
                  >
                    <span>Aksi</span>
                    {columns.action && (
                      <Check size={16} className="text-green-600" />
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        <div className="relative sm:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center gap-1.5 px-3 h-8 bg-white rounded-lg border text-xs w-full justify-center hover:bg-gray-50 transition-colors"
          >
            <Menu size={18} />
            Menu
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-1 z-10">
              <button
                className="flex items-center gap-1.5 px-4 py-2 text-xs hover:bg-gray-50 w-full"
                onClick={() => {
                  setIsColumnMenuOpen(!isColumnMenuOpen);
                  setIsMenuOpen(false);
                }}
              >
                <Table size={18} />
                Toggle Kolom
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Star Rating Component
const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${
            star <= rating
              ? "fill-yellow-400 text-yellow-400"
              : "fill-gray-200 text-gray-200"
          }`}
        />
      ))}
    </div>
  );
};

// Feedback History Table Component
const FeedbackTable = ({
  feedbacks,
  columns,
  loading,
  error,
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  onSort,
  sortField,
}) => {
  const [viewedFeedbacks, setViewedFeedbacks] = useState<number[]>([]);

  // Load viewed feedbacks from localStorage
  useEffect(() => {
    const storedViewed = localStorage.getItem("viewed_feedbacks");
    if (storedViewed) {
      setViewedFeedbacks(JSON.parse(storedViewed));
    }
  }, []);

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

  // Calculate total pages
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

  if (!feedbacks || feedbacks.length === 0) {
    return (
      <div className="rounded-lg border p-8 text-center text-gray-500">
        Tidak ada data feedback untuk user ini.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <UITable>
        <TableHeader className="bg-[#EAEAEA]">
          <TableRow>
            <TableHead className="w-[50px] text-center">No</TableHead>

            {columns.id && (
              <TableHead
                onClick={() => onSort("id")}
                className="cursor-pointer"
              >
                <div className="flex items-center gap-1.5 text-[#080808] font-medium">
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

            {/* {columns.type && <TableHead>Jenis Feedback</TableHead>}

            {columns.date_lrt && <TableHead>Tanggal LRT</TableHead>}

            {columns.station && <TableHead>Stasiun</TableHead>} */}

            {columns.content && <TableHead>Feedback</TableHead>}

            {/* {columns.document && <TableHead>Dokumentasi</TableHead>}

            {columns.rating && <TableHead>Penilaian</TableHead>} */}

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
            const rowNumber = startIndex + index + 1;

            return (
              <TableRow key={feedback.id} className="h-[50px] relative">
                <TableCell className="text-center font-medium text-gray-500">
                  {rowNumber}
                </TableCell>

                {columns.id && (
                  <TableCell className="relative">
                    {isNew && (
                      <span className="absolute w-2 h-2 bg-red-500 rounded-full -left-1 top-1/2 transform -translate-y-1/2"></span>
                    )}
                    FB-{feedback.id}
                  </TableCell>
                )}

                {columns.date && (
                  <TableCell>{formatDate(feedback.created_at)}</TableCell>
                )}

                {/* {columns.type && (
                  <TableCell>{feedback.type || "Kritik dan Saran"}</TableCell>
                )}

                {columns.date_lrt && (
                  <TableCell>{feedback.date_lrt || "-"}</TableCell>
                )}

                {columns.station && (
                  <TableCell>{feedback.station || "DJKA"}</TableCell>
                )} */}

                {columns.content && (
                  <TableCell className="max-w-[200px] truncate">
                    {feedback.content}
                  </TableCell>
                )}

                {/* {columns.document && (
                  <TableCell className="text-gray-500">
                    {feedback.document || "-"}
                  </TableCell>
                )}

                {columns.rating && (
                  <TableCell>
                    <StarRating rating={feedback.rating || 0} />
                  </TableCell>
                )} */}

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
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <FileText size={18} className="text-gray-600" />
                        </button>
                      ) : (
                        <>
                          <button className="p-1 hover:bg-gray-100 rounded">
                            <Pencil size={18} className="text-gray-600" />
                          </button>
                        </>
                      )}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </UITable>

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
    </div>
  );
};

// Main Page Component
export const UserFeedbackHistory = ({ userId }) => {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [sortField, setSortField] = useState<string>("id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const handleGoBack = () => {
    router.push("/users");
  };

  // Column visibility state
  const [columns, setColumns] = useState<ColumnVisibility>({
    id: true,
    date: true,
    type: true,
    date_lrt: true,
    station: true,
    content: true,
    document: true,
    rating: true,
    status: true,
    action: true,
  });

  // Konversi poin ke level
  const getLevel = (points?: number): string => {
    if (!points) return "Bronze Level";
    if (points < 50) return "Bronze Level";
    if (points < 100) return "Silver Level";
    if (points < 200) return "Gold Level";
    return "Platinum Level";
  };

  // Fetch user info dan feedback
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        // Fetch user info
        const id = parseInt(userId);
        if (isNaN(id)) {
          throw new Error("Invalid user ID");
        }

        const userData = await userService.getUserById(id);

        // Fetch user feedbacks
        const userFeedbacks = await feedbackService.getFeedbacksByUserId(id);

        // Perbaiki data user
        const enhancedUserInfo = {
          ...userData,
          phone: userData.phone || "-", // Default jika tidak ada
          points: userData.points || 0,
          level: getLevel(userData.points),
          feedbackCount: userFeedbacks.total,
        };

        setUserInfo(enhancedUserInfo);
        setFeedbacks(userFeedbacks.feedbacks);
        setFilteredFeedbacks(userFeedbacks.feedbacks);
        setError(null);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Gagal memuat data pengguna. Silakan coba lagi nanti.");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  // Handle sorting
  const handleSort = (field: string) => {
    if (sortField === field) {
      // Toggle sort order if same field
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // Set new field and default to ascending
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // Filter feedbacks based on status, search query, and sorting
  useEffect(() => {
    if (!feedbacks.length) return;

    let filtered = [...feedbacks];

    // Filter by status
    if (statusFilter) {
      filtered = filtered.filter(
        (feedback) => feedback.status === statusFilter
      );
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (feedback) =>
          feedback.id.toString().includes(query) ||
          feedback.title?.toLowerCase().includes(query) ||
          feedback.content?.toLowerCase().includes(query)
      );
    }

    // Sort the filtered data
    filtered.sort((a, b) => {
      let comparison = 0;

      if (sortField === "id") {
        comparison = a.id - b.id;
      } else if (sortField === "date") {
        comparison =
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      } else if (sortField === "status") {
        comparison = a.status.localeCompare(b.status);
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    setFilteredFeedbacks(filtered);
    // Reset to first page when filters change
    setCurrentPage(1);
  }, [feedbacks, statusFilter, searchQuery, sortField, sortOrder]);

  // Get current page items
  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredFeedbacks.slice(startIndex, endIndex);
  };

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  if (!userInfo) {
    return (
      <div className="p-8 text-center text-red-500">User tidak ditemukan</div>
    );
  }

  return (
    <div className="space-y-6 py-6">
      <div className="flex items-center justify-between ">
        <div className="flex items-center gap-3">
          <button
            onClick={handleGoBack}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Kembali ke daftar pengguna"
          >
            <ArrowLeft size={20} className="text-black" />
          </button>
          <h1 className="text-2xl font-medium text-[#CF0000]">
            Data Pengguna | <span className="text-black">Lihat Riwayat</span>
          </h1>
        </div>
      </div>

      <div className="space-y-6">
        <UserInfoSection userInfo={userInfo} />

        <FeedbackFilter
          onFilterChange={setStatusFilter}
          onSearch={setSearchQuery}
          columns={columns}
          onColumnChange={setColumns}
        />

        <FeedbackTable
          feedbacks={getCurrentPageItems()}
          loading={loading}
          error={error}
          columns={columns}
          currentPage={currentPage}
          totalItems={filteredFeedbacks.length}
          itemsPerPage={itemsPerPage}
          sortField={sortField}
          onSort={handleSort}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
        />
      </div>
    </div>
  );
};
