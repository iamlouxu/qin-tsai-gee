import React from 'react';
import { ArrowUpRight, ArrowDownLeft, ShieldCheck } from 'lucide-react';
import { formatCurrency, formatNumber } from '../../utils/formatters';

interface PersonalOverviewCardProps {
  balance: number;
  totalExpense: number;
  totalIncome: number;
  monthlyBudget: number;
}

export const PersonalOverviewCard: React.FC<PersonalOverviewCardProps> = ({
  balance,
  totalExpense,
  totalIncome,
  monthlyBudget,
}) => {
  const budgetPercent = Math.min(100, Math.round((totalExpense / monthlyBudget) * 100));
  const remainingBudget = Math.max(0, monthlyBudget - totalExpense);

  return (
    <div className="pink-gradient-card rounded-3xl p-5 text-white relative overflow-hidden mb-5 border border-white/30 shadow-[0_14px_34px_-6px_rgba(244,63,94,0.38)]">
      {/* Top Meta Header */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-medium text-rose-100/90">
          8 月份 · 總結餘
        </span>
        <div className="flex items-center space-x-1 bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[11px] font-medium text-white border border-white/30 shadow-xs">
          <ShieldCheck className="w-3.5 h-3.5 text-rose-100" />
          <span>預算健康</span>
        </div>
      </div>

      {/* Hero Balance Display with Distinct Currency Hierarchy */}
      <div className="flex items-baseline gap-1.5 mb-4">
        <span className="text-base font-bold text-rose-100/90 font-display">NT$</span>
        <span className="font-display font-extrabold text-[38px] tracking-tight text-white leading-none">
          {formatNumber(balance)}
        </span>
      </div>

      {/* Expense & Income Cards */}
      <div className="grid grid-cols-2 gap-2.5 mb-3.5">
        {/* Expense Card */}
        <div className="bg-white/15 backdrop-blur-md rounded-2xl p-3 border border-white/20 transition-transform active:scale-[0.98]">
          <div className="flex items-center space-x-1.5 text-rose-100 text-xs mb-1">
            <span className="w-4 h-4 rounded-full bg-rose-400/50 flex items-center justify-center">
              <ArrowDownLeft className="w-3 h-3 text-white stroke-[2.5]" />
            </span>
            <span className="font-medium">本月總支出</span>
          </div>
          <div className="font-display font-bold text-[17px] text-white tracking-tight">
            {formatCurrency(totalExpense)}
          </div>
        </div>

        {/* Income Card */}
        <div className="bg-white/15 backdrop-blur-md rounded-2xl p-3 border border-white/20 transition-transform active:scale-[0.98]">
          <div className="flex items-center space-x-1.5 text-rose-100 text-xs mb-1">
            <span className="w-4 h-4 rounded-full bg-emerald-400/50 flex items-center justify-center">
              <ArrowUpRight className="w-3 h-3 text-white stroke-[2.5]" />
            </span>
            <span className="font-medium">本月總收入</span>
          </div>
          <div className="font-display font-bold text-[17px] text-white tracking-tight">
            {formatCurrency(totalIncome)}
          </div>
        </div>
      </div>

      {/* Budget Progress Bar */}
      <div className="bg-black/15 backdrop-blur-md rounded-2xl p-3 border border-white/15">
        <div className="flex justify-between items-center text-xs text-rose-100 mb-1.5">
          <span className="font-medium">預算消耗進度</span>
          <span className="font-semibold text-white">
            剩餘 {formatCurrency(remainingBudget)}{' '}
            <span className="text-rose-200/90 font-normal">({budgetPercent}%)</span>
          </span>
        </div>
        <div className="w-full bg-black/20 h-2 rounded-full overflow-hidden p-[1px]">
          <div
            className="bg-gradient-to-r from-white/80 to-white h-full rounded-full transition-all duration-500 shadow-xs"
            style={{ width: `${budgetPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
};

