"use client";

import { useEffect, useState } from "react";
import { RewardClaim, rewardService } from "@/services/rewardService";
import { Check } from "lucide-react";
import Link from "next/link";

export default function RewardClaimHistoryPage() {
  const [claims, setClaims] = useState<RewardClaim[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const fetchClaims = async () => {
    try {
      const res = await rewardService.getAllClaims(1, 20);
      setClaims(res.claims);
    } catch (err) {
      console.error("Failed to fetch claims", err);
      setError("Gagal memuat data klaim hadiah.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  const handleApprove = async (id: number) => {
    try {
      setUpdatingId(id);
      await rewardService.updateClaimStatus(id, { status: "APPROVED" });
      await fetchClaims();
    } catch (err) {
      console.error("Gagal meng-approve klaim:", err);
      alert("Terjadi kesalahan saat meng-approve klaim.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6 py-4">
      <div className="flex flex-col sm:flex-row justify-start items-start sm:items-center gap-4">
        <Link
          href="/reward"
          className="inline-flex items-center gap-2 text-sm text-[#CF0000] hover:text-red-700 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </Link>

        <h1 className="text-2xl font-medium text-[#CF0000]">
          Riwayat Permintaan Tukar Hadiah
        </h1>
      </div>

      {/* Status */}
      {loading ? (
        <p className="text-gray-500">Memuat data klaim...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : claims.length === 0 ? (
        <p className="text-gray-500">Belum ada permintaan tukar hadiah.</p>
      ) : (
        <div className="overflow-x-auto border rounded-lg">
          <table className="min-w-full text-sm">
            <thead className="bg-[#EAEAEA] text-left">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">Nama Hadiah</th>
                <th className="p-3">User ID</th>
                <th className="p-3">Point</th>
                <th className="p-3">Status</th>
                <th className="p-3">Tanggal</th>
                <th className="p-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {claims.map((claim) => (
                <tr key={claim.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">CL-{claim.id}</td>
                  <td className="p-3">{claim.reward.name}</td>
                  <td className="p-3">{claim.user_id}</td>
                  <td className="p-3">{claim.point_cost}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        claim.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-800"
                          : claim.status === "APPROVED"
                          ? "bg-green-100 text-green-800"
                          : claim.status === "REJECTED"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {claim.status}
                    </span>
                  </td>
                  <td className="p-3">
                    {new Date(claim.created_at).toLocaleString("id-ID")}
                  </td>
                  <td className="p-3">
                    {claim.status === "PENDING" ? (
                      <button
                        onClick={() => handleApprove(claim.id)}
                        className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1 rounded disabled:opacity-50"
                        disabled={updatingId === claim.id}
                      >
                        <Check size={14} />
                        {updatingId === claim.id ? "Memproses..." : "Approve"}
                      </button>
                    ) : (
                      <span className="text-gray-400 text-xs">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
