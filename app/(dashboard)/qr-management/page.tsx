'use client';

import { useState } from "react";
import { Plus, Trash } from "lucide-react";
import Link from "next/link";

// Import components
import QRStats from "@/components/qr-management/QRStats";
import QRTableContainer from "@/components/qr-management/QRTable";

// Import modals
import LihatQRModal from "@/components/qr-management/modals/QRCodeModal";
import DeleteQRModal from "@/components/qr-management/modals/DeleteQRModal";
import DeleteSuccessModal from "@/components/qr-management/modals/DeleteSuccessModal";
import DeleteErrorModal from "@/components/qr-management/modals/DeleteErrorModal";
import DownloadSuccessModal from "@/components/qr-management/modals/DownloadSuccessModal";

export default function ManajemenQRPage() {
  // State untuk modal
  const [selectedQR, setSelectedQR] = useState<{id: string; namaStasiun?: string; qrImageUrl?: string} | null>(null);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleteSuccessModalOpen, setIsDeleteSuccessModalOpen] = useState(false);
  const [isDeleteErrorModalOpen, setIsDeleteErrorModalOpen] = useState(false);
  const [isDownloadSuccessModalOpen, setIsDownloadSuccessModalOpen] = useState(false);
  const [qrsToDelete, setQRsToDelete] = useState<string[]>([]);
  
  // Sample data
  const qrData = [
    { id: "QR-1245", stasiun: "ST-1245", namaStasiun: "DJKA", qrImageUrl: "/sample-qr.png" },
    { id: "QR-1246", stasiun: "ST-1246", namaStasiun: "Bandara SMB II", qrImageUrl: "/sample-qr.png" },
    { id: "QR-1247", stasiun: "ST-1247", namaStasiun: "Jakabaring", qrImageUrl: "/sample-qr.png" },
    { id: "QR-1248", stasiun: "ST-1248", namaStasiun: "Punti Kayu", qrImageUrl: "/sample-qr.png" },
    { id: "QR-1249", stasiun: "ST-1249", namaStasiun: "Asrama Haji", qrImageUrl: "/sample-qr.png" },
    { id: "QR-1250", stasiun: "ST-1250", namaStasiun: "Cinde", qrImageUrl: "/sample-qr.png" },
    { id: "QR-1251", stasiun: "ST-1251", namaStasiun: "Garuda Dempo", qrImageUrl: "/sample-qr.png" },
    { id: "QR-1252", stasiun: "ST-1252", namaStasiun: "RSUD", qrImageUrl: "/sample-qr.png" },
    { id: "QR-1253", stasiun: "ST-1253", namaStasiun: "Bumi Sriwijaya", qrImageUrl: "/sample-qr.png" },
    { id: "QR-1254", stasiun: "ST-1254", namaStasiun: "Dishub", qrImageUrl: "/sample-qr.png" },
    { id: "QR-1255", stasiun: "ST-1255", namaStasiun: "Ampera", qrImageUrl: "/sample-qr.png" },
    { id: "QR-1256", stasiun: "ST-1256", namaStasiun: "Polresta", qrImageUrl: "/sample-qr.png" }
  ];

  // Handler untuk action di tabel QR
  const handleViewQR = (qr: {id: string; namaStasiun?: string; qrImageUrl?: string}) => {
    setSelectedQR(qr);
    setIsQRModalOpen(true);
  };

  const handleDeleteClick = (qrIds: string[]) => {
    setQRsToDelete(qrIds);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleteModalOpen(false);
    
    try {
      // Simulasi API call untuk hapus QR
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Demo: Random success or error
      const isSuccess = Math.random() > 0.2;
      
      if (isSuccess) {
        setIsDeleteSuccessModalOpen(true);
      } else {
        setIsDeleteErrorModalOpen(true);
      }
    } catch (error) {
      console.error("Error deleting QR:", error);
      setIsDeleteErrorModalOpen(true);
    }
  };

  const handleRetryDelete = () => {
    setIsDeleteErrorModalOpen(false);
    setTimeout(() => {
      handleConfirmDelete();
    }, 500);
  };

  const handleDownloadQR = (qr: {id: string; qrImageUrl?: string}) => {
    if (!qr.qrImageUrl) return;
    
    // Create a download link
    const link = document.createElement('a');
    link.href = qr.qrImageUrl;
    link.download = `QR-${qr.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Show download success modal
    setIsDownloadSuccessModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <h1 className="text-2xl font-medium text-[#CF0000]">
        Manajemen QR
      </h1>

      {/* Stats Section */}
      <QRStats totalQR={13} totalStasiun={13} />
      
      {/* Add QR Button */}
      <div className="flex items-center w-full sm:w-auto">
        <Link
          href="/qr-management/create"
          className="inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-[#CF0000] text-white rounded-lg hover:bg-red-700 text-xs sm:text-sm w-full sm:w-auto transition-colors"
        >
          <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          Tambah QR
        </Link>
      </div>

      {/* QR Table */}
      <QRTableContainer 
        qrData={qrData}
        onViewQR={handleViewQR}
        onDownloadQR={handleDownloadQR}
        onDeleteQR={handleDeleteClick}
      />

      {/* Modals */}
      {selectedQR && (
        <LihatQRModal
          isOpen={isQRModalOpen}
          onClose={() => setIsQRModalOpen(false)}
          qrData={selectedQR}
        />
      )}

      <DeleteQRModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        count={qrsToDelete.length}
      />

      <DeleteSuccessModal
        isOpen={isDeleteSuccessModalOpen}
        onClose={() => setIsDeleteSuccessModalOpen(false)}
        count={qrsToDelete.length}
      />

      <DeleteErrorModal
        isOpen={isDeleteErrorModalOpen}
        onClose={() => setIsDeleteErrorModalOpen(false)}
        onRetry={handleRetryDelete}
        count={qrsToDelete.length}
      />

      <DownloadSuccessModal
        isOpen={isDownloadSuccessModalOpen}
        onClose={() => setIsDownloadSuccessModalOpen(false)}
      />
    </div>
  );
}