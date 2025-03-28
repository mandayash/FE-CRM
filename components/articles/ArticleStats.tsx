"use client";

import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";

interface ArticleStatsProps {
  totalArticles: number;
}

export default function ArticleStats({ totalArticles = 0 }: ArticleStatsProps) {
  const stats = [
    {
      icon: <FileText className="w-5 h-5 text-red-600" />,
      value: totalArticles,
      label: "Total Artikel",
      bgColor: "bg-red-50",
      valueColor: "text-primary",
    },
  ];

  return (
    <div className="pt-4 sm:pt-6">
      <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-4">
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
