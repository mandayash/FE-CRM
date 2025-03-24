'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import EditGiftForm from '@/components/gift/forms/EditGiftForm';
import ConfirmEditModal from '@/components/gift/modals/ConfirmEditModal';
import SuccessEditModal from '@/components/gift/modals/SuccessEditModal';
import ErrorEditModal from '@/components/gift/modals/ErrorEditModal';

export default function EditHadiahPage() {
  const router = useRouter();
  const params = useParams();
  const giftId = params.id as string;
  
  // State untuk data hadiah
  const [giftData, setGiftData] = useState<{
    id: string;
    name: string;
    stock: number;
    points: number;
    imageUrl: string;
  } | null>(null);
  
  // State untuk loading
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal states
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  
  // State untuk menyimpan data form yang akan dikirim ke API
  const [formDataToSubmit, setFormDataToSubmit] = useState<any>(null);

  // Fetch gift data
  useEffect(() => {
    // Simulate API call to fetch gift data
    const fetchGiftData = async () => {
      setIsLoading(true);
      try {
        setTimeout(() => {
          setGiftData({
            id: giftId,
            name: 'Mug',
            stock: 32,
            points: 1025,
            imageUrl: '/images/mug.png'
          });
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error('Failed to fetch gift:', error);
        setIsLoading(false);
      }
    };

    fetchGiftData();
  }, [giftId]);

  // Handler untuk form submission
  const handleFormSubmit = (data: {
    id: string;
    name: string;
    stock: number;
    points: number;
    image: File | null;
    imageUrl: string;
  }) => {
    setFormDataToSubmit(data);
    setShowConfirmModal(true);
  };

  // Modal handlers
  const handleConfirmEdit = async () => {
    setShowConfirmModal(false);
    
    if (!formDataToSubmit) return;
    
    // Simulate API call
    try {

      setTimeout(() => {
        setShowSuccessModal(true);
      }, 1000);
    } catch (error) {
      console.error('Error updating gift:', error);
      setShowErrorModal(true);
    }
  };

  // Menampilkan loader jika data masih dimuat
  if (isLoading) {
    return (
      <div className="p-8 flex justify-center items-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-[#CF0000] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Menampilkan pesan error jika data tidak ditemukan
  if (!giftData) {
    return (
      <div className="p-8 flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-xl font-medium text-gray-700">Hadiah tidak ditemukan</h2>
          <p className="mt-2 text-gray-500">Data hadiah yang Anda cari tidak ditemukan.</p>
          <button
            onClick={() => router.push('/gift')}
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
      {/* Page Title */}
      <h1 className="text-2xl font-medium">
        <span className="text-[#CF0000]">Stok Hadiah</span> | <span className="text-black">Edit Hadiah</span>
      </h1>

      {/* Form Component */}
      <EditGiftForm
        initialData={giftData}
        onSubmit={handleFormSubmit}
        onCancel={() => router.push('/gift')}
      />

      {/* Modals */}
      <ConfirmEditModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmEdit}
      />

      <SuccessEditModal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          router.push('/gift');
        }}
      />

      <ErrorEditModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
      />
    </div>
  );
}