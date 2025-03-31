/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { authService } from "@/services/authService";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess(false);

    try {
      await authService.requestResetPassword(email);
      setSuccess(true);
      // Redirect ke halaman verifikasi OTP setelah sukses
      setTimeout(() => {
        router.push("/verify-otp");
      }, 2000);
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          "Gagal mengirim permintaan reset password"
      );
    } finally {
      setIsLoading(false);
    }
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
          {/* Title */}
          <h2 className="text-base md:text-[18px] font-bold text-[#080808] mb-3 md:mb-4">
            Lupa Password
          </h2>
          {/* Description */}
          <p className="text-xs md:text-sm text-gray-600 mb-4 md:mb-6">
            Silakan masukkan alamat email Anda untuk menerima kode verifikasi.
          </p>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-500 text-xs md:text-sm rounded-lg">
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-4 p-3 bg-green-50 text-green-600 text-xs md:text-sm rounded-lg">
              Kode verifikasi telah dikirim ke email Anda. Silakan cek email
              Anda.
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-xs md:text-sm font-medium text-[#080808]">
                Alamat Email
              </label>
              <input
                type="email"
                placeholder="Masukan alamat email"
                className="w-full h-10 md:h-[46px] px-3 md:px-5 rounded-lg border border-[#EAEAEA] focus:outline-none focus:ring-2 focus:ring-[#CF0000] text-xs md:text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            {/* Submit Button */}
            <button
              type="submit"
              className="w-full h-10 md:h-[46px] bg-[#CF0000] text-white rounded-lg font-medium text-xs md:text-base hover:bg-[#B00000] transition-colors"
              disabled={isLoading}
            >
              {isLoading ? "Mengirim..." : "Kirim"}
            </button>
            {/* Back to Login */}
            <div className="text-center">
              <Link
                href="/login"
                className="text-xs md:text-sm text-gray-600 hover:text-[#CF0000]"
              >
                Kembali ke halaman login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
