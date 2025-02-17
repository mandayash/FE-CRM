"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authService } from "@/services/auth_service";

export default function VerifyCodePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  useEffect(() => {
    if (!email) {
      router.push("/forgot-password");
    }
  }, [email, router]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setResendDisabled(false);
    }
  }, [countdown]);

  const handleChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      if (value && index < 5) {
        inputRefs[index + 1].current?.focus();
      }
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleResendCode = async () => {
    if (!email || resendDisabled) return;

    setError("");
    setResendDisabled(true);
    setCountdown(60); // 60 seconds countdown

    try {
      await authService.forgotPassword({ email });
      setSuccessMessage("Kode verifikasi baru telah dikirim");
    } catch {
      setError("Gagal mengirim kode verifikasi");
      setResendDisabled(false);
      setCountdown(0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setError("");
    setSuccessMessage("");
    setIsLoading(true);

    const otp = code.join("");

    try {
      await authService.verifyOTP({ email, otp });
      setSuccessMessage("Verifikasi berhasil");

      // Redirect to reset password page after short delay
      setTimeout(() => {
        router.push(
          `/forgot-password/reset?email=${encodeURIComponent(email)}`
        );
      }, 1500);
    } catch {
      setError("Kode verifikasi tidak valid");
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
              Verifikasi Email Anda
            </h2>
            <p className="text-xs md:text-sm text-gray-600">
              Silakan masukkan kode 6 digit yang dikirim ke {email}.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 text-sm text-red-500 bg-red-50 rounded-lg">
              {error}
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="mb-4 p-3 text-sm text-green-500 bg-green-50 rounded-lg">
              {successMessage}
            </div>
          )}

          {/* Verification Code Input */}
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            <div className="flex justify-between gap-1 md:gap-2">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={inputRefs[index]}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  disabled={isLoading}
                  className="w-10 h-10 md:w-12 md:h-12 text-center text-base md:text-lg font-bold border border-[#EAEAEA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CF0000] disabled:bg-gray-100 disabled:text-gray-400"
                />
              ))}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || code.some((digit) => !digit)}
              className="w-full h-10 md:h-[46px] bg-[#CF0000] text-white rounded-lg font-medium text-xs md:text-base hover:bg-[#B00000] transition-colors disabled:bg-opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? "Memproses..." : "Verifikasi"}
            </button>

            {/* Resend Code */}
            <div className="text-center">
              <button
                type="button"
                onClick={handleResendCode}
                disabled={resendDisabled}
                className="text-xs md:text-sm text-gray-600 hover:text-[#CF0000] disabled:text-gray-400 disabled:hover:text-gray-400"
              >
                {countdown > 0
                  ? `Kirim ulang kode dalam ${countdown}s`
                  : "Kirim ulang kode"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
