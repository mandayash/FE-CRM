"use client";

import { useState } from "react";
import InputStation from "@/components/qr-management/InputStation";
import QRCodePreview from "@/components/qr-management/QRCodePreview";
import ConfirmAddQRModal from "@/components/qr-management/modals/ConfirmAddQRModal";
import SuccessAddQRModal from "@/components/qr-management/modals/SuccessAddQRModal";
import ErrorAddQRModal from "@/components/qr-management/modals/ErrorAddQRModal";

export default function TambahQRPage() {
  const [stationName, setStationName] = useState("");
  const [qrCode, setQrCode] = useState<string | null>(null);
  
  // Modal states
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  
  // Generate QR code based on station name
  const generateQRCode = () => {
    if (!stationName.trim()) return;
    
    setQrCode("/public/images/sample-qr-code.png");
  };
  
  // Handle when station name changes
  const handleStationNameChange = (value: string) => {
    setStationName(value);
    // Optionally, regenerate QR code as user types
    if (value.trim()) {
      generateQRCode();
    } else {
      setQrCode(null);
    }
  };
  
  // Triggered when "Tambah QR" button is clicked
  const handleAddQR = () => {
    if (!stationName.trim()) return;
    setIsConfirmModalOpen(true);
  };
  
  // Triggered when "Ya, Tambahkan" button is clicked in confirm modal
  const handleConfirmAdd = async () => {
    setIsConfirmModalOpen(false);
    
    try {
      // For demonstration, simulate success most of the time
      const success = Math.random() > 0.2;
      
      if (success) {
        // Show success modal
        setIsSuccessModalOpen(true);
      } else {
        // Show error modal
        setIsErrorModalOpen(true);
      }
    } catch (error) {
      console.error("Error adding QR:", error);
      setIsErrorModalOpen(true);
    }
  };
  
  // Handle retry after error
  const handleRetry = () => {
    setIsErrorModalOpen(false);
    setTimeout(() => {
      handleConfirmAdd();
    }, 500);
  };
  
  // Download the generated QR code
  const handleDownloadQR = () => {
    if (!qrCode) return;
    
    // In a real application, you would implement proper download logic
    const link = document.createElement('a');
    link.href = qrCode;
    link.download = `QR-${stationName.replace(/\s+/g, '-')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Page title */}
      <div className="flex items-center">
        <h1 className="text-2xl font-medium">
          <span className="text-[#CF0000]">Manajemen QR</span> | <span>Tambah QR</span>
        </h1>
      </div>
      
      {/* Main content */}
      <div className="bg-white rounded-xl p-6">
        <h2 className="text-xl font-medium mb-6">Tambah QR</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left side - Input Station Component */}
          <InputStation 
            stationName={stationName} 
            onChange={handleStationNameChange} 
          />
          
          {/* Right side - QR Code Preview Component */}
          <QRCodePreview 
            qrCode={qrCode} 
            onDownload={handleDownloadQR} 
          />
        </div>
        
        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            Batalkan
          </button>
          <button
            onClick={handleAddQR}
            disabled={!stationName.trim() || !qrCode}
            className="px-4 py-2 bg-[#CF0000] text-white rounded-lg text-sm hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Tambah QR
          </button>
        </div>
      </div>
      
      {/* Modals */}
      <ConfirmAddQRModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmAdd}
      />
      
      <SuccessAddQRModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
      />
      
      <ErrorAddQRModal
        isOpen={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
        onRetry={handleRetry}
      />
    </div>
  );
}