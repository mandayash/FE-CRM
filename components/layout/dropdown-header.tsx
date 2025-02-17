"use client";

import { Settings, LogOut, User, Key } from "lucide-react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth_service";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function SettingsDropdown() {
  const router = useRouter();

  const handleLogout = async () => {
    await authService.logout();
    router.push("/login");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-1.5 sm:p-2 hover:bg-[#CF0000]/10 rounded-full transition-colors">
          <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Pengaturan Akun</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            Profil (Incoming)
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Key className="mr-2 h-4 w-4" />
            Ubah Password (Incoming)
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-red-600 focus:text-red-600"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Keluar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
