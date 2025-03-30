"use client";

import { useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Download,
  Search,
} from "lucide-react";
import { QRFeedback } from "@/services/qrService";

interface QRTableProps {
  qrData: QRFeedback[];
  onDownloadQR: (qr: QRFeedback) => void;
}

const QRTable = ({ qrData, onDownloadQR }: QRTableProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortColumn, setSortColumn] = useState<keyof QRFeedback | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(
    null
  );

  const handleSort = (column: keyof QRFeedback) => {
    if (sortColumn === column) {
      setSortDirection(
        sortDirection === "asc"
          ? "desc"
          : sortDirection === "desc"
          ? null
          : "asc"
      );
      if (sortDirection === "desc") setSortColumn(null);
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (column: keyof QRFeedback) => {
    if (sortColumn !== column) return <ArrowUpDown size={16} />;
    return sortDirection === "asc" ? (
      <ArrowUp size={16} />
    ) : (
      <ArrowDown size={16} />
    );
  };

  const filteredQRs = qrData.filter((qr) => {
    const search = searchQuery.toLowerCase();
    return (
      qr.id.toString().includes(search) ||
      qr.station.toLowerCase().includes(search)
    );
  });

  const sortedQRs = [...filteredQRs].sort((a, b) => {
    if (!sortColumn || !sortDirection) return 0;
    const aVal = a[sortColumn] ?? "";
    const bVal = b[sortColumn] ?? "";
    if (sortDirection === "asc") return aVal > bVal ? 1 : -1;
    return aVal < bVal ? 1 : -1;
  });

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative max-w-sm">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari QR atau Stasiun..."
          className="w-full h-9 pl-10 pr-4 rounded-[20px] bg-white text-sm border border-gray-300"
        />
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
          size={18}
        />
      </div>

      {/* Table */}
      <div className="rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-sm text-center">
            <thead className="bg-[#EAEAEA]">
              <tr>
                <th
                  className="p-3 cursor-pointer"
                  onClick={() => handleSort("id")}
                >
                  <div className="flex justify-center items-center gap-1">
                    QR ID {getSortIcon("id")}
                  </div>
                </th>
                <th
                  className="p-3 cursor-pointer"
                  onClick={() => handleSort("station")}
                >
                  <div className="flex justify-center items-center gap-1">
                    Station {getSortIcon("station")}
                  </div>
                </th>
                <th
                  className="p-3 cursor-pointer"
                  onClick={() => handleSort("created_at")}
                >
                  <div className="flex justify-center items-center gap-1">
                    Created At {getSortIcon("created_at")}
                  </div>
                </th>
                <th className="p-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {sortedQRs.length > 0 ? (
                sortedQRs.map((qr) => (
                  <tr
                    key={qr.id}
                    className="border-t hover:bg-gray-50 bg-white"
                  >
                    <td className="p-3 font-medium">{qr.id}</td>
                    <td className="p-3">{qr.station || "-"}</td>
                    <td className="p-3">
                      {new Date(qr.created_at).toLocaleString()}
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => onDownloadQR(qr)}
                        title="Download QR"
                        className="p-1.5 hover:bg-gray-100 rounded-lg"
                      >
                        <Download className="w-4 h-4 text-gray-500" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-6 text-gray-500">
                    Tidak ada data QR ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default QRTable;
