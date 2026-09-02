import React, { useState } from 'react';
import { Target, PieChart, Sparkles } from 'lucide-react';
import { Ledger, Transaction } from '../../types';
import { SavingsGoalSection } from './SavingsGoalSection';

import { CategoryBudgetSection } from './CategoryBudgetSection';

interface GoalsViewProps {
  currentLedger: Ledger;
  transactions: Transaction[];
  currentSavings: number;
  userContribution: number;
  partnerContribution: number;
  onQuickDepositClick?: () => void;
  onUpdateLedgerTarget?: (newTarget: number) => void;
  onUpdateLedgerBudget?: (newBudget: number) => void;
}

type GoalTabMode = 'savings' | 'budgets';

export const GoalsView: React.FC<GoalsViewProps> = ({
  currentLedger,
  transactions,
  currentSavings,
  userContribution,
  partnerContribution,
  onQuickDepositClick,
  onUpdateLedgerTarget,
  onUpdateLedgerBudget,
}) => {
  const [activeMode, setActiveMode] = useState<GoalTabMode>('savings');

  return (
    <div className="space-y-4 pb-6 animate-fade-in">
      {/* 1. Header & Title */}
      <div className="flex items-center justify-between pt-1 px-1">
        <div>
          <h1 className="text-xl font-extrabold text-rose-950 font-sans tracking-tight">
            目標與預算
          </h1>
          <p className="text-xs text-rose-800/60 font-medium mt-0.5">
            {currentLedger.name} · 存錢進度與支出控管
          </p>
        </div>

        <div className="flex items-center space-x-1 px-3 py-1 bg-white/80 backdrop-blur-md rounded-2xl border border-rose-200/60 text-xs font-bold text-rose-800 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-rose-500" />
          <span>{currentLedger.type === 'shared' ? '💍 共同基金' : '👤 個人目標'}</span>
        </div>
      </div>

      {/* 2. Mode Toggle Pills ([ 💎 存錢目標 ] / [ 📊 類別預算 ]) */}
      <div className="bg-rose-100/60 p-1 rounded-2xl flex items-center justify-between border border-rose-200/50 shadow-inner">
        <button
          onClick={() => setActiveMode('savings')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center space-x-1.5 transition-all duration-200 ${
            activeMode === 'savings'
              ? 'bg-white text-rose-600 shadow-soft-pink scale-[1.01]'
              : 'text-slate-500 hover:text-rose-600'
          }`}
        >
          <Target className="w-3.5 h-3.5" />
          <span>💎 存錢目標</span>
        </button>

        <button
          onClick={() => setActiveMode('budgets')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center space-x-1.5 transition-all duration-200 ${
            activeMode === 'budgets'
              ? 'bg-white text-rose-600 shadow-soft-pink scale-[1.01]'
              : 'text-slate-500 hover:text-rose-600'
          }`}
        >
          <PieChart className="w-3.5 h-3.5" />
          <span>📊 類別預算</span>
        </button>
      </div>

      {/* 3. Tab Content */}
      {activeMode === 'savings' ? (
        <SavingsGoalSection
          currentLedger={currentLedger}
          currentSavings={currentSavings}
          userContribution={userContribution}
          partnerContribution={partnerContribution}
          onQuickDepositClick={onQuickDepositClick}
          onUpdateGoal={onUpdateLedgerTarget}
        />
      ) : (
        <CategoryBudgetSection
          currentLedger={currentLedger}
          transactions={transactions}
          onUpdateLedgerBudget={onUpdateLedgerBudget}
        />
      )}
    </div>
  );
};
