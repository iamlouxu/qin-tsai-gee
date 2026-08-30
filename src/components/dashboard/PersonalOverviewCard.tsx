import React from 'react';
import { ArrowUpRight, ArrowDownLeft, ShieldCheck } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

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
    <div className="pink-gradient-card rounded-4xl p-6 text-white relative overflow-hidden mb-5">
      {/* Decorative Light Glows */}
      <div className="absolute -right-8 -top-8 w-36 h-36 bg-white/15 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -left-8 -bottom-8 w-36 h-36 bg-rose-900/20 rounded-full blur-xl pointer-events-none" />

      {/* Header Info */}
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs font-semibold text-rose-100 uppercase tracking-wider">
          8 月份 總結餘
        </span>
        <div className="flex items-center space-x-1 bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[11px] font-medium text-white border border-white/25">
          <ShieldCheck className="w-3.5 h-3.5 text-rose-200" />
          <span>預算正常</span>
        </div>
      </div>

      {/* Hero Balance Display */}
      <div className="font-display font-extrabold text-[36px] tracking-tight text-white mb-4 leading-tight">
        {formatCurrency(balance)}
      </div>

      {/* Expense & Income Grid Cards */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Expense Card */}
        <div className="bg-white/15 backdrop-blur-md rounded-2xl p-3 border border-white/20">
          <div className="flex items-center space-x-1.5 text-rose-100 text-xs mb-1">
            <span className="w-4 h-4 rounded-full bg-rose-400/40 flex items-center justify-center">
              <ArrowDownLeft className="w-3 h-3 text-white stroke-[2.5]" />
            </span>
            <span>本月總支出</span>
          </div>
          <div className="font-display font-bold text-lg text-white">
            {formatCurrency(totalExpense)}
          </div>
        </div>

        {/* Income Card */}
        <div className="bg-white/15 backdrop-blur-md rounded-2xl p-3 border border-white/20">
          <div className="flex items-center space-x-1.5 text-rose-100 text-xs mb-1">
            <span className="w-4 h-4 rounded-full bg-emerald-400/40 flex items-center justify-center">
              <ArrowUpRight className="w-3 h-3 text-white stroke-[2.5]" />
            </span>
            <span>本月總收入</span>
          </div>
          <div className="font-display font-bold text-lg text-white">
            {formatCurrency(totalIncome)}
          </div>
        </div>
      </div>

      {/* Budget Progress Bar */}
      <div className="bg-black/10 backdrop-blur-sm rounded-2xl p-3 border border-white/10">
        <div className="flex justify-between items-center text-xs text-rose-100 mb-1.5">
          <span>每月預算消耗</span>
          <span className="font-semibold text-white">
            剩餘 {formatCurrency(remainingBudget)} ({budgetPercent}%)
          </span>
        </div>
        <div className="w-full bg-white/20 h-2.5 rounded-full overflow-hidden p-0.5">
          <div
            className="bg-white h-full rounded-full transition-all duration-500 shadow-sm"
            style={{ width: `${budgetPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
};
