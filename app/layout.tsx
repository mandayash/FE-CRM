import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import { AuthProvider } from "@/contexts/AuthContext";

const sfProDisplay = localFont({
  src: [
    {
      path: "./fonts/SFPRODISPLAYREGULAR.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/SFPRODISPLAYMEDIUM.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/SFPRODISPLAYBOLD.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--sf-pro-display",
});

export const metadata: Metadata = {
  title: "LRT Sumsel CRM Admin",
  description: "Admin dashboard for LRT Sumsel CRM system",
  icons: {
    icon: [{ url: "/images/logo_lrt.png", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${sfProDisplay.variable} bg-light text-text font-sans`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
