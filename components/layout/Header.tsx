// components/layout/Header.tsx
"use client";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CreativeCommons, LogOut, Server, User, UserCog } from "lucide-react";
import { useState, useEffect } from "react";

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  // For hydration protection
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const getPageTitle = (path: string) => {
    switch (path) {
      case "/dashboard":
        return "Dashboard";

      case "/feedback":
        return "Data Feedback";
      case "/feedback/[id]":
        return "Detail Feedback";
      case "/feedback/[id]/reply":
        return "Balas Feedback";

      case "/users":
        return "Data Pengguna";

      case "/articles":
        return "Kelola Artikel";
      case "/articles/create":
        return "Tambah Artikel";
      case "/articles/[id]":
        return "Detail Artikel";
      case "/articles/[id]/edit":
        return "Edit Artikel";

      case "/qr-management":
        return "Manajemen QR";
      case "/qr-management/create":
        return "Tambah QR";
      case "/qr-management/[id]/edit":
        return "Edit QR";

      case "/reward":
        return "Stok Hadiah";
      case "/reward/create":
        return "Tambah Hadiah";
      case "/reward/claims":
        return "Klaim Hadiah";
      case "/reward/history":
        return "Riwayat Hadiah";
      case "/reward/[id]":
        return "Detail Hadiah";
      case "/reward/[id]/edit":
        return "Edit Hadiah";

      default:
        return "Dashboard";
    }
  };

  const handleLogout = () => {
    console.log("Logging out...");
    logout();
  };

  return (
    <header className="sticky top-0 left-0 right-0 z-50 bg-white border-b w-full">
      <div className="flex items-center h-[70px] sm:h-[90px] px-4 sm:px-8 w-full">
        {/* Left Section: Page Title */}
        <h1 className="text-lg sm:text-2xl font-medium text-primary truncate">
          {getPageTitle(pathname)}
        </h1>
        {/* Right Section: Profile */}
        <div className="flex items-center gap-2 sm:gap-5 ml-auto">
          {/* Profile Dropdown */}
          {mounted && (
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none">
                <div className="flex items-center gap-2 sm:gap-5">
                  <div className="hidden md:block text-right">
                    <p className="font-medium truncate">
                      {user?.name || "Admin"}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {user?.role || "Admin"}
                    </p>
                  </div>
                  <div className="relative h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0 cursor-pointer">
                    <Image
                      src="/images/profile-placeholder.png"
                      alt="Admin Profile"
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem
                  onClick={() => router.push("/profile")}
                  className="cursor-pointer"
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>Admin Profile (Soon)</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer text-black-600">
                  <UserCog className="mr-2 h-4 w-4"></UserCog>
                  <span>Developer (Soon)</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
