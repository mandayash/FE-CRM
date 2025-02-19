"use client";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Send, XCircle, Save } from "lucide-react";

interface ArticleStatsProps {
  totalArticles: number;
  publishedArticles: number;
  draftArticles: number;
  deniedArticles: number;
}

export default function ArticleStats({
  totalArticles = 0,
  publishedArticles = 0,
  draftArticles = 0,
  deniedArticles = 0,
}: ArticleStatsProps) {
  const stats = [
    {
      icon: <FileText className="w-5 h-5 text-red-600" />,
      value: totalArticles,
      label: "Total Artikel",
      bgColor: "bg-red-50",
      valueColor: "text-primary",
    },
    {
      icon: <Send className="w-5 h-5 text-green-600" />,
      value: publishedArticles,
      label: "Terkirim",
      bgColor: "bg-green-50",
      valueColor: "text-green-600",
    },
    {
      icon: <XCircle className="w-5 h-5 text-red-600" />,
      value: deniedArticles,
      label: "Gagal",
      bgColor: "bg-red-50",
      valueColor: "text-red-600",
    },
    {
      icon: <Save className="w-5 h-5 text-gray-600" />,
      value: draftArticles,
      label: "Draft",
      bgColor: "bg-gray-50",
      valueColor: "text-gray-600",
    },
  ];

  return (
    <div className="pt-4 sm:pt-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="overflow-hidden">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-4">
                <div
                  className={`h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 flex items-center justify-center rounded-lg ${stat.bgColor}`}
                >
                  {stat.icon}
                </div>
                <div>
                  <p
                    className={`text-lg sm:text-xl lg:text-2xl font-semibold ${stat.valueColor}`}
                  >
                    {stat.value.toLocaleString()}
                  </p>
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
