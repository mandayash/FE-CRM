import React from 'react';
import Image from "next/image";
import { Download } from "lucide-react";

interface QRCodePreviewProps {
  qrCode: string | null;
  onDownload: () => void;
}

const QRCodePreview: React.FC<QRCodePreviewProps> = ({ qrCode, onDownload }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 h-full">
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center justify-center w-5 h-5 bg-[#CF0000] text-white rounded-full text-xs">2</div>
          <label className="text-sm font-medium text-gray-700">
            Hasil QR
          </label>
        </div>
        <div className="bg-gray-50 rounded-lg p-6 flex flex-col items-center border border-gray-100">
          {qrCode ? (
            <div className="flex flex-col items-center gap-4">
              <div className="w-32 h-32">
                <Image 
                  src="{qrCode}" 
                  alt="QR Code"
                  width={128}
                  height={128}
                  className="w-full h-full"
                />
              </div>
              <button
                onClick={onDownload}
                className="flex items-center gap-2 px-4 py-2 bg-[#CF0000] text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                Download QR
              </button>
            </div>
          ) : (
            <div className="w-32 h-32 border-2 border-dashed border-gray-300 flex items-center justify-center">
              <span className="text-gray-400 text-sm">QR Code</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRCodePreview;