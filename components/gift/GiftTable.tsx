"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Pencil,
  Trash,
  Eye,
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

export interface Gift {
  id: number;
  name: string;
  stock: number;
  point_cost: number;
  image_url?: string;
  description?: string;
  totalExchanged?: number;
  is_active: boolean;
}

interface GiftTableProps {
  gifts: Gift[];
  selectedItems: number[];
  onSelectItem: (id: number) => void;
  onDelete: (ids: number[]) => void;
}

const GiftTable: React.FC<GiftTableProps> = ({
  gifts,
  selectedItems,
  onSelectItem,
  onDelete,
}) => {
  const [search, setSearch] = useState("");
  const [sortColumn, setSortColumn] = useState<keyof Gift | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(
    null
  );
  const [selectAll, setSelectAll] = useState(false);

  const filteredGifts = useMemo(() => {
    return gifts.filter((gift) =>
      gift.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [gifts, search]);

  const sortedGifts = useMemo(() => {
    if (!sortColumn || !sortDirection) return filteredGifts;
    const sorted = [...filteredGifts].sort((a, b) => {
      const valueA = a[sortColumn]!;
      const valueB = b[sortColumn]!;
      if (typeof valueA === "number" && typeof valueB === "number") {
        return sortDirection === "asc" ? valueA - valueB : valueB - valueA;
      }
      return sortDirection === "asc"
        ? String(valueA).localeCompare(String(valueB))
        : String(valueB).localeCompare(String(valueA));
    });
    return sorted;
  }, [filteredGifts, sortColumn, sortDirection]);

  const toggleSort = (column: keyof Gift) => {
    if (sortColumn === column) {
      setSortDirection((prev) =>
        prev === "asc" ? "desc" : prev === "desc" ? null : "asc"
      );
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (column: keyof Gift) => {
    if (sortColumn !== column) return <ArrowUpDown size={16} />;
    return sortDirection === "asc" ? (
      <ArrowUp size={16} />
    ) : sortDirection === "desc" ? (
      <ArrowDown size={16} />
    ) : (
      <ArrowUpDown size={16} />
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      filteredGifts.forEach((gift) => {
        if (selectedItems.includes(gift.id)) onSelectItem(gift.id);
      });
    } else {
      filteredGifts.forEach((gift) => {
        if (!selectedItems.includes(gift.id)) onSelectItem(gift.id);
      });
    }
    setSelectAll(!selectAll);
  };

  useEffect(() => {
    setSelectAll(
      filteredGifts.length > 0 &&
        filteredGifts.every((gift) => selectedItems.includes(gift.id))
    );
  }, [selectedItems, filteredGifts]);

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative w-full sm:max-w-xs">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari hadiah..."
          className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-200 text-sm"
        />
        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
      </div>

      {/* Table */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full bg-white text-sm text-left">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-4 text-center">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                  className="w-4 h-4"
                />
              </th>
              <th
                className="p-4 cursor-pointer"
                onClick={() => toggleSort("id")}
              >
                <div className="flex items-center gap-1">
                  ID {getSortIcon("id")}
                </div>
              </th>
              <th
                className="p-4 cursor-pointer"
                onClick={() => toggleSort("name")}
              >
                <div className="flex items-center gap-1">
                  Nama {getSortIcon("name")}
                </div>
              </th>
              <th className="p-4">Deskripsi</th>
              <th
                className="p-4 cursor-pointer"
                onClick={() => toggleSort("stock")}
              >
                <div className="flex items-center gap-1">
                  Stok {getSortIcon("stock")}
                </div>
              </th>
              <th
                className="p-4 cursor-pointer"
                onClick={() => toggleSort("point_cost")}
              >
                <div className="flex items-center gap-1">
                  Poin {getSortIcon("point_cost")}
                </div>
              </th>
              <th className="p-4">Path Gambar</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {sortedGifts.map((gift) => (
              <tr key={gift.id} className="border-t hover:bg-gray-50">
                <td className="p-4 text-center">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(gift.id)}
                    onChange={() => onSelectItem(gift.id)}
                    className="w-4 h-4"
                  />
                </td>
                <td className="p-4">HA-{gift.id}</td>
                <td className="p-4">{gift.name}</td>
                <td className="p-4">{gift.description || "-"}</td>
                <td className="p-4">{gift.stock}</td>
                <td className="p-4">{gift.point_cost}</td>
                <td className="p-4 text-xs break-all text-gray-500">
                  {gift.image_url || "-"}
                </td>
                <td className="p-4">
                  {gift.is_active ? (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                      Aktif
                    </span>
                  ) : (
                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                      Nonaktif
                    </span>
                  )}
                </td>
                <td className="p-4">
                  <div className="flex justify-center gap-2">
                    <Link
                      href={`/reward/${gift.id}`}
                      className="p-1.5 hover:bg-gray-100 rounded-lg"
                      title="Detail"
                    >
                      <Eye className="w-4 h-4 text-gray-500" />
                    </Link>
                    <Link
                      href={`/reward/${gift.id}/edit`}
                      className="p-1.5 hover:bg-gray-100 rounded-lg"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4 text-gray-500" />
                    </Link>
                    <button
                      onClick={() => onDelete([gift.id])}
                      className="p-1.5 hover:bg-gray-100 rounded-lg"
                      title="Hapus"
                    >
                      <Trash className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {sortedGifts.length === 0 && (
              <tr>
                <td colSpan={9} className="text-center py-8 text-gray-500">
                  Tidak ada data hadiah ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GiftTable;
