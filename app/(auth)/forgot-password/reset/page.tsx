"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { authService } from "@/services/auth_service";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const { toast } = useToast();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (!email) {
      router.push("/forgot-password");
    }
  }, [email, router]);

  const validatePassword = () => {
    if (formData.password.length < 8) {
      setError("Password minimal 8 karakter");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Password tidak cocok");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validatePassword()) return;
    setIsLoading(true);

    try {
      await authService.resetPassword({
        email: email!,
        new_password: formData.password,
        confirm_password: formData.confirmPassword,
      });

      // Show success toast
      toast({
        title: "Berhasil!",
        description:
          "Password anda telah berhasil diubah. Anda akan diarahkan ke halaman login.",
        duration: 3000,
      });

      // Tunggu 3 detik sebelum redirect
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Redirect to login after successful reset
      router.push("/login");
    } catch {
      setError("Gagal mengubah password. Silakan coba lagi.");
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

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 text-sm text-red-500 bg-red-50 rounded-lg">
              {error}
            </div>
          )}

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
                  disabled={isLoading}
                  required
                  minLength={8}
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
                  disabled={isLoading}
                  required
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
              disabled={
                isLoading || !formData.password || !formData.confirmPassword
              }
              className="w-full h-10 md:h-[46px] bg-[#CF0000] text-white rounded-lg font-medium text-xs md:text-base hover:bg-[#B00000] transition-colors disabled:bg-opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? "Memproses..." : "Kirim"}
            </button>
          </form>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
