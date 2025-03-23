import React from 'react';
import Image from 'next/image';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
}

const AddSuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
  title,
  message
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={onClose}></div>
      
      <div className="bg-white rounded-xl overflow-hidden w-full max-w-md z-10">
        <div className="flex flex-col items-center text-center p-6">
          <Image
            src="/images/success-feedback.png"
            alt="Success"
            width={200}
            height={200}
            className="mb-6"
          />
          
          <div className="space-y-2 mb-6">
            <h3 className="text-[#CF0000] text-xl font-bold">{title}</h3>
            <p className="text-[#303030] text-base">{message}</p>
          </div>
          
          <button
            onClick={onClose}
            className="px-6 py-2 bg-[#EAEAEA] hover:bg-gray-200 text-[#303030] rounded-lg text-sm font-medium transition-colors"
          >
            Kembali
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddSuccessModal;