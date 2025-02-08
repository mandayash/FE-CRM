'use client';

import Image from 'next/image';

export default function ForgotPasswordPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic untuk mengirim kode verifikasi
  };

  return (
    <div className="flex h-screen">
      {/* Left Side - Illustration */}
      <div className="hidden lg:flex w-1/2 bg-[#CF0000] items-center justify-center p-8">
        <div className="relative w-full max-w-[500px] aspect-square">
          <Image
            src="/images/login-illustration.png"
            alt="LRT Illustration"
            fill
            className="object-contain"
          />
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#F5F5F5]">
        <div className="w-full max-w-[400px] bg-white rounded-2xl p-10 shadow-sm">
          {/* Logo */}
          <div className="mb-8">
            <Image
              src="/images/LOGO LRT SUMSEL.png"
              alt="LRT Logo"
              width={170}
              height={40}
              className="mx-auto"
            />
            <h1 className="text-center text-[#CF0000] text-xl font-bold mt-2">
              Dashboard Admin
            </h1>
          </div>

          {/* Title */}
          <h2 className="text-[18px] font-bold text-[#080808] mb-4">
            Lupa Password
          </h2>

          {/* Description */}
          <p className="text-sm text-gray-600 mb-6">
            Silakan masukkan alamat email Anda untuk menerima kode verifikasi.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#080808]">
                Alamat Email
              </label>
              <input
                type="email"
                placeholder="Masukan alamat email"
                className="w-full h-[46px] px-5 rounded-lg border border-[#EAEAEA] focus:outline-none focus:ring-2 focus:ring-[#CF0000] text-sm"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full h-[46px] bg-[#CF0000] text-white rounded-lg font-medium hover:bg-[#B00000] transition-colors"
            >
              Kirim
            </button>

            {/* Back to Login */}
            <div className="text-center">
              <a 
                href="/login" 
                className="text-sm text-gray-600 hover:text-[#CF0000]"
              >
                Kembali ke halaman login
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}