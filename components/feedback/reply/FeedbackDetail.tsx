"use client";

import React from "react";
import Image from "next/image";
import { Star } from "lucide-react";

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
  category?: string;
  status?: string;
  message?: string;
  image?: {
    url: string;
    name: string;
  };
  rating?: number;
}

const FeedbackDetail = ({
  id = "UF-1245",
  user = {
    name: "Sarah Miller",
    email: "smiller@gmail.com",
    avatar: "/images/profile-placeholder.png",
  },
  type = "Masalah Fasilitas",
  date = "2028-02-27 | 04:28:48",
  station = "Demang",
  category = "Saran & Kritik",
  status = "PENDING",
  message = "AC di dalam kereta tidak dingin, terutama saat jam ramai. Rasanya pengap dan tidak nyaman.",
  image = {
    url: "/path-to-image.jpg",
    name: "DSC21012.JPG",
  },
  rating = 3,
}: FeedbackDetailProps) => {
  return (
    <div className="w-full max-w-[443px] p-4 sm:p-6 flex flex-col gap-2.5 sm:gap-3 rounded-2xl border border-[#C0C0C0] bg-[#F9F9F9]">
      <h2 className="text-base sm:text-[18px] font-medium leading-[150%] tracking-[0.5px] text-[#080808]">
        Feedback
      </h2>

      <div className="space-y-1.5 sm:space-y-2">
        <p className="text-xs sm:text-sm font-medium leading-[150%] tracking-[0.5px] text-[#080808]">
          Feedback ID: {id}
        </p>
      </div>

      {[
        { label: "Jenis Umpan Balik", value: type },
        { label: "Kategori", value: category },
        {
          label: "Status",
          value: status === "RESPONDED" ? "Selesai" : "Belum",
        },
        { label: "Stasiun Keberangkatan", value: station },
        { label: "Tanggal dan Waktu Perjalanan", value: date },
        { label: "Feedback", value: message },
      ].map((section) => (
        <div key={section.label} className="space-y-1.5 sm:space-y-2">
          <p className="text-xs sm:text-sm font-medium leading-[150%] tracking-[0.5px] text-[#080808]">
            {section.label}
          </p>
          <div className="rounded-lg border border-[#EAEAEA] bg-[#EAEAEA] p-2 sm:p-2.5">
            <p className="text-[10px] sm:text-xs leading-[150%] tracking-[0.5px]">
              {section.value}
            </p>
          </div>
        </div>
      ))}

      {image?.url && (
        <div className="space-y-1.5 sm:space-y-2">
          <p className="text-xs sm:text-sm font-medium leading-[150%] tracking-[0.5px] text-[#080808]">
            File Pendukung
          </p>
          <div className="rounded-lg border border-[#EAEAEA] bg-[#EAEAEA] p-2 sm:p-2.5">
            <div className="relative w-full aspect-[2/1] mb-2">
              <Image
                src={image.url}
                alt="Supporting document"
                fill
                className="rounded-lg object-cover"
              />
            </div>
            <p className="text-[10px] sm:text-xs text-center text-gray-500">
              {image.name}
            </p>
          </div>
        </div>
      )}

      <div className="space-y-1.5 sm:space-y-2">
        <p className="text-xs sm:text-sm font-medium leading-[150%] tracking-[0.5px] text-[#080808]">
          Penilaian
        </p>
        <div className="flex gap-1 sm:gap-1.5">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={24}
              className={
                i < rating
                  ? "fill-[#E5B12F] text-[#E5B12F]"
                  : "fill-[#C0C0C0] text-[#C0C0C0]"
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeedbackDetail;
