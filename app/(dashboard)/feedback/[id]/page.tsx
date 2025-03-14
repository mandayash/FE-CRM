'use client'

import FeedbackReplyWrapper from '@/components/feedback/reply/FeedbackReplyWrapper';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface FeedbackDetailProps {
    id?: string;
    user?: {
      name: string;
      email: string;
      avatar: string;
    };
    type?: string;
    date?: string;
    station?: string;
    message?: string;
    image?: {
      url: string;
      name: string;
    };
    rating?: number;
}
  
export default function FeedbackReplyPage() {
  const router = useRouter();
    // Data dummy untuk testing
    const feedbackData: FeedbackDetailProps = {
      id: 'UF-1245',
      user: {
        name: 'Sarah Miller',
        email: 'smiller@gmail.com',
        avatar: '/profile-placeholder.png'
      },
      type: 'Masalah Fasilitas',
      date: '2028-02-27 | 04:28:48',
      station: 'Demang',
      message: 'AC di dalam kereta tidak dingin, terutama saat jam ramai. Rasanya pengap dan tidak nyaman.',
      image: {
        url: '/profile-placeholder.png',
        name: 'DSC21012.JPG'
      },
      rating: 3
    };
  
    return (
      <div className="p-4 sm:p-6 max-w-[1200px] mx-auto">
        {/* Back Button */}
        <div className="flex items-center gap-2">
            <button 
              onClick={() => router.back()}
              className="hover:bg-gray-100 p-1.5 sm:p-2 rounded-lg transition-colors"
            >
              <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
            </button>
            <h2 className="text-base sm:text-lg font-medium">Lihat Balasan</h2>
          </div>

        {/* Wrapper Content */}
        <FeedbackReplyWrapper feedbackData={feedbackData} />
      </div>
    );
  }