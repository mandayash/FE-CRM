import type { Metadata } from "next";
import localFont from "next/font/local";

const sfProDisplay = localFont({
  src: [
    {
      path: "../fonts/SFPRODISPLAYREGULAR.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/SFPRODISPLAYMEDIUM.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/SFPRODISPLAYBOLD.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--sf-pro-display",
});

export const metadata: Metadata = {
  title: "Login - Admin Dashboard",
  description: "Admin dashboard login page",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${sfProDisplay.variable} bg-light font-sans`}>
        {children}
      </body>
    </html>
  );
}
