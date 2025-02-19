"use client";

import { useState, useEffect } from "react";
import ArticleStats from "@/components/articles/ArticleStats";
import ArticleTable from "@/components/articles/ArticleTable";
import { Plus, Filter, Table, Search, Menu } from "lucide-react";
import Link from "next/link";
import { articleService } from "@/services/article_service";
import { Article, ArticleStatus } from "@/types/article";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/services/auth_service";

export default function ArticlesPage() {
  const [activeStatus, setActiveStatus] = useState<string>("Semua");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const [userRole, setUserRole] = useState<"admin" | "super_admin">("admin");

  // Define status mapping
  const statusMap = {
    Semua: null,
    Terkirim: ArticleStatus.PUBLISHED,
    Draft: ArticleStatus.DRAFT,
    Gagal: ArticleStatus.DENIED,
  };

  // Fetch articles on mount
  useEffect(() => {
    fetchArticles();
  }, []);

  useEffect(() => {
    // Determine user role from JWT
    const token = authService.getToken();
    if (token) {
      try {
        // Decode JWT - assuming structure has a 'role' field
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (payload.role === "super_admin") {
          setUserRole("super_admin");
        }
      } catch (error) {
        console.error("Error parsing token:", error);
      }
    }
  }, []);

  // Apply filters when activeStatus or search changes
  useEffect(() => {
    if (articles) {
      filterArticles();
    }
  }, [activeStatus, articles, searchQuery]);

  const fetchArticles = async () => {
    setIsLoading(true);
    try {
      const data = await articleService.listArticles();
      setArticles(data || []);
    } catch (error) {
      console.error("Failed to fetch articles:", error);
      toast({
        title: "Error",
        description: "Gagal mengambil data artikel",
        variant: "destructive",
      });
      setArticles([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filterArticles = () => {
    if (!articles) {
      setFilteredArticles([]);
      return;
    }

    let filtered = [...articles];

    // Filter by status
    const selectedStatus = statusMap[activeStatus as keyof typeof statusMap];
    if (selectedStatus !== null) {
      filtered = filtered.filter(
        (article) => article.status === selectedStatus
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(query) ||
          article.content.toLowerCase().includes(query)
      );
    }

    setFilteredArticles(filtered);
  };

  const statuses = ["Semua", "Terkirim", "Draft", "Gagal"];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Calculate stats safely
  const totalArticles = articles?.length || 0;
  const publishedArticles =
    articles?.filter((a) => a?.status === ArticleStatus.PUBLISHED)?.length || 0;
  const draftArticles =
    articles?.filter((a) => a?.status === ArticleStatus.DRAFT)?.length || 0;
  const deniedArticles =
    articles?.filter((a) => a?.status === ArticleStatus.DENIED)?.length || 0;

  return (
    <div className="space-y-6">
      {/* Stats Section */}
      <ArticleStats
        totalArticles={totalArticles}
        publishedArticles={publishedArticles}
        draftArticles={draftArticles}
        deniedArticles={deniedArticles}
      />

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

      {/* Filter Section */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 sm:items-center">
        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => setActiveStatus(status)}
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
          {/* Search Input */}
          <div className="relative flex-grow sm:flex-grow-0">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Cari artikel..."
              className="w-full sm:w-[283px] h-8 pl-10 pr-4 rounded-[20px] bg-[#E5E6E6] text-xs"
            />
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              size={18}
            />
          </div>

          {/* Desktop Buttons */}
          <div className="hidden sm:flex items-center gap-2.5">
            <button
              onClick={() => fetchArticles()}
              className="flex items-center gap-1.5 px-3 h-8 bg-white rounded-lg border text-xs hover:bg-gray-50 transition-colors"
            >
              <Filter size={18} />
              Refresh
            </button>
            <button className="flex items-center gap-1.5 px-3 h-8 bg-white rounded-lg border text-xs hover:bg-gray-50 transition-colors">
              <Table size={18} />
              Tampilkan Tabel
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="relative sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-1.5 px-3 h-8 bg-white rounded-lg border text-xs w-full justify-center hover:bg-gray-50 transition-colors"
            >
              <Menu size={18} />
              Menu
            </button>

            {/* Mobile Dropdown Menu */}
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-1 z-10">
                <button
                  onClick={() => {
                    fetchArticles();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs hover:bg-gray-50 w-full"
                >
                  <Filter size={18} />
                  Refresh
                </button>
                <button className="flex items-center gap-1.5 px-4 py-2 text-xs hover:bg-gray-50 w-full">
                  <Table size={18} />
                  Tampilkan Tabel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <ArticleTable
        articles={filteredArticles}
        isLoading={isLoading}
        onRefresh={fetchArticles}
        userRole={userRole}
      />
    </div>
  );
}
