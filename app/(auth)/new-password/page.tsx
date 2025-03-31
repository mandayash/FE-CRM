"use client";

import Image from "next/image";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle password reset logic
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#CF0000] items-center justify-center p-4 md:p-8">
        <div className="relative w-full max-w-[500px] aspect-square">
          <Image
            src="/images/login-illustration.png"
            alt="LRT Illustration"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 md:p-8 bg-[#F5F5F5]">
        <div className="w-full max-w-[400px] bg-white rounded-2xl p-6 md:p-10 shadow-sm">
          {/* Logo */}
          <div className="mb-6 md:mb-8">
            <Image
              src="/images/logo_lrt.png"
              alt="LRT Logo"
              width={170}
              height={40}
              className="mx-auto"
              priority
            />
            <h1 className="text-center text-[#CF0000] text-lg md:text-xl font-bold mt-2">
              Dashboard Admin
            </h1>
          </div>

          {/* Title & Description */}
          <div className="space-y-2 mb-6 md:mb-8">
            <h2 className="text-base md:text-[18px] font-bold text-[#080808]">
              Buat password baru
            </h2>
            <p className="text-xs md:text-sm text-gray-600">
              Kata sandi baru anda harus berbeda dari kata sandi yang digunakan
              sebelumnya.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            {/* New Password */}
            <div className="space-y-2">
              <label className="text-xs md:text-sm font-medium text-[#080808]">
                Password Baru
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukan Password baru"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full h-10 md:h-[46px] px-3 md:px-4 pr-10 md:pr-12 rounded-lg border border-[#EAEAEA] focus:outline-none focus:ring-2 focus:ring-[#CF0000] text-xs md:text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="text-xs md:text-sm font-medium text-[#080808]">
                Konfirmasi Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Masukan konfirmasi password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="w-full h-10 md:h-[46px] px-3 md:px-4 pr-10 md:pr-12 rounded-lg border border-[#EAEAEA] focus:outline-none focus:ring-2 focus:ring-[#CF0000] text-xs md:text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full h-10 md:h-[46px] bg-[#CF0000] text-white rounded-lg font-medium text-xs md:text-base hover:bg-[#B00000] transition-colors"
            >
              Kirim
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
