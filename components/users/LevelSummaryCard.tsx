// components/users/LevelSummaryCard.tsx
"use client";
import { useState, useEffect } from "react";
import { Trophy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { userService } from "@/services/userService";

interface LevelData {
  count: number;
  label: string;
  gradient: string;
}

interface LevelCardProps {
  count: number;
  label: string;
  gradient: string;
  loading?: boolean;
}

const LevelCard = ({
  count,
  label,
  gradient,
  loading = false,
}: LevelCardProps) => {
  return (
    <div
      className="flex items-center gap-2 py-1.5 px-3 sm:py-2 sm:px-4 rounded-lg min-w-[150px] sm:min-w-[170px] hover:shadow-md transition-shadow"
      style={{ background: gradient }}
    >
      <div className="w-full">
        {loading ? (
          <div className="h-6 w-16 bg-gray-200 animate-pulse rounded"></div>
        ) : (
          <p className="text-base sm:text-lg lg:text-xl font-bold truncate leading-tight text-[#303030]">
            {count.toLocaleString()}
          </p>
        )}
        <p className="text-[11px] sm:text-xs font-medium truncate text-[#404040]">
          {label}
        </p>
      </div>
    </div>
  );
};

const LevelSummaryCard = () => {
  const [levelData, setLevelData] = useState<LevelData[]>([
    {
      count: 0,
      label: "Bronze Level",
      gradient:
        "linear-gradient(198deg, #CD7F32 20.34%, #E9967A 29.06%, #B87333 50.52%, #CD7F32 58.25%, #A46628 86.63%)",
    },
    {
      count: 0,
      label: "Silver Level",
      gradient:
        "linear-gradient(198deg, #ADADAD 20.34%, #D2D2D2 29.06%, #BBB 50.52%, #A0A0A0 58.25%, #959595 86.63%)",
    },
    {
      count: 0,
      label: "Gold Level",
      gradient:
        "linear-gradient(179deg, #FFD23D 35.57%, #EFD787 42.04%, #E1B831 57.97%, #EFD787 63.71%, rgba(242, 186, 0, 0.47) 84.77%)",
    },
    {
      count: 0,
      label: "Platinum Level",
      gradient:
        "linear-gradient(244deg, #B09FFF 37.63%, #8C7BDB 41.94%, #BEB0FF 52.54%, #8C7BDB 56.36%, #CBC0FF 70.38%)",
    },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLevelCounts = async () => {
      try {
        // Mengambil semua pengguna dengan limit tinggi untuk mendapatkan seluruh data
        // Dalam praktik nyata, sebaiknya gunakan endpoint khusus di backend
        const response = await userService.getAllCustomers(1, 1000);

        // Menghitung pengguna berdasarkan levelnya
        const bronze = response.users.filter(
          (user) => user.points && user.points < 50
        ).length;
        const silver = response.users.filter(
          (user) => user.points && user.points >= 50 && user.points < 100
        ).length;
        const gold = response.users.filter(
          (user) => user.points && user.points >= 100 && user.points < 200
        ).length;
        const platinum = response.users.filter(
          (user) => user.points && user.points >= 200
        ).length;

        setLevelData([
          {
            count: bronze,
            label: "Bronze Level",
            gradient:
              "linear-gradient(198deg, #CD7F32 20.34%, #E9967A 29.06%, #B87333 50.52%, #CD7F32 58.25%, #A46628 86.63%)",
          },
          {
            count: silver,
            label: "Silver Level",
            gradient:
              "linear-gradient(198deg, #ADADAD 20.34%, #D2D2D2 29.06%, #BBB 50.52%, #A0A0A0 58.25%, #959595 86.63%)",
          },
          {
            count: gold,
            label: "Gold Level",
            gradient:
              "linear-gradient(179deg, #FFD23D 35.57%, #EFD787 42.04%, #E1B831 57.97%, #EFD787 63.71%, rgba(242, 186, 0, 0.47) 84.77%)",
          },
          {
            count: platinum,
            label: "Platinum Level",
            gradient:
              "linear-gradient(244deg, #B09FFF 37.63%, #8C7BDB 41.94%, #BEB0FF 52.54%, #8C7BDB 56.36%, #CBC0FF 70.38%)",
          },
        ]);
      } catch (error) {
        console.error("Error fetching level data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLevelCounts();
  }, []);

  return (
    <Card className="bg-white overflow-hidden shadow-sm mt-6 mb-4 py-1">
      <CardContent className="h-[76px] sm:h-[92px] flex items-center px-5 py-4 sm:px-7 sm:py-6">
        <div className="flex items-center gap-5 sm:gap-6 w-full">
          {/* Title Section */}
          <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
            <div className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 flex items-center justify-center rounded-full bg-red-50 shadow-sm">
              <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
            </div>
            <div>
              <p className="text-lg text-primary font-medium text-gray-800">
                Poin Level
              </p>
              <p className="text-xs text-gray-500 hidden sm:block">
                Statistik Level
              </p>
            </div>
          </div>
          {/* Level Cards - Scrollable Container */}
          <div className="overflow-x-auto flex-1 -mr-5 sm:-mr-7">
            <div className="flex items-center gap-3 sm:gap-3 pr-5 sm:pr-7 py-1">
              {levelData.map((level) => (
                <LevelCard
                  key={level.label}
                  count={level.count}
                  label={level.label}
                  gradient={level.gradient}
                  loading={loading}
                />
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LevelSummaryCard;
