'use client';

import { useState } from 'react';
import ArticleStats from '@/components/articles/ArticleStats';
import ArticleTable from '@/components/articles/ArticleTable';
import { Plus, Filter, Table, Search, Menu } from 'lucide-react';
import Link from 'next/link';

export default function ArticlesPage() {
  const [activeStatus, setActiveStatus] = useState('Semua');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const statuses = ['Semua', 'Terkirim', 'Draft', 'Gagal'];

  return (
    <div className="space-y-6">
      {/* Stats Section */}
      <ArticleStats />

      {/* Actions Section */}
      <div className="flex items-center w-full sm:w-auto">
        <Link
          href="/articles/create"
          className="inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-[#CF0000] text-white rounded-lg hover:bg-red-700 text-xs sm:text-sm w-full sm:w-auto transition-colors"
        >
          <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          Tambah Artikel
        </Link>
      </div>

      {/* Filter Section */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 sm:items-center">
        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => setActiveStatus(status)}
              className={`h-8 px-3 sm:px-4 flex-shrink-0 flex items-center justify-center text-xs font-medium tracking-wider rounded-lg transition-colors
                ${activeStatus === status 
                  ? 'bg-[#CF0000] text-[#FBFBFC]' 
                  : 'bg-gray-100 text-[#080808] hover:bg-gray-200'
                }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Search and Tools */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          {/* Search Input */}
          <div className="relative flex-grow sm:flex-grow-0">
            <input
              type="text"
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
              <Table size={18} />
              Tampilkan Tabel
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
                  <Table size={18} />
                  Tampilkan Tabel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <ArticleTable />
    </div>
  );
}