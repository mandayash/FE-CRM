import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Pencil, Trash, Eye, Search, Menu, Filter, FileDown, ArrowDown, ArrowUp, ArrowUpDown, ArrowLeft, ArrowRight } from 'lucide-react';

interface Gift {
  id: string;
  name: string;
  stock: number;
  initialStock: number;
  exchangePoints: number;
  totalExchanged: number;
  status: string;
}

interface GiftTableProps {
  gifts: Gift[];
  selectedItems: string[];
  onSelectItem: (itemId: string) => void;
  onDelete: (itemIds: string[]) => void;
  onFilteredDataChange?: (filteredData: Gift[]) => void;
}

const GiftTable: React.FC<GiftTableProps> = ({
  gifts,
  selectedItems,
  onSelectItem,
  onDelete,
  onFilteredDataChange
}) => {
  // Filter states
  const [activeTab, setActiveTab] = useState("Semua");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Table states
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(null);
  const [selectAll, setSelectAll] = useState(false);

  const tabs = ["Semua", "Terkirim", "Draft", "Gagal"];

  // Filter and sort gifts using useMemo untuk menghindari recalculation pada setiap render
  const sortedGifts = useMemo(() => {
    // Filter gifts based on tab and search query
    const filteredGifts = gifts
      .filter(gift => {
        if (activeTab === "Semua") return true;
        return gift.status === activeTab;
      })
      .filter(gift => {
        if (!searchQuery) return true;
        return (
          gift.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          gift.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });

    // Sort the filtered gifts
    const sorted = [...filteredGifts];
    if (sortColumn && sortDirection) {
      sorted.sort((a, b) => {
        const valueA = a[sortColumn as keyof typeof a];
        const valueB = b[sortColumn as keyof typeof b];
        
        if (sortDirection === "asc") {
          return valueA > valueB ? 1 : -1;
        } else {
          return valueA < valueB ? 1 : -1;
        }
      });
    }
    
    return sorted;
  }, [gifts, activeTab, searchQuery, sortColumn, sortDirection]);

  // Notify parent component about filtered data changes - dengan dependencies yang tepat
  useEffect(() => {
    if (onFilteredDataChange) {
      onFilteredDataChange(sortedGifts);
    }
  }, [sortedGifts, onFilteredDataChange]);

  // Reset selectAll when tab changes
  useEffect(() => {
    setSelectAll(false);
  }, [activeTab]);

  // Handle column sorting
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortColumn(null);
        setSortDirection(null);
      } else {
        setSortDirection("asc");
      }
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  // Get the sort icon based on current sort state
  const getSortIcon = (column: string) => {
    if (sortColumn !== column) {
      return <ArrowUpDown size={16} />;
    }
    
    if (sortDirection === "asc") {
      return <ArrowUp size={16} />;
    }
    
    if (sortDirection === "desc") {
      return <ArrowDown size={16} />;
    }
    
    return <ArrowUpDown size={16} />;
  };

  // Handle select all rows
  const handleSelectAll = () => {
    if (selectAll) {
      // Tell parent component to clear selections
      sortedGifts.forEach(gift => {
        if (selectedItems.includes(gift.id)) {
          onSelectItem(gift.id);
        }
      });
    } else {
      // Tell parent component to select all filtered items
      sortedGifts.forEach(gift => {
        if (!selectedItems.includes(gift.id)) {
          onSelectItem(gift.id);
        }
      });
    }
    setSelectAll(!selectAll);
  };

  // Function to render status badge
  const renderStatus = (status: string) => {
    let bgColor = "";
    
    switch (status) {
      case "Terkirim":
        bgColor = "bg-green-100 text-green-800";
        break;
      case "Draft":
        bgColor = "bg-gray-100 text-gray-800";
        break;
      case "Gagal":
        bgColor = "bg-red-100 text-red-800";
        break;
      default:
        bgColor = "bg-gray-100 text-gray-800";
    }
    
    return (
      <span className={`px-2.5 py-1 rounded-md text-xs ${bgColor}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Filter & Search */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 sm:items-center">
        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`h-8 px-3 sm:px-4 flex-shrink-0 flex items-center justify-center text-xs font-medium tracking-wider rounded-lg transition-colors
                ${
                  activeTab === tab
                    ? "bg-[#CF0000] text-[#FBFBFC]"
                    : "bg-gray-100 text-[#080808] hover:bg-gray-200"
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search placeholder"
              className="w-full sm:w-[283px] h-8 pl-10 pr-4 rounded-[20px] bg-[#E5E6E6] text-xs"
            />
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              size={18}
            />
          </div>

          {/* Desktop Buttons */}
          <div className="hidden sm:flex items-center gap-2.5">
            <button className="flex items-center gap-1.5 px-3 h-8 bg-white rounded-lg border text-xs hover:bg-gray-50 transition-colors">
              <Filter size={18} />
              Filter
            </button>
            <button className="flex items-center gap-1.5 px-3 h-8 bg-white rounded-lg border text-xs hover:bg-gray-50 transition-colors">
              <FileDown size={18} />
              Export
            </button>
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
                <button className="flex items-center gap-1.5 px-4 py-2 text-xs hover:bg-gray-50 w-full">
                  <Filter size={18} />
                  Filter
                </button>
                <button className="flex items-center gap-1.5 px-4 py-2 text-xs hover:bg-gray-50 w-full">
                  <FileDown size={18} />
                  Export
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bulk Delete Button */}
      {selectedItems.length > 0 && (
        <div className="flex justify-end">
          <button
            className="bg-[#CF0000] hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm"
            onClick={() => onDelete(selectedItems)}
          >
            <Trash className="w-4 h-4" />
            Hapus {selectedItems.length} hadiah yang dipilih
          </button>
        </div>
      )}

      {/* Gift Table */}
      {sortedGifts.length === 0 ? (
        <div className="rounded-lg border p-8 text-center">
          <p className="text-gray-500">Tidak ada data yang ditemukan.</p>
        </div>
      ) : (
        <div className="rounded-lg border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#EAEAEA] text-center text-[#080808]">
                <tr>
                  <th className="w-4 p-4 text-center">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded border-gray-300" 
                      checked={selectAll}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th 
                    className="p-4 text-center text-sm font-medium cursor-pointer"
                    onClick={() => handleSort('id')}
                  >
                    <div className="flex items-center gap-1">
                      Hadiah Id {getSortIcon('id')}
                    </div>
                  </th>
                  <th 
                    className="p-4 text-left text-sm font-medium cursor-pointer"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center gap-1">
                      Nama Hadiah {getSortIcon('name')}
                    </div>
                  </th>
                  <th 
                    className="p-4 text-left text-sm font-medium cursor-pointer"
                    onClick={() => handleSort('stock')}
                  >
                    <div className="flex items-center gap-1">
                      Stok Hadiah {getSortIcon('stock')}
                    </div>
                  </th>
                  <th 
                    className="p-4 text-left text-sm font-medium cursor-pointer"
                    onClick={() => handleSort('initialStock')}
                  >
                    <div className="flex items-center gap-1">
                      Stok Awal Hadiah {getSortIcon('initialStock')}
                    </div>
                  </th>
                  <th 
                    className="p-4 text-left text-sm font-medium cursor-pointer"
                    onClick={() => handleSort('exchangePoints')}
                  >
                    <div className="flex items-center gap-1">
                      Poin Penukaran {getSortIcon('exchangePoints')}
                    </div>
                  </th>
                  <th 
                    className="p-4 text-left text-sm font-medium cursor-pointer"
                    onClick={() => handleSort('totalExchanged')}
                  >
                    <div className="flex items-center gap-1">
                      Total Penukar {getSortIcon('totalExchanged')}
                    </div>
                  </th>
                  <th className="p-4 text-left text-sm font-medium">
                    Riwayat Penukaran Hadiah
                  </th>
                  <th 
                    className="p-4 text-center text-sm font-medium cursor-pointer"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center gap-1">
                      Status {getSortIcon('status')}
                    </div>
                  </th>
                  <th className="p-4 text-center text-sm font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {sortedGifts.map((gift) => (
                  <tr key={`${gift.id}-${gift.name}`} className="border-t hover:bg-gray-50 bg-white text-center">
                    <td className="p-4">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded border-gray-300"
                        checked={selectedItems.includes(gift.id)}
                        onChange={() => onSelectItem(gift.id)}
                      />
                    </td>
                    <td className="p-4 text-sm font-medium">{gift.id}</td>
                    <td className="p-4 text-sm">{gift.name}</td>
                    <td className="p-4 text-sm">{gift.stock}</td>
                    <td className="p-4 text-sm">{gift.initialStock}</td>
                    <td className="p-4 text-sm">{gift.exchangePoints}</td>
                    <td className="p-4 text-sm">{gift.totalExchanged}</td>
                    <td className="p-4">
                      <Link 
                        href={`/gift/${gift.id}/history`}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs hover:bg-gray-50 transition-colors justify-center w-fit"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Lihat Riwayat
                      </Link>
                    </td>
                    <td className="p-4 text-center">
                      {renderStatus(gift.status)}
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                        <Link
                          href={`/gift/${gift.id}/edit`}
                          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Edit Hadiah"
                        >
                          <Pencil className="w-4 h-4 text-gray-500" />
                        </Link>
                        <button
                          onClick={() => onDelete([gift.id])}
                          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Hapus Hadiah"
                        >
                          <Trash className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between py-4">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-gray-500">Showing</span>
          <select className="bg-[#EAEAEA] px-2 py-1.5 rounded">
            <option>1</option>
          </select>
          <span className="text-gray-500">out of 2</span>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-1.5 bg-[#EAEAEA] rounded-lg">
            <ArrowLeft
              size={16}
              className="text-[#080808]"
            />
          </button>

          <button className="w-[30px] h-[30px] flex items-center justify-center rounded-lg text-xs bg-[#CF0000] text-white">
            1
          </button>
          <button className="w-[30px] h-[30px] flex items-center justify-center rounded-lg text-xs bg-[#EAEAEA] text-[#080808]">
            2
          </button>

          <button className="p-1.5 bg-[#EAEAEA] rounded-lg">
            <ArrowRight
              size={16}
              className="text-[#080808]"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GiftTable;