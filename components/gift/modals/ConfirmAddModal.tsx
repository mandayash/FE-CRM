import React from 'react';
import Image from 'next/image';

interface ConfirmAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmAddModal: React.FC<ConfirmAddModalProps> = ({
  isOpen,
  onClose,
  onConfirm
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={onClose}></div>
      
      <div className="bg-white rounded-xl overflow-hidden w-full max-w-md z-10">
        <div className="flex flex-col items-center text-center p-6">
          <Image
            src="/images/alert-illustration.png"
            alt="Confirm"
            width={200}
            height={200}
            className="mb-6"
          />
          
          <div className="space-y-2 mb-6">
            <div className="flex items-center justify-center gap-1">
              <div className="text-red-600 text-xl">⚠️</div>
              <h3 className="text-[#CF0000] text-xl font-bold">Anda yakin ingin menambahkan Hadiah?</h3>
            </div>
            <p className="text-[#303030] text-base">Pastikan data hadiah yang anda masukan sudah sesuai.</p>
          </div>
          
          <div className="flex gap-3 w-full">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-2 bg-[#EAEAEA] hover:bg-gray-200 text-[#303030] rounded-lg text-sm font-medium transition-colors"
            >
              Kembali
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-6 py-2 bg-[#CF0000] hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Ya, Tambah
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmAddModal;