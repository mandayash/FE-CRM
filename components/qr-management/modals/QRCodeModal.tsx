import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScanQrCode } from "lucide-react";
import Image from "next/image";
import { QRFeedback } from "@/services/qrService";

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  qrData: QRFeedback;
}

const LihatQRModal = ({ isOpen, onClose, qrData }: QRCodeModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[400px] p-0 rounded-2xl border-0 shadow-lg bg-white overflow-hidden">
        {/* Header */}
        <div className="bg-white flex flex-col items-center justify-center pt-6 pb-4">
          <div className="flex items-center mb-1 text-[#CF0000]">
            <ScanQrCode className="w-5 h-5 text-[#CF0000] mr-2" />
            <h2 className="text-[#CF0000] text-xl font-bold">Lihat QR</h2>
          </div>
          <div className="w-full border-t border-dashed border-gray-300 mt-2"></div>
        </div>

        {/* QR Code */}
        <div className="px-6 pb-4 flex flex-col items-center">
          <div className="w-[160px] h-[160px] mb-4">
            {qrData.qrImageUrl ? (
              <Image
                src={qrData.qrImageUrl}
                alt={`QR Code ${qrData.id}`}
                width={160}
                height={160}
                className="w-full h-full"
              />
            ) : (
              // Placeholder QR code sample
              <svg viewBox="0 0 160 160" className="w-full h-full">
                <rect x="0" y="0" width="160" height="160" fill="white" />
                <path d="M30,30 L60,30 L60,60 L30,60 Z" fill="black" />
                <path d="M40,40 L50,40 L50,50 L40,50 Z" fill="white" />
                <path d="M70,30 L100,30 L100,60 L70,60 Z" fill="black" />
                <path d="M80,40 L90,40 L90,50 L80,50 Z" fill="white" />
                <path d="M110,30 L130,30 L130,50 L110,50 Z" fill="black" />
                <path d="M30,70 L50,70 L50,90 L30,90 Z" fill="black" />
                <path d="M70,70 L90,70 L90,90 L70,90 Z" fill="black" />
                <path d="M110,70 L130,70 L130,90 L110,90 Z" fill="black" />
                <path d="M30,100 L60,100 L60,130 L30,130 Z" fill="black" />
                <path d="M40,110 L50,110 L50,120 L40,120 Z" fill="white" />
                <path d="M70,100 L90,100 L90,120 L70,120 Z" fill="black" />
                <path d="M70,120 L100,120 L100,130 L70,130 Z" fill="black" />
                <path d="M110,100 L130,100 L130,130 L110,130 Z" fill="black" />
              </svg>
            )}
          </div>

          <div className="text-center mb-4">
            <p className="text-sm text-gray-500">QR ID</p>
            <p className="text-base font-medium">{qrData.id}</p>
          </div>

          <Button
            variant="outline"
            className="bg-gray-100 hover:bg-gray-200 border-gray-300 rounded-lg px-6 py-2 text-sm"
            onClick={onClose}
          >
            Kembali
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LihatQRModal;
