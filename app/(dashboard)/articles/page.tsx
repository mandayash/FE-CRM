"use client";

import { useState, useEffect } from "react";
import { Search, Table, Check, Plus } from "lucide-react";
import Link from "next/link";
import ArticleTable from "@/components/articles/ArticleTable";
import { articleService, Article } from "@/services/articleService";
import ArticleStats from "@/components/articles/ArticleStats";

export interface ColumnVisibility {
  id: boolean;
  date: boolean;
  title: boolean;
  content: boolean;
  image: boolean;
  actions: boolean;
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleColumns, setVisibleColumns] = useState<ColumnVisibility>({
    id: true,
    date: true,
    title: true,
    content: true,
    image: true,
    actions: true,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });
  const [isColumnMenuOpen, setIsColumnMenuOpen] = useState(false);

  const [stats, setStats] = useState({
    total: 0,
  });

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const res = searchQuery
        ? await articleService.searchArticles(
            searchQuery,
            pagination.page,
            pagination.limit
          )
        : await articleService.getAllArticles(
            pagination.page,
            pagination.limit
          );

      setArticles(res.articles);
      setPagination((prev) => ({ ...prev, total: res.total }));
      setError(null);

      setStats({
        total: res.total,
      });
    } catch (err) {
      console.error("Gagal memuat artikel:", err);
      setError("Gagal memuat artikel. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [pagination.page, pagination.limit, searchQuery]);

  const toggleColumn = (key: keyof ColumnVisibility) => {
    setVisibleColumns((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6 py-4">
      {/* Header and Actions */}
      <ArticleStats totalArticles={stats.total} />

      <div className="flex flex-col sm:flex-row justify-between gap-4 sm:items-center">
        <Link
          href="/articles/create"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#CF0000] text-white rounded-lg hover:bg-red-700 text-sm transition"
        >
          <Plus className="w-4 h-4" />
          Tambah Artikel
        </Link>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari artikel..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-[280px] h-8 pl-10 pr-4 rounded-[20px] bg-[#E5E6E6] text-xs"
            />
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              size={18}
            />
          </div>

          {/* Column Toggle Menu */}
          <div className="relative">
            <button
              onClick={() => setIsColumnMenuOpen(!isColumnMenuOpen)}
              className="flex items-center gap-1.5 px-3 h-8 bg-white border rounded-lg text-xs hover:bg-gray-50"
            >
              <Table size={18} />
              Tampilkan Tabel
            </button>
            {isColumnMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-1 z-10">
                {Object.entries(visibleColumns).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between px-4 py-2 text-xs hover:bg-gray-50 cursor-pointer"
                    onClick={() => toggleColumn(key as keyof ColumnVisibility)}
                  >
                    <span>{key}</span>
                    {value && <Check size={16} className="text-green-600" />}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}

      {/* Table */}
      {!loading ? (
        <ArticleTable
          articles={articles}
          visibleColumns={visibleColumns}
          pagination={pagination}
          onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
        />
      ) : (
        <div className="text-center py-8 text-sm text-gray-500">
          Memuat artikel...
        </div>
      )}
    </div>
  );
}
