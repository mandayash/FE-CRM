import React from "react";

interface GiftStatsProps {
  totalCategories?: number;
  initialStock?: number;
  currentStock?: number;
  totalRedeemed?: number;
}

const GiftStats: React.FC<GiftStatsProps> = ({
  totalCategories = 16,

  currentStock = 301,
}) => {
  return (
    <div className="w-full flex flex-col lg:flex-row gap-4">
      {/* Card 1: Kategori Hadiah  */}
      <div className="flex justify-between items-center p-6 rounded-2xl border border-[#EAEAEA] bg-white shadow-[0px_6px_14px_0px_rgba(0,0,0,0.05)] lg:w-[250px]">
        <div className="flex flex-col">
          <span className="text-[#CF0000] text-4xl font-bold mb-1 font-poppins">
            {totalCategories}
          </span>
          <span className="text-sm text-[#080808] font-medium">
            Kategori Hadiah
          </span>
        </div>

        <div className="w-16 h-16 bg-[#FDEBEB] rounded-full flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="27"
            height="27"
            viewBox="0 0 27 27"
            fill="none"
          >
            <path
              d="M22.4648 11.25H4.46484V20.25C4.46484 23.625 5.58984 24.75 8.96484 24.75H17.9648C21.3398 24.75 22.4648 23.625 22.4648 20.25V11.25Z"
              stroke="#CF0000"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M24.1875 7.875V9C24.1875 10.2375 23.5913 11.25 21.9375 11.25H5.0625C3.34125 11.25 2.8125 10.2375 2.8125 9V7.875C2.8125 6.6375 3.34125 5.625 5.0625 5.625H21.9375C23.5913 5.625 24.1875 6.6375 24.1875 7.875Z"
              stroke="#CF0000"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M13.0941 5.62512H6.88415C6.50165 5.20887 6.5129 4.56762 6.9179 4.16262L8.5154 2.56512C8.93165 2.14887 9.6179 2.14887 10.0341 2.56512L13.0941 5.62512Z"
              stroke="#CF0000"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M20.1045 5.62512H13.8945L16.9545 2.56512C17.3708 2.14887 18.057 2.14887 18.4733 2.56512L20.0708 4.16262C20.4758 4.56762 20.487 5.20887 20.1045 5.62512Z"
              stroke="#CF0000"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10.0586 11.25V17.0325C10.0586 17.9325 11.0486 18.4613 11.8023 17.9775L12.8598 17.28C13.2423 17.0325 13.7261 17.0325 14.0973 17.28L15.0986 17.955C15.8411 18.45 16.8423 17.9213 16.8423 17.0213V11.25H10.0586Z"
              stroke="#CF0000"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Card 2: */}
      <div className="flex-1 p-4 rounded-2xl border border-[#EAEAEA] bg-white shadow-[0px_6px_14px_0px_rgba(0,0,0,0.05)]">
        <div className="flex flex-col lg:flex-row h-full">
          {/* Judul */}
          <div className="mb-4 lg:mb-0 lg:mr-4 lg:w-[120px] lg:flex-shrink-0 flex flex-col justify-center">
            <h3 className="text-base font-medium text-[#333]">Informasi</h3>
            <h3 className="text-base font-medium text-[#333]">Total Hadiah</h3>
          </div>

          {/* Kontainer untuk 3 stats card */}
          <div className="flex flex-1 flex-row space-x-2 lg:space-x-4 overflow-hidden">
            {/* Stok Terkini */}
            <div className="flex-1 p-2 lg:p-4 bg-[#EEFBD1] rounded-lg flex flex-col justify-center items-center text-center">
              <span className="block text-[#1F5305] text-2xl lg:text-3xl font-bold font-poppins">
                {currentStock}
              </span>
              <span className="text-sm lg:text-sm text-[#1F5305] font-medium">
                Stok Terkini
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GiftStats;
