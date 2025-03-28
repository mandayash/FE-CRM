"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Image as ImageIcon, AlertCircle, ArrowLeft } from "lucide-react";
import { articleService } from "@/services/articleService";
import type { UpdateArticlePayload } from "@/services/articleService";

export default function EditArticlePage() {
  const params = useParams();
  const router = useRouter();
  const articleId = Number(params.id);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [summary, setSummary] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isPublished, setIsPublished] = useState(true);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const data = await articleService.getArticleById(articleId);
        setTitle(data.title);
        setContent(data.content);
        setSummary(data.summary);
        setIsPublished(data.is_published);
        if (data.image_url) {
          setPreviewUrl(
            `${process.env.NEXT_PUBLIC_API_URL}/article${data.image_url}`
          );
        }
      } catch {
        setErrorMessage("Gagal mengambil data artikel.");
      } finally {
        setLoading(false);
      }
    };

    if (articleId) fetchArticle();
  }, [articleId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      setErrorMessage("Judul dan isi artikel wajib diisi.");
      return;
    }

    if (!isPublished) {
      const confirm = window.confirm(
        "Artikel akan ditandai sebagai tidak dipublikasikan. Ini dapat membuat artikel hilang dari tampilan publik. Lanjutkan?"
      );
      if (!confirm) return;
    }

    const payload: UpdateArticlePayload = {
      title,
      content,
      summary,
      is_published: isPublished,
    };

    if (image) {
      payload.image = image;
    }

    try {
      await articleService.updateArticle(articleId, payload);
      alert("Artikel berhasil diperbarui!");
      router.push("/articles");
    } catch {
      setErrorMessage("Gagal menyimpan perubahan artikel.");
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
        <h1 className="text-2xl font-medium">
          <span className="text-[#CF0000]">Kelola Artikel</span> |{" "}
          <span className="text-black">Edit Artikel</span>
        </h1>
      </div>

      {errorMessage && (
        <div className="bg-red-50 text-red-600 border border-red-200 rounded p-4 flex items-start gap-3">
          <AlertCircle className="mt-1" />
          <div>{errorMessage}</div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Artikel */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6 space-y-6">
              {/* Judul */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Judul Artikel *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              {/* Summary */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Summary</label>
                <input
                  type="text"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              {/* Content */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Isi Artikel *</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full p-4 min-h-[200px] rounded-lg border"
                />
              </div>

              {/* Status Publikasi */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Status Publikasi</label>
                <select
                  value={isPublished ? "true" : "false"}
                  onChange={(e) => setIsPublished(e.target.value === "true")}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="true">Dipublikasikan</option>
                  <option value="false">Tidak dipublikasikan</option>
                </select>
              </div>

              {/* Upload Gambar */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Gambar</label>
                {previewUrl ? (
                  <div className="relative w-full h-[200px]">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-full object-contain border rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImage(null);
                        setPreviewUrl("");
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white text-xs rounded px-2 py-1"
                    >
                      Hapus
                    </button>
                  </div>
                ) : (
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <div className="flex flex-col items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-gray-400" />
                      <p className="text-sm text-gray-600 mt-2">
                        Klik untuk pilih gambar
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex gap-3 justify-end pt-4">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-[#CF0000] text-white rounded-lg"
                >
                  Simpan Perubahan
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="font-medium flex items-center gap-2">
                <ImageIcon className="w-4 h-4" /> Preview
              </h2>
              <div className="space-y-2 text-sm text-gray-700">
                <p className="font-medium">{title}</p>
                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-[150px] object-contain rounded-md border"
                  />
                )}
                <p className="line-clamp-3">{summary}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
