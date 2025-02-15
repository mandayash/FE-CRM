// app/feedback/[id]/reply/page.tsx

'use client'

import { ArrowLeft, Download, Maximize2, Star } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function FeedbackReplyDetail() {
  const router = useRouter();
  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
      {/* Left Section - Message Content */}
      <div className="flex-1 bg-white rounded-lg p-4 sm:p-8">
        {/* Header with back button */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => router.back()}
              className="hover:bg-gray-100 p-1.5 sm:p-2 rounded-lg transition-colors"
            >
              <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
            </button>
            <h2 className="text-base sm:text-lg font-medium">Balasan Feedback</h2>
          </div>
          <div className="flex gap-1 sm:gap-2">
            <button className="hover:bg-gray-100 p-1.5 sm:p-2 rounded-lg transition-colors">
              <Download size={18} className="sm:w-5 sm:h-5" />
            </button>
            <button className="hover:bg-gray-100 p-1.5 sm:p-2 rounded-lg transition-colors">
              <Maximize2 size={18} className="sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Message Title */}
        <h1 className="text-2xl font-bold mb-2">
          LRT SUMSEL: Tindak Lanjut atas Masalah Suhu AC di LRT
        </h1>
        <p className="text-gray-500 mb-6">14 September 2028, 07:00 AM</p>

        {/* Message Content */}
        <div className="space-y-3 sm:space-y-4 text-sm sm:text-base text-justify">
          <p>Hallo Anandita,</p>
          <p>
            Kami mohon maaf atas ketidaknyamanan yang Anda rasakan terkait suhu AC di dalam kereta,
            terutama saat jam ramai. Kami memahami betapa pentingnya kenyamanan selama perjalanan,
            dan masukan Anda sangat berarti bagi kami untuk terus meningkatkan kualitas layanan.
          </p>
          <p>
            Kami telah menyampaikan laporan ini kepada tim teknis kami untuk segera melakukan
            pengecekan dan perbaikan pada sistem pendingin udara di kereta. Selain itu, kami juga
            sedang mengevaluasi kapasitas dan distribusi suhu AC, khususnya di gerbong yang sering
            penuh pada jam sibuk.
          </p>
          <p>
            Sebagai upaya kami dalam menjaga kenyamanan penumpang, tim operasional akan
            memastikan bahwa AC berfungsi dengan baik sebelum kereta mulai beroperasi setiap hari.
            Kami juga akan mengawasi secara berkala agar permasalahan serupa dapat diminimalkan di
            masa mendatang.
          </p>
          <p>
            Kami berkomitmen untuk terus meningkatkan layanan kami dan sangat menghargai
            kesediaan Anda memberikan masukan ini. Jika Anda mengalami ketidaknyamanan lainnya
            selama perjalanan, jangan ragu untuk segera melaporkannya kepada kami melalui kanal resmi
            yang tersedia. Terima kasih atas pengertian dan dukungan Anda.
          </p>
          <p>Semoga hari anda menyenangkan!</p>
          <p>Salam Hangat,</p>
          <p>LRT SUMSEL</p>
        </div>
      </div>

      {/* Right Section - Feedback Detail */}
      <div className="w-[443px] bg-white rounded-lg p-6">
        <h2 className="font-medium mb-6">Feedback</h2>
        
        <div className="space-y-6">
          <div>
            <p className="text-sm font-medium mb-2">Feedback ID: UF-1248</p>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">User</p>
            <div className="flex items-center gap-3 bg-[#EAEAEA] p-2.5 rounded-lg">
              <Image
                src="/placeholder-user.jpg"
                alt="Sarah Miller"
                width={30}
                height={30}
                className="rounded-full"
              />
              <div>
                <p className="text-sm">Sarah Miller</p>
                <p className="text-xs text-gray-500">smiller@gmail.com</p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Jenis Umpan Balik</p>
            <div className="bg-[#EAEAEA] p-2.5 rounded-lg">
              <p className="text-sm">Masalah Fasilitas</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Tanggal dan Waktu Perjalanan</p>
            <div className="bg-[#EAEAEA] p-2.5 rounded-lg">
              <p className="text-sm">2028-02-27 | 04:28:48</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Stasiun Keberangkatan</p>
            <div className="bg-[#EAEAEA] p-2.5 rounded-lg">
              <p className="text-sm">Demang</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Feedback</p>
            <div className="bg-[#EAEAEA] p-2.5 rounded-lg">
              <p className="text-sm">AC di dalam kereta tidak dingin, terutama saat jam ramai. Rasanya pengap dan tidak nyaman.</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">File Pendukung</p>
            <div className="bg-[#EAEAEA] p-2.5 rounded-lg">
              <Image
                src="/path-to-image.jpg"
                alt="Supporting Document"
                width={395}
                height={200}
                className="w-full h-auto rounded-lg mb-2"
              />
              <p className="text-xs text-center text-gray-500">DSC21012.JPG</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Penilaian</p>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={32}
                  className={star <= 3 ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}