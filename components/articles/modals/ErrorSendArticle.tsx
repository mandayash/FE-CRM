import React from 'react';
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import Image from "next/image";

interface ErrorSendArticleProps {
  isOpen: boolean;
  onClose: () => void;
}

const ErrorSendArticle: React.FC<ErrorSendArticleProps> = ({
  isOpen,
  onClose
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[400px] p-0 rounded-2xl border-0 shadow-lg bg-white overflow-hidden">
        {/* Konten Modal */}
        <div className="flex flex-col items-center p-6 text-center">
          {/* Ilustrasi Petugas */}
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
            <h2 className="text-[#CF0000] text-xl font-bold mb-2">
              Artikel gagal dikirim!
            </h2>
            <p className="text-[#303030] text-sm">
              Mohon periksa koneksi internet Anda dan coba lagi.
            </p>
          </div>
          
          {/* Action Button */}
          <Button 
            className="px-6 py-2 rounded-lg bg-[#CF0000] hover:bg-red-700 text-white text-sm font-medium min-w-[120px]"
            onClick={onClose}
          >
            Kirim ulang Artikel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ErrorSendArticle;