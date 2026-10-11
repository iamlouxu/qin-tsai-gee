import React, { useState } from 'react';
import { CheckCircle2, ChevronRight } from 'lucide-react';
import { Ledger, Transaction } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { EditGoalModal } from './EditGoalModal';
import { DepositGoalDrawer } from './DepositGoalDrawer';
import { CategoryBudgetSection } from './CategoryBudgetSection';
import { GoalDetailView } from './GoalDetailView';

interface GoalsViewProps {
  currentLedger: Ledger;
  transactions: Transaction[];
  currentSavings: number;
  userContribution: number;
  partnerContribution: number;
  onQuickDepositClick?: () => void;
  onUpdateLedgerTarget?: (newTarget: number, title?: string) => void;
  onUpdateLedgerBudget?: (newBudget: number) => void;
  onDetailOpenChange?: (isOpen: boolean) => void;
}

type TabState = 'active' | 'completed' | 'budgets';

export const GoalsView: React.FC<GoalsViewProps> = ({
  currentLedger,
  transactions,
  currentSavings: _currentSavings,
  userContribution: _userContribution,
  partnerContribution: _partnerContribution,
  onQuickDepositClick: _onQuickDepositClick,
  onUpdateLedgerTarget,
  onUpdateLedgerBudget,
  onDetailOpenChange,
}) => {
  // Tab state: active (進行中), completed (已完成), budgets (類別預算)
  const [activeTab, setActiveTab] = useState<TabState>('active');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDepositDrawerOpen, setIsDepositDrawerOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const handleOpenDetail = () => {
    setIsDetailOpen(true);
    onDetailOpenChange?.(true);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    onDetailOpenChange?.(false);
  };

  // Secondary Quick Goal state (e.g., 沖繩夏日旅行 from Stitch)
  const [subGoal, setSubGoal] = useState({
    title: '沖繩夏日旅行',
    saved: 15000,
    target: 50000,
  });

  const isShared = currentLedger.type === 'shared';
  const targetAmount = currentLedger.targetAmount || (isShared ? 600000 : 100000);

  // Sub-goal calculations
  const subGoalPercent = Math.min(
    100,
    Math.round((subGoal.saved / subGoal.target) * 1000) / 10
  );
  const subGoalRemaining = Math.max(0, subGoal.target - subGoal.saved);

  // Handler for depositing into goal
  const handleGoalDeposit = (depositAmount: number) => {
    setSubGoal((prev) => ({
      ...prev,
      saved: prev.saved + depositAmount,
    }));
  };

  // If viewing details of a goal, render GoalDetailView directly
  if (isDetailOpen) {
    return (
      <>
        <GoalDetailView
          goal={subGoal}
          onBack={handleCloseDetail}
          onTopUpClick={() => setIsDepositDrawerOpen(true)}
        />

        {/* Deposit Goal Drawer */}
        <DepositGoalDrawer
          isOpen={isDepositDrawerOpen}
          onClose={() => setIsDepositDrawerOpen(false)}
          goalTitle={subGoal.title}
          onDeposit={handleGoalDeposit}
        />
      </>
    );
  }

  return (
    <div className="space-y-4 pb-12 animate-fade-in font-sans">
      {/* 1. Top Header & Ledger Context */}
      <div className="flex items-center justify-center pt-1 px-1">
        <div>
          <h1 className="text-xl font-extrabold text-rose-950 font-sans tracking-tight flex items-center gap-1.5">
            <span>存錢目標</span>
          </h1>
        </div>
      </div>

      {activeTab === 'budgets' ? (
        <CategoryBudgetSection
          currentLedger={currentLedger}
          transactions={transactions}
          onUpdateLedgerBudget={onUpdateLedgerBudget}
        />
      ) : (
        <>
          {/* 2. Top Segmented Switcher (進行中 (2) / 已完成 (1)) */}
          <div className="w-full bg-rose-100/70 p-1 rounded-full flex items-center justify-between border border-rose-200/50 shadow-inner">
            <button
              onClick={() => setActiveTab('active')}
              className={`flex-1 py-2 px-4 rounded-full text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 ${activeTab === 'active'
                ? 'bg-white text-rose-600 shadow-soft-pink scale-[1.01]'
                : 'text-slate-500 hover:text-rose-700'
                }`}
            >
              <span
                className={`w-2 h-2 rounded-full inline-block ${activeTab === 'active' ? 'bg-rose-500' : 'bg-transparent'
                  }`}
              />
              <span>進行中 (2)</span>
            </button>

            <button
              onClick={() => setActiveTab('completed')}
              className={`flex-1 py-2 px-4 rounded-full text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 ${activeTab === 'completed'
                ? 'bg-white text-rose-600 shadow-soft-pink scale-[1.01]'
                : 'text-slate-500 hover:text-rose-700'
                }`}
            >
              <span
                className={`w-2 h-2 rounded-full inline-block ${activeTab === 'completed' ? 'bg-rose-500' : 'bg-transparent'
                  }`}
              />
              <span>已完成 (1)</span>
            </button>
          </div>

          {activeTab === 'active' ? (
            <div className="space-y-4">
              {/* 3. Quick Action / Add Goal Card (沖繩夏日旅行) */}
              <div className="glass-card rounded-3xl p-4 sm:p-5 shadow-soft-pink border border-rose-100/80 flex flex-col gap-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div>
                      <h2 className="text-sm sm:text-base font-extrabold text-rose-950">
                        {subGoal.title}
                      </h2>
                    </div>
                  </div>

                  <button
                    onClick={handleOpenDetail}
                    aria-label="查看目標詳情"
                    className="w-8 h-8 rounded-xl bg-white border border-rose-100/90 shadow-sm flex items-center justify-center text-slate-700 hover:text-rose-600 hover:bg-rose-50/60 active:scale-95 transition-all"
                  >
                    <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </div>

                {/* Sub-Goal Target Preview Row */}
                <div className="bg-rose-50/60 rounded-2xl p-3 border border-rose-100/70 flex flex-col gap-2">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-rose-800/70 font-medium">
                      已存 {formatCurrency(subGoal.saved)}
                    </span>
                    <span className="text-xs text-rose-950 font-bold">
                      目標 {formatCurrency(subGoal.target)}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2 bg-rose-200/50 rounded-full overflow-hidden flex items-center">
                    <div
                      className="h-full bg-gradient-to-r from-rose-400 to-rose-600 rounded-full transition-all duration-700"
                      style={{ width: `${subGoalPercent}%` }}
                    />
                  </div>

                  <div className="flex justify-between items-center text-[11px] pt-0.5">
                    <span className="text-rose-600 font-bold">
                      進度 {subGoalPercent}%
                    </span>
                    <span className="text-slate-500 font-medium">
                      尚差 {formatCurrency(subGoalRemaining)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Completed Tab (已完成) */
            <div className="glass-card rounded-3xl p-5 shadow-soft-pink border border-rose-100/80 flex flex-col gap-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-extrabold text-rose-950">
                      富士山攻頂裝備基金 🗻
                    </h3>
                    <p className="text-[10px] text-slate-400 font-medium">
                      完成於 2026 年 3 月 15 日
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                  100% 已達標 ✨
                </span>
              </div>

              <div className="bg-emerald-50/50 rounded-2xl p-3 border border-emerald-100/60 flex justify-between items-center text-xs">
                <span className="text-slate-500">累積達成金額</span>
                <span className="font-display font-extrabold text-emerald-700 text-sm">
                  NT$ 35,000 / NT$ 35,000
                </span>
              </div>
            </div>
          )}
        </>
      )}

      {/* Edit / Add Goal Modal */}
      <EditGoalModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialTarget={targetAmount}
        initialTitle={currentLedger.name}
        onSave={(newTarget, newTitle) => {
          if (onUpdateLedgerTarget) {
            onUpdateLedgerTarget(newTarget, newTitle);
          }
        }}
      />

      {/* Deposit Goal Drawer (matching screenshot design) */}
      <DepositGoalDrawer
        isOpen={isDepositDrawerOpen}
        onClose={() => setIsDepositDrawerOpen(false)}
        goalTitle={subGoal.title}
        onDeposit={handleGoalDeposit}
      />
    </div>
  );
};


