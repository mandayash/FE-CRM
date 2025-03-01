// components/layout/Header.tsx
"use client";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { SettingsDropdown } from "./dropdown-header";

const Header = () => {
  const pathname = usePathname();

  const getPageTitle = (path: string) => {
    switch (path) {
      case "/":
        return "Dashboard";
      case "/feedback":
        return "Data Feedback";
      case "/users":
        return "Data Pengguna";
      case "/articles":
        return "Kelola Artikel";
      default:
        return "Dashboard";
    }
  };

  return (
    <header className="sticky top-0 left-0 right-0 z-50 bg-white border-b w-full">
      <div className="flex items-center h-[70px] sm:h-[90px] px-4 sm:px-8 w-full">
        {/* Left Section: Page Title */}
        <h1 className="text-lg sm:text-2xl font-medium text-primary truncate">
          {getPageTitle(pathname)}
        </h1>

        {/* Right Section: Notif & Profile */}
        <div className="flex items-center gap-2 sm:gap-5 ml-auto">
          {/* Setting */}
          <SettingsDropdown />

          {/* Profile */}
          <div className="flex items-center gap-2 sm:gap-5">
            <div className="hidden md:block text-right">
              <p className="font-medium truncate">Anandita</p>
              <p className="text-sm text-gray-500 truncate">Admin</p>
            </div>
            <div className="relative h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0">
              <Image
                src="/images/profile-placeholder.png"
                alt="Admin Profile"
                fill
                className="rounded-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
