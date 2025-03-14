// middleware.ts (letakkan di root project, sejajar dengan folder app)
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Ambil token dari cookies
  const token = request.cookies.get("token")?.value;

  // Alternatif: Jika Anda menggunakan localStorage, middleware tidak bisa mengaksesnya
  // karena localStorage hanya ada di client-side. Dalam kasus ini, kita perlu memigrasikan
  // penyimpanan token ke cookies.

  // Dapatkan path yang diminta
  const path = request.nextUrl.pathname;

  // Definisikan path publik yang tidak memerlukan autentikasi
  const isPublicPath =
    path === "/login" ||
    path === "/reset-password" ||
    path === "/verify-otp" ||
    path.startsWith("/api/public");

  // Definisikan path yang memerlukan autentikasi
  const isProtectedPath =
    path === "/dashboard" ||
    path.startsWith("/dashboard/") ||
    path === "/profile" ||
    path === "/feedback" ||
    path === "/users" ||
    path === "/articles";

  // Redirect ke login jika mengakses halaman terproteksi tanpa token
  if (isProtectedPath && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirect ke dashboard jika mengakses halaman login dengan token valid
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Lanjutkan request untuk semua kasus lainnya
  return NextResponse.next();
}

// Konfigurasikan path mana yang akan diproses oleh middleware
export const config = {
  matcher: [
    // Halaman yang memerlukan autentikasi
    "/dashboard/:path*",
    "/profile/:path*",
    "/feedback/:path*",
    "/users/:path*",
    "/articles/:path*",
    // Halaman publik yang perlu diproses
    "/login",
    "/reset-password",
    "/verify-otp",
  ],
};
