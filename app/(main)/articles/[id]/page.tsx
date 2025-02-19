"use client";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { articleService } from "@/services/article_service";
import { Article } from "@/types/article";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export default function ArticleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const articleId = params.id as string;

  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      setIsLoading(true);
      try {
        const articleData = await articleService.getArticleById(articleId);
        if (articleData) {
          setArticle(articleData);
        } else {
          toast({
            title: "Error",
            description: "Artikel tidak ditemukan",
            variant: "destructive",
          });
          router.push("/articles");
        }
      } catch (error) {
        console.error("Failed to fetch article:", error);
        toast({
          title: "Error",
          description: "Gagal memuat artikel",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (articleId) {
      fetchArticle();
    }
  }, [articleId, router, toast]);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "EEEE, dd MMMM yyyy", { locale: id });
    } catch {
      return "Invalid date";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#CF0000]" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px]">
        <h2 className="text-xl font-medium text-gray-600">
          Artikel tidak ditemukan
        </h2>
        <button
          onClick={() => router.push("/articles")}
          className="mt-4 px-4 py-2 bg-[#CF0000] text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Kembali ke Daftar Artikel
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4">
      <h1 className="text-2xl font-medium">
        <span className="text-[#CF0000]">Kelola Artikel</span> |
        <span className="text-black"> Lihat Artikel</span>
      </h1>

      {/* Article Content */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          {/* Article Image */}
          <div className="relative w-full h-[400px] bg-gray-100">
            {article.image ? (
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <p className="text-gray-500">Tidak ada gambar</p>
              </div>
            )}
          </div>

          {/* Article Info dan Content */}
          <div className="p-8 space-y-6">
            {/* Date */}
            <div className="flex items-center gap-2 text-gray-500">
              <CalendarIcon className="w-4 h-4" />
              <span>{formatDate(article.making_date)}</span>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-semibold">{article.title}</h2>

            {/* Content */}
            <div className="prose max-w-none text-gray-600 text-justify">
              {/* Use dangerouslySetInnerHTML if content is HTML formatted */}
              <div dangerouslySetInnerHTML={{ __html: article.content }} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
