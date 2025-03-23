import React from 'react';
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface ConfirmEditArticleProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmEditArticle: React.FC<ConfirmEditArticleProps> = ({
  isOpen,
  onClose,
  onConfirm
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
              alt="Konfirmasi"
              width={150} 
              height={150}
              className="w-auto h-auto"
            />
          </div>
          
          {/* Confirm Text */}
          <div className="mb-6 text-center">
            <h2 className="text-[#CF0000] text-xl font-bold mb-2">
              Anda yakin ingin mengedit artikel?
            </h2>
            <p className="text-[#303030] text-sm">
              Pastikan artikel yang anda edit sudah sesuai.
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
              Ya, Kirim Artikel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmEditArticle;