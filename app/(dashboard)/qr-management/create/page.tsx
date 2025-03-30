"use client";

import { useState } from "react";
import InputStation from "@/components/qr-management/InputStation";
import ConfirmAddQRModal from "@/components/qr-management/modals/ConfirmAddQRModal";
import SuccessAddQRModal from "@/components/qr-management/modals/SuccessAddQRModal";
import ErrorAddQRModal from "@/components/qr-management/modals/ErrorAddQRModal";
import { qrService } from "@/services/qrService";

export default function TambahQRPage() {
  const [stationName, setStationName] = useState("");
  const [qrImageUrl, setQrImageUrl] = useState<string | null>(null);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);

  const handleStationNameChange = (value: string) => {
    setStationName(value);
  };

  const handleAddQR = () => {
    if (!stationName.trim()) return;
    setIsConfirmModalOpen(true);
  };

  const handleConfirmAdd = async () => {
    setIsConfirmModalOpen(false);

    try {
      const createdQR = await qrService.createQR({ station: stationName });

      // Ambil QR code sebagai blob dan konversi ke URL agar bisa dipreview/download
      const imageUrl = await qrService.getQRCodeObjectUrl(createdQR.id);
      setQrImageUrl(imageUrl);

      setIsSuccessModalOpen(true);
    } catch (error) {
      console.error("Error creating QR:", error);
      setIsErrorModalOpen(true);
    }
  };

  const handleRetry = () => {
    setIsErrorModalOpen(false);
    setTimeout(() => {
      handleConfirmAdd();
    }, 500);
  };

  return (
    <div className="space-y-6">
      <div className="pt-6 items-center">
        <h1 className="text-2xl font-medium">
          <span className="text-[#CF0000]">Manajemen QR</span> | Tambah QR
        </h1>
      </div>

      <div className="bg-white rounded-xl p-2">
        <h2 className="text-xl font-medium mb-6">Tambah QR</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <InputStation
            stationName={stationName}
            onChange={handleStationNameChange}
          />
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            Batalkan
          </button>
          <button
            onClick={handleAddQR}
            disabled={!stationName.trim()}
            className="px-4 py-2 bg-[#CF0000] text-white rounded-lg text-sm hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Tambah QR
          </button>
        </div>
      </div>

      <ConfirmAddQRModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmAdd}
      />

      <SuccessAddQRModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        qrImageUrl={qrImageUrl}
      />

      <ErrorAddQRModal
        isOpen={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
        onRetry={handleRetry}
      />
    </div>
  );
}
