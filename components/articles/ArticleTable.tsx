"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Article, articleService } from "@/services/articleService";
import {
  Pencil,
  Trash,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function ArticleTable({
  articles,
  visibleColumns,
  pagination,
  onPageChange,
}: {
  articles: Article[];
  visibleColumns: ColumnVisibility;
  pagination: { page: number; limit: number; total: number };
  onPageChange: (page: number) => void;
}) {
  const router = useRouter();
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState<number | null>(null);

  const totalPages = Math.ceil(pagination.total / pagination.limit);

  // Fungsi untuk menghapus artikel dengan konfirmasi
  const handleDeleteArticle = async (articleId: number) => {
    try {
      const isConfirmed = window.confirm(
        "Apakah Anda yakin ingin menghapus artikel ini? Tindakan ini tidak dapat dibatalkan."
      );
      if (!isConfirmed) return;

      console.log("Deleting article with ID:", articleId);
      await articleService.deleteArticle(articleId);
      setArticleToDelete(articleId);
      setShowSuccessDialog(true);
    } catch (error) {
      console.error(`Error deleting article with ID ${articleId}:`, error);
      alert("Gagal menghapus artikel. Silakan coba lagi.");
    }
  };

  return (
    <div className="rounded-lg border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px]">
          <thead className="bg-gray-50">
            <tr>
              {visibleColumns.id && (
                <th className="p-4 text-left text-sm font-medium">ID</th>
              )}
              {visibleColumns.date && (
                <th className="p-4 text-left text-sm font-medium">
                  Tanggal Artikel
                </th>
              )}
              {visibleColumns.title && (
                <th className="p-4 text-left text-sm font-medium">
                  Judul Artikel
                </th>
              )}
              {visibleColumns.content && (
                <th className="p-4 text-left text-sm font-medium">
                  Isi Artikel
                </th>
              )}
              {visibleColumns.actions && (
                <th className="p-4 text-mid text-sm font-medium">Aksi</th>
              )}
            </tr>
          </thead>
          <tbody>
            {articles.map((article) => (
              <tr key={article.id} className="hover:bg-gray-50">
                {visibleColumns.id && (
                  <td className="p-4 text-sm font-medium">AR-{article.id}</td>
                )}
                {visibleColumns.date && (
                  <td className="p-4 text-sm whitespace-nowrap">
                    {new Date(article.created_at).toLocaleString("id-ID")}
                  </td>
                )}
                {visibleColumns.title && (
                  <td className="p-4 text-sm max-w-[200px] truncate">
                    {article.title}
                  </td>
                )}
                {visibleColumns.content && (
                  <td className="p-4 text-sm max-w-[300px] truncate">
                    {article.summary ||
                      article.content.substring(0, 100) + "..."}
                  </td>
                )}
                {visibleColumns.actions && (
                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => router.push(`/articles/${article.id}`)}
                        className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <FileText className="w-4 h-4 text-gray-500" />
                      </button>
                      <button
                        onClick={() =>
                          router.push(`/articles/${article.id}/edit`)
                        }
                        className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Pencil className="w-4 h-4 text-gray-500" />
                      </button>
                      <button
                        onClick={() => handleDeleteArticle(article.id)}
                        className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Trash className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center p-4 border-t">
          <button
            className="p-2 bg-gray-200 rounded-lg disabled:opacity-50"
            onClick={() => onPageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
          >
            <ChevronLeft size={16} className="text-gray-700" />
          </button>
          <span className="text-sm text-gray-500">
            Halaman {pagination.page} dari {totalPages}
          </span>
          <button
            className="p-2 bg-gray-200 rounded-lg disabled:opacity-50"
            onClick={() => onPageChange(pagination.page + 1)}
            disabled={pagination.page === totalPages}
          >
            <ChevronRight size={16} className="text-gray-700" />
          </button>
        </div>
      )}
      {/* Dialog sukses setelah penghapusan */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Artikel Berhasil Dihapus</DialogTitle>
          </DialogHeader>
          <p>
            Artikel dengan ID {articleToDelete} telah berhasil dihapus dari
            sistem.
          </p>
          <DialogFooter>
            <Button
              variant="destructive"
              onClick={() => {
                setShowSuccessDialog(false);
                router.refresh();
              }}
            >
              Oke
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
