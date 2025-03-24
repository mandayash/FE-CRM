import React from 'react';
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import Image from "next/image";

interface DeleteGiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  count: number; 
}

const DeleteGiftModal: React.FC<DeleteGiftModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm,
  count 
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[400px] p-0 rounded-2xl border-0 shadow-lg bg-white overflow-hidden">
        {/* Konten Modal */}
        <div className="flex flex-col items-center p-6 text-center">
          {/* Ilustrasi */}
          <div className="mb-6">
            <Image 
              src="/images/alert-illustration.png" 
              alt="Alert" 
              width={150} 
              height={150}
              className="w-auto h-auto"
            />
          </div>
          
          {/* Warning Text */}
          <div className="mb-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <h2 className="text-[#CF0000] text-xl font-bold">
                Anda yakin ingin menghapus {count} data hadiah?
              </h2>
            </div>
            <p className="text-[#303030] text-sm">
              Jika Anda menghapus data hadiah, data akan terhapus secara permanen.
            </p>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-3 w-full">
            <Button 
              variant="outline"
              className="flex-1 px-6 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 border-none text-[#303030] text-sm font-medium"
              onClick={onClose}
            >
              Kembali
            </Button>
            <Button 
              className="flex-1 px-6 py-2 rounded-lg bg-[#CF0000] hover:bg-red-700 text-white text-sm font-medium"
              onClick={onConfirm}
            >
              Ya, Hapus
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteGiftModal;