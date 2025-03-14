'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Image as ImageIcon, AlertCircle } from 'lucide-react';
import { useState, useRef } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

export default function CreateArticlePage() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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
    const supportedFormats = ['image/jpeg', 'image/png', 'image/jpg'];
    
    if (file && supportedFormats.includes(file.type)) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setErrorMessage('Format file tidak didukung. Harap upload file dengan format .jpg, .jpeg, atau .png');
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
        {/* Card Editor Artikel */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6 space-y-6">
              <h2 className="text-red-600 font-medium text-lg">Tambah Artikel</h2>
              
              <div className="space-y-2">
                <label className="block text-sm">Gambar <span className="text-red-500">*</span></label>
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
                      <p className="break-words">Seret dan lepas atau Pilih File</p>
                      <p className="text-sm text-gray-500">(.jpg, .jpeg, .png)</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm">Judul Artikel <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Masukan Judul Artikel"
                  className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-red-100 break-words truncate"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm">Isi Artikel <span className="text-red-500">*</span></label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Masukan Isi Artikel"
                  className="w-full p-4 min-h-[200px] max-h-[400px] rounded-lg border focus:outline-none focus:ring-2 focus:ring-red-100 break-words overflow-y-auto"
                />
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-3">
                <button className="px-6 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 order-2 sm:order-1">Simpan</button>
                <button className="px-6 py-2 rounded-lg bg-[#CF0000] text-white hover:bg-red-700 order-1 sm:order-2">Kirim Artikel</button>
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
                  <p className="text-gray-500 text-center">Preview akan muncul di sini</p>
                </div>
              )}
              <div className="space-y-2 max-h-[400px] overflow-y-auto px-2 break-words">
                <h3 className="font-medium truncate">{title || 'Judul artikel akan muncul di sini'}</h3>
                <p className="text-gray-600 line-clamp-4">{content || 'Isi artikel akan muncul di sini...'}</p>
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
              <AlertCircle className="w-5 h-5" /> Format Tidak Didukung
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-600">{errorMessage}</p>
          </div>
          <div className="flex justify-end">
            <button onClick={() => setShowError(false)} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Tutup</button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}