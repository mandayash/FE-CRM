// page.tsx
"use client";

import DashboardStats from "@/components/dashboard/DashboardStats";
import UsersBarChart from "@/components/dashboard/UsersBarChart";
import RatingStats from "@/components/dashboard/RatingStats";
import LevelStats from "@/components/dashboard/LevelStats";
import FeedbackData from "@/components/dashboard/FeedbackData";

const DashboardPage = () => {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <DashboardStats />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <UsersBarChart />
        </div>
        <div>
          <RatingStats />
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <FeedbackData />
        </div>
        <div>
          <LevelStats />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
