"use client";

import { useAuth } from "@/contexts/AuthContext"; // Sesuaikan path jika berbeda

export default function LogoutButton() {
  const { logout } = useAuth();

  const handleLogout = () => {
    const confirmed = window.confirm("Apakah kamu yakin ingin keluar?");
    if (confirmed) {
      logout();
    }
  };

  return (
    <div className="px-7 pb-6 mt-auto">
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 w-[178px] px-4 py-2 rounded-[25px] bg-[#080808] text-white hover:bg-opacity-80 transition-all duration-200"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          viewBox="0 0 22 22"
          fill="none"
        >
          <path
            d="M15.9867 13.4013L18.3333 11.0547L15.9867 8.70801"
            stroke="white"
            strokeWidth="1.5"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M8.94667 11.0547H18.2692"
            stroke="white"
            strokeWidth="1.5"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M10.78 18.3337C6.72834 18.3337 3.44667 15.5837 3.44667 11.0003C3.44667 6.41699 6.72834 3.66699 10.78 3.66699"
            stroke="white"
            strokeWidth="1.5"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="font-medium">Log Out</span>
      </button>
    </div>
  );
}
