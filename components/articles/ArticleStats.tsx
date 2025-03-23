'use client';

import { Card, CardContent } from "@/components/ui/card";
import { FileText, Send, XCircle, Save } from 'lucide-react';
import { useEffect, useState } from "react";
import { articleService } from "@/services/articleService";

export default function ArticleStats() {
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    failed: 0,
    draft: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        // Fetch all articles to calculate stats
        const response = await articleService.getAllArticles(1, 1000); // Fetch with large limit to get all

        const totalArticles = response.total;
        const publishedArticles = response.articles.filter(
          (article) => article.is_published
        ).length;
        
        const failedArticles = 0;
        
        const draftArticles = response.articles.filter(
          (article) => !article.is_published
        ).length;

        setStats({
          total: totalArticles,
          published: publishedArticles,
          failed: failedArticles,
          draft: draftArticles,
        });
      } catch (error) {
        console.error("Error fetching article stats:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const statsData = [
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 27 27" fill="none">
        <path d="M23.0625 12.7125V7.92001C23.0625 3.38626 22.005 2.25 17.7525 2.25H9.2475C4.995 2.25 3.9375 3.38626 3.9375 7.92001V20.5875C3.9375 23.58 5.58001 24.2888 7.57126 22.1513L7.58249 22.14C8.50499 21.1612 9.91124 21.24 10.71 22.3087L11.8462 23.8275" stroke="#CF0000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9 7.875H18" stroke="#CF0000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M10.125 12.375H16.875" stroke="#CF0000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M20.4874 16.6163L16.5049 20.5988C16.3474 20.7563 16.2011 21.0488 16.1674 21.2626L15.9536 22.7813C15.8749 23.3326 16.2574 23.7151 16.8086 23.6363L18.3274 23.4226C18.5412 23.3888 18.8449 23.2426 18.9911 23.0851L22.9737 19.1026C23.6599 18.4163 23.9862 17.6176 22.9737 16.6051C21.9724 15.6038 21.1736 15.9301 20.4874 16.6163Z" stroke="#CF0000" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M19.9121 17.1895C20.2496 18.4045 21.1946 19.3495 22.4096 19.687" stroke="#CF0000" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>,
      value: stats.total,
      label: 'Total Artikel',
      bgColor: 'bg-red-50',
      valueColor: 'text-primary'
    },
    {
      icon: <Send className="w-5 h-5 text-green-600" />,
      value: stats.published,
      label: 'Terkirim',
      bgColor: 'bg-green-50',
      valueColor: 'text-green-600'
    },
    {
      icon: <XCircle className="w-5 h-5 text-red-600" />,
      value: stats.failed,
      label: 'Gagal',
      bgColor: 'bg-red-50',
      valueColor: 'text-red-600'
    },
    {
      icon: <Save className="w-5 h-5 text-gray-600" />,
      value: stats.draft,
      label: 'Draft',
      bgColor: 'bg-gray-50',
      valueColor: 'text-gray-600'
    }
  ];

  return (
    <div className="pt-4 sm:pt-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat, index) => (
          <Card key={index} className="overflow-hidden">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-4">
                <div className={`h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 flex items-center justify-center rounded-lg ${stat.bgColor}`}>
                  {stat.icon}
                </div>
                <div>
                  {loading ? (
                    <div className="h-7 w-16 bg-gray-200 animate-pulse rounded"></div>
                  ) : (
                    <p className={`text-lg sm:text-xl lg:text-2xl font-bold font-poppins ${stat.valueColor}`}>
                      {stat.value.toLocaleString()}
                    </p>
                  )}
                  <p className="text-sm sm:text-sm text-[#080808] font-medium">
                    {stat.label}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}