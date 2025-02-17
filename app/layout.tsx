import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";

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
  title: "LRT Admin Dashboard",
  description: "Admin dashboard for LRT system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={sfProDisplay.variable}>
      <body>{children}</body>
    </html>
  );
}
