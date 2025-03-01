"use client";
import { useState, useEffect } from "react";
import { MessageSquare, CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { feedbackService } from "@/services/feedback_service";

interface StatCardProps {
  icon: React.ElementType;
  title: string;
  value: number;
  previousValue: number;
  percentageChange: number;
}

const StatCard = ({
  icon: Icon,
  title,
  value,
  previousValue,
  percentageChange,
}: StatCardProps) => {
  const isIncrease = percentageChange > 0;
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
            </div>
          </div>
          {/* Right Section */}
          <div className="flex items-center sm:items-end justify-between sm:justify-end sm:flex-col gap-2 sm:gap-1 flex-shrink-0 ml-auto">
            {/* Percentage change */}
            <div
              className={`flex items-center ${
                isIncrease ? "text-green-600" : "text-red-600"
              }`}
            >
              <span className="text-xs sm:text-sm font-medium whitespace-nowrap">
                {isIncrease ? "↑" : "↓"} {Math.abs(percentageChange).toFixed(1)}
                %
              </span>
            </div>
            {/* Previous value info */}
            <div className="flex flex-col items-end">
              <div className="text-[10px] sm:text-xs text-gray-500 text-right">
                <span className="sm:block truncate">{title}</span>
                <span className="ml-1 sm:ml-0 sm:block">Bulan Lalu</span>
              </div>
              <span className="text-xs sm:text-sm text-red-600 font-medium whitespace-nowrap">
                {previousValue.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const StatisticsCards = () => {
  const [stats, setStats] = useState([
    {
      icon: MessageSquare,
      title: "Total Feedback",
      value: 0,
      previousValue: 0,
      percentageChange: 0,
    },
    {
      icon: CheckCircle,
      title: "Feedback Selesai",
      value: 0,
      previousValue: 0,
      percentageChange: 0,
    },
    {
      icon: AlertCircle,
      title: "Feedback Belum",
      value: 0,
      previousValue: 0,
      percentageChange: 0,
    },
  ]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { stats } = await feedbackService.getAllFeedbacks();

        // Calculate values for previous month
        const previousTotal = Math.round(
          stats.totalFeedback / (1 + stats.monthlyChangePercentage.total / 100)
        );
        const previousSolved = Math.round(
          stats.solvedFeedback /
            (1 + stats.monthlyChangePercentage.solved / 100)
        );
        const previousPending = Math.round(
          stats.pendingFeedback /
            (1 + stats.monthlyChangePercentage.pending / 100)
        );

        setStats([
          {
            icon: MessageSquare,
            title: "Total Feedback",
            value: stats.totalFeedback,
            previousValue: previousTotal,
            percentageChange: stats.monthlyChangePercentage.total,
          },
          {
            icon: CheckCircle,
            title: "Feedback Selesai",
            value: stats.solvedFeedback,
            previousValue: previousSolved,
            percentageChange: stats.monthlyChangePercentage.solved,
          },
          {
            icon: AlertCircle,
            title: "Feedback Belum",
            value: stats.pendingFeedback,
            previousValue: previousPending,
            percentageChange: stats.monthlyChangePercentage.pending,
          },
        ]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching statistics:", error);
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
            <Card key={i} className="overflow-hidden h-full">
              <CardContent className="p-4 sm:p-6">
                <div className="animate-pulse flex space-x-4">
                  <div className="rounded-full bg-gray-200 h-12 w-12"></div>
                  <div className="flex-1 space-y-4 py-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="pt-12 sm:pt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>
    </div>
  );
};

export default StatisticsCards;
