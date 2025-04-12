import { notFound } from "next/navigation";
import { rewardService } from "@/services/rewardService"; // Update this path if needed

// Define the props type for dynamic parameters
interface PageProps {
  params: Promise<{ id: string }> | { id: string };
}

export default async function RewardDetailPage(props: PageProps) {
  // Get the parameters safely
  const resolvedParams =
    "then" in props.params ? await props.params : props.params;
  const rewardId = parseInt(resolvedParams.id, 10);

  if (isNaN(rewardId)) {
    return notFound();
  }

  try {
    const reward = await rewardService.getRewardById(rewardId);

    if (!reward) {
      return notFound();
    }

    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white shadow rounded-2xl p-6">
          <h1 className="text-2xl font-bold mb-6">{reward.name}</h1>

          {/* Gambar */}
          {reward.image_url && (
            <div className="relative w-full h-72 rounded-xl overflow-hidden mb-6 border">
              <img
                src={rewardService.getImageUrl(reward.image_url)}
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
  } catch (error) {
    console.error("Error fetching reward:", error);
    return notFound();
  }
}
