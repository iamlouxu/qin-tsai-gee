import React, { useState } from 'react';
import { ChevronDown, TrendingDown, TrendingUp } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export interface DailyBarItem {
  day: string;
  fullDate: string;
  dateStr: string;
  expense: number;
  income: number;
  isToday?: boolean;
}

interface PersonalOverviewCardProps {
  balance: number;
  totalExpense: number;
  totalIncome: number;
  monthlyBudget?: number;
  monthLabel?: string;
  weeklyData?: DailyBarItem[];
}

const DEFAULT_WEEK_DATA: DailyBarItem[] = [
  { day: '週一', fullDate: '週一', dateStr: '2026-10-12', expense: 1450, income: 0 },
  { day: '週二', fullDate: '週二', dateStr: '2026-10-13', expense: 980, income: 0 },
  { day: '週三', fullDate: '週三', dateStr: '2026-10-14', expense: 620, income: 0 },
  { day: '週四', fullDate: '週四', dateStr: '2026-10-15', expense: 2150, income: 48000 },
  { day: '週五', fullDate: '週五', dateStr: '2026-10-16', expense: 1850, income: 0 },
  { day: '週六', fullDate: '週六', dateStr: '2026-10-17', expense: 3100, income: 0 },
  { day: '週日', fullDate: '週日', dateStr: '2026-10-18', expense: 890, income: 0 },
];

export const PersonalOverviewCard: React.FC<PersonalOverviewCardProps> = ({
  balance,
  totalExpense,
  totalIncome,
  monthLabel = '2026年 10月',
  weeklyData = DEFAULT_WEEK_DATA,
}) => {
  const [activeTab, setActiveTab] = useState<'expense' | 'income'>('expense');

  // 預設選中週四 (如圖一中高亮的柱體) 或今天
  const todayIdx = weeklyData.findIndex((d) => d.isToday);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(
    todayIdx >= 0 ? todayIdx : 3
  );

  // 取得當前模式（支出 or 收入）下的各日數值
  const currentValues = weeklyData.map((d) =>
    activeTab === 'expense' ? d.expense : d.income
  );
  const maxVal = Math.max(...currentValues, 100);

  // 計算左側 Y 軸的 4 個刻度標記 (從高到低)
  const yAxisTicks = [
    maxVal,
    Math.round((maxVal * 0.7) / 50) * 50,
    Math.round((maxVal * 0.4) / 50) * 50,
    Math.round((maxVal * 0.15) / 50) * 50,
  ];

  return (
    <div className="bg-white/95 rounded-3xl p-5 sm:p-6 border border-rose-100/70 shadow-[0_4px_24px_-4px_rgba(244,63,94,0.06)] mb-5 select-none transition-all">
      {/* 1. 頂部 Header: 左側結餘 + 右側月份膠囊 */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="text-xs font-semibold text-slate-400 tracking-wide mb-1">
            本月結餘 Total balance
          </div>
          <div className="font-display font-extrabold text-[32px] sm:text-[36px] tracking-tight text-slate-900 leading-none tabular-nums">
            {formatCurrency(balance)}
          </div>
        </div>

        {/* 月份選擇膠囊 */}
        <button
          type="button"
          className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-200/80 px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-700 shadow-2xs active:scale-95 transition-all"
        >
          <span>{monthLabel}</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 stroke-[2.5]" />
        </button>
      </div>

      {/* 2. 收支切換膠囊 (Segmented Control Pill) */}
      <div className="bg-rose-50/70 border border-rose-100/90 p-1.5 rounded-3xl grid grid-cols-2 gap-1.5 mb-6 shadow-2xs">
        {/* 支出按鈕 */}
        <button
          type="button"
          onClick={() => setActiveTab('expense')}
          className={`flex items-center justify-center gap-2.5 py-2.5 px-3 rounded-2xl transition-all duration-200 select-none cursor-pointer ${
            activeTab === 'expense'
              ? 'bg-rose-500 text-white shadow-[0_4px_12px_rgba(244,63,94,0.3)]'
              : 'text-slate-700 hover:text-slate-900 hover:bg-black/5'
          }`}
        >
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
              activeTab === 'expense' ? 'bg-white/20' : 'bg-rose-100/80'
            }`}
          >
            <TrendingDown
              className={`w-4 h-4 stroke-[2.5] ${
                activeTab === 'expense' ? 'text-white' : 'text-rose-500'
              }`}
            />
          </div>
          <div className="text-left">
            <div
              className={`text-[11px] font-bold leading-tight ${
                activeTab === 'expense' ? 'text-white/90' : 'text-slate-500'
              }`}
            >
              支出 Expenses
            </div>
            <div
              className={`text-sm sm:text-base font-extrabold font-display leading-tight tabular-nums ${
                activeTab === 'expense' ? 'text-white' : 'text-slate-900'
              }`}
            >
              {formatCurrency(totalExpense)}
            </div>
          </div>
        </button>

        {/* 收入按鈕 */}
        <button
          type="button"
          onClick={() => setActiveTab('income')}
          className={`flex items-center justify-center gap-2.5 py-2.5 px-3 rounded-2xl transition-all duration-200 select-none cursor-pointer ${
            activeTab === 'income'
              ? 'bg-rose-500 text-white shadow-[0_4px_12px_rgba(244,63,94,0.3)]'
              : 'text-slate-700 hover:text-slate-900 hover:bg-black/5'
          }`}
        >
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
              activeTab === 'income' ? 'bg-white/20' : 'bg-rose-100/80'
            }`}
          >
            <TrendingUp
              className={`w-4 h-4 stroke-[2.5] ${
                activeTab === 'income' ? 'text-white' : 'text-rose-500'
              }`}
            />
          </div>
          <div className="text-left">
            <div
              className={`text-[11px] font-bold leading-tight ${
                activeTab === 'income' ? 'text-white/90' : 'text-slate-500'
              }`}
            >
              收入 Income
            </div>
            <div
              className={`text-sm sm:text-base font-extrabold font-display leading-tight tabular-nums ${
                activeTab === 'income' ? 'text-white' : 'text-slate-900'
              }`}
            >
              {formatCurrency(totalIncome)}
            </div>
          </div>
        </button>
      </div>

      {/* 3. 週一至週日 圓角膠囊長條圖 (Pill Bar Chart) */}
      <div className="flex items-end gap-2 pt-2 pb-1">
        {/* 左側 Y 軸刻度 */}
        <div className="w-10 text-right pr-2 text-[11px] font-semibold text-slate-400 flex flex-col justify-between h-40 pb-7 select-none shrink-0">
          {yAxisTicks.map((tick, i) => (
            <span key={i} className="tabular-nums">
              ${tick >= 1000 ? `${(tick / 1000).toFixed(0)}k` : tick}
            </span>
          ))}
        </div>

        {/* 7 根長條柱 (週一至週日) */}
        <div className="flex-1 flex items-end justify-between gap-1.5 sm:gap-2 h-40">
          {weeklyData.map((item, index) => {
            const amount = activeTab === 'expense' ? item.expense : item.income;
            // 計算長條高度百分比，設最低高度 12% 保持膠囊飽滿圓角
            const heightPercent =
              maxVal > 0 ? Math.max(12, Math.round((amount / maxVal) * 100)) : 12;
            const isSelected = selectedDayIndex === index;

            return (
              <div
                key={item.day}
                onClick={() => setSelectedDayIndex(index)}
                className="flex-1 flex flex-col items-center cursor-pointer group"
              >
                {/* 柱體容器 */}
                <div className="relative w-full flex items-end justify-center h-32">
                  {/* 選中時的浮動提示氣泡 */}
                  {isSelected && (
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold py-0.5 px-2 rounded-full whitespace-nowrap shadow-md pointer-events-none z-10 animate-in fade-in zoom-in-90 duration-150">
                      {formatCurrency(amount)}
                    </div>
                  )}

                  {/* 圓角膠囊柱體 */}
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full max-w-[38px] rounded-full transition-all duration-300 ease-out ${
                      isSelected
                        ? 'bg-rose-500 shadow-[0_4px_14px_rgba(244,63,94,0.35)]'
                        : 'bg-rose-100/70 hover:bg-rose-200/80'
                    }`}
                  />
                </div>

                {/* 底部星期標籤 (週一至週日) */}
                <span
                  className={`text-xs mt-2.5 transition-all duration-150 tabular-nums ${
                    isSelected
                      ? 'font-bold text-slate-950 scale-105'
                      : 'font-medium text-slate-400 group-hover:text-slate-600'
                  }`}
                >
                  {item.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
