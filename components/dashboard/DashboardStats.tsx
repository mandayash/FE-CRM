// components/dashboard/DashboardStats.tsx
"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, MessageSquare } from "lucide-react";
import { userService } from "@/services/userService";
import { feedbackService } from "@/services/feedbackService";

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  loading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  loading = false,
}) => {
  return (
    <Card className="bg-white overflow-hidden">
      <CardContent className="flex items-center p-6 sm:p-6">
        <div className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 flex items-center justify-center rounded-full bg-red-50">
          {icon}
        </div>
        <div className="ml-3 sm:ml-4 min-w-0">
          <p className="text-xs sm:text-sm text-gray-600">{title}</p>
          {loading ? (
            <div className="h-6 w-20 bg-gray-200 animate-pulse rounded mt-1"></div>
          ) : (
            <p className="text-lg sm:text-xl lg:text-xl font-semibold mt-0.5 sm:mt-1">
              {value.toLocaleString()}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const DashboardStats: React.FC = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalFeedback, setTotalFeedback] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch users count
        const usersResponse = await userService.getAllCustomers(1, 1);
        setTotalUsers(usersResponse.total);

        // Asumsikan ada feedbackService.getAllFeedback
        const feedbackResponse = await feedbackService.getAllFeedbacks(1, 1);
        setTotalFeedback(feedbackResponse.total);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const stats = [
    {
      title: "Total Pengguna",
      value: totalUsers,
      icon: <Users className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />,
    },
    {
      title: "Total Feedback",
      value: totalFeedback,
      icon: <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />,
    },
  ];

  return (
    <div className="pt-12 sm:pt-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            loading={loading}
          />
        ))}
      </div>
    </div>
  );
};

export default DashboardStats;
