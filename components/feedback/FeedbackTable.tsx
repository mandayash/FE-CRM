"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { feedbackService, Feedback } from "@/services/feedbackService";
import { FileText, Pencil, Image as ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { ColumnVisibility } from "./FilterSearch";

interface Props {
  filterStatus: string;
  searchQuery: string;
  columns: ColumnVisibility;
  sortField: string;
  sortOrder: "asc" | "desc";
  onSort: (field: string) => void;
  onSortToggle: () => void;
}

export default function FeedbackTable({
  filterStatus,
  searchQuery,
  columns,
  sortField,
  sortOrder,
}: Props) {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await feedbackService.getAllFeedbacks(
          currentPage,
          itemsPerPage
        );
        let data = res.feedbacks;
        let total = res.total;

        // Filtering
        if (filterStatus) {
          data = data.filter((f) => f.status === filterStatus);
          total = data.length;
        }

        // Searching
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          data = data.filter(
            (f) =>
              `FB-${f.id}`.toLowerCase().includes(q) ||
              f.title.toLowerCase().includes(q) ||
              f.content.toLowerCase().includes(q)
          );
          total = data.length;
        }

        // Sorting
        if (sortField) {
          data = data.sort((a, b) => {
            if (sortField === "id") {
              return sortOrder === "asc" ? a.id - b.id : b.id - a.id;
            } else if (sortField === "status") {
              return sortOrder === "asc"
                ? a.status.localeCompare(b.status)
                : b.status.localeCompare(a.status);
            }
            return 0;
          });
        }

        setFeedbacks(data);
        setTotalItems(total);
      } catch (err) {
        console.error("Gagal memuat data feedback:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filterStatus, searchQuery, sortField, sortOrder, currentPage]);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No</TableHead>
              {columns.id && <TableHead>ID</TableHead>}
              {columns.date && <TableHead>Tanggal</TableHead>}
              {columns.userId && <TableHead>User ID</TableHead>}
              {columns.title && <TableHead>Judul</TableHead>}
              {columns.content && <TableHead>Konten</TableHead>}
              {columns.station && <TableHead>Stasiun</TableHead>}
              {columns.rating && <TableHead>Rating</TableHead>}
              {columns.image && <TableHead>Gambar</TableHead>}
              {columns.category && <TableHead>Kategori</TableHead>}
              {columns.status && <TableHead>Status</TableHead>}
              {columns.action && <TableHead>Aksi</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={12}
                  className="text-center py-6 text-gray-500"
                >
                  Memuat data feedback...
                </TableCell>
              </TableRow>
            ) : feedbacks.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={12}
                  className="text-center py-6 text-gray-500"
                >
                  Tidak ada data ditemukan.
                </TableCell>
              </TableRow>
            ) : (
              feedbacks.map((f, idx) => (
                <TableRow key={f.id}>
                  <TableCell>
                    {(currentPage - 1) * itemsPerPage + idx + 1}
                  </TableCell>
                  {columns.id && <TableCell>FB-{f.id}</TableCell>}
                  {columns.date && (
                    <TableCell>
                      {new Date(f.created_at).toLocaleString("id-ID")}
                    </TableCell>
                  )}
                  {columns.userId && <TableCell>{f.user_id}</TableCell>}
                  {columns.title && <TableCell>{f.title}</TableCell>}
                  {columns.content && <TableCell>{f.content}</TableCell>}
                  {columns.station && <TableCell>{f.station}</TableCell>}
                  {columns.rating && <TableCell>{f.rating}</TableCell>}
                  {columns.image && (
                    <TableCell>
                      {f.image_path ? (
                        <a
                          href={feedbackService.getImageUrl(f.image_path)}
                          target="_blank"
                          className="flex items-center gap-1 text-blue-600"
                        >
                          <ImageIcon size={16} /> Lihat
                        </a>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                  )}
                  {columns.category && <TableCell>{f.category}</TableCell>}
                  {columns.status && (
                    <TableCell
                      className={
                        f.status === "RESPONDED"
                          ? "text-green-600"
                          : "text-yellow-600"
                      }
                    >
                      {f.status === "RESPONDED" ? "Selesai" : "Belum"}
                    </TableCell>
                  )}
                  {columns.action && (
                    <TableCell>
                      <button
                        onClick={() =>
                          router.push(
                            f.status === "RESPONDED"
                              ? `/feedback/${f.id}/reply`
                              : `/feedback/${f.id}`
                          )
                        }
                      >
                        {f.status === "RESPONDED" ? (
                          <FileText size={18} />
                        ) : (
                          <Pencil size={18} />
                        )}
                      </button>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <div className="flex gap-2 items-center">
            <button
              className="px-3 py-1 border rounded disabled:opacity-50"
              onClick={() => setCurrentPage((prev) => prev - 1)}
              disabled={currentPage === 1}
            >
              Prev
            </button>
            {[...Array(totalPages)].map((_, i) => {
              const page = i + 1;
              return (
                <button
                  key={page}
                  className={`px-3 py-1 border rounded ${
                    currentPage === page
                      ? "bg-red-600 text-white"
                      : "bg-white text-gray-800"
                  }`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              );
            })}
            <button
              className="px-3 py-1 border rounded disabled:opacity-50"
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
