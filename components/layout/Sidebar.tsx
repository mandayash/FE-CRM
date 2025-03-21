"use client";

import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  MessageSquare,
  Users,
  FileText,
  X,
  Pointer,
  Bell,
  Gift,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/contexts/SideBarContext";
import { COLORS } from "@/constants/theme";

const Sidebar = () => {
  const pathname = usePathname();
  const { isSidebarOpen, closeSidebar } = useSidebar();

  const menuItems = [
    {
      title: "Dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
      path: "/",
    },
    {
      title: "Data Feedback",
      icon: <MessageSquare className="w-5 h-5" />,
      path: "/feedback",
    },
    {
      title: "Data Pengguna",
      icon: <Users className="w-5 h-5" />,
      path: "/users",
    },
    {
      title: "Data Tukar Point",
      icon: <Gift className="w-5 h-5" />,
      path: "/reward",
    },
    // {
    //   title: "Notifikasi",
    //   icon: <Bell className="w-5 h-5" />,
    //   path: "/notification",
    // },
    {
      title: "Kelola Artikel",
      icon: <FileText className="w-5 h-5" />,
      path: "/articles",
    },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-40"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={`
                fixed top-0 left-0 z-50
                w-[238px] h-screen
                bg-primary
                transition-transform duration-300 ease-in-out
                md:translate-x-0
                ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
                flex flex-col
            `}
      >
        {/* Close button - Mobile only */}
        <button
          onClick={closeSidebar}
          className="lg:hidden absolute top-4 right-4 text-white p-2 hover:bg-primary-light rounded-full"
        >
          <X size={24} />
        </button>

        {/* Logo */}
        <div className="px-7 py-6 flex-shrink-0">
          <Image
            src="/images/LOGO LRT SUMSEL.png"
            width={170}
            height={65}
            alt="Logo"
            className="object-contain"
            priority
          />
        </div>

        {/* Menu */}
        <nav className="mt-8 px-4 flex-1 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.title}
              href={item.path}
              onClick={closeSidebar}
              className={`
                                flex items-center h-[52px] px-7
                                rounded-3xl mx-2 my-1
                                group
                                ${
                                  pathname === item.path
                                    ? "bg-white text-primary"
                                    : "text-white hover:bg-white/10 hover:text-white lg:hover:bg-white lg:hover:text-primary"
                                }
                                transition-all duration-200
                            `}
            >
              <div
                className={`
                                flex items-center
                                ${
                                  pathname === item.path
                                    ? "[&_svg]:text-primary"
                                    : "[&_svg]:text-white group-hover:[&_svg]:text-white lg:group-hover:[&_svg]:text-primary"
                                }
                            `}
              >
                {item.icon}
                <span className="ml-3 font-medium">{item.title}</span>
              </div>
            </Link>
          ))}
        </nav>

        {/* Version info or additional content */}
        <div className="px-7 py-4 text-white/60 text-sm">Version 1.0.0</div>
      </aside>
    </>
  );
};

export default Sidebar;
