import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Tooltip,
  XAxis,
} from 'recharts';
import { TrendingUp } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

interface SpendingTrendChartProps {
  data: { day: string; amount: number; fullDate: string }[];
  totalWeekly: number;
}

export const SpendingTrendChart: React.FC<SpendingTrendChartProps> = ({
  data,
  totalWeekly,
}) => {
  return (
    <div className="glass-card rounded-3xl p-5 mb-5 border border-rose-100/70">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <div>
          <div className="text-xs font-semibold text-rose-900/60 uppercase tracking-wider">
            近 7 日消費走勢
          </div>
          <div className="font-display font-extrabold text-xl text-rose-950 mt-0.5">
            {formatCurrency(totalWeekly)}
          </div>
        </div>
        <div className="flex items-center space-x-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>花費平穩</span>
        </div>
      </div>

      {/* Recharts Area Chart - Clean Mibu Spline with Gradient */}
      <div className="h-32 w-full -ml-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="pinkTrendGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FB7185" stopOpacity={0.45} />
                <stop offset="60%" stopColor="#F43F5E" stopOpacity={0.12} />
                <stop offset="100%" stopColor="#FFF0F5" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9D174D', fontSize: 11, fontWeight: 500 }}
              dy={6}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;
                  return (
                    <div className="bg-rose-950/90 backdrop-blur-md text-white text-xs py-1.5 px-3 rounded-2xl shadow-lg border border-rose-400/30">
                      <div className="text-[10px] text-rose-200">{item.fullDate}</div>
                      <div className="font-display font-bold text-sm text-white">
                        {formatCurrency(item.amount)}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="amount"
              stroke="#F43F5E"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#pinkTrendGradient)"
              activeDot={{
                r: 6,
                fill: '#FFFFFF',
                stroke: '#E11D48',
                strokeWidth: 3,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
