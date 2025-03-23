"use client";

import { useState, useCallback } from "react";  
import { Plus } from "lucide-react";
import Link from "next/link";
import GiftStats from "@/components/gift/GiftStats";
import GiftTable from "@/components/gift/GiftTable";
import DeleteGiftModal from "@/components/gift/modals/DeleteGiftModal";
import DeleteSuccessModal from "@/components/gift/modals/DeleteSuccessModal";
import DeleteErrorModal from "@/components/gift/modals/DeleteErrorModal";

export default function StokHadiahPage() {
  // State for handling selected items and delete operations
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [filteredGifts, setFilteredGifts] = useState<any[]>([]);
  
  // Delete modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleteSuccessModalOpen, setIsDeleteSuccessModalOpen] = useState(false);
  const [isDeleteErrorModalOpen, setIsDeleteErrorModalOpen] = useState(false);
  const [itemsToDelete, setItemsToDelete] = useState<string[]>([]);

  // Sample data untuk statistik
  const stats = {
    totalCategories: 16,
    totalItems: {
      all: 421,
      current: 301,
      exchanged: 120
    }
  };
  
  // Sample data untuk tabel
  const giftData = [
    { id: "HA-1245", name: "Mug", stock: 23, initialStock: 33, exchangePoints: 1023, totalExchanged: 10, status: "Draft" },
    { id: "HA-1246", name: "Topi", stock: 23, initialStock: 34, exchangePoints: 1123, totalExchanged: 11, status: "Draft" },
    { id: "HA-1247", name: "Payung", stock: 14, initialStock: 18, exchangePoints: 231, totalExchanged: 4, status: "Draft" },
    { id: "HA-1247", name: "Gantungan", stock: 13, initialStock: 19, exchangePoints: 340, totalExchanged: 6, status: "Gagal" },
    { id: "HA-1247", name: "Kaos", stock: 18, initialStock: 31, exchangePoints: 721, totalExchanged: 13, status: "Gagal" },
    { id: "HA-1248", name: "Stiker", stock: 23, initialStock: 34, exchangePoints: 2100, totalExchanged: 11, status: "Terkirim" },
    { id: "HA-1248", name: "Jaket", stock: 23, initialStock: 44, exchangePoints: 2101, totalExchanged: 21, status: "Terkirim" },
    { id: "HA-1249", name: "Tumbler", stock: 23, initialStock: 41, exchangePoints: 2105, totalExchanged: 18, status: "Terkirim" },
    { id: "HA-1250", name: "Piring", stock: 30, initialStock: 53, exchangePoints: 3000, totalExchanged: 23, status: "Terkirim" },
    { id: "HA-1250", name: "Pin LRT", stock: 31, initialStock: 58, exchangePoints: 3000, totalExchanged: 27, status: "Terkirim" },
    { id: "HA-1250", name: "Kacamata", stock: 62, initialStock: 64, exchangePoints: 23, totalExchanged: 2, status: "Terkirim" },
    { id: "HA-1250", name: "Emas", stock: 3, initialStock: 4, exchangePoints: 3100, totalExchanged: 1, status: "Terkirim" },
  ];

  // Handle select/deselect individual item
  const handleSelectItem = (itemId: string) => {
    setSelectedItems(prev => {
      if (prev.includes(itemId)) {
        return prev.filter(id => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  };

  // Handle when GiftTable filters data
  const handleFilteredDataChange = useCallback((data: any[]) => {
    setFilteredGifts(data);
  }, []);  

  // Handle delete gift
  const handleDeleteClick = (giftIds: string[]) => {
    setItemsToDelete(giftIds);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleteModalOpen(false);
    
    try {
      // Simulation of API call
      const isSuccess = Math.random() > 0.2;
      
      if (isSuccess) {
        setIsDeleteSuccessModalOpen(true);
        // Update selected items
        setSelectedItems(prev => prev.filter(id => !itemsToDelete.includes(id)));
      } else {
        setIsDeleteErrorModalOpen(true);
      }
    } catch (error) {
      console.error("Error deleting gifts:", error);
      setIsDeleteErrorModalOpen(true);
    }
  };

  const handleRetryDelete = () => {
    setIsDeleteErrorModalOpen(false);
    setTimeout(() => {
      handleConfirmDelete();
    }, 500);
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <h1 className="text-2xl font-medium text-[#CF0000]">
        Stok Hadiah
      </h1>

      {/* Gift Stats */}
      <GiftStats 
        totalCategories={stats.totalCategories}
        initialStock={stats.totalItems.all}
        currentStock={stats.totalItems.current}
        totalRedeemed={stats.totalItems.exchanged}
      />
      
      {/* Add Gift Button */}
      <div className="flex items-center w-full sm:w-auto">
        <Link
          href="/gift/create"
          className="inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-[#CF0000] text-white rounded-lg hover:bg-red-700 text-xs sm:text-sm w-full sm:w-auto transition-colors"
        >
          <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          Tambah Hadiah
        </Link>
      </div>

      {/* Gift Table Component*/}
      <GiftTable 
        gifts={giftData}
        selectedItems={selectedItems}
        onSelectItem={handleSelectItem}
        onDelete={handleDeleteClick}
        onFilteredDataChange={handleFilteredDataChange}
      />

      {/* Modals */}
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
        onRetry={handleRetryDelete}
        count={itemsToDelete.length}
      />
    </div>
  );
}