import React from 'react';
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface SuccessSaveArticleProps {
  isOpen: boolean;
  onClose: () => void;
}

const SuccessSaveArticle: React.FC<SuccessSaveArticleProps> = ({
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
              src="/images/success-feedback.png" 
              alt="Sukses"
              width={150} 
              height={150}
              className="w-auto h-auto"
            />
          </div>
          
          {/* Success Text */}
          <div className="mb-6 text-center">
            <h2 className="text-[#CF0000] text-xl font-bold mb-2">
              Artikel disimpan!
            </h2>
            <p className="text-[#303030] text-sm">
              Artikel berhasil disimpan.
            </p>
          </div>
          
          {/* Action Button */}
          <Button 
            variant="outline"
            className="px-6 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 border-none text-[#303030] text-sm font-medium min-w-[120px]"
            onClick={onClose}
          >
            Kembali
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SuccessSaveArticle;