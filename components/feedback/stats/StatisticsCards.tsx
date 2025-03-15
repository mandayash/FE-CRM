// components/feedback/stats/StatisticsCards.tsx
"use client";
import { useEffect, useState } from "react";
import { MessageSquare, CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { feedbackService } from "@/services/feedbackService";

interface StatCardProps {
  icon: React.ElementType;
  title: string;
  value: number;
  percentage?: number; // persentase dari total
}

const StatCard = ({ icon: Icon, title, value, percentage }: StatCardProps) => {
  return (
    <Card className="overflow-hidden h-full">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
          {/* Left Section */}
          <div className="flex items-start gap-3 sm:gap-4 min-w-0">
            {/* Icon container */}
            <div className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 flex items-center justify-center rounded-full bg-red-50">
              <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
            </div>
            {/* Title and value */}
            <div className="flex flex-col min-w-0">
              <p className="text-xs sm:text-sm text-gray-600 truncate">
                {title}
              </p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-black text-primary mt-0.5 sm:mt-1 truncate">
                {value.toLocaleString()}
              </p>
              {/* Tambahkan persentase jika ada */}
              {percentage !== undefined && (
                <p className="text-xs text-gray-500 mt-1">
                  {percentage.toFixed(1)}% dari total
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const StatisticsCards = () => {
  const [stats, setStats] = useState<{
    total: number;
    responded: number;
    pending: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await feedbackService.getFeedbackStats();
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch feedback stats:", err);
        setError("Gagal memuat statistik feedback");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="pt-12 sm:pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="h-[120px] animate-pulse">
              <CardContent className="p-6 flex items-center justify-center">
                <div className="w-full h-full bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-12 sm:pt-6">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
      </div>
    );
  }

  // Jika data sudah ada, tampilkan statistik
  if (stats) {
    // Hitung persentase
    const respondedPercentage =
      stats.total > 0 ? (stats.responded / stats.total) * 100 : 0;
    const pendingPercentage =
      stats.total > 0 ? (stats.pending / stats.total) * 100 : 0;

    const statCards = [
      {
        icon: MessageSquare,
        title: "Total Feedback",
        value: stats.total,
      },
      {
        icon: CheckCircle,
        title: "Feedback Selesai",
        value: stats.responded,
        percentage: respondedPercentage,
      },
      {
        icon: AlertCircle,
        title: "Feedback Belum",
        value: stats.pending,
        percentage: pendingPercentage,
      },
    ];

    return (
      <div className="pt-12 sm:pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {statCards.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>
      </div>
    );
  }

  return null;
};

export default StatisticsCards;
