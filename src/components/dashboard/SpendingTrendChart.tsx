import React, { useState } from 'react';

interface SpendingTrendChartProps {
  data?: { day: string; amount: number; fullDate: string }[];
  totalWeekly?: number;
}

const MONTHS = [
  { key: 'jul', label: 'jul', cx: 75, cy: 78 },
  { key: 'aug', label: 'aug', cx: 150, cy: 24 },
  { key: 'sep', label: 'sep', cx: 185, cy: 45 },
  { key: 'oct', label: 'oct', cx: 218, cy: 58 },
  { key: 'nov', label: 'nov', cx: 290, cy: 30 },
  { key: 'dec', label: 'dec', cx: 345, cy: 80 },
];

export const SpendingTrendChart: React.FC<SpendingTrendChartProps> = () => {
  const [selectedMonth, setSelectedMonth] = useState('oct');
  const currentPoint = MONTHS.find((m) => m.key === selectedMonth) || MONTHS[3];

  return (
    <div className="w-full pt-2 pb-5 select-none">
      {/* Smooth Continuous Spline Wave (Exact match to reference screenshot) */}
      <div className="relative h-28 w-full overflow-visible my-1">
        <svg
          viewBox="0 0 380 110"
          className="w-full h-full overflow-visible"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Ambient soft glow stroke beneath main path */}
          <path
            d="M 0,55 C 30,55 45,78 75,78 C 105,78 120,24 150,24 C 180,24 195,58 220,58 C 245,58 260,30 290,30 C 320,30 345,80 380,60"
            stroke="rgba(244, 63, 94, 0.12)"
            strokeWidth="8"
            strokeLinecap="round"
          />

          {/* Main Pure Continuous Wave Line */}
          <path
            d="M 0,55 C 30,55 45,78 75,78 C 105,78 120,24 150,24 C 180,24 195,58 220,58 C 245,58 260,30 290,30 C 320,30 345,80 380,60"
            stroke="#18181B"
            strokeWidth="3.2"
            strokeLinecap="round"
          />

          {/* Focal Active Marker Circle */}
          <circle
            cx={currentPoint.cx}
            cy={currentPoint.cy}
            r="8.5"
            fill="#FFFFFF"
            stroke="#18181B"
            strokeWidth="3.5"
            className="transition-all duration-300 shadow-sm"
          />
        </svg>
      </div>

      {/* Months Horizontal Navigation */}
      <div className="flex justify-between items-center px-4 pt-1">
        {MONTHS.map((m) => {
          const isSelected = m.key === selectedMonth;
          return (
            <button
              key={m.key}
              onClick={() => setSelectedMonth(m.key)}
              className={`text-xs transition-all duration-150 lowercase py-1 px-2 rounded-lg ${
                isSelected
                  ? 'font-bold text-slate-950 scale-105'
                  : 'font-medium text-slate-400 hover:text-slate-600'
              }`}
            >
              {m.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};


