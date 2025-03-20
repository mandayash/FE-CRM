"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Image as ImageIcon, AlertCircle, ArrowLeft } from "lucide-react";
import { articleService, Article } from "@/services/articleService";

export default function EditArticlePage() {
  const params = useParams();
  const router = useRouter();
  const articleId = Number(params.id);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [summary, setSummary] = useState("");
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const fetchedArticle = await articleService.getArticleById(articleId);
        setTitle(fetchedArticle.title);
        setContent(fetchedArticle.content);
        setSummary(fetchedArticle.summary);
      } catch {
        setErrorMessage("Gagal mengambil data artikel.");
        setShowError(true);
      } finally {
        setLoading(false);
      }
    };

    if (articleId) {
      fetchArticle();
    }
  }, [articleId]);

  const handleSubmit = async (action: "save" | "publish") => {
    if (!title.trim() || !content.trim()) {
      setErrorMessage("Judul dan isi artikel wajib diisi.");
      setShowError(true);
      return;
    }

    try {
      const updatedArticle = {
        title,
        content,
        summary,
        is_published: action === "publish",
      };

      await articleService.updateArticle(articleId, updatedArticle);
      alert(
        `Artikel berhasil ${
          action === "publish" ? "dipublikasikan" : "disimpan"
        }!`
      );
      router.push("/articles");
    } catch {
      setErrorMessage("Gagal menyimpan perubahan artikel.");
      setShowError(true);
    }
  };

  if (loading) {
    return <p className="text-gray-500">Memuat artikel...</p>;
  }

  return (
    <div className="space-y-6 p-4 max-w-7xl mx-auto">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="text-2xl font-medium text-center md:text-left">
          <span className="text-[#CF0000]">Kelola Artikel</span> |
          <span className="text-black"> Edit Artikel</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6 space-y-6">
              <h2 className="text-red-600 font-medium text-lg">Edit Artikel</h2>

              <div className="space-y-2">
                <label className="block text-sm">
                  Judul Artikel <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-red-100"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm">
                  Summary <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-red-100"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm">
                  Isi Artikel <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full p-4 min-h-[200px] max-h-[400px] rounded-lg border focus:ring-2 focus:ring-red-100"
                ></textarea>
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-3">
                <button
                  onClick={() => router.back()}
                  className="px-6 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                >
                  Batalkan
                </button>
                <button
                  onClick={() => handleSubmit("publish")}
                  className="px-6 py-2 rounded-lg bg-[#CF0000] text-white hover:bg-red-700"
                >
                  Publikasikan
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Card Preview Artikel */}
        <div className="lg:col-span-1 sticky top-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="flex items-center gap-2">
                <span className="p-1 rounded-full bg-gray-100">
                  <ImageIcon className="w-4 h-4" />
                </span>
                Preview Artikel
              </h2>
              <div className="space-y-2 max-h-[400px] overflow-y-auto px-2 break-words">
                <h3 className="font-medium truncate">
                  {title || "Judul artikel akan muncul di sini"}
                </h3>
                <p className="text-gray-600 line-clamp-4">
                  {content || "Isi artikel akan muncul di sini..."}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
