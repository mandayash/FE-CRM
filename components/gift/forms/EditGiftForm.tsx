"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { UploadCloudIcon } from "lucide-react";
import { rewardService } from "@/services/rewardService";

interface EditGiftFormProps {
  initialData: {
    id: number;
    name: string;
    stock: number;
    point_cost: number;
    description: string;
    image_url: string;
  };
  onSubmit: (formData: {
    id: number;
    name: string;
    stock: number;
    points: number;
    description: string;
    image: File | null;
    imageUrl: string;
  }) => void;
  onCancel: () => void;
}

const EditGiftForm: React.FC<EditGiftFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [giftName, setGiftName] = useState(initialData.name);
  const [stockCount, setStockCount] = useState(initialData.stock);
  const [pointsRequired, setPointsRequired] = useState(initialData.point_cost);
  const [description, setDescription] = useState(initialData.description);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(
    initialData.image_url
      ? rewardService.getImageUrl(initialData.image_url)
      : null
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      id: initialData.id,
      name: giftName,
      stock: stockCount,
      points: pointsRequired,
      description,
      image,
      imageUrl: initialData.image_url,
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-[#EAEAEA] shadow p-6">
      <h2 className="text-xl font-medium mb-6">Edit Hadiah</h2>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Nama Hadiah */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Nama Hadiah <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={giftName}
              onChange={(e) => setGiftName(e.target.value)}
              className="w-full h-12 px-4 rounded-lg border border-[#EAEAEA] focus:ring-2 focus:ring-[#CF0000] focus:outline-none"
              required
            />
          </div>

          {/* Deskripsi */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">Deskripsi</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 rounded-lg border border-[#EAEAEA] focus:ring-2 focus:ring-[#CF0000] focus:outline-none"
              placeholder="Masukkan deskripsi hadiah"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Stok */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Stok Hadiah <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() =>
                    stockCount > 0 && setStockCount(stockCount - 1)
                  }
                  className="h-12 w-12 border rounded-l-lg bg-gray-50"
                >
                  -
                </button>
                <input
                  type="number"
                  value={stockCount}
                  onChange={(e) => setStockCount(Number(e.target.value))}
                  min="0"
                  className="h-12 w-full text-center border-t border-b"
                />
                <button
                  type="button"
                  onClick={() => setStockCount(stockCount + 1)}
                  className="h-12 w-12 border rounded-r-lg bg-gray-50"
                >
                  +
                </button>
              </div>
            </div>

            {/* Poin */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Poin Penukaran <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() =>
                    pointsRequired > 0 && setPointsRequired(pointsRequired - 1)
                  }
                  className="h-12 w-12 border rounded-l-lg bg-gray-50"
                >
                  -
                </button>
                <input
                  type="number"
                  value={pointsRequired}
                  onChange={(e) => setPointsRequired(Number(e.target.value))}
                  min="0"
                  className="h-12 w-full text-center border-t border-b"
                />
                <button
                  type="button"
                  onClick={() => setPointsRequired(pointsRequired + 1)}
                  className="h-12 w-12 border rounded-r-lg bg-gray-50"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Upload Gambar */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">Gambar</label>
            {preview ? (
              <div className="relative w-full h-64 border rounded-lg overflow-hidden">
                <Image
                  src={preview}
                  alt="Preview"
                  fill
                  className="object-contain"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImage(null);
                    setPreview(null);
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white text-xs rounded-full px-2 py-1"
                >
                  X
                </button>
              </div>
            ) : (
              <div
                className="border-2 border-dashed border-[#EAEAEA] rounded-lg p-8 text-center cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-3 mx-auto">
                  <UploadCloudIcon className="w-8 h-8 text-[#CF0000]" />
                </div>
                <p className="text-sm font-medium text-gray-700">
                  Seret dan lepas atau Pilih File
                </p>
                <p className="text-xs text-gray-500">(.jpg, .png, .jpeg)</p>
              </div>
            )}
          </div>

          {/* Tombol Aksi */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded-lg bg-[#EAEAEA] text-gray-700 hover:bg-gray-300 transition"
            >
              Batalkan
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#CF0000] text-white hover:bg-red-700 transition"
              disabled={!giftName || stockCount <= 0 || pointsRequired <= 0}
            >
              Simpan Perubahan
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditGiftForm;
