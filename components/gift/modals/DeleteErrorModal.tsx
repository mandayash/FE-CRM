import React from 'react';
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import Image from "next/image";

interface DeleteErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRetry: () => void;
  count: number;
}

const DeleteErrorModal: React.FC<DeleteErrorModalProps> = ({
  isOpen,
  onClose,
  onRetry,
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
              src="/images/error-feedback.png" 
              alt="Error"
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
                {count} data hadiah gagal dihapus!
              </h2>
            </div>
            <p className="text-[#303030] text-sm">
              Mohon periksa koneksi internet Anda dan coba lagi.
            </p>
          </div>
          
          {/* Action Button */}
          <div className="flex w-full">
            <Button 
              className="flex-1 px-6 py-2 rounded-lg bg-[#CF0000] hover:bg-red-700 text-white text-sm font-medium"
              onClick={onRetry}
            >
              Coba lagi
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteErrorModal;