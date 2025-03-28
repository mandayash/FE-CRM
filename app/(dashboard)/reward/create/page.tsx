"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import AddGiftForm from "@/components/gift/forms/AddGiftForm";
import ConfirmAddModal from "@/components/gift/modals/ConfirmAddModal";
import SuccessModal from "@/components/gift/modals/AddSuccessModal";
import ErrorModal from "@/components/gift/modals/AddErrorModal";

import { rewardService } from "@/services/rewardService";

export default function TambahHadiahPage() {
  const router = useRouter();

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const [formData, setFormData] = useState<{
    name: string;
    stock: number;
    points: number;
    image: File | null;
    description?: string;
  } | null>(null);

  const handleFormSubmit = (data: {
    name: string;
    stock: number;
    points: number;
    image: File | null;
    description?: string;
  }) => {
    setFormData(data);
    setShowConfirmModal(true);
  };

  const handleConfirmAdd = async () => {
    setShowConfirmModal(false);
    if (!formData) return;

    try {
      const form = new FormData();
      form.append("name", formData.name);
      form.append("point_cost", formData.points.toString());
      form.append("stock", formData.stock.toString());
      if (formData.description) {
        form.append("description", formData.description);
      }
      if (formData.image) {
        form.append("image", formData.image);
      }

      await rewardService.createReward(form);

      setShowSuccessModal(true);
    } catch (error) {
      console.error("Failed to create reward:", error);
      setShowErrorModal(true);
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Kembali */}
      <button
        onClick={() => router.push("/reward")}
        className="flex items-center gap-2 text-sm text-gray-600 hover:text-black"
      >
        <ArrowLeft size={18} />
        Kembali ke daftar hadiah
      </button>

      {/* Judul */}
      <h1 className="text-2xl font-medium">
        <span className="text-[#CF0000]">Stok Hadiah</span> |{" "}
        <span className="text-black">Tambah Hadiah</span>
      </h1>

      {/* Form */}
      <AddGiftForm
        onSubmit={handleFormSubmit}
        onCancel={() => router.push("/reward")}
        includeDescription
      />

      {/* Modals */}
      <ConfirmAddModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmAdd}
      />
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          router.push("/reward");
        }}
        title="Data Hadiah berhasil ditambah!"
        message="Hadiah berhasil ditambahkan ke sistem."
      />
      <ErrorModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title="Gagal menambah hadiah!"
        message="Terjadi kesalahan, silakan coba kembali."
      />
    </div>
  );
}
