'use client';

import { useState } from 'react';
import { ArrowDown, ArrowUp, ArrowUpDown, Download, Trash, Search, Menu, ChevronLeft, ChevronRight } from 'lucide-react';

interface QRData {
  id: string;
  stasiun: string;
  namaStasiun: string;
  qrImageUrl?: string;
}

interface QRTableProps {
  qrData: QRData[];
  onViewQR: (qr: QRData) => void;
  onDownloadQR: (qr: QRData) => void;
  onDeleteQR: (ids: string[]) => void;
}

const QRTable = ({
  qrData,
  onViewQR,
  onDownloadQR,
  onDeleteQR
}: QRTableProps) => {
  // State untuk filter dan search
  const [activeTab, setActiveTab] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // State untuk tabel
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(null);
  const [selectedQRs, setSelectedQRs] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  // Tabs untuk filter
  const tabs = ["Semua", "Stasiun 1", "Stasiun 2", "Stasiun 3"];

  // Filter berdasarkan tab dan search
  const filteredQRs = qrData
    .filter(qr => {
      if (activeTab === "Semua") return true;
      return qr.namaStasiun === activeTab;
    })
    .filter(qr => {
      if (!searchQuery) return true;
      return (
        qr.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        qr.stasiun.toLowerCase().includes(searchQuery.toLowerCase()) ||
        qr.namaStasiun.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });

  // Sorting logic
  const sortedQRs = [...filteredQRs];
  if (sortColumn && sortDirection) {
    sortedQRs.sort((a, b) => {
      
      const valueA = a[sortColumn as keyof typeof a] ?? '';
      const valueB = b[sortColumn as keyof typeof b] ?? '';
      
      if (sortDirection === "asc") {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });
  }

  // Handler untuk sorting
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      // Toggle sort direction or reset
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortColumn(null);
        setSortDirection(null);
      } else {
        setSortDirection("asc");
      }
    } else {
      // New column to sort
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  // Mendapatkan icon untuk sorting
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

  // Handlers untuk select checkbox
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedQRs([]);
    } else {
      setSelectedQRs(filteredQRs.map(qr => qr.id));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectQR = (qrId: string) => {
    if (selectedQRs.includes(qrId)) {
      setSelectedQRs(selectedQRs.filter(id => id !== qrId));
      setSelectAll(false);
    } else {
      setSelectedQRs([...selectedQRs, qrId]);
      // Cek apakah semua QR sudah diselect
      if (selectedQRs.length + 1 === filteredQRs.length) {
        setSelectAll(true);
      }
    }
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

        {/* Search and Sort Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          {/* Search Input */}
          <div className="relative flex-grow sm:flex-grow-0">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari QR atau Stasiun..."
              className="w-full sm:w-[283px] h-8 pl-10 pr-4 rounded-[20px] bg-white text-xs"
            />
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              size={18}
            />
          </div>

          {/* Sort Direction Controls */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => {
                setSortColumn('id');
                setSortDirection('asc');
              }}
              className={`flex items-center gap-1.5 px-3 h-8 rounded-lg border text-xs transition-colors ${
                sortDirection === 'asc' && sortColumn === 'id' 
                  ? 'bg-[#CF0000] text-white border-[#CF0000]' 
                  : 'bg-white hover:bg-gray-50 border-gray-200'
              }`}
            >
              <ArrowUp size={16} />
              Ascending
            </button>
            <button 
              onClick={() => {
                setSortColumn('id');
                setSortDirection('desc');
              }}
              className={`flex items-center gap-1.5 px-3 h-8 rounded-lg border text-xs transition-colors ${
                sortDirection === 'desc' && sortColumn === 'id' 
                  ? 'bg-[#CF0000] text-white border-[#CF0000]' 
                  : 'bg-white hover:bg-gray-50 border-gray-200'
              }`}
            >
              <ArrowDown size={16} />
              Descending
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Action - Visible when items are selected */}
      {selectedQRs.length > 0 && (
        <div className="flex justify-end">
          <button
            className="bg-[#CF0000] hover:bg-[#B80000] text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm"
            onClick={() => onDeleteQR(selectedQRs)}
          >
            <Trash className="w-4 h-4" />
            Hapus {selectedQRs.length} QR yang dipilih
          </button>
        </div>
      )}

      {/* QR Table */}
      <div className="rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px]">
            <thead className="bg-[#EAEAEA]">
              <tr>
                <th className="w-4 p-4 text-center text-[#080808]">
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
                  <div className="flex items-center justify-center gap-1">
                    QR Id {getSortIcon('id')}
                  </div>
                </th>
                <th 
                  className="p-4 text-center text-sm font-medium cursor-pointer"
                  onClick={() => handleSort('stasiun')}
                >
                  <div className="flex items-center justify-center gap-1">
                    Stasiun Id {getSortIcon('stasiun')}
                  </div>
                </th>
                <th 
                  className="p-4 text-center text-sm font-medium cursor-pointer"
                  onClick={() => handleSort('namaStasiun')}
                >
                  <div className="flex items-center justify-center gap-1">
                    Nama Stasiun {getSortIcon('namaStasiun')}
                  </div>
                </th>
                <th className="p-4 text-center text-sm font-medium">
                  Tampilkan QR
                </th>
                <th className="p-4 text-center text-sm font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {sortedQRs.length > 0 ? (
                sortedQRs.map((qr, index) => (
                  <tr key={index} className="border-t hover:bg-gray-50 bg-white text-center">
                    <td className="p-4">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded border-gray-300"
                        checked={selectedQRs.includes(qr.id)}
                        onChange={() => handleSelectQR(qr.id)}
                      />
                    </td>
                    <td className="p-4 text-sm font-medium text-center">{qr.id}</td>
                    <td className="p-4 text-sm text-center">{qr.stasiun}</td>
                    <td className="p-4 text-sm text-center">{qr.namaStasiun}</td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => onViewQR(qr)}
                        className="inline-flex items-center justify-center px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs text-gray-700"
                      >
                        Lihat QR
                      </button>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => onDownloadQR(qr)}
                          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Download QR"
                        >
                          <Download className="w-4 h-4 text-gray-500" />
                        </button>
                        <button
                          onClick={() => onDeleteQR([qr.id])}
                          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Hapus QR"
                        >
                          <Trash className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    Tidak ada data QR yang ditemukan
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
          <select className="bg-gray-100 px-2 py-1.5 rounded">
            <option>1</option>
          </select>
          <span className="text-gray-500">out of 2</span>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-1.5 bg-gray-100 rounded-lg">
            <ChevronLeft size={16} className="text-gray-700" />
          </button>

          <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#CF0000] text-white">
            1
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 text-gray-700">
            2
          </button>

          <button className="p-1.5 bg-gray-100 rounded-lg">
            <ChevronRight size={16} className="text-gray-700" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRTable;