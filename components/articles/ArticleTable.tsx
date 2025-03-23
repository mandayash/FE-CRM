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

// Import modal components
import ConfirmDeleteArticle from '@/components/articles/modals/ConfirmDeleteArticle';
import SuccessDeleteArticle from '@/components/articles/modals/SuccessDeleteArticle';
import ErrorDeleteArticle from '@/components/articles/modals/ErrorDeleteArticle';

interface ColumnVisibility {
  id: boolean;
  date: boolean;
  title: boolean;
  content: boolean;
  image?: boolean;
  status?: boolean;
  actions: boolean;
}

// StatusBadge component - Dari kode asli Anda
const StatusBadge = ({ status }: { status: 'Draft' | 'Terkirim' | 'Gagal' }) => {
  const styles = {
    'Draft': 'bg-[#4B5563] text-[#FFFFFF]',
    'Terkirim': 'bg-[#EEFBD1] text-[#1F5305]',
    'Gagal': 'bg-[#FCE6CF] text-[#CF0000]'
  }[status];

  return (
    <span className={`px-2 py-1 rounded text-xs ${styles}`}>
      {status}
    </span>
  );
};

export default function ArticleTable({
  articles,
  visibleColumns = {
    id: true,
    date: true,
    title: true,
    content: true,
    image: true,
    status: true,
    actions: true
  },
  pagination = { page: 1, limit: 10, total: 0 },
  onPageChange = (page: number) => {}
}: {
  articles: Article[];
  visibleColumns?: ColumnVisibility;
  pagination?: { page: number; limit: number; total: number };
  onPageChange?: (page: number) => void;
}) {
  const router = useRouter();
  const totalPages = Math.ceil(pagination.total / pagination.limit);
  
  // State untuk modal
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showSuccessDelete, setShowSuccessDelete] = useState(false);
  const [showErrorDelete, setShowErrorDelete] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  // Handler untuk tombol delete
  const handleDeleteClick = (article: Article) => {
    setSelectedArticle(article);
    setShowConfirmDelete(true);
  };

  // Handler untuk konfirmasi delete
  const handleConfirmDelete = async () => {
    setShowConfirmDelete(false);
    
    if (!selectedArticle) return;
    
    try {
      // Menggunakan service untuk delete artikel
      await articleService.deleteArticle(selectedArticle.id);
      
      // Tampilkan modal sukses
      setShowSuccessDelete(true)
    } catch (error) {
      console.error('Error deleting article:', error);
      setShowErrorDelete(true);
    }
  };

  // Handler untuk menutup modal sukses hapus
  const handleSuccessDeleteClose = () => {
    setShowSuccessDelete(false);
    // Refresh data
    router.refresh();
  };

  // Handler untuk menutup modal error hapus
  const handleErrorDeleteClose = () => {
    setShowErrorDelete(false);
  };

  // Helper function untuk mendapatkan status artikel
  const getArticleStatus = (article: Article): 'Draft' | 'Terkirim' | 'Gagal' => {

    return article.is_published ? 'Terkirim' : 'Draft';
  };

  return (
    <>
      <div className="rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead className="bg-[#EAEAEA]">
              <tr>
                <th className="w-4 p-4 text-left">
                  <input type="checkbox" className="rounded" />
                </th>
                {visibleColumns.id && (
                  <th className="p-4 text-center text-sm font-medium">Artikel Id</th>
                )}
                {visibleColumns.date && (
                  <th className="p-4 text-center text-sm font-medium">Tanggal Artikel</th>
                )}
                {visibleColumns.title && (
                  <th className="p-4 text-center text-sm font-medium">Judul Artikel</th>
                )}
                {visibleColumns.content && (
                  <th className="p-4 text-center text-sm font-medium">Isi Artikel</th>
                )}
                {visibleColumns.image && (
                  <th className="p-4 text-center text-sm font-medium">Gambar Artikel</th>
                )}
                {visibleColumns.status && (
                  <th className="p-4 text-center text-sm font-medium">Status</th>
                )}
                {visibleColumns.actions && (
                  <th className="p-4 text-center text-sm font-medium">Aksi</th>
                )}
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => (
                <tr key={article.id} className="bg-white hover:bg-gray-50 border-t">
                  <td className="p-4 text-left">
                    <input type="checkbox" className="rounded" />
                  </td>
                  {visibleColumns.id && (
                    <td className="p-4 text-center text-sm font-medium">
                      {typeof article.id === 'number' ? `AR-${article.id}` : article.id}
                    </td>
                  )}
                  {visibleColumns.date && (
                    <td className="p-4 text-center text-sm whitespace-nowrap">
                      {article.created_at && 
                        new Date(article.created_at).toLocaleString('id-ID')}
                    </td>
                  )}
                  {visibleColumns.title && (
                    <td className="p-4 text-center text-sm max-w-[200px] truncate">
                      {article.title}
                    </td>
                  )}
                  {visibleColumns.content && (
                    <td className="p-4 text-center text-sm max-w-[300px] truncate">
                      {article.summary || 
                       (article.content && article.content.substring(0, 100) + '...')}
                    </td>
                  )}
                  {visibleColumns.image && (
                    <td className="p-4 text-center text-sm text-gray-500">
                      {article.image_url || '-'}
                    </td>
                  )}
                  {visibleColumns.status && (
                    <td className="p-4 text-center">
                      <StatusBadge status={getArticleStatus(article)} />
                    </td>
                  )}
                  {visibleColumns.actions && (
                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                        {article.is_published ? (
                          <button
                            onClick={() => router.push(`/articles/${article.id}`)}  
                            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-center"
                            title="Lihat Detail"
                          >
                            <FileText className="w-4 h-4 text-gray-500" />
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={() => router.push(`/articles/${article.id}/edit`)}
                              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                              title="Edit Artikel"
                            >
                              <Pencil className="w-4 h-4 text-gray-500" />
                            </button>
                            <button 
                              onClick={() => handleDeleteClick(article)}
                              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                              title="Hapus Artikel"
                            >
                              <Trash className="w-4 h-4 text-gray-500" />
                            </button>
                          </>
                        )}
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
      </div>

      {/* Modal Konfirmasi Hapus */}
      <ConfirmDeleteArticle 
        isOpen={showConfirmDelete}
        onClose={() => setShowConfirmDelete(false)}
        onConfirm={handleConfirmDelete}
      />

      {/* Modal Sukses Hapus */}
      <SuccessDeleteArticle 
        isOpen={showSuccessDelete}
        onClose={handleSuccessDeleteClose}
      />

      {/* Modal Error Hapus */}
      <ErrorDeleteArticle 
        isOpen={showErrorDelete}
        onClose={handleErrorDeleteClose}
      />
    </>
  );
}