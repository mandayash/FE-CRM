"use client";

import Image from "next/image";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth_service";
import { LoginRequest } from "@/types/auth";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const loginData: LoginRequest = {
        email,
        password,
      };

      const response = await authService.login(loginData);

      // First set the token
      authService.setToken(response.token);

      if (rememberMe) {
        localStorage.setItem("remember_me", "true");
      }

      // Add a small delay to ensure token is set
      setTimeout(() => {
        router.push("/dashboard");
        // Force a hard reload to ensure new auth state is picked up
        router.refresh();
      }, 100);
    } catch (error) {
      console.error("Login error:", error);
      setError("Email atau password salah");
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

      {/* Right Side - Login Form */}
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
          <h2 className="text-base md:text-[18px] font-bold text-[#080808] text-center mb-6 md:mb-8 leading-[150%] tracking-[0.5px]">
            Masuk ke akun Anda
          </h2>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 text-sm text-red-500 bg-red-50 rounded-lg">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <label className="text-xs md:text-sm font-medium text-[#080808] tracking-[0.5px]">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Masukan email"
                className="w-full h-10 md:h-[46px] px-3 md:px-5 rounded-lg border border-[#EAEAEA] focus:outline-none focus:ring-2 focus:ring-[#CF0000] text-xs md:text-sm"
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-xs md:text-sm font-medium text-[#080808] tracking-[0.5px]">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukan password"
                  className="w-full h-10 md:h-[46px] px-3 md:px-5 rounded-lg border border-[#EAEAEA] focus:outline-none focus:ring-2 focus:ring-[#CF0000] text-xs md:text-sm"
                  required
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

            {/* Remember Me */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-3 h-3 md:w-4 md:h-4 rounded border-gray-300 text-[#CF0000] focus:ring-[#CF0000]"
              />
              <label
                htmlFor="remember"
                className="text-xs md:text-sm text-gray-600"
              >
                Ingat preferensi saya
              </label>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-10 md:h-[46px] bg-[#CF0000] text-white rounded-lg font-medium text-xs md:text-base hover:bg-[#B00000] transition-colors disabled:bg-opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? "Memproses..." : "Masuk"}
            </button>

            {/* Forgot Password */}
            <div className="text-center">
              <a
                href="/forgot-password"
                className="text-xs md:text-sm text-gray-600 hover:text-[#CF0000]"
              >
                Lupa Password?
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
