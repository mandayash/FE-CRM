"use client";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Send, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { articleService } from "@/services/articleService";

export default function ArticleStats() {
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
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
        const draftArticles = response.articles.filter(
          (article) => !article.is_published
        ).length;

        setStats({
          total: totalArticles,
          published: publishedArticles,
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
      icon: <FileText className="w-5 h-5 text-red-600" />,
      value: stats.total,
      label: "Total Artikel",
      bgColor: "bg-red-50",
      valueColor: "text-primary",
    },
    {
      icon: <Send className="w-5 h-5 text-green-600" />,
      value: stats.published,
      label: "Terkirim",
      bgColor: "bg-green-50",
      valueColor: "text-green-600",
    },
    {
      icon: <Save className="w-5 h-5 text-gray-600" />,
      value: stats.draft,
      label: "Draft",
      bgColor: "bg-gray-50",
      valueColor: "text-gray-600",
    },
  ];

  return (
    <div className="pt-4 sm:pt-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statsData.map((stat, index) => (
          <Card key={index} className="overflow-hidden">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-4">
                <div
                  className={`h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 flex items-center justify-center rounded-lg ${stat.bgColor}`}
                >
                  {stat.icon}
                </div>
                <div>
                  {loading ? (
                    <div className="h-6 w-16 bg-gray-200 animate-pulse rounded"></div>
                  ) : (
                    <p
                      className={`text-lg sm:text-xl lg:text-2xl font-semibold ${stat.valueColor}`}
                    >
                      {stat.value.toLocaleString()}
                    </p>
                  )}
                  <p className="text-xs sm:text-sm text-gray-500">
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
