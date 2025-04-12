import { notFound } from "next/navigation";

// Tipe sesuai backend
type Reward = {
  id: number;
  name: string;
  description: string;
  point_cost: number;
  stock: number;
  image_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

// Fetch data reward dari API Gateway
async function getReward(id: string): Promise<Reward | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/rewards/${id}`,
      {
        cache: "no-store",
      }
    );
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error("Failed to fetch reward:", err);
    return null;
  }
}

interface PageProps {
  params: { id: string };
}

// Halaman detail reward
export default async function RewardDetailPage({ params }: PageProps) {
  // Explicitly cast id as string to avoid the params.id error
  const id = params.id as string;
  const reward = await getReward(id);

  if (!reward) return notFound();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white shadow rounded-2xl p-6">
        <h1 className="text-2xl font-bold mb-6">{reward.name}</h1>
        {/* Gambar */}
        {reward.image_url && (
          <div className="relative w-full h-72 rounded-xl overflow-hidden mb-6 border">
            <img
              src={`${process.env.NEXT_PUBLIC_API_URL}${reward.image_url}`}
              alt={reward.name}
              className="w-full object-contain rounded-xl bg-gray-50 mb-6"
              style={{ height: "300px" }}
            />
          </div>
        )}
        {/* Deskripsi */}
        <p className="text-gray-700 mb-4">
          {reward.description || "Tidak ada deskripsi untuk hadiah ini."}
        </p>
        {/* Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <span className="font-medium">Poin Dibutuhkan:</span>{" "}
            {reward.point_cost}
          </div>
          <div>
            <span className="font-medium">Stok Tersedia:</span> {reward.stock}
          </div>
          <div>
            <span className="font-medium">Status:</span>{" "}
            {reward.is_active ? "Aktif" : "Tidak Aktif"}
          </div>
          <div>
            <span className="font-medium">Dibuat pada:</span>{" "}
            {new Date(reward.created_at).toLocaleString("id-ID")}
          </div>
        </div>
      </div>
    </div>
  );
}
