"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface LevelData {
  level: string;
  count: number;
  percentage: number;
  color: string;
}

const LevelStats = () => {
  const totalPoin = 432932;

  const levels: LevelData[] = [
    {
      level: "Silver Level",
      count: 311172,
      percentage: 72,
      color: "#ADADAD",
    },
    {
      level: "Gold Level",
      count: 77792,
      percentage: 18,
      color: "#FFD23D",
    },
    {
      level: "Platinum Level",
      count: 43429,
      percentage: 10,
      color: "#B09FFF",
    },
  ];

  const LevelRow = ({ level, count, percentage }: LevelData) => {
    const getGradientStyle = (level: string) => {
      switch (level) {
        case "Silver Level":
          return "linear-gradient(198deg, #ADADAD 20.34%, #D2D2D2 29.06%, #BBB 50.52%, #A0A0A0 58.25%, #959595 86.63%)";
        case "Gold Level":
          return "linear-gradient(179deg, #FFD23D 35.57%, #EFD787 42.04%, #E1B831 57.97%, #EFD787 63.71%, rgba(242, 186, 0, 0.47) 84.77%)";
        case "Platinum Level":
          return "linear-gradient(244deg, #B09FFF 37.63%, #8C7BDB 41.94%, #BEB0FF 52.54%, #8C7BDB 56.36%, #CBC0FF 70.38%)";
        default:
          return "";
      }
    };

    return (
      <div className="flex items-center gap-4 min-w-[250px] sm:min-w-[300px]">
        <div className="flex items-center gap-3 flex-1">
          {/* Percentage badge with gradient background */}
          <div
            className="px-2 sm:px-3 py-1 rounded-lg w-[40px] sm:w-[48px] text-center flex-shrink-0"
            style={{
              backgroundImage: getGradientStyle(level),
            }}
          >
            <span className="text-xs sm:text-sm font-bold text-text">
              {percentage}%
            </span>
          </div>
          <span className="text-xs sm:text-sm font-medium whitespace-nowrap">
            {level}
          </span>
        </div>
        <span className="text-xs sm:text-sm font-bold whitespace-nowrap">
          {count.toLocaleString()}
        </span>
      </div>
    );
  };

  return (
    <Card className="w-full h-full overflow-hidden">
      <CardHeader className="px-4 sm:px-6 pt-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-2">
          <div className="min-w-0 w-full sm:w-auto">
            <CardTitle className="text-base sm:text-lg font-medium text-primary truncate">
              Statistik Level Poin
            </CardTitle>
          </div>
          <select className="w-full sm:w-auto border rounded-lg px-3 py-2 text-xs sm:text-sm bg-white flex-shrink-0">
            <option>Tahun Ini</option>
            <option>2024</option>
            <option>2023</option>
          </select>
        </div>
      </CardHeader>

      <CardContent className="px6">
        {/* Pie Chart Container */}
        <div className="relative w-full max-w-[160px] aspect-square mx-auto mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <defs>
                <linearGradient id="silverGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="20.34%" stopColor="#ADADAD" />
                  <stop offset="29.06%" stopColor="#D2D2D2" />
                  <stop offset="50.52%" stopColor="#BBB" />
                  <stop offset="58.25%" stopColor="#A0A0A0" />
                  <stop offset="86.63%" stopColor="#959595" />
                </linearGradient>
                <linearGradient id="goldGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="35.57%" stopColor="#FFD23D" />
                  <stop offset="42.04%" stopColor="#EFD787" />
                  <stop offset="57.97%" stopColor="#E1B831" />
                  <stop offset="63.71%" stopColor="#EFD787" />
                  <stop offset="84.77%" stopColor="rgba(242, 186, 0, 0.47)" />
                </linearGradient>
                <linearGradient
                  id="platinumGradient"
                  x1="0"
                  y1="0"
                  x2="1"
                  y2="0"
                >
                  <stop offset="37.63%" stopColor="#B09FFF" />
                  <stop offset="41.94%" stopColor="#8C7BDB" />
                  <stop offset="52.54%" stopColor="#BEB0FF" />
                  <stop offset="56.36%" stopColor="#8C7BDB" />
                  <stop offset="70.38%" stopColor="#CBC0FF" />
                </linearGradient>
              </defs>
              <Pie
                data={levels}
                dataKey="percentage"
                cx="50%"
                cy="50%"
                innerRadius="60%"
                outerRadius="80%"
                startAngle={90}
                endAngle={-270}
                stroke="#FBFBFC"
                strokeWidth={3}
              >
                {levels.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={`url(#${
                      entry.level.toLowerCase().split(" ")[0]
                    }Gradient)`}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center w-full">
            <p className="text-[#303030] text-sm">Total Poin</p>
            <p className="text-primary text-xl font-bold">
              {totalPoin.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Level Stats */}
        <div className="overflow-x-auto pb-2">
          <div className="space-y-4">
            {levels.map((level) => (
              <LevelRow key={level.level} {...level} />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LevelStats;
