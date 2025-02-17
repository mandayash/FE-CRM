"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Search, Bell } from "lucide-react";
import { SettingsDropdown } from "./dropdown-header";

const Header = () => {
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

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

        {/* Right Section: Search & Profile */}
        <div className="flex items-center gap-2 sm:gap-5 ml-auto">
          {/* Search Bar - Desktop */}
          <div className="hidden md:block relative">
            <input
              type="text"
              placeholder="Search placeholder"
              className="w-[283px] h-[40px] px-4 pl-12 rounded-full bg-[#F5F5F5] border-none focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
            />
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              size={20}
            />
          </div>

          {/* Search Icon - Mobile */}
          <button
            className="md:hidden p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <Search className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
          </button>

          {/* Mobile Search Input */}
          {isSearchOpen && (
            <div className="absolute top-full left-0 right-0 p-4 bg-white border-b md:hidden">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search placeholder"
                  className="w-full h-[40px] px-4 pl-12 rounded-full bg-[#F5F5F5] border-none focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                />
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                  size={20}
                />
              </div>
            </div>
          )}

          {/* Notification */}
          <div className="relative">
            <button className="p-1.5 sm:p-2 hover:bg-[#CF0000]/10 rounded-full transition-colors">
              <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
            </button>
            <span className="absolute top-1.5 sm:top-2 right-1.5 sm:right-2 w-2 sm:w-2.5 h-2 sm:h-2.5 bg-red-500 rounded-full" />
          </div>

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
