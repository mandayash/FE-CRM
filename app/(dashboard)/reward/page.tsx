"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, ListChecks } from "lucide-react";
import GiftStats from "@/components/gift/GiftStats";
import GiftTable from "@/components/gift/GiftTable";
import { rewardService, Reward } from "@/services/rewardService";
import DeleteGiftModal from "@/components/gift/modals/DeleteGiftModal";
import DeleteSuccessModal from "@/components/gift/modals/DeleteSuccessModal";
import DeleteErrorModal from "@/components/gift/modals/DeleteErrorModal";

export default function RewardPage() {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleteSuccessModalOpen, setIsDeleteSuccessModalOpen] =
    useState(false);
  const [isDeleteErrorModalOpen, setIsDeleteErrorModalOpen] = useState(false);
  const [itemsToDelete, setItemsToDelete] = useState<number[]>([]);

  const fetchRewards = async () => {
    try {
      setLoading(true);
      const { rewards } = await rewardService.getAllRewards();
      setRewards(rewards);
    } catch (error) {
      console.error("Failed to fetch rewards", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRewards();
  }, []);

  const handleSelectItem = (id: number) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleDeleteClick = (ids: number[]) => {
    setItemsToDelete(ids);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await Promise.all(
        itemsToDelete.map((id) => rewardService.deleteReward(id))
      );
      setRewards((prev) => prev.filter((r) => !itemsToDelete.includes(r.id)));
      setSelectedItems([]);
      setIsDeleteModalOpen(false);
      setIsDeleteSuccessModalOpen(true);
    } catch (error) {
      console.error("Failed to delete reward", error);
      setIsDeleteModalOpen(false);
      setIsDeleteErrorModalOpen(true);
    }
  };

  return (
    <div className="space-y-6 py-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-2xl font-medium text-[#CF0000]">Stok Hadiah</h1>

        <div className="flex gap-2">
          <Link
            href="/reward/claims"
            className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition"
          >
            <ListChecks className="w-4 h-4" />
            Permintaan Tukar Hadiah
          </Link>
          <Link
            href="/reward/create"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#CF0000] text-white rounded-lg text-sm hover:bg-red-700 transition"
          >
            <Plus className="w-4 h-4" />
            Tambah Hadiah
          </Link>
        </div>
      </div>

      <GiftStats
        totalCategories={rewards.length}
        initialStock={rewards.reduce((acc, cur) => acc + cur.stock, 0)}
        currentStock={rewards.reduce((acc, cur) => acc + cur.stock, 0)}
        totalRedeemed={0} // Nanti bisa diganti dengan data dari klaim
      />

      <GiftTable
        gifts={rewards}
        selectedItems={selectedItems}
        onSelectItem={handleSelectItem}
        onDelete={handleDeleteClick}
      />

      <DeleteGiftModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        count={itemsToDelete.length}
      />

      <DeleteSuccessModal
        isOpen={isDeleteSuccessModalOpen}
        onClose={() => setIsDeleteSuccessModalOpen(false)}
        count={itemsToDelete.length}
      />

      <DeleteErrorModal
        isOpen={isDeleteErrorModalOpen}
        onClose={() => setIsDeleteErrorModalOpen(false)}
        onRetry={handleConfirmDelete}
        count={itemsToDelete.length}
      />
    </div>
  );
}
