import React from 'react';
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import Image from "next/image";

interface ErrorAddQRModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRetry: () => void;
}

const ErrorAddQRModal = ({ isOpen, onClose, onRetry }: ErrorAddQRModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[400px] p-0 rounded-2xl border-0 shadow-lg bg-white overflow-hidden">
        {/* Konten Modal */}
        <div className="flex flex-col items-center p-6 text-center">
          {/* Ilustrasi Petugas */}
          <div className="mb-6">
            <Image 
              src="/images/error-feedback.png" 
              alt="Petugas" 
              width={150} 
              height={150}
              className="w-auto h-auto"
            />
          </div>
          
          {/* Error Text */}
          <div className="mb-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <AlertTriangle className="text-[#CF0000] w-6 h-6" />
              <h2 className="text-[#CF0000] text-xl font-bold">
                QR gagal ditambahkan!
              </h2>
            </div>
            <p className="text-[#303030] text-sm">
              Mohon periksa koneksi internet Anda dan coba lagi.
            </p>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-3 mt-2">
            <Button 
              variant="outline"
              className="px-6 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 border-none text-[#303030] text-sm font-medium min-w-[120px]"
              onClick={onClose}
            >
              Kembali
            </Button>
            <Button 
              className="px-6 py-2 rounded-lg bg-[#CF0000] hover:bg-[#B80000] text-white text-sm font-medium min-w-[120px]"
              onClick={onRetry}
            >
              Kirim ulang QR
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ErrorAddQRModal;