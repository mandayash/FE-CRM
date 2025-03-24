// app/users/page.tsx
"use client";
import { useState, useEffect } from "react";
import DashboardStats from "@/components/dashboard/DashboardStats";
import LevelSummaryCard from "@/components/users/LevelSummaryCard";
import UsersTable from "@/components/users/UsersTable";
import { Columns, Search, Menu, Check } from "lucide-react";

// Define the column visibility type
export interface ColumnVisibility {
  userId: boolean;
  email: boolean;
  totalFeedback: boolean;
  totalPoints: boolean;
  levelPoints: boolean;
  action: boolean;
}

export default function UsersPage() {
  const [activeLevel, setActiveLevel] = useState("Semua");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isColumnMenuOpen, setIsColumnMenuOpen] = useState(false);
  const [columns, setColumns] = useState<ColumnVisibility>({
    userId: true,
    email: true,
    totalFeedback: true,
    totalPoints: true,
    levelPoints: true,
    action: true,
  });

  const levels = [
    "Semua",
    "Bronze Level",
    "Silver Level",
    "Gold Level",
    "Platinum Level",
  ];

  // Toggle column visibility
  const toggleColumn = (columnName: keyof ColumnVisibility) => {
    setColumns((prev) => ({
      ...prev,
      [columnName]: !prev[columnName],
    }));
  };

  // Tutup menu saat memilih level di mobile
  const handleLevelSelect = (level: string) => {
    setActiveLevel(level);
    setIsMenuOpen(false);
  };

  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle Toggle Column button click
  const handleToggleColumnClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsColumnMenuOpen(!isColumnMenuOpen);
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Close mobile menu
      if (
        isMenuOpen &&
        !(event.target as Element).closest(".mobile-menu-container") &&
        !(event.target as Element).closest(".mobile-menu-button")
      ) {
        setIsMenuOpen(false);
      }

      // Close column menu
      if (
        isColumnMenuOpen &&
        !(event.target as Element).closest(".column-toggle-menu") &&
        !(event.target as Element).closest(".column-toggle-button")
      ) {
        setIsColumnMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen, isColumnMenuOpen]);

  return (
    <div className="space-y-6">
      {/* Stats and Level Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        <div className="lg:col-span-2">
          <DashboardStats />
        </div>
        <div className="lg:col-span-5">
          <LevelSummaryCard />
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 sm:items-center">
        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
          {levels.map((level) => (
            <button
              key={level}
              onClick={() => handleLevelSelect(level)}
              className={`h-8 px-3 sm:px-4 flex-shrink-0 flex items-center justify-center text-xs font-medium tracking-wider rounded-lg transition-colors
              ${
                activeLevel === level
                  ? "bg-[#CF0000] text-[#FBFBFC]"
                  : "bg-gray-100 text-[#080808] hover:bg-gray-200"
              }`}
            >
              {level}
            </button>
          ))}
        </div>

        {/* Search and Tools */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          {/* Search Input */}
          <div className="relative flex-grow sm:flex-grow-0">
            <input
              type="text"
              placeholder="Cari ID atau Email"
              className="w-full sm:w-[283px] h-8 pl-10 pr-4 rounded-[20px] bg-[#E5E6E6] text-xs"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              size={18}
            />
          </div>

          {/* Desktop Buttons */}
          <div className="hidden sm:flex items-center gap-2.5">
            <div className="relative">
              <button
                onClick={handleToggleColumnClick}
                className="column-toggle-button flex items-center gap-1.5 px-3 h-8 bg-white rounded-lg border text-xs hover:bg-gray-50 transition-colors"
              >
                <Columns size={18} />
                Tampilkan Tabel
              </button>

              {/* Column Selection Dropdown */}
              {isColumnMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-1 z-10">
                  <div className="px-2 py-1 text-xs font-semibold text-gray-600 border-b">
                    Toggle Columns
                  </div>
                  <div className="column-toggle-menu">
                    <div
                      className="flex items-center justify-between px-4 py-2 text-xs hover:bg-gray-50 cursor-pointer"
                      onClick={() => toggleColumn("userId")}
                    >
                      <span>User ID</span>
                      {columns.userId && (
                        <Check size={16} className="text-green-600" />
                      )}
                    </div>
                    <div
                      className="flex items-center justify-between px-4 py-2 text-xs hover:bg-gray-50 cursor-pointer"
                      onClick={() => toggleColumn("email")}
                    >
                      <span>Email</span>
                      {columns.email && (
                        <Check size={16} className="text-green-600" />
                      )}
                    </div>
                    <div
                      className="flex items-center justify-between px-4 py-2 text-xs hover:bg-gray-50 cursor-pointer"
                      onClick={() => toggleColumn("totalFeedback")}
                    >
                      <span>Total Feedback</span>
                      {columns.totalFeedback && (
                        <Check size={16} className="text-green-600" />
                      )}
                    </div>
                    <div
                      className="flex items-center justify-between px-4 py-2 text-xs hover:bg-gray-50 cursor-pointer"
                      onClick={() => toggleColumn("totalPoints")}
                    >
                      <span>Total Poin</span>
                      {columns.totalPoints && (
                        <Check size={16} className="text-green-600" />
                      )}
                    </div>
                    <div
                      className="flex items-center justify-between px-4 py-2 text-xs hover:bg-gray-50 cursor-pointer"
                      onClick={() => toggleColumn("levelPoints")}
                    >
                      <span>Level Poin</span>
                      {columns.levelPoints && (
                        <Check size={16} className="text-green-600" />
                      )}
                    </div>
                    <div
                      className="flex items-center justify-between px-4 py-2 text-xs hover:bg-gray-50 cursor-pointer"
                      onClick={() => toggleColumn("action")}
                    >
                      <span>Aksi</span>
                      {columns.action && (
                        <Check size={16} className="text-green-600" />
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="relative sm:hidden">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMenuOpen(!isMenuOpen);
              }}
              className="mobile-menu-button flex items-center gap-1.5 px-3 h-8 bg-white rounded-lg border text-xs w-full justify-center hover:bg-gray-50 transition-colors"
            >
              <Menu size={18} />
              Menu
            </button>

            {/* Mobile Dropdown Menu */}
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-1 z-10 mobile-menu-container">
                <button
                  className="flex items-center gap-1.5 px-4 py-2 text-xs hover:bg-gray-50 w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsColumnMenuOpen(!isColumnMenuOpen);
                    setIsMenuOpen(false);
                  }}
                >
                  <Columns size={18} />
                  Toggle Kolom
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Users Table */}
      <UsersTable
        activeLevel={activeLevel}
        searchQuery={searchQuery}
        columns={columns}
      />
    </div>
  );
}
