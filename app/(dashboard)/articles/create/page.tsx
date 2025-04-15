"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AlertCircle, ArrowLeft, ImagePlus } from "lucide-react";
import { articleService } from "@/services/articleService";
import Image from "next/image";

export default function CreateArticlePage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();
  const handleGoBack = () => {
    router.push("/articles");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setErrorMessage("Format gambar tidak didukung.");
      setShowError(true);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("Ukuran gambar maksimum 5MB.");
      setShowError(true);
      return;
    }

    setImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = () => {
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
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("summary", content.substring(0, 100) + "...");
      formData.append("is_published", "true");

      if (image) {
        formData.append("image", image);
      }

      await articleService.createArticle(formData);
      alert("Artikel berhasil dipublikasikan!");
      router.push("/articles");
    } catch (error: any) {
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
        <button
          onClick={handleGoBack}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Kembali ke daftar pengguna"
        >
          <ArrowLeft size={20} className="text-black" />
        </button>
        <span className="text-[#CF0000]">Kelola Artikel</span> |{" "}
        <span className="text-black">Tambah Artikel</span>
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

              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  Thumbnail Gambar
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="text-sm"
                />
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-3">
                <button
                  onClick={() => router.push("/articles")}
                  className="px-6 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                >
                  Batalkan
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2 rounded-lg bg-[#CF0000] text-white hover:bg-red-700"
                >
                  Publikasikan
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 sticky top-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="text-lg font-medium">Preview Artikel</h2>
              {previewUrl ? (
                <Image
                  src={previewUrl}
                  alt="Preview"
                  width={400}
                  height={200}
                  className="rounded-lg object-cover"
                />
              ) : (
                <div className="bg-gray-100 border border-dashed rounded-lg flex items-center justify-center aspect-video">
                  <ImagePlus className="w-8 h-8 text-gray-400" />
                </div>
              )}
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

      {/* Konfirmasi Dialog */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            Apakah Anda yakin ingin mempublikasikan artikel ini?
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5" /> Kesalahan
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 text-gray-700">{errorMessage}</div>
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
