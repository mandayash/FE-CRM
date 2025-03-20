"use client";

import { useState, useEffect } from "react";
import ArticleTable from "@/components/articles/ArticleTable";
import {
  articleService,
  Article,
  ArticleListResponse,
} from "@/services/articleService";
import { Search, Table, Menu, Check, Plus } from "lucide-react";
import Link from "next/link";

// Define the column visibility type
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
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleColumns, setVisibleColumns] = useState<ColumnVisibility>({
    id: true,
    date: true,
    title: true,
    content: true,
    image: true,
    actions: true,
  });
  const [isColumnMenuOpen, setIsColumnMenuOpen] = useState(false);

  // Fetch articles on component mount and when pagination changes
  useEffect(() => {
    fetchArticles();
  }, [pagination.page, pagination.limit]);

  // Fetch articles from API
  const fetchArticles = async () => {
    try {
      setLoading(true);
      const response: ArticleListResponse = await articleService.getAllArticles(
        pagination.page,
        pagination.limit
      );
      setArticles(response.articles);
      setFilteredArticles(response.articles);
      setPagination({
        ...pagination,
        total: response.total,
      });
      setError(null);
    } catch (err) {
      setError("Gagal memuat artikel. Silakan coba lagi.");
      console.error("Error fetching articles:", err);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters based on search query and status
  useEffect(() => {
    let filtered = [...articles];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (article) =>
          article.id.toString().toLowerCase().includes(query) ||
          article.title.toLowerCase().includes(query) ||
          article.content.toLowerCase().includes(query)
      );
    }

    setFilteredArticles(filtered);
  }, [articles, searchQuery]);

  // Handle search input change
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Toggle visibility of columns
  const toggleColumn = (columnName: keyof ColumnVisibility) => {
    const updatedColumns = {
      ...visibleColumns,
      [columnName]: !visibleColumns[columnName],
    };
    setVisibleColumns(updatedColumns);
  };

  return (
    <div className="space-y-6 py-4">
      {/* Filter Tabs and Search */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 sm:items-center">
        {/* Actions Section */}
        <div className="flex items-center w-full sm:w-auto">
          <Link
            href="/articles/create"
            className="inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-[#CF0000] text-white rounded-lg hover:bg-red-700 text-xs sm:text-sm w-full sm:w-auto transition-colors"
          >
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Tambah Artikel
          </Link>
        </div>

        {/* Search and Tools */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          {/* Search Input */}
          <div className="relative flex-grow sm:flex-grow-0">
            <input
              type="text"
              placeholder="Cari berdasarkan ID, judul, konten..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full sm:w-[283px] h-8 pl-10 pr-4 rounded-[20px] bg-[#E5E6E6] text-xs"
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

              {/* Dropdown Menu for Column Selection */}
              {isColumnMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-1 z-10">
                  <div className="px-2 py-1 text-xs font-semibold text-gray-600 border-b">
                    Toggle Columns
                  </div>

                  <div
                    className="flex items-center justify-between px-4 py-2 text-xs hover:bg-gray-50 cursor-pointer"
                    onClick={() => toggleColumn("id")}
                  >
                    <span>Artikel ID</span>
                    {visibleColumns.id && (
                      <Check size={16} className="text-green-600" />
                    )}
                  </div>

                  <div
                    className="flex items-center justify-between px-4 py-2 text-xs hover:bg-gray-50 cursor-pointer"
                    onClick={() => toggleColumn("date")}
                  >
                    <span>Tanggal Artikel</span>
                    {visibleColumns.date && (
                      <Check size={16} className="text-green-600" />
                    )}
                  </div>

                  <div
                    className="flex items-center justify-between px-4 py-2 text-xs hover:bg-gray-50 cursor-pointer"
                    onClick={() => toggleColumn("title")}
                  >
                    <span>Judul Artikel</span>
                    {visibleColumns.title && (
                      <Check size={16} className="text-green-600" />
                    )}
                  </div>

                  <div
                    className="flex items-center justify-between px-4 py-2 text-xs hover:bg-gray-50 cursor-pointer"
                    onClick={() => toggleColumn("content")}
                  >
                    <span>Konten Artikel</span>
                    {visibleColumns.content && (
                      <Check size={16} className="text-green-600" />
                    )}
                  </div>

                  <div
                    className="flex items-center justify-between px-4 py-2 text-xs hover:bg-gray-50 cursor-pointer"
                    onClick={() => toggleColumn("actions")}
                  >
                    <span>Aksi</span>
                    {visibleColumns.actions && (
                      <Check size={16} className="text-green-600" />
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="relative sm:hidden">
            <button
              onClick={() => setIsColumnMenuOpen(!isColumnMenuOpen)}
              className="flex items-center gap-1.5 px-3 h-8 bg-white rounded-lg border text-xs w-full justify-center hover:bg-gray-50 transition-colors"
            >
              <Menu size={18} />
              Menu
            </button>
          </div>
        </div>
      </div>

      {/* Error message if any */}
      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="text-center py-8">
          <div
            className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
            role="status"
          >
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
              Loading...
            </span>
          </div>
          <p className="mt-2 text-sm text-gray-600">Memuat artikel...</p>
        </div>
      ) : (
        /* Table */
        <ArticleTable
          articles={filteredArticles}
          visibleColumns={visibleColumns}
          pagination={{
            page: pagination.page,
            limit: pagination.limit,
            total: pagination.total,
          }}
          onPageChange={(newPage: number) =>
            setPagination({ ...pagination, page: newPage })
          }
        />
      )}
    </div>
  );
}
