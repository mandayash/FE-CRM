"use client";

import { TableRow } from "@/components/ui/table";
import {
  Pencil,
  Trash,
  FileText,
  AlertCircle,
  Loader2,
  Check,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Article, ArticleStatus } from "@/types/article";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { articleService } from "@/services/article_service";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface ArticleTableProps {
  articles: Article[];
  isLoading: boolean;
  onRefresh: () => void;
  userRole?: "admin" | "super_admin";
}

const StatusBadge = ({ status }: { status: ArticleStatus }) => {
  const styles = {
    [ArticleStatus.DRAFT]: "bg-[#4B5563] text-[#FFFFFF]",
    [ArticleStatus.PUBLISHED]: "bg-[#EEFBD1] text-[#1F5305]",
    [ArticleStatus.DENIED]: "bg-[#FCE6CF] text-[#CF0000]",
  }[status];

  const label = {
    [ArticleStatus.DRAFT]: "Draft",
    [ArticleStatus.PUBLISHED]: "Terkirim",
    [ArticleStatus.DENIED]: "Gagal",
  }[status];

  return <span className={`px-2 py-1 rounded text-xs ${styles}`}>{label}</span>;
};

export default function ArticleTable({
  articles,
  isLoading,
  onRefresh,
  userRole = "admin",
}: ArticleTableProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<ArticleStatus | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [isChangingStatus, setIsChangingStatus] = useState(false);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "yyyy-MM-dd HH:mm:ss", { locale: id });
    } catch {
      return "Invalid date";
    }
  };

  const handleDeleteClick = (article: Article) => {
    setSelectedArticle(article);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedArticle) return;

    setIsDeleting(true);
    try {
      await articleService.deleteArticle(selectedArticle.id);
      toast({
        title: "Artikel dihapus",
        description: "Artikel berhasil dihapus",
      });
      onRefresh();
    } catch {
      toast({
        title: "Gagal menghapus",
        description: "Terjadi kesalahan saat menghapus artikel",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  const openStatusDialog = (article: Article, status: ArticleStatus) => {
    setSelectedArticle(article);
    setSelectedStatus(status);
    setStatusDialogOpen(true);
  };

  const handleStatusChange = async () => {
    if (!selectedArticle || selectedStatus === null) return;

    setIsChangingStatus(true);
    try {
      await articleService.changeArticleStatus(
        selectedArticle.id,
        selectedStatus
      );
      toast({
        title: "Status diubah",
        description: `Artikel berhasil ${
          selectedStatus === ArticleStatus.PUBLISHED ? "diterbitkan" : "ditolak"
        }`,
      });
      onRefresh();
    } catch {
      toast({
        title: "Gagal mengubah status",
        description: "Terjadi kesalahan saat mengubah status artikel",
        variant: "destructive",
      });
    } finally {
      setIsChangingStatus(false);
      setStatusDialogOpen(false);
    }
  };

  if (isLoading) {
    // Loading skeleton code remains the same
    return (
      <div className="rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-4 p-4 text-left"></th>
                <th className="p-4 text-left text-sm font-medium">
                  Artikel Id
                </th>
                <th className="p-4 text-left text-sm font-medium">
                  Tanggal Artikel
                </th>
                <th className="p-4 text-left text-sm font-medium">
                  Judul Artikel
                </th>
                <th className="p-4 text-left text-sm font-medium">
                  Isi Artikel
                </th>
                <th className="p-4 text-left text-sm font-medium">
                  Gambar Artikel
                </th>
                <th className="p-4 text-left text-sm font-medium">Status</th>
                <th className="p-4 text-right text-sm font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, i) => (
                <tr key={i}>
                  <td className="p-4">
                    <Skeleton className="h-4 w-4" />
                  </td>
                  <td className="p-4">
                    <Skeleton className="h-5 w-20" />
                  </td>
                  <td className="p-4">
                    <Skeleton className="h-5 w-32" />
                  </td>
                  <td className="p-4">
                    <Skeleton className="h-5 w-40" />
                  </td>
                  <td className="p-4">
                    <Skeleton className="h-5 w-48" />
                  </td>
                  <td className="p-4">
                    <Skeleton className="h-5 w-24" />
                  </td>
                  <td className="p-4">
                    <Skeleton className="h-6 w-16 rounded-md" />
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <Skeleton className="h-8 w-8 rounded-lg" />
                      <Skeleton className="h-8 w-8 rounded-lg" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (articles.length === 0) {
    // Empty state remains the same
    return (
      <div className="rounded-lg border p-8 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium">Tidak ada artikel</h3>
        <p className="text-sm text-gray-500 mt-2">
          Tidak ada artikel yang sesuai dengan filter atau pencarian Anda.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-4 p-4 text-left">
                  <input type="checkbox" className="rounded" />
                </th>
                <th className="p-4 text-left text-sm font-medium">
                  Artikel Id
                </th>
                <th className="p-4 text-left text-sm font-medium">
                  Tanggal Artikel
                </th>
                <th className="p-4 text-left text-sm font-medium">
                  Judul Artikel
                </th>
                <th className="p-4 text-left text-sm font-medium">
                  Isi Artikel
                </th>
                <th className="p-4 text-left text-sm font-medium">
                  Gambar Artikel
                </th>
                <th className="p-4 text-left text-sm font-medium">Status</th>
                <th className="p-4 text-right text-sm font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => (
                <TableRow key={article.id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <input type="checkbox" className="rounded" />
                  </td>
                  <td className="p-4 text-sm font-medium">
                    {article.id.substring(0, 8)}
                  </td>
                  <td className="p-4 text-sm whitespace-nowrap">
                    {formatDate(article.making_date)}
                  </td>
                  <td className="p-4 text-sm max-w-[200px] truncate">
                    {article.title}
                  </td>
                  <td className="p-4 text-sm max-w-[300px] truncate">
                    {article.content}
                  </td>
                  <td className="p-4 text-sm text-gray-500">
                    {article.image.split("/").pop() || article.image}
                  </td>
                  <td className="p-4">
                    <StatusBadge status={article.status} />
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      {/* View button - always visible */}
                      <button
                        onClick={() => router.push(`/articles/${article.id}`)}
                        className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Lihat detail"
                      >
                        <FileText className="w-4 h-4 text-gray-500" />
                      </button>

                      {/* Edit button - visible for super_admin or for admin with draft articles */}
                      {(userRole === "super_admin" ||
                        (userRole === "admin" &&
                          article.status === ArticleStatus.DRAFT)) && (
                        <button
                          onClick={() =>
                            router.push(`/articles/${article.id}/edit`)
                          }
                          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Edit artikel"
                        >
                          <Pencil className="w-4 h-4 text-gray-500" />
                        </button>
                      )}

                      {/* Delete button - visible for super_admin or for admin with draft articles */}
                      {(userRole === "super_admin" ||
                        (userRole === "admin" &&
                          article.status === ArticleStatus.DRAFT)) && (
                        <button
                          onClick={() => handleDeleteClick(article)}
                          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Hapus artikel"
                        >
                          <Trash className="w-4 h-4 text-gray-500" />
                        </button>
                      )}

                      {/* Approve button - only for super_admin and draft articles */}
                      {userRole === "super_admin" &&
                        article.status === ArticleStatus.DRAFT && (
                          <button
                            onClick={() =>
                              openStatusDialog(article, ArticleStatus.PUBLISHED)
                            }
                            className="p-1.5 hover:bg-green-100 rounded-lg transition-colors"
                            title="Terbitkan artikel"
                          >
                            <Check className="w-4 h-4 text-green-500" />
                          </button>
                        )}

                      {/* Reject button - only for super_admin and draft articles */}
                      {userRole === "super_admin" &&
                        article.status === ArticleStatus.DRAFT && (
                          <button
                            onClick={() =>
                              openStatusDialog(article, ArticleStatus.DENIED)
                            }
                            className="p-1.5 hover:bg-red-100 rounded-lg transition-colors"
                            title="Tolak artikel"
                          >
                            <X className="w-4 h-4 text-red-500" />
                          </button>
                        )}
                    </div>
                  </td>
                </TableRow>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Artikel</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus artikel ini? Tindakan ini tidak
              dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menghapus...
                </>
              ) : (
                "Hapus"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Status Change Dialog */}
      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedStatus === ArticleStatus.PUBLISHED
                ? "Terbitkan Artikel"
                : "Tolak Artikel"}
            </DialogTitle>
            <DialogDescription>
              {selectedStatus === ArticleStatus.PUBLISHED
                ? `Apakah Anda yakin ingin menerbitkan artikel "${selectedArticle?.title}"?`
                : `Apakah Anda yakin ingin menolak artikel "${selectedArticle?.title}"?`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setStatusDialogOpen(false)}
              disabled={isChangingStatus}
            >
              Batal
            </Button>
            <Button
              variant={
                selectedStatus === ArticleStatus.PUBLISHED
                  ? "default"
                  : "destructive"
              }
              onClick={handleStatusChange}
              disabled={isChangingStatus}
            >
              {isChangingStatus ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {selectedStatus === ArticleStatus.PUBLISHED
                    ? "Menerbitkan..."
                    : "Menolak..."}
                </>
              ) : selectedStatus === ArticleStatus.PUBLISHED ? (
                "Terbitkan"
              ) : (
                "Tolak"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
