'use client';

import { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface HistoryItem {
  penukaranId: string;
  tanggal: string;
  userId: string;
  name: string;
  level: 'Gold Level' | 'Silver Level' | 'Platinum Level';
}

interface HistoryTableProps {
  historyData: HistoryItem[];
  totalResults?: number;
}

// Komponen badge untuk level
const LevelBadge = ({ level }: { level: 'Gold Level' | 'Silver Level' | 'Platinum Level' }) => {
  const badgeStyles = {
    'Silver Level': {
      background: "linear-gradient(198deg, #ADADAD 20.34%, #D2D2D2 29.06%, #BBB 50.52%, #A0A0A0 58.25%, #959595 86.63%)",
      text: "#303030"
    },
    'Gold Level': {
      background: "linear-gradient(179deg, #FFD23D 35.57%, #EFD787 42.04%, #E1B831 57.97%, #EFD787 63.71%, rgba(242, 186, 0, 0.47) 84.77%)",
      text: "#303030"
    },
    'Platinum Level': {
      background: "linear-gradient(244deg, #B09FFF 37.63%, #8C7BDB 41.94%, #BEB0FF 52.54%, #8C7BDB 56.36%, #CBC0FF 70.38%)",
      text: "#303030"
    }
  }[level];

  return (
    <span 
      className="px-3 py-1 rounded-full text-xs font-medium"
      style={{ 
        background: badgeStyles.background,
        color: badgeStyles.text
      }}
    >
      {level}
    </span>
  );
};

const HistoryTable: React.FC<HistoryTableProps> = ({ 
  historyData,
  totalResults = 472322 
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("Terbaru");
  
  // Sort state
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(null);

  // Pagination
  const itemsPerPage = 12;
  const totalPages = Math.ceil(totalResults / itemsPerPage);

  // Filter history data berdasarkan search query
  const filteredHistory = historyData.filter(item => 
    item.penukaranId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort berdasarkan activeFilter (Terbaru/Terlama)
  let sortedHistory = [...filteredHistory];
  
  if (activeFilter === "Terbaru" || activeFilter === "Terlama") {
    sortedHistory.sort((a, b) => {
      const dateA = new Date(a.tanggal).getTime();
      const dateB = new Date(b.tanggal).getTime();
      
      return activeFilter === "Terbaru" ? dateB - dateA : dateA - dateB;
    });
  }
  
  // Sort berdasarkan column
  if (sortColumn && sortDirection) {
    sortedHistory.sort((a, b) => {
      const valueA = a[sortColumn as keyof typeof a] || '';
      const valueB = b[sortColumn as keyof typeof b] || '';
      
      if (sortDirection === "asc") {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });
  }

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

  // Format tanggal dengan jam
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('id-ID', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }).format(date);
    } catch (error) {
      return dateString; // fallback to original string if parsing fails
    }
  };

  // Get the sort icon
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

  return (
    <div className="space-y-6">
      {/* Search dan Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search placeholder"
            className="w-full h-10 pl-10 pr-4 rounded-[20px] bg-white text-xs"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search 
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" 
            size={18} 
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
          {["Semua", "Terbaru", "Terlama"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`h-8 px-3 sm:px-4 flex-shrink-0 flex items-center justify-center text-xs font-medium tracking-wider rounded-lg transition-colors
                ${
                  activeFilter === tab
                    ? "bg-[#CF0000] text-[#FBFBFC]"
                    : "bg-gray-100 text-[#080808] hover:bg-gray-200"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px]">
            <thead className="bg-[#EAEAEA]">
              <tr>
                <th 
                  className="p-4 text-center text-sm font-medium cursor-pointer text-[#080808]"
                  onClick={() => handleSort('penukaranId')}
                >
                  <div className="flex items-center justify-center gap-1">
                    Penukaran Id {getSortIcon('penukaranId')}
                  </div>
                </th>
                <th 
                  className="p-4 text-center text-sm font-medium cursor-pointer text-[#080808]"
                  onClick={() => handleSort('tanggal')}
                >
                  <div className="flex items-center justify-center gap-1">
                    Tanggal {getSortIcon('tanggal')}
                  </div>
                </th>
                <th 
                  className="p-4 text-center text-sm font-medium cursor-pointer text-[#080808]"
                  onClick={() => handleSort('userId')}
                >
                  <div className="flex items-center justify-center gap-1">
                    User Id {getSortIcon('userId')}
                  </div>
                </th>
                <th 
                  className="p-4 text-center text-sm font-medium cursor-pointer text-[#080808]"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center justify-center gap-1">
                    Nama Pengguna {getSortIcon('name')}
                  </div>
                </th>
                <th 
                  className="p-4 text-center text-sm font-medium cursor-pointer text-[#080808]"
                  onClick={() => handleSort('level')}
                >
                  <div className="flex items-center justify-center gap-1">
                    Level Poin {getSortIcon('level')}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedHistory.length > 0 ? (
                sortedHistory.map((item, index) => (
                  <tr key={index} className="border-t hover:bg-gray-50 bg-white text-center">
                    <td className="p-4 text-sm font-medium text-center bg-white">{item.penukaranId}</td>
                    <td className="p-4 text-sm text-center bg-white">{formatDate(item.tanggal)}</td>
                    <td className="p-4 text-sm text-center bg-white">{item.userId}</td>
                    <td className="p-4 text-sm text-center bg-white">{item.name}</td>
                    <td className="p-4 text-center bg-white">
                      <div className="flex justify-center bg-white">
                        <LevelBadge level={item.level} />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500 bg-white">
                    Tidak ada data yang ditemukan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between py-4">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-gray-500">Showing</span>
          <select className="bg-[#EAEAEA] px-2 py-1.5 rounded">
            <option>12</option>
            <option>24</option>
            <option>36</option>
          </select>
          <span className="text-gray-500">out of {totalResults.toLocaleString()}</span>
        </div>

        <div className="flex items-center gap-2">
          <button 
            className="p-1.5 bg-[#EAEAEA] rounded-lg"
            onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
          >
            <ChevronLeft size={16} className="text-[#080808]" />
          </button>
          
          <button className="w-[30px] h-[30px] flex items-center justify-center rounded-lg text-xs bg-[#CF0000] text-white">
            1
          </button>
          <button className="w-[30px] h-[30px] flex items-center justify-center rounded-lg text-xs bg-[#EAEAEA] text-[#080808]">
            2
          </button>

          <button 
            className="p-1.5 bg-[#EAEAEA] rounded-lg"
            onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
          >
            <ChevronRight size={16} className="text-[#080808]" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HistoryTable;