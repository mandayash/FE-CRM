/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import EditGiftForm from "@/components/gift/forms/EditGiftForm";
import ConfirmEditModal from "@/components/gift/modals/ConfirmEditModal";
import SuccessEditModal from "@/components/gift/modals/SuccessEditModal";
import ErrorEditModal from "@/components/gift/modals/ErrorEditModal";
import { rewardService, Reward } from "@/services/rewardService";

export default function EditHadiahPage() {
  const router = useRouter();
  const { id } = useParams();
  const rewardId = Number(id);

  const [reward, setReward] = useState<Reward | null>(null);
  const [loading, setLoading] = useState(true);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const [formDataToSubmit, setFormDataToSubmit] = useState<any>(null);

  useEffect(() => {
    const fetchReward = async () => {
      try {
        setLoading(true);
        const data = await rewardService.getRewardById(rewardId);
        setReward(data);
      } catch (error) {
        console.error("Failed to fetch reward:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!isNaN(rewardId)) fetchReward();
  }, [rewardId]);

  const handleFormSubmit = (data: {
    id: number;
    name: string;
    stock: number;
    points: number;
    description: string;
    image: File | null;
    imageUrl?: string;
  }) => {
    setFormDataToSubmit(data);
    setShowConfirmModal(true);
  };

  const handleConfirmEdit = async () => {
    setShowConfirmModal(false);

    if (!formDataToSubmit) return;

    try {
      const form = new FormData();
      form.append("name", formDataToSubmit.name);
      form.append("point_cost", formDataToSubmit.points.toString());
      form.append("stock", formDataToSubmit.stock.toString());
      form.append("description", formDataToSubmit.description);
      if (formDataToSubmit.image) {
        form.append("image", formDataToSubmit.image);
      }

      await rewardService.updateReward(rewardId, form);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error updating reward:", error);
      setShowErrorModal(true);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-[#CF0000] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!reward) {
    return (
      <div className="p-8 flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-xl font-medium text-gray-700">
            Hadiah tidak ditemukan
          </h2>
          <p className="mt-2 text-gray-500">
            Data hadiah yang Anda cari tidak ditemukan.
          </p>
          <button
            onClick={() => router.push("/reward")}
            className="mt-4 px-4 py-2 bg-[#CF0000] text-white rounded-lg"
          >
            Kembali ke Daftar Hadiah
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <h1 className="text-2xl font-medium">
        <span className="text-[#CF0000]">Stok Hadiah</span> |{" "}
        <span className="text-black">Edit Hadiah</span>
      </h1>

      <EditGiftForm
        initialData={{
          id: reward.id,
          name: reward.name,
          stock: reward.stock,
          point_cost: reward.point_cost,
          description: reward.description,
          image_url: reward.image_url || "",
        }}
        onSubmit={handleFormSubmit}
        onCancel={() => router.push("/reward")}
      />

      <ConfirmEditModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmEdit}
      />

      <SuccessEditModal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          router.push("/reward");
        }}
      />

      <ErrorEditModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
      />
    </div>
  );
}
