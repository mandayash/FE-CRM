"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { qrService } from "@/services/qrService";

interface StatItem {
  title: string;
  value: number;
  bgColor: string;
  icon: React.ReactNode;
  valueColor: string;
}

const QRStats = () => {
  const [totalQR, setTotalQR] = useState(0);
  const [totalStasiun, setTotalStasiun] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await qrService.listQRFeedbacks(1, 1000);
        const feedbacks = res.qr_feedbacks;

        setTotalQR(feedbacks.length);

        const uniqueStations = new Set(
          feedbacks.map((qr) => qr.station).filter((s) => s !== "")
        );
        setTotalStasiun(uniqueStations.size);
      } catch (error) {
        console.error("Failed to fetch QR stats", error);
      }
    };

    fetchStats();
  }, []);

  const stats: StatItem[] = [
    {
      title: "Total QR",
      value: totalQR,
      bgColor: "bg-[#FCDBCA]",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="27"
          viewBox="0 0 28 27"
          fill="none"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M4 4h8v8H4V4zm12 0h8v8h-8V4zM4 15h8v8H4v-8zm12 0h3v3h-3v-3z"
            fill="#CF0000"
          />
        </svg>
      ),
      valueColor: "text-[#242E2C]",
    },
    {
      title: "Total Stasiun",
      value: totalStasiun,
      bgColor: "bg-[#FDF6D5]",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="30"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z"
            fill="#C49122"
          />
        </svg>
      ),
      valueColor: "text-[#242E2C]",
    },
  ];

  return (
    <div className="pt-4 sm:pt-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="overflow-hidden">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-4">
                <div
                  className={`h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 flex items-center justify-center rounded-lg ${stat.bgColor}`}
                >
                  {stat.icon}
                </div>
                <div>
                  <p
                    className={`text-lg sm:text-xl lg:text-2xl font-semibold ${stat.valueColor}`}
                  >
                    {stat.value.toLocaleString()}
                  </p>
                  <p className="text-sm sm:text-sm font-medium text-[#080808]">
                    {stat.title}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default QRStats;
