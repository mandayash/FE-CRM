"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import Link from "next/link";

import QRStats from "@/components/qr-management/QRStats";
import QRTable from "@/components/qr-management/QRTable";
import { qrService, QRFeedback } from "@/services/qrService";

import LihatQRModal from "@/components/qr-management/modals/QRCodeModal";
import DownloadSuccessModal from "@/components/qr-management/modals/DownloadSuccessModal";

export default function ManajemenQRPage() {
  const [qrData, setQrData] = useState<QRFeedback[]>([]);
  const [selectedQR] = useState<QRFeedback | null>(null);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isDownloadSuccessModalOpen, setIsDownloadSuccessModalOpen] =
    useState(false);

  useEffect(() => {
    const fetchQRs = async () => {
      try {
        const response = await qrService.listQRFeedbacks(1, 50);
        setQrData(response.qr_feedbacks);
      } catch (err) {
        console.error("Failed to fetch QR list:", err);
      }
    };

    fetchQRs();
  }, []);

  // const handleViewQR = (qr: QRFeedback) => {
  //   setSelectedQR(qr);
  //   setIsQRModalOpen(true);
  // };

  const handleDownloadQR = async (qr: QRFeedback) => {
    try {
      const blob = await qrService.downloadQRImage(qr.id);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `QR-${qr.id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setIsDownloadSuccessModalOpen(true);
    } catch (err) {
      console.error("Failed to download QR:", err);
    }
  };

  return (
    <div className="space-y-4">
      <QRStats />

      <div className="flex items-center w-full sm:w-auto">
        <Link
          href="/qr-management/create"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#CF0000] text-white rounded-lg hover:bg-red-700 text-sm w-full sm:w-auto transition"
        >
          <Plus className="w-4 h-4" />
          Tambah QR
        </Link>
      </div>

      <QRTable qrData={qrData} onDownloadQR={handleDownloadQR} />

      {selectedQR && (
        <LihatQRModal
          isOpen={isQRModalOpen}
          onClose={() => setIsQRModalOpen(false)}
          qrData={selectedQR}
        />
      )}

      <DownloadSuccessModal
        isOpen={isDownloadSuccessModalOpen}
        onClose={() => setIsDownloadSuccessModalOpen(false)}
      />
    </div>
  );
}
