'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AddGiftForm from '@/components/gift/forms/AddGiftForm';
import ConfirmAddModal from '@/components/gift/modals/ConfirmAddModal';
import SuccessModal from '@/components/gift/modals/AddSuccessModal';
import ErrorModal from '@/components/gift/modals/AddErrorModal';

export default function TambahHadiahPage() {
  const router = useRouter();
  
  // Modal states
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  
  // Form data 
  const [formData, setFormData] = useState<{
    name: string;
    stock: number;
    points: number;
    image: File | null;
  } | null>(null);

  // Handle form submission
  const handleFormSubmit = (data: {
    name: string;
    stock: number;
    points: number;
    image: File | null;
  }) => {
    setFormData(data);
    setShowConfirmModal(true);
  };

  // Modal handlers
  const handleConfirmAdd = async () => {
    setShowConfirmModal(false);
    
    if (!formData) return;
    
    // Simulate API call
    try {
      
      setTimeout(() => {
        setShowSuccessModal(true);
      }, 1000);
    } catch (error) {
      console.error("Error adding gift:", error);
      setShowErrorModal(true);
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Page Title */}
      <h1 className="text-2xl font-medium">
        <span className="text-[#CF0000]">Stok Hadiah</span> | <span className="text-black">Tambah Hadiah</span>
      </h1>

      {/* Form Component */}
      <AddGiftForm 
        onSubmit={handleFormSubmit}
        onCancel={() => router.push('/gift')}
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
          router.push('/gift');
        }}
        title="Data Hadiah berhasil ditambah!"
        message="Data Hadiah berhasil ditambah."
      />

      <ErrorModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title="Data Hadiah gagal ditambah!"
        message="Mohon periksa koneksi internet Anda dan coba lagi."
      />
    </div>
  );
}