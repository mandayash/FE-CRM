"use client";

import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { userService, User } from "@/services/userService";
import dayjs from "dayjs";

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Ags",
  "Sep",
  "Okt",
  "Nov",
  "Des",
];

interface ChartData {
  month: string;
  users: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: {
    value: number;
    payload: { month: string };
  }[];
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border rounded-lg shadow-lg">
        <p className="text-sm text-gray-600">{`${payload[0].payload.month}`}</p>
        <p className="text-sm font-bold">{`${payload[0].value.toLocaleString()} Pengguna`}</p>
      </div>
    );
  }
  return null;
};

const UsersBarChart: React.FC = () => {
  const [isClient, setIsClient] = useState(false);
  const [data, setData] = useState<ChartData[]>([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [allUsers, setAllUsers] = useState<User[]>([]);

  useEffect(() => {
    setIsClient(true);
    const fetch = async () => {
      try {
        const res = await userService.getAllCustomers(1, 10000);
        setAllUsers(res.users);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetch();
  }, []);

  useEffect(() => {
    const monthlyCounts = Array(12).fill(0);
    allUsers.forEach((user) => {
      const createdAt = dayjs(user.created_at);
      if (createdAt.year() === year) {
        monthlyCounts[createdAt.month()]++;
      }
    });
    const chartData: ChartData[] = monthlyCounts.map((count, index) => ({
      month: monthNames[index],
      users: count,
    }));
    setData(chartData);
  }, [year, allUsers]);

  return (
    <Card className="w-full h-full overflow-hidden">
      <CardHeader className="px-4 sm:px-6 pt-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-2">
          <div className="min-w-0 w-full sm:w-auto">
            <CardTitle className="text-base sm:text-lg font-medium text-primary truncate">
              Total Pengguna Aplikasi
            </CardTitle>
            <div className="mt-1 min-w-0">
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold truncate">
                {allUsers.length}
              </p>
              <p className="text-xs sm:text-sm text-gray-500 truncate">
                Total Pengguna
              </p>
            </div>
          </div>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="w-full sm:w-auto border rounded-lg px-3 py-2 text-xs sm:text-sm bg-white flex-shrink-0"
          >
            {[...Array(5)].map((_, i) => {
              const y = new Date().getFullYear() - i;
              return (
                <option key={y} value={y}>
                  {y}
                </option>
              );
            })}
          </select>
        </div>
      </CardHeader>
      <CardContent className="flex-1 px-4 sm:px-6">
        {isClient ? (
          <div className="w-full overflow-x-auto">
            <div className="min-w-[600px] sm:min-w-[700px] lg:min-w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data}
                  margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                  barSize={30}
                >
                  <defs>
                    <linearGradient
                      id="colorGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#D64017" />
                      <stop offset="100%" stopColor="#FFB547" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    vertical={false}
                    strokeDasharray="3 3"
                    stroke="#E4E4E4"
                  />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#666", fontSize: 11 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#666", fontSize: 11 }}
                    width={45}
                  />
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
                  />
                  <Bar
                    dataKey="users"
                    fill="url(#colorGradient)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="w-full h-[300px] flex items-center justify-center">
            <p className="text-gray-500">Loading chart...</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UsersBarChart;
