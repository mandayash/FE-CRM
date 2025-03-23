'use client';

import Image from 'next/image';
import HistoryTable from '@/components/gift/history/HistoryTable';
import GiftStats from '@/components/gift/GiftStats';

// Data dummy untuk hadiah
const giftInfo = {
  name: "Mug",
  id: "HA-1245",
  points: 1023
};

// Data dummy untuk statistik
const stats = {
  totalCategories: 16,
  totalItems: {
    all: 421,
    current: 301,
    exchanged: 120
  }
};

type Level = 'Gold Level' | 'Silver Level' | 'Platinum Level';

// Data dummy 
const giftHistory = [
  {
    penukaranId: "PN-1245",
    tanggal: "2028-02-27 04:28:48",
    userId: "US-1245",
    name: "Anandita Nabila Ramadhani",
    level: "Gold Level" as Level
  },
  {
    penukaranId: "PN-1246",
    tanggal: "2028-02-27 04:28:48",
    userId: "US-1246",
    name: "Salsabila",
    level: "Gold Level" as Level
  },
  {
    penukaranId: "PN-1247",
    tanggal: "2028-02-27 04:28:48",
    userId: "US-1247",
    name: "Rahmawati",
    level: "Silver Level" as Level
  },
  {
    penukaranId: "PN-1247",
    tanggal: "2028-02-27 04:28:48",
    userId: "US-1247",
    name: "Putri Rara",
    level: "Silver Level" as Level
  },
  {
    penukaranId: "PN-1250",
    tanggal: "2028-02-27 04:28:48",
    userId: "US-1249",
    name: "Anandita Nabila Ramadhani",
    level: "Platinum Level" as Level
  },
  {
    penukaranId: "PN-1247",
    tanggal: "2028-02-27 04:28:48",
    userId: "US-1247",
    name: "Anandita Nabila Ramadhani",
    level: "Gold Level" as Level
  },
  {
    penukaranId: "PN-1249",
    tanggal: "2028-02-27 04:28:48",
    userId: "US-1248",
    name: "Anandita Nabila Ramadhani",
    level: "Gold Level" as Level
  },
  {
    penukaranId: "PN-1249",
    tanggal: "2028-02-27 04:28:48",
    userId: "US-1248",
    name: "Anandita Nabila Ramadhani",
    level: "Platinum Level" as Level
  },
  {
    penukaranId: "PN-1250",
    tanggal: "2028-02-27 04:28:48",
    userId: "US-1249",
    name: "Anandita Nabila Ramadhani",
    level: "Silver Level" as Level
  },
  {
    penukaranId: "PN-1250",
    tanggal: "2028-02-27 04:28:48",
    userId: "US-1249",
    name: "Anandita Nabila Ramadhani",
    level: "Platinum Level" as Level
  },
  {
    penukaranId: "PN-1250",
    tanggal: "2028-02-27 04:28:48",
    userId: "US-1249",
    name: "Anandita Nabila Ramadhani",
    level: "Platinum Level" as Level
  },
  {
    penukaranId: "PN-1250",
    tanggal: "2028-02-27 04:28:48",
    userId: "US-1250",
    name: "Anandita Nabila Ramadhani",
    level: "Silver Level" as Level
  }
];

export default function GiftHistoryPage() {
  const InfoCard = () => (
    <div className="p-4 sm:p-6 rounded-2xl border border-[#EAEAEA] bg-white shadow-[0px_6px_14px_0px_rgba(0,0,0,0.05)] h-full">
      <h2 className="text-base font-medium mb-4">Informasi Hadiah</h2>
      <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-5">
        <div className="flex-shrink-0 flex justify-center w-full sm:w-auto">
          <Image 
            src="/images/mug.png" 
            alt="Hadiah" 
            width={75} 
            height={75}
            className="rounded-lg bg-gray-100"
          />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 w-full">
          <div>
            <p className="text-sm text-gray-500 mb-1">Nama Hadiah:</p>
            <p className="text-sm font-medium">{giftInfo.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Hadiah Id:</p>
            <p className="text-sm font-medium">{giftInfo.id}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Poin Penukaran:</p>
            <p className="text-sm font-medium">{giftInfo.points}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Page Title */}
      <h1 className="text-2xl font-medium">
        <span className="text-[#CF0000]">Stok Hadiah</span> | <span className="text-black">Lihat Riwayat</span>
      </h1>

      {/* Info Cards Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Left: Info Card */}
        <div>
          <InfoCard />
        </div>

        {/* Right: Gift Stats */}
        <div className="h-full">
          <GiftStats 
            totalCategories={stats.totalCategories}
            initialStock={stats.totalItems.all}
            currentStock={stats.totalItems.current}
            totalRedeemed={stats.totalItems.exchanged}
          />
        </div>
      </div>

      {/* History Table Component */}
      <HistoryTable historyData={giftHistory} />
    </div>
  );
}