'use client';

import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: number;
  previousValue: number;
  percentageChange: number;
  bgColor?: string; 
  valueColor?: string;
}

const StatCard = ({
  icon,
  title,
  value,
  previousValue,
  percentageChange,
  valueColor = '#CF0000'
}: StatCardProps) => {
  const isIncrease = percentageChange > 0;
  
  return (
    <Card className="overflow-hidden h-full">
      <CardContent className="p-4 sm:p-6 h-full">
        <div className="flex items-start justify-between h-full">
          {/* Left Section: Icon and Main Stats */}
          <div className="flex items-start gap-3 sm:gap-4 min-w-0">
            {/* Icon with consistent background styling */}
            <div className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 flex items-center justify-center rounded-full bg-red-50">
              {icon}
            </div>
            
            {/* Title and value */}
            <div className="flex flex-col min-w-0">
              <p className="text-xs sm:text-sm text-gray-600 truncate">
                {title}
              </p>
              <p 
                className="text-lg sm:text-xl lg:text-2xl font-semibold mt-0.5 sm:mt-1 truncate"
                style={{ color: valueColor }}
              >
                {value.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Right Section: Percentage and Previous Value */}
          <div className="flex flex-col items-end justify-start gap-1 flex-shrink-0">
            {/* Percentage change */}
            <div className={`flex items-center ${
              isIncrease ? 'text-green-600' : 'text-red-600'
            }`}>
              <span className="text-xs sm:text-sm font-medium whitespace-nowrap">
                {isIncrease ? '↑' : '↓'} {Math.abs(percentageChange)}%
              </span>
            </div>
            
            {/* Previous value info */}
            <div className="flex flex-col items-end">
              <div className="text-[10px] sm:text-xs text-gray-500 text-right leading-tight">
                <p className="truncate">{title}</p>
                <p>Bulan Lalu</p>
              </div>
              <span className="text-xs sm:text-sm text-red-600 font-medium whitespace-nowrap mt-0.5">
                {previousValue.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;