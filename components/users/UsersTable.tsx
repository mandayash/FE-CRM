// components/users/UsersTable.tsx
"use client";

import Link from "next/link";
import React, { useState, useEffect, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { userService, User } from "@/services/userService";
import { feedbackService } from "@/services/feedbackService";

// Interface untuk menambahkan properti yang diperlukan tapi tidak ada di User asli
interface EnhancedUser extends User {
  totalFeedback: number;
  level: string;
}

// Komponen badge untuk level
const LevelBadge = ({ level }: { level: string }) => {
  const badgeStyles = {
    "Bronze Level": {
      background:
        "linear-gradient(198deg, #CD7F32 20.34%, #E9967A 29.06%, #B87333 50.52%, #CD7F32 58.25%, #A46628 86.63%)",
      text: "#303030",
    },
    "Silver Level": {
      background:
        "linear-gradient(198deg, #ADADAD 20.34%, #D2D2D2 29.06%, #BBB 50.52%, #A0A0A0 58.25%, #959595 86.63%)",
      text: "#303030",
    },
    "Gold Level": {
      background:
        "linear-gradient(179deg, #FFD23D 35.57%, #EFD787 42.04%, #E1B831 57.97%, #EFD787 63.71%, rgba(242, 186, 0, 0.47) 84.77%)",
      text: "#303030",
    },
    "Platinum Level": {
      background:
        "linear-gradient(244deg, #B09FFF 37.63%, #8C7BDB 41.94%, #BEB0FF 52.54%, #8C7BDB 56.36%, #CBC0FF 70.38%)",
      text: "#303030",
    },
  }[level] || {
    background: "#f3f4f6",
    text: "#4b5563",
  };

  return (
    <span
      className="px-3 py-1 rounded-full text-xs font-medium"
      style={{
        background: badgeStyles.background,
        color: badgeStyles.text,
      }}
    >
      {level}
    </span>
  );
};

interface UsersTableProps {
  activeLevel?: string;
  searchQuery?: string;
  columns: ColumnVisibility;
}

const UsersTable: React.FC<UsersTableProps> = ({
  activeLevel = "Semua",
  searchQuery = "",
  columns,
}) => {
  const [users, setUsers] = useState<EnhancedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // Konversi poin ke level
  const getLevel = (points?: number): string => {
    if (!points) return "Bronze Level";
    if (points < 50) return "Bronze Level";
    if (points < 100) return "Silver Level";
    if (points < 200) return "Gold Level";
    return "Platinum Level";
  };

  // Fetch data pengguna dan tambahkan jumlah feedback untuk setiap pengguna
  useEffect(() => {
    const fetchUsersWithFeedback = async () => {
      setLoading(true);
      try {
        // Get users
        const response = await userService.getAllCustomers(
          currentPage,
          rowsPerPage
        );

        // Get enhanced users with feedback count
        const enhancedUsers = await Promise.all(
          response.users.map(async (user) => {
            try {
              // Fetch feedback count for each user
              const userFeedbacks = await feedbackService.getFeedbacksByUserId(
                user.id,
                1,
                1
              );

              return {
                ...user,
                totalFeedback: userFeedbacks.total,
                level: getLevel(user.points),
              };
            } catch (error) {
              console.error(
                `Error fetching feedback for user ${user.id}:`,
                error
              );
              return {
                ...user,
                totalFeedback: 0,
                level: getLevel(user.points),
              };
            }
          })
        );

        setUsers(enhancedUsers);
        setTotalUsers(response.total);
        setTotalPages(Math.ceil(response.total / rowsPerPage));
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsersWithFeedback();
  }, [currentPage, rowsPerPage]);

  // Filter user berdasarkan level dan search query
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      // Filter berdasarkan level
      const levelMatch = activeLevel === "Semua" || user.level === activeLevel;

      // Filter berdasarkan search query (cari di ID, nama, dan email)
      const searchMatch =
        !searchQuery ||
        user.id.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.name &&
          user.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (user.email &&
          user.email.toLowerCase().includes(searchQuery.toLowerCase()));

      return levelMatch && searchMatch;
    });
  }, [users, activeLevel, searchQuery]);

  // Pagination utils
  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset ke halaman pertama saat mengubah jumlah baris
  };

  // Generate pagination items
  const paginationItems = useMemo(() => {
    const items = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      // Show all pages if there are 5 or fewer
      for (let i = 1; i <= totalPages; i++) {
        items.push(i);
      }
    } else {
      // Always show first page
      items.push(1);

      if (currentPage > 3) {
        // Add ellipsis if current page is away from start
        items.push("...");
      }

      // Pages around current page
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      for (let i = startPage; i <= endPage; i++) {
        items.push(i);
      }

      if (currentPage < totalPages - 2) {
        // Add ellipsis if current page is away from end
        items.push("...");
      }

      // Always show last page
      items.push(totalPages);
    }

    return items;
  }, [currentPage, totalPages]);

  return (
    <div className="space-y-4 overflow-hidden">
      {/* Table Container */}
      <div className="rounded-lg border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              {columns.userId && (
                <TableHead className="w-[100px] text-center py-4">
                  User Id
                </TableHead>
              )}
              {columns.email && (
                <TableHead className="text-center">Email</TableHead>
              )}
              {columns.totalFeedback && (
                <TableHead className="text-center">Total Feedback</TableHead>
              )}
              {columns.totalPoints && (
                <TableHead className="text-center">Total Poin</TableHead>
              )}
              {columns.levelPoints && (
                <TableHead className="text-center">Level Poin</TableHead>
              )}
              {columns.action && (
                <TableHead className="text-center w-[130px]">Aksi</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              // Loading state
              Array.from({ length: rowsPerPage }).map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
                  {columns.userId && (
                    <TableCell className="py-2">
                      <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                    </TableCell>
                  )}
                  {columns.email && (
                    <TableCell className="py-2">
                      <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                    </TableCell>
                  )}
                  {columns.totalFeedback && (
                    <TableCell className="py-2">
                      <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                    </TableCell>
                  )}
                  {columns.totalPoints && (
                    <TableCell className="py-2">
                      <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                    </TableCell>
                  )}
                  {columns.levelPoints && (
                    <TableCell className="py-2">
                      <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                    </TableCell>
                  )}
                  {columns.action && (
                    <TableCell className="py-2">
                      <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : filteredUsers.length > 0 ? (
              // Render data
              filteredUsers.map((user) => (
                <TableRow key={user.id} className="hover:bg-gray-50">
                  {columns.userId && (
                    <TableCell className="font-medium text-center">
                      {`US-${user.id}`}
                    </TableCell>
                  )}
                  {columns.email && (
                    <TableCell className="text-center">{user.email}</TableCell>
                  )}
                  {columns.totalFeedback && (
                    <TableCell className="text-center font-medium">
                      {user.totalFeedback}
                    </TableCell>
                  )}
                  {columns.totalPoints && (
                    <TableCell className="text-center font-medium">
                      {user.points || 0}
                    </TableCell>
                  )}
                  {columns.levelPoints && (
                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        <LevelBadge level={user.level} />
                      </div>
                    </TableCell>
                  )}
                  {columns.action && (
                    <TableCell className="text-center">
                      <Link
                        href={`/users/${user.id}/history`}
                        className="inline-flex items-center gap-1.5 text-gray-500 hover:text-primary text-sm px-3 py-1.5 border rounded-lg hover:border-primary transition-colors"
                      >
                        <Eye size={16} />
                        Riwayat
                      </Link>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              // No data state
              <TableRow>
                <TableCell
                  colSpan={Object.values(columns).filter(Boolean).length}
                  className="text-center py-6 text-gray-500"
                >
                  {searchQuery
                    ? "Tidak ada hasil pencarian"
                    : "Tidak ada data pengguna"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination & View Options */}
      {filteredUsers.length > 0 && (
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-500">Show</span>
            <select
              className="bg-[#EAEAEA] px-2 py-1.5 rounded"
              value={rowsPerPage}
              onChange={handleRowsPerPageChange}
            >
              <option value={10}>10</option>
              <option value={12}>12</option>
              <option value={24}>24</option>
              <option value={36}>36</option>
            </select>
            <span className="text-gray-500">
              out of {totalUsers.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              className="p-1.5 bg-[#EAEAEA] rounded-lg disabled:opacity-50"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              <ChevronLeft size={16} className="text-[#080808]" />
            </button>

            {paginationItems.map((page, i) => (
              <button
                key={i}
                className={`w-[30px] h-[30px] flex items-center justify-center rounded-lg text-xs
                        ${
                          page === currentPage
                            ? "bg-[#CF0000] text-white"
                            : "bg-[#EAEAEA] text-[#080808]"
                        }`}
                onClick={() =>
                  typeof page === "number" && handlePageChange(page)
                }
                disabled={typeof page !== "number"}
              >
                {page}
              </button>
            ))}

            <button
              className="p-1.5 bg-[#EAEAEA] rounded-lg disabled:opacity-50"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              <ChevronRight size={16} className="text-[#080808]" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersTable;
