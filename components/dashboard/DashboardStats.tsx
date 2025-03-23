"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { userService } from "@/services/userService";
import { feedbackService } from "@/services/feedbackService";
import { articleService } from "@/services/articleService";

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
      <CardContent className="flex items-center p-4 sm:p-6">
        <div className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 flex items-center justify-center rounded-[8px] bg-[#FCDBCA]">
          {icon}
        </div>
        <div className="ml-3 sm:ml-4 min-w-0"> 
          <p className="text-sm sm:text-sm text-[#080808] font-medium truncate font-medium">{title}</p>
          {loading ? (
            <div className="h-7 w-20 bg-gray-200 animate-pulse rounded mt-1"></div>
          ) : (
            <p className="text-xl sm:text-xl lg:text-2xl mt-0.5 sm:mt-1 font-poppins font-bold truncate">
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
  const [totalPoints, setTotalPoints] = useState(0);
  const [totalArticles, setTotalArticles] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch users count
        const usersResponse = await userService.getAllCustomers(1, 1);
        setTotalUsers(usersResponse.total);

        // Fetch feedback count
        const feedbackResponse = await feedbackService.getAllFeedbacks(1, 1);
        setTotalFeedback(feedbackResponse.total);

        // Fetch articles count
        const articlesResponse = await articleService.getAllArticles(1, 1);
        setTotalArticles(articlesResponse.total);

        // Set total points (simulasi - sesuaikan dengan API yang tersedia)
        // Asumsi: Tidak ada API 
        setTotalPoints(432932);
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
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="31" height="30" viewBox="0 0 30 30" fill="none">
        <path d="M23 8.95C22.925 8.9375 22.8375 8.9375 22.7625 8.95C21.0375 8.8875 19.6625 7.475 19.6625 5.725C19.6625 3.9375 21.1 2.5 22.8875 2.5C24.675 2.5 26.1125 3.95 26.1125 5.725C26.1 7.475 24.725 8.8875 23 8.95Z" stroke="#CF0000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M21.7125 18.0502C23.425 18.3377 25.3125 18.0377 26.6375 17.1502C28.4 15.9752 28.4 14.0502 26.6375 12.8752C25.3 11.9877 23.3875 11.6877 21.675 11.9877" stroke="#CF0000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M7.96248 8.95C8.03748 8.9375 8.12498 8.9375 8.19998 8.95C9.92498 8.8875 11.3 7.475 11.3 5.725C11.3 3.9375 9.86248 2.5 8.07498 2.5C6.28748 2.5 4.84998 3.95 4.84998 5.725C4.86248 7.475 6.23748 8.8875 7.96248 8.95Z" stroke="#CF0000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9.24999 18.0502C7.53749 18.3377 5.64999 18.0377 4.32499 17.1502C2.56249 15.9752 2.56249 14.0502 4.32499 12.8752C5.66249 11.9877 7.57498 11.6877 9.28748 11.9877" stroke="#CF0000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M15.5 18.2874C15.425 18.2749 15.3375 18.2749 15.2625 18.2874C13.5375 18.2249 12.1625 16.8124 12.1625 15.0624C12.1625 13.2749 13.6 11.8374 15.3875 11.8374C17.175 11.8374 18.6125 13.2874 18.6125 15.0624C18.6 16.8124 17.225 18.2374 15.5 18.2874Z" stroke="#CF0000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M11.8625 22.2247C10.1 23.3997 10.1 25.3247 11.8625 26.4997C13.8625 27.8372 17.1375 27.8372 19.1375 26.4997C20.9 25.3247 20.9 23.3997 19.1375 22.2247C17.15 20.8997 13.8625 20.8997 11.8625 22.2247Z" stroke="#CF0000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    },
    {
      title: "Total Feedback",
      value: totalFeedback,
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="31" height="30" viewBox="0 0 31 30" fill="none">
        <path d="M15.5 2.5V10L18 7.5" stroke="#CF0000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M15.5 10L13 7.5" stroke="#CF0000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9.25 15C4.25 15 4.25 17.2375 4.25 20V21.25C4.25 24.7 4.25 27.5 10.5 27.5H20.5C25.5 27.5 26.75 24.7 26.75 21.25V20C26.75 17.2375 26.75 15 21.75 15C20.5 15 20.15 15.2625 19.5 15.75L18.225 17.1C16.75 18.675 14.25 18.675 12.7625 17.1L11.5 15.75C10.85 15.2625 10.5 15 9.25 15Z" stroke="#CF0000" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M6.75 14.9998V9.99981C6.75 7.4873 6.75 5.4123 10.5 5.0498" stroke="#CF0000" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M24.25 14.9998V9.99981C24.25 7.4873 24.25 5.4123 20.5 5.0498" stroke="#CF0000" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    },
    {
      title: "Total Point",
      value: totalPoints,
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="31" height="30" viewBox="0 0 31 30" fill="none">
        <path d="M12.375 17.1873C12.375 18.3998 13.3125 19.3748 14.4625 19.3748H16.8125C17.8125 19.3748 18.625 18.5248 18.625 17.4623C18.625 16.3248 18.125 15.9123 17.3875 15.6498L13.625 14.3373C12.8875 14.0748 12.3875 13.6748 12.3875 12.5248C12.3875 11.4748 13.2 10.6123 14.2 10.6123H16.55C17.7 10.6123 18.6375 11.5873 18.6375 12.7998" stroke="#CF0000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M15.5 9.375V20.625" stroke="#CF0000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M28 15C28 21.9 22.4 27.5 15.5 27.5C8.6 27.5 3 21.9 3 15C3 8.1 8.6 2.5 15.5 2.5" stroke="#CF0000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M28 7.5V2.5H23" stroke="#CF0000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M21.75 8.75L28 2.5" stroke="#CF0000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    },
    {
      title: "Total Artikel",
      value: totalArticles,
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="31" height="30" viewBox="0 0 31 30" fill="none">
        <path d="M26.125 14.125V8.80001C26.125 3.76251 24.95 2.5 20.225 2.5H10.775C6.05 2.5 4.875 3.76251 4.875 8.80001V22.875C4.875 26.2 6.70001 26.9875 8.91251 24.6125L8.92499 24.6C9.94999 23.5125 11.5125 23.6 12.4 24.7875L13.6625 26.475" stroke="#CF0000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M10.5 8.75H20.5" stroke="#CF0000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M11.75 13.75H19.25" stroke="#CF0000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M23.2638 18.4628L18.8388 22.8879C18.6638 23.0629 18.5013 23.3879 18.4638 23.6254L18.2263 25.3129C18.1388 25.9254 18.5638 26.3504 19.1763 26.2629L20.8638 26.0254C21.1013 25.9879 21.4388 25.8253 21.6013 25.6503L26.0263 21.2254C26.7888 20.4629 27.1513 19.5754 26.0263 18.4504C24.9138 17.3379 24.0263 17.7003 23.2638 18.4628Z" stroke="#CF0000" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M22.624 19.1006C22.999 20.4506 24.049 21.5006 25.399 21.8756" stroke="#CF0000" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    }
  ];

  return (
    <div className="pt-12 sm:pt-6"> 
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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