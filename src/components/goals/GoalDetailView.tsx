import React from 'react';
import { ChevronLeft, MoreVertical, Car, ArrowUpRight, Rocket, Plus } from 'lucide-react';
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

  // Monthly savings analytics data (Jan to Jun)
  const monthlyData = [
    { month: '1月', heightPercent: 65, value: '$1,300' },
    { month: '2月', heightPercent: 52, value: '$1,040' },
    { month: '3月', heightPercent: 38, value: '$760' },
    { month: '4月', heightPercent: 48, value: '$960' },
    { month: '5月', heightPercent: 88, value: '$1,760' },
    { month: '6月', heightPercent: 60, value: '$1,200' },
  ];

  return (
    <div className="absolute inset-0 z-40 bg-gradient-to-b from-[#FFF0F5] via-[#FFF5F8] to-[#FFF0F4] flex flex-col overflow-hidden font-sans animate-in slide-in-from-right duration-300">
      {/* Scrollable Screen Content */}
      <div className="flex-1 overflow-y-auto px-5 pt-4 pb-28 no-scrollbar">
        {/* 1. Header Bar: Back, Title, More */}
        <div className="flex items-center justify-between pb-3 pt-1">
          <button
            onClick={onBack}
            aria-label="返回"
            className="w-9 h-9 rounded-full bg-white/80 border border-rose-100 flex items-center justify-center text-rose-950 hover:bg-rose-50 active:scale-95 transition-all shadow-sm"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
          </button>

          <h1 className="text-base font-extrabold text-rose-950 tracking-tight">
            目標詳情
          </h1>

          <button
            aria-label="更多選項"
            className="w-9 h-9 rounded-full bg-white/80 border border-rose-100 flex items-center justify-center text-rose-950 hover:bg-rose-50 active:scale-95 transition-all shadow-sm"
          >
            <MoreVertical className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

      <div className="space-y-4 pb-24">
        {/* 2. Top Goal Status Header */}
        <div className="pt-2">
          <div className="flex items-start justify-between">
            {/* Goal Icon */}
            <div className="w-14 h-14 rounded-2xl bg-white border border-rose-100/90 shadow-soft-pink flex items-center justify-center text-rose-500">
              <Car className="w-7 h-7 stroke-[1.8]" />
            </div>

            {/* Growth Badge */}
            <div className="flex flex-col items-end">
              <div className="inline-flex items-center gap-1 bg-emerald-50 border border-emerald-200/80 text-emerald-700 font-extrabold text-xs px-2.5 py-1 rounded-full shadow-sm">
                <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">
                  ↑
                </span>
                <span>+112.00%</span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium mt-1">
                自 4 月以來增長
              </span>
            </div>
          </div>

          {/* Goal Title & Motto */}
          <div className="mt-3.5">
            <h2 className="text-2xl font-black text-rose-950 tracking-tight">
              {goal.title || '夏日度假'}
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-1 flex items-center gap-1">
              <span>專注累積，才能盡情享受旅程</span>
              <span>🤩</span>
            </p>
          </div>
        </div>

        {/* 3. Main Progress Card */}
        <div className="bg-white rounded-3xl p-5 border border-rose-100/80 shadow-soft-pink space-y-3.5">
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-rose-950 tracking-tight font-display">
              {formatCurrency(goal.saved)}
            </span>
            <span className="text-sm font-bold text-slate-400 font-display">
              {formatCurrency(goal.target)}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2.5 bg-rose-100/70 rounded-full overflow-hidden flex items-center p-0.5">
            <div
              className="h-full bg-gradient-to-r from-rose-500 to-rose-600 rounded-full transition-all duration-700"
              style={{ width: `${percent}%` }}
            />
          </div>

          {/* Countdown & Percentage */}
          <div className="flex items-center justify-between text-xs font-bold pt-0.5">
            <span className="text-slate-600">倒數 20 天</span>
            <span className="text-rose-950">{percent}%</span>
          </div>
        </div>

        {/* 4. Saving Analytics Card */}
        <div className="bg-white rounded-3xl p-5 border border-rose-100/80 shadow-soft-pink space-y-4">
          <div>
            <h3 className="text-sm font-black text-rose-950">
              儲蓄分析
            </h3>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              每月平均 <span className="font-bold text-slate-700">$1,202</span>
            </p>
          </div>

          {/* Bar Chart Container */}
          <div className="relative pt-6 pb-2">
            {/* Background horizontal dashed guides */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none py-2 opacity-30">
              <div className="border-b border-dashed border-slate-300 w-full" />
              <div className="border-b border-dashed border-slate-300 w-full" />
              <div className="border-b border-dashed border-slate-300 w-full" />
            </div>

            {/* Bars */}
            <div className="relative flex items-end justify-between h-36 px-2">
              {monthlyData.map((item, idx) => (
                <div key={idx} className="flex flex-col items-center gap-2 flex-1 group">
                  <div className="w-8 sm:w-9 bg-rose-100/50 rounded-2xl flex items-end justify-center h-full p-0.5">
                    <div
                      className="w-full bg-gradient-to-t from-rose-950 via-rose-900 to-rose-800 rounded-2xl transition-all duration-500 group-hover:from-rose-600 group-hover:to-rose-500 shadow-sm relative overflow-hidden"
                      style={{ height: `${item.heightPercent}%` }}
                    >
                      {/* Subtle diagonal striped texture to match screenshot feel */}
                      <div className="absolute inset-0 opacity-15 bg-[repeating-linear-gradient(45deg,transparent,transparent_4px,rgba(255,255,255,0.4)_4px,rgba(255,255,255,0.4)_8px)]" />
                    </div>
                  </div>
                  <span className="text-[11px] font-medium text-slate-400 group-hover:text-rose-950 transition-colors">
                    {item.month}
                  </span>
                </div>
              ))}
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
