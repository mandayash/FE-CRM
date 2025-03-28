"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { UploadCloudIcon } from "lucide-react";

interface AddGiftFormProps {
  includeDescription?: boolean;
  onSubmit: (formData: {
    name: string;
    stock: number;
    points: number;
    image: File | null;
    description?: string;
  }) => void;
  onCancel: () => void;
}

const AddGiftForm: React.FC<AddGiftFormProps> = ({
  onSubmit,
  onCancel,
  includeDescription = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [giftName, setGiftName] = useState("");
  const [stockCount, setStockCount] = useState(0);
  const [pointsRequired, setPointsRequired] = useState(0);
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

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
      name: giftName,
      stock: stockCount,
      points: pointsRequired,
      image,
      description: includeDescription ? description : undefined,
    });
  };

  const incrementStock = () => setStockCount(stockCount + 1);
  const decrementStock = () => stockCount > 0 && setStockCount(stockCount - 1);

  const incrementPoints = () => setPointsRequired(pointsRequired + 1);
  const decrementPoints = () =>
    pointsRequired > 0 && setPointsRequired(pointsRequired - 1);

  return (
    <div className="bg-white rounded-2xl border border-[#EAEAEA] shadow-md p-6">
      <h2 className="text-xl font-medium mb-6">Tambah Hadiah</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nama Hadiah */}
        <div className="space-y-2">
          <label htmlFor="gift-name" className="block text-sm font-medium">
            Nama Hadiah <span className="text-red-500">*</span>
          </label>
          <input
            id="gift-name"
            type="text"
            value={giftName}
            onChange={(e) => setGiftName(e.target.value)}
            placeholder="Masukkan Nama Hadiah"
            className="w-full h-12 px-4 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#CF0000]"
            required
          />
        </div>

        {/* Deskripsi (Opsional) */}
        {includeDescription && (
          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium">
              Deskripsi Hadiah
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Tulis deskripsi singkat..."
              className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#CF0000]"
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Stok Hadiah */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Stok Hadiah <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center">
              <button
                type="button"
                onClick={decrementStock}
                className="h-12 w-12 border rounded-l-lg bg-gray-50"
              >
                -
              </button>
              <input
                type="number"
                value={stockCount}
                onChange={(e) => setStockCount(Number(e.target.value))}
                className="h-12 w-full text-center border-y"
                min="0"
              />
              <button
                type="button"
                onClick={incrementStock}
                className="h-12 w-12 border rounded-r-lg bg-gray-50"
              >
                +
              </button>
            </div>
          </div>

          {/* Poin Penukaran */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Poin Penukaran <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center">
              <button
                type="button"
                onClick={decrementPoints}
                className="h-12 w-12 border rounded-l-lg bg-gray-50"
              >
                -
              </button>
              <input
                type="number"
                value={pointsRequired}
                onChange={(e) => setPointsRequired(Number(e.target.value))}
                className="h-12 w-full text-center border-y"
                min="0"
              />
              <button
                type="button"
                onClick={incrementPoints}
                className="h-12 w-12 border rounded-r-lg bg-gray-50"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Upload Gambar */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">
            Gambar Hadiah <span className="text-red-500">*</span>
          </label>
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
                  setPreview(null);
                  setImage(null);
                }}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 text-xs"
              >
                X
              </button>
            </div>
          ) : (
            <div
              className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              <div className="mx-auto w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-3">
                <UploadCloudIcon className="w-8 h-8 text-[#CF0000]" />
              </div>
              <p className="text-sm font-medium text-gray-700">
                Seret dan lepas atau Pilih File
              </p>
              <p className="text-xs text-gray-500 mt-1">(.jpg, .png, .webp)</p>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-lg bg-[#EAEAEA] text-gray-700 hover:bg-gray-300"
          >
            Batalkan
          </button>
          <button
            type="submit"
            disabled={
              !giftName || stockCount <= 0 || pointsRequired <= 0 || !image
            }
            className="px-4 py-2 rounded-lg bg-[#CF0000] text-white hover:bg-red-700"
          >
            Tambah Hadiah
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddGiftForm;
