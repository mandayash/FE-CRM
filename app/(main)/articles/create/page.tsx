"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Image as ImageIcon,
  AlertCircle,
  Bold,
  Italic,
  List,
  Heading,
  Link,
} from "lucide-react";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import LinkExtension from "@tiptap/extension-link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { articleService } from "@/services/article_service";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

// Custom CSS for justified text
const editorStyles = `
  .ProseMirror p, .article-preview p {
    text-align: justify;
  }
  
  .ProseMirror {
    min-height: 180px;
  }
`;

export default function CreateArticlePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successAction, setSuccessAction] = useState<"save" | "publish">(
    "save"
  );

  const stripHtmlTags = (html: string): string => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      LinkExtension.configure({
        openOnClick: false,
      }),
    ],
    content: "",
    onUpdate: ({ editor }) => {
      // You can access the HTML content from editor if needed
      console.log(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose max-w-none min-h-[180px] focus:outline-none",
      },
    },
  });

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleFile = (file: File) => {
    const supportedFormats = ["image/jpeg", "image/png", "image/jpg"];

    if (file && supportedFormats.includes(file.type)) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setErrorMessage(
        "Format file tidak didukung. Harap upload file dengan format .jpg, .jpeg, atau .png"
      );
      setShowError(true);
    }
  };

  const uploadImageToServer = async (file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();
      return data.url; // This will be like "/uploads/abc-123.jpg"
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  };

  const saveArticle = async (shouldPublish: boolean = false) => {
    if (!title) {
      setErrorMessage("Judul artikel tidak boleh kosong");
      setShowError(true);
      return;
    }

    if (!editor || !editor.getHTML() || editor.getText().trim() === "") {
      setErrorMessage("Isi artikel tidak boleh kosong");
      setShowError(true);
      return;
    }

    if (!imageFile) {
      setErrorMessage("Gambar artikel harus diupload");
      setShowError(true);
      return;
    }

    try {
      if (shouldPublish) {
        setIsPublishing(true);
      } else {
        setIsSaving(true);
      }

      // Upload image first
      const imageUrl = await uploadImageToServer(imageFile);

      // Get content without HTML tags
      const plainContent = stripHtmlTags(editor.getHTML());

      // Create the article
      await articleService.createArticle({
        title,
        content: plainContent,
        image: imageUrl,
        status: shouldPublish ? 2 : 1, // 1 for draft, 2 for published
        making_date: new Date().toISOString(),
      });

      // Show success dialog
      setSuccessAction(shouldPublish ? "publish" : "save");
      setShowSuccessDialog(true);
    } catch (error) {
      console.error("Failed to save article:", error);
      toast({
        title: "Gagal menyimpan artikel",
        description:
          "Terjadi kesalahan saat menyimpan artikel. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
      setIsPublishing(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessDialog(false);
    router.push("/articles");
  };

  return (
    <div className="space-y-6 p-4 max-w-7xl mx-auto">
      {/* Add the styles */}
      <style jsx global>
        {editorStyles}
      </style>

      <h1 className="text-2xl font-medium text-center md:text-left">
        <span className="text-[#CF0000]">Kelola Artikel</span> |
        <span className="text-black"> Buat Artikel</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card Editor Artikel */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6 space-y-6">
              <h2 className="text-red-600 font-medium text-lg">
                Tambah Artikel
              </h2>

              <div className="space-y-2">
                <label className="block text-sm">
                  Gambar <span className="text-red-500">*</span>
                </label>
                <div
                  className="border-2 border-dashed rounded-lg p-4 sm:p-8 cursor-pointer text-center overflow-hidden"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-auto max-h-[300px] object-contain rounded-lg"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <div className="p-3 bg-red-50 rounded-lg">
                        <ImageIcon className="w-6 h-6 text-red-600" />
                      </div>
                      <p className="break-words">
                        Seret dan lepas atau Pilih File
                      </p>
                      <p className="text-sm text-gray-500">
                        (.jpg, .jpeg, .png)
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm">
                  Judul Artikel <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Masukan Judul Artikel"
                  className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-red-100 break-words truncate"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm">
                  Isi Artikel <span className="text-red-500">*</span>
                </label>

                {/* Text Editor Toolbar */}
                <div className="border rounded-t-lg p-2 bg-gray-50 flex flex-wrap gap-1">
                  <button
                    onClick={() => editor?.chain().focus().toggleBold().run()}
                    className={`p-1.5 rounded-md ${
                      editor?.isActive("bold")
                        ? "bg-gray-200"
                        : "hover:bg-gray-200"
                    }`}
                    title="Bold"
                    type="button"
                  >
                    <Bold className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => editor?.chain().focus().toggleItalic().run()}
                    className={`p-1.5 rounded-md ${
                      editor?.isActive("italic")
                        ? "bg-gray-200"
                        : "hover:bg-gray-200"
                    }`}
                    title="Italic"
                    type="button"
                  >
                    <Italic className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() =>
                      editor?.chain().focus().toggleHeading({ level: 2 }).run()
                    }
                    className={`p-1.5 rounded-md ${
                      editor?.isActive("heading", { level: 2 })
                        ? "bg-gray-200"
                        : "hover:bg-gray-200"
                    }`}
                    title="Heading"
                    type="button"
                  >
                    <Heading className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() =>
                      editor?.chain().focus().toggleBulletList().run()
                    }
                    className={`p-1.5 rounded-md ${
                      editor?.isActive("bulletList")
                        ? "bg-gray-200"
                        : "hover:bg-gray-200"
                    }`}
                    title="Bullet List"
                    type="button"
                  >
                    <List className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      const url = window.prompt("Enter URL");
                      if (url) {
                        editor?.chain().focus().setLink({ href: url }).run();
                      }
                    }}
                    className={`p-1.5 rounded-md ${
                      editor?.isActive("link")
                        ? "bg-gray-200"
                        : "hover:bg-gray-200"
                    }`}
                    title="Link"
                    type="button"
                  >
                    <Link className="w-4 h-4" />
                  </button>
                </div>

                {/* Text Editor Content Area */}
                <div className="min-h-[200px] max-h-[400px] overflow-y-auto border rounded-b-lg p-4">
                  <EditorContent editor={editor} />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => saveArticle(false)}
                  disabled={isSaving || isPublishing}
                  className="order-2 sm:order-1"
                  type="button"
                >
                  {isSaving ? "Menyimpan..." : "Simpan"}
                </Button>
                <Button
                  onClick={() => saveArticle(true)}
                  disabled={isSaving || isPublishing}
                  className="bg-[#CF0000] hover:bg-red-700 text-white order-1 sm:order-2"
                  type="button"
                >
                  {isPublishing ? "Mengirim..." : "Kirim Artikel"}
                </Button>
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
              {imagePreview ? (
                <div className="aspect-video rounded-lg overflow-hidden">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-video rounded-lg bg-gray-100 flex items-center justify-center">
                  <p className="text-gray-500 text-center">
                    Preview akan muncul di sini
                  </p>
                </div>
              )}
              <div className="space-y-2 max-h-[400px] overflow-y-auto px-2 break-words">
                <h3 className="font-medium truncate">
                  {title || "Judul artikel akan muncul di sini"}
                </h3>
                <div className="text-gray-600 line-clamp-6 prose prose-sm article-preview">
                  {editor?.isEmpty ? (
                    "Isi artikel akan muncul di sini..."
                  ) : (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: editor?.getHTML() || "",
                      }}
                    />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialog Error */}
      <Dialog open={showError} onOpenChange={setShowError}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5" /> Error
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-600">{errorMessage}</p>
          </div>
          <DialogFooter>
            <Button
              onClick={() => setShowError(false)}
              className="bg-red-600 hover:bg-red-700 text-white"
              type="button"
            >
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-green-600">
              Artikel Berhasil{" "}
              {successAction === "publish" ? "Dikirim" : "Disimpan"}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-600">
              {successAction === "publish"
                ? "Artikel telah berhasil dikirim dan akan ditinjau oleh admin."
                : "Artikel telah berhasil disimpan sebagai draft."}
            </p>
          </div>
          <DialogFooter>
            <Button
              onClick={handleSuccessClose}
              className="bg-green-600 hover:bg-green-700 text-white"
              type="button"
            >
              Kembali ke Daftar Artikel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
