import React, { useState } from 'react';
import { ChevronLeft, MoreVertical, ArrowUpRight, Rocket, Plus } from 'lucide-react';
import {
  BarChart,
  Bar,
  Cell,
  CartesianGrid,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { formatCurrency } from '../../utils/formatters';

interface GoalDetailViewProps {
  goal: {
    title: string;
    saved: number;
    target: number;
  };
  onBack: () => void;
  onTopUpClick: () => void;
}

export const GoalDetailView: React.FC<GoalDetailViewProps> = ({
  goal,
  onBack,
  onTopUpClick,
}) => {
  const percent = Math.min(100, Math.round((goal.saved / goal.target) * 100));
  const [selectedMonthIndex, setSelectedMonthIndex] = useState<number>(4); // 預設 5月

  // Monthly savings analytics data (Jan to Jun)
  const monthlyData = [
    { month: '1月', amount: 1300 },
    { month: '2月', amount: 1040 },
    { month: '3月', amount: 760 },
    { month: '4月', amount: 960 },
    { month: '5月', amount: 1760 },
    { month: '6月', amount: 1200 },
  ];

  return (
    <div className="absolute inset-0 z-40 bg-gradient-to-b from-[#FFF0F5] via-[#FFF5F8] to-[#FFF0F4] flex flex-col overflow-hidden font-sans animate-in slide-in-from-right duration-300">
      {/* Scrollable Screen Content */}
      <div className="flex-1 overflow-y-auto px-5 pt-4 pb-28 no-scrollbar">
        {/* 1. Header Bar: Back, Title (每張卡片的名字), More */}
        <div className="flex items-center justify-between pb-3 pt-1">
          <button
            onClick={onBack}
            aria-label="返回"
            className="w-9 h-9 rounded-full bg-white/80 border border-rose-100 flex items-center justify-center text-rose-950 hover:bg-rose-50 active:scale-95 transition-all shadow-sm"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
          </button>

          <h1 className="text-base font-extrabold text-rose-950 tracking-tight">
            {goal.title || '目標詳情'}
          </h1>

          <button
            aria-label="更多選項"
            className="w-9 h-9 rounded-full bg-white/80 border border-rose-100 flex items-center justify-center text-rose-950 hover:bg-rose-50 active:scale-95 transition-all shadow-sm"
          >
            <MoreVertical className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        <div className="space-y-4 pb-24 pt-1">
          {/* 3. Combined Progress & Saving Analytics Unified Card (外面那層為白色) */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-rose-100/80 shadow-soft-pink space-y-4">
            {/* Top: Progress Info */}
            <div className="space-y-3">
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black text-rose-950 tracking-tight font-display">
                  {formatCurrency(goal.saved)}
                </span>
                <span className="text-sm font-bold text-slate-400 font-display">
                  {formatCurrency(goal.target)}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-rose-100/70 rounded-full overflow-hidden flex items-center p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-rose-500 to-rose-600 rounded-full transition-all duration-700"
                  style={{ width: `${percent}%` }}
                />
              </div>

              {/* Countdown & Percentage */}
              <div className="flex items-center justify-between text-xs font-bold pt-0.5">
                <span className="text-slate-500 font-medium">進度 30%</span>
                <span className="text-rose-950 font-bold">{percent}%</span>
              </div>
            </div>

            {/* Bottom: Nested Saving Analytics Inner Card (shadcn/ui 圓角風格) */}
            <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-rose-100/80 shadow-2xs space-y-3">
              <div>
                <h3 className="text-sm font-black text-rose-950">
                  儲蓄分析
                </h3>
                <p className="text-xs text-slate-400 font-medium mt-0.5">
                  每月平均 <span className="font-bold text-slate-700">$1,202</span>
                </p>
              </div>

              {/* shadcn/ui Recharts Bar Chart (與分析頁完全一致風格) */}
              <div className="h-44 w-full pt-1">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyData}
                    margin={{ top: 20, right: 4, left: 4, bottom: 0 }}
                    onClick={(state) => {
                      if (state && state.activeTooltipIndex !== undefined) {
                        setSelectedMonthIndex(state.activeTooltipIndex);
                      }
                    }}
                  >
                    {/* 水平虛線格線 */}
                    <CartesianGrid
                      vertical={false}
                      stroke="#FCE7F3"
                      strokeDasharray="3 3"
                    />

                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={10}
                      tick={({ x, y, payload, index }) => {
                        const isSelected = selectedMonthIndex === index;
                        return (
                          <text
                            x={x}
                            y={y}
                            textAnchor="middle"
                            className={`text-[11px] select-none transition-colors duration-150 ${isSelected
                                ? 'fill-rose-950 font-extrabold'
                                : 'fill-slate-400 font-medium'
                              }`}
                          >
                            {payload.value}
                          </text>
                        );
                      }}
                    />

                    <Tooltip
                      cursor={false}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-rose-950 text-white font-display font-extrabold text-[11px] px-2.5 py-1 rounded-xl shadow-lg shadow-rose-950/20 whitespace-nowrap flex items-center space-x-1 -translate-y-2 animate-in fade-in zoom-in-95 duration-100">
                              <span>{formatCurrency(data.amount)}</span>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />

                    <Bar
                      dataKey="amount"
                      radius={[10, 10, 8, 8]}
                      barSize={32}
                      className="cursor-pointer"
                    >
                      {monthlyData.map((_entry, index) => {
                        const isSelected = selectedMonthIndex === index;
                        return (
                          <Cell
                            key={`bar-cell-${index}`}
                            fill={isSelected ? '#F43F5E' : '#E2E8F0'}
                            className="transition-colors duration-200"
                            onClick={() => setSelectedMonthIndex(index)}
                          />
                        );
                      })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* 5. Transactions Section */}
          <div className="space-y-2.5 pt-1">
            <h3 className="text-sm font-black text-rose-950 px-1">
              存入明細
            </h3>

            <div className="space-y-2.5">
              {/* Transaction item 1 */}
              <div className="bg-white rounded-2xl p-3.5 border border-rose-100/70 shadow-sm flex items-center justify-between hover:shadow-soft-pink transition-all">
                <div className="flex items-center gap-3">
                  <div className="relative w-11 h-11 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600 border border-rose-100">
                    <Rocket className="w-5 h-5 text-rose-500" />
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[9px] font-bold border-2 border-white shadow-sm">
                      <ArrowUpRight className="w-2.5 h-2.5" />
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-extrabold text-rose-950">
                      目標存入
                    </h4>
                    <p className="text-[11px] text-slate-400 font-medium">
                      夏日度假基金
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs sm:text-sm font-black text-rose-950 block">
                    +$320.00
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    12:00 PM
                  </span>
                </div>
              </div>

              {/* Transaction item 2 */}
              <div className="bg-white rounded-2xl p-3.5 border border-rose-100/70 shadow-sm flex items-center justify-between hover:shadow-soft-pink transition-all">
                <div className="flex items-center gap-3">
                  <div className="relative w-11 h-11 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600 border border-rose-100">
                    <Rocket className="w-5 h-5 text-rose-500" />
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[9px] font-bold border-2 border-white shadow-sm">
                      <ArrowUpRight className="w-2.5 h-2.5" />
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-extrabold text-rose-950">
                      目標存入
                    </h4>
                    <p className="text-[11px] text-slate-400 font-medium">
                      夏日度假基金
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs sm:text-sm font-black text-rose-950 block">
                    +$320.00
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    10:15 AM
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 6. Fixed Bottom Action Button: + 存入款項 (位置與外層 BottomNav 完全一致且固定不滑動) */}
      <div className="absolute bottom-5 left-5 right-5 z-50 pointer-events-auto">
        <button
          onClick={onTopUpClick}
          className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 active:scale-95 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-glow-pink transition-all"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>存入款項</span>
        </button>
      </div>
    </div>
  );
};
