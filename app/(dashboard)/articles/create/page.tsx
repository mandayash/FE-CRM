"use client";

import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { articleService } from "@/services/articleService";

export default function CreateArticlePage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const router = useRouter();

  // Handle form submission
  const handleSubmit = async () => {
    if (!title.trim()) {
      setErrorMessage("Judul artikel wajib diisi.");
      setShowError(true);
      return;
    }

    if (!content.trim()) {
      setErrorMessage("Isi artikel wajib diisi.");
      setShowError(true);
      return;
    }

    setShowConfirm(true);
  };

  const confirmSubmit = async () => {
    setShowConfirm(false);
    try {
      const articleData = {
        title,
        content,
        summary: content.substring(0, 100) + "...",
        is_published: true,
      };

      console.log("Sending article data:", articleData);

      await articleService.createArticle(articleData);
      alert("Artikel berhasil dipublikasikan!");

      router.push("/articles"); // Redirect ke daftar artikel
    } catch (error) {
      console.error("Error submitting article:", error);
      setErrorMessage(
        error.message || "Gagal mempublikasikan artikel. Silakan coba lagi."
      );
      setShowError(true);
    }
  };

  return (
    <div className="space-y-6 p-4 max-w-7xl mx-auto">
      <h1 className="text-2xl font-medium text-center md:text-left">
        <span className="text-[#CF0000]">Kelola Artikel</span> |
        <span className="text-black"> Buat Artikel</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6 space-y-6">
              <h2 className="text-red-600 font-medium text-lg">
                Tambah Artikel
              </h2>

              <div className="space-y-2">
                <label className="block text-sm">
                  Judul Artikel <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Masukan Judul Artikel"
                  className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-red-100"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm">
                  Isi Artikel <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Masukan Isi Artikel"
                  className="w-full p-4 min-h-[200px] max-h-[400px] rounded-lg border focus:outline-none focus:ring-2 focus:ring-red-100"
                />
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-3">
                <button
                  onClick={() => router.push("/articles")}
                  className="px-6 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 order-2 sm:order-1"
                >
                  Batalkan
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2 rounded-lg bg-[#CF0000] text-white hover:bg-red-700 order-1 sm:order-2"
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
              <h2 className="text-lg font-medium">Preview Artikel</h2>
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

      {/* Dialog Konfirmasi */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Konfirmasi</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Apakah Anda yakin ingin membuat artikel ini?</p>
          </div>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowConfirm(false)}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Batal
            </button>
            <button
              onClick={confirmSubmit}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Ya, Publikasikan
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog Error */}
      <Dialog open={showError} onOpenChange={setShowError}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5" /> Kesalahan
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-600">{errorMessage}</p>
          </div>
          <div className="flex justify-end">
            <button
              onClick={() => setShowError(false)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Tutup
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
