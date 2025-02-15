'use client';

import Image from 'next/image';
import { useState, useRef } from 'react';

export default function VerifyCodePage() {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const handleChange = (index: number, value: string) => {
    // Update kode
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto focus ke input berikutnya
    if (value && index < 5) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Kembali ke input sebelumnya saat backspace
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const verificationCode = code.join('');
    console.log('Verification code:', verificationCode);
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
              Silakan masukkan kode 6 digit yang dikirim ke anandita@gmail.com.
            </p>
          </div>

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
                  className="w-10 h-10 md:w-12 md:h-12 text-center text-base md:text-lg font-bold border border-[#EAEAEA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CF0000]"
                />
              ))}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full h-10 md:h-[46px] bg-[#CF0000] text-white rounded-lg font-medium text-xs md:text-base hover:bg-[#B00000] transition-colors"
            >
              Kirim
            </button>

            {/* Resend Code */}
            <div className="text-center">
              <button 
                type="button"
                className="text-xs md:text-sm text-gray-600 hover:text-[#CF0000]"
              >
                Kirim ulang kode
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}