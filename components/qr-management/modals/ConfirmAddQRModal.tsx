import React from 'react';
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import Image from "next/image";

interface ConfirmAddQRModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmAddQRModal = ({ isOpen, onClose, onConfirm }: ConfirmAddQRModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[400px] p-0 rounded-2xl border-0 shadow-lg bg-white overflow-hidden">
        {/* Konten Modal */}
        <div className="flex flex-col items-center p-6 text-center">
          {/* Ilustrasi Petugas */}
          <div className="mb-6">
            <Image 
              src="/images/alert-illustration.png" 
              alt="Petugas" 
              width={150}
              height={150}
              className="w-auto h-auto"
            />
          </div>
          
          {/* Warning Text */}
          <div className="mb-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <AlertTriangle className="text-[#CF0000] w-6 h-6" />
              <h2 className="text-[#CF0000] text-xl font-bold">
                Anda yakin ingin menambahkan data QR?
              </h2>
            </div>
            <p className="text-[#303030] text-sm">
              Pastikan data yang anda masukan sudah sesuai!
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
              onClick={onConfirm}
            >
              Ya, Tambahkan
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmAddQRModal;