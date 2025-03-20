"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarIcon, ArrowLeft } from "lucide-react";
import { articleService, Article } from "@/services/articleService";

export default function ArticleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const articleId = params.id;
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const fetchedArticle = await articleService.getArticleById(
          Number(articleId)
        );
        setArticle(fetchedArticle);
      } catch (err) {
        setError("Gagal mengambil data artikel.");
        console.error("Error fetching article:", err);
      } finally {
        setLoading(false);
      }
    };

    if (articleId) {
      fetchArticle();
    }
  }, [articleId]);

  if (loading) {
    return <p className="text-gray-500">Memuat artikel...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!article) {
    return <p className="text-gray-500">Artikel tidak ditemukan.</p>;
  }

  return (
    <div className="space-y-6 py-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="text-2xl font-medium">
          <span className="text-[#CF0000]">Kelola Artikel</span> |
          <span className="text-black"> Lihat Artikel</span>
        </h1>
      </div>

      {/* Article Content */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          {/* Article Info dan Content */}
          <div className="p-8 space-y-6">
            {/* Date */}
            <div className="flex items-center gap-2 text-gray-500">
              <CalendarIcon className="w-4 h-4" />
              <span>
                {new Date(article.created_at).toLocaleString("id-ID")}
              </span>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-semibold">{article.title}</h2>

            {/* Content */}
            <div className="prose max-w-none text-gray-600 text-justify">
              {article.content}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
