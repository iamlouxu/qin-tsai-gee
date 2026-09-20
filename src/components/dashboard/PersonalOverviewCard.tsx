import React, { useState } from 'react';
import { ChevronDown, Search, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
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
  const [showDetails, setShowDetails] = useState(false);
  const remainingBudget = Math.max(0, monthlyBudget - totalExpense);

  return (
    <div className="pt-2 pb-1 text-center select-none">
      {/* Top Filter Bar: Centered Period Capsule & Search */}
      <div className="relative flex items-center justify-center mb-5">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="inline-flex items-center space-x-1.5 bg-white/95 hover:bg-white border border-rose-200/80 px-4 py-1.5 rounded-full text-xs font-semibold text-slate-800 shadow-2xs active:scale-95 transition-all"
        >
          <span>this month</span>
          <ChevronDown
            className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${
              showDetails ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* Search Icon button on the right */}
        <button
          className="absolute right-1 w-8 h-8 rounded-full flex items-center justify-center text-slate-600 hover:text-rose-600 hover:bg-white/60 active:scale-95 transition-all"
          title="搜尋收支"
        >
          <Search className="w-4 h-4 stroke-[2]" />
        </button>
      </div>

      {/* Hero Big Amount: Centered Clean Minimalist Display */}
      <div className="mb-2">
        <div className="font-display font-extrabold text-[44px] tracking-tight text-slate-900 leading-none">
          {formatCurrency(balance)}
        </div>
      </div>

      {/* Optional Expandable Breakdown Pills */}
      {showDetails && (
        <div className="flex items-center justify-center gap-2.5 mt-3 mb-1 animate-in fade-in zoom-in-95 duration-200">
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200/60 shadow-2xs">
            <ArrowDownLeft className="w-3 h-3" />
            支 {formatCurrency(totalExpense)}
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60 shadow-2xs">
            <ArrowUpRight className="w-3 h-3" />
            收 {formatCurrency(totalIncome)}
          </span>
          <span className="text-[11px] text-slate-500 font-medium">
            預算餘 {formatCurrency(remainingBudget)}
          </span>
        </div>
      )}
    </div>
  );
};


