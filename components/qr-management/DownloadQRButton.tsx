import React from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DownloadQRButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

const DownloadQRButton: React.FC<DownloadQRButtonProps> = ({ onClick, disabled = false }) => {
  return (
    <Button 
      onClick={onClick}
      disabled={disabled}
      className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Download className="w-4 h-4" />
      Download QR
    </Button>
  );
};

export default DownloadQRButton;