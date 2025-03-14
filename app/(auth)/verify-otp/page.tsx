"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { authService } from "@/services/authService";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function VerifyOTP() {
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess(false);

    // Validasi password
    if (newPassword !== confirmPassword) {
      setError("Password baru dan konfirmasi password tidak cocok");
      setIsLoading(false);
      return;
    }

    try {
      await authService.verifyOtpAndResetPassword(otp, newPassword);
      setSuccess(true);
      // Redirect ke halaman login setelah sukses
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          "Gagal verifikasi OTP atau reset password"
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
              src="/images/LOGO LRT SUMSEL.png"
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
            Verifikasi OTP
          </h2>

          {/* Description */}
          <p className="text-xs md:text-sm text-gray-600 mb-4 md:mb-6">
            Masukkan kode OTP yang telah dikirim ke email Anda dan buat password
            baru.
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
              Password berhasil diubah. Silakan login dengan password baru Anda.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            {/* OTP Input */}
            <div className="space-y-2">
              <label className="text-xs md:text-sm font-medium text-[#080808]">
                Kode OTP
              </label>
              <input
                type="text"
                className="w-full h-10 md:h-[46px] px-3 md:px-5 rounded-lg border border-[#EAEAEA] focus:outline-none focus:ring-2 focus:ring-[#CF0000] text-xs md:text-sm"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                placeholder="Masukkan kode OTP"
                maxLength={8}
              />
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <label className="text-xs md:text-sm font-medium text-[#080808]">
                Password Baru
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full h-10 md:h-[46px] px-3 md:px-5 rounded-lg border border-[#EAEAEA] focus:outline-none focus:ring-2 focus:ring-[#CF0000] text-xs md:text-sm"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  placeholder="Masukkan password baru"
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
                  className="w-full h-10 md:h-[46px] px-3 md:px-5 rounded-lg border border-[#EAEAEA] focus:outline-none focus:ring-2 focus:ring-[#CF0000] text-xs md:text-sm"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Konfirmasi password baru"
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
              disabled={isLoading}
            >
              {isLoading ? "Memproses..." : "Reset Password"}
            </button>

            {/* Back to Reset Request */}
            <div className="text-center">
              <Link
                href="/reset-password"
                className="text-xs md:text-sm text-gray-600 hover:text-[#CF0000]"
              >
                Kembali ke permintaan OTP
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
