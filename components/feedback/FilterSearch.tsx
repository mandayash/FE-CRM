// components/feedback/FilterSearch.tsx
"use client";
import React, { useState, useEffect } from "react";
import { Search, Table, Menu, Check } from "lucide-react";

interface FilterSearchProps {
  onFilterChange: (filter: string) => void;
  onSearch: (query: string) => void;
  columns: ColumnVisibility;
  onColumnChange: (columns: ColumnVisibility) => void;
}

// Define the column visibility type
export interface ColumnVisibility {
  id: boolean;
  date: boolean;
  userId: boolean;
  title: boolean;
  content: boolean;
  status: boolean;
  action: boolean;
}

const FilterSearch = ({
  onFilterChange,
  onSearch,
  columns,
  onColumnChange,
}: FilterSearchProps) => {
  const [activeTab, setActiveTab] = useState("Semua");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isColumnMenuOpen, setIsColumnMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const tabs = ["Semua", "Selesai", "Belum"];

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);

    // Map UI filter names directly to status values
    let apiFilter;
    if (tab === "Selesai") {
      apiFilter = "RESPONDED";
      console.log("Selected: Selesai -> API filter: RESPONDED");
    } else if (tab === "Belum") {
      apiFilter = "PENDING";
      console.log("Selected: Belum -> API filter: PENDING");
    } else {
      apiFilter = "";
      console.log("Selected: Semua -> API filter: '' (empty)");
    }

    // Call the parent's filter change handler
    onFilterChange(apiFilter);
  };

  // Toggle column visibility
  const toggleColumn = (columnName: keyof ColumnVisibility) => {
    const updatedColumns = {
      ...columns,
      [columnName]: !columns[columnName],
    };
    onColumnChange(updatedColumns);
  };

  // Add debounce effect for live search updates
  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      onSearch(searchQuery);
    }, 300);

    return () => clearTimeout(debounceTimeout);
  }, [searchQuery, onSearch]);

  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4 sm:items-center">
      {/* Filter Tabs */}
      <div className="flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            className={`h-8 px-3 sm:px-4 flex items-center justify-center text-xs font-medium tracking-wider rounded-lg transition-colors
              ${
                activeTab === tab
                  ? "bg-[#CF0000] text-[#FBFBFC]"
                  : "bg-transparent text-[#080808] hover:bg-gray-100"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>
      {/* Search and Tools */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        {/* Search Input */}
        <div className="relative flex-grow sm:flex-grow-0">
          <input
            type="text"
            placeholder="Cari berdasarkan ID, judul, konten..."
            className="w-full sm:w-[283px] h-8 pl-10 pr-4 rounded-[20px] bg-[#E5E6E6] text-xs"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
              onClick={() => setIsColumnMenuOpen(!isColumnMenuOpen)}
              className="flex items-center gap-1.5 px-3 h-8 bg-white rounded-lg border text-xs hover:bg-gray-50 transition-colors"
            >
              <Table size={18} />
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
                    onClick={() => toggleColumn("id")}
                  >
                    <span>Feedback ID</span>
                    {columns.id && (
                      <Check size={16} className="text-green-600" />
                    )}
                  </div>

                  <div
                    className="flex items-center justify-between px-4 py-2 text-xs hover:bg-gray-50 cursor-pointer"
                    onClick={() => toggleColumn("date")}
                  >
                    <span>Tanggal</span>
                    {columns.date && (
                      <Check size={16} className="text-green-600" />
                    )}
                  </div>

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
                    onClick={() => toggleColumn("title")}
                  >
                    <span>Judul Feedback</span>
                    {columns.title && (
                      <Check size={16} className="text-green-600" />
                    )}
                  </div>

                  <div
                    className="flex items-center justify-between px-4 py-2 text-xs hover:bg-gray-50 cursor-pointer"
                    onClick={() => toggleColumn("content")}
                  >
                    <span>Konten Feedback</span>
                    {columns.content && (
                      <Check size={16} className="text-green-600" />
                    )}
                  </div>

                  <div
                    className="flex items-center justify-between px-4 py-2 text-xs hover:bg-gray-50 cursor-pointer"
                    onClick={() => toggleColumn("status")}
                  >
                    <span>Status</span>
                    {columns.status && (
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
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center gap-1.5 px-3 h-8 bg-white rounded-lg border text-xs w-full justify-center hover:bg-gray-50 transition-colors"
          >
            <Menu size={18} />
            Menu
          </button>
          {/* Mobile Dropdown Menu */}
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-1 z-10">
              <button
                className="flex items-center gap-1.5 px-4 py-2 text-xs hover:bg-gray-50 w-full"
                onClick={() => {
                  setIsColumnMenuOpen(!isColumnMenuOpen);
                  setIsMenuOpen(false);
                }}
              >
                <Table size={18} />
                Tampilkan Tabel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterSearch;
