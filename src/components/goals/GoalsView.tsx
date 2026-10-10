import React, { useState } from 'react';
import {
  Plane,
  Heart,
  Sparkles,
  Lightbulb,
  Receipt,
  Plus,
  Pencil,
  ChevronRight,
  Calendar,
  PiggyBank,
  CheckCircle2,
  Target,
  PlusCircle,
  TrendingUp,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Ledger, Transaction } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { EditGoalModal } from './EditGoalModal';
import { CategoryBudgetSection } from './CategoryBudgetSection';

interface GoalsViewProps {
  currentLedger: Ledger;
  transactions: Transaction[];
  currentSavings: number;
  userContribution: number;
  partnerContribution: number;
  onQuickDepositClick?: () => void;
  onUpdateLedgerTarget?: (newTarget: number, title?: string) => void;
  onUpdateLedgerBudget?: (newBudget: number) => void;
}

type TabState = 'active' | 'completed' | 'budgets';

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
  // Tab state: active (進行中), completed (已完成), budgets (類別預算)
  const [activeTab, setActiveTab] = useState<TabState>('active');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showAllHistory, setShowAllHistory] = useState(false);

  // Secondary Quick Goal state (e.g., 沖繩夏日旅行 from Stitch)
  const [subGoal] = useState({
    title: '沖繩夏日旅行',
    saved: 38000,
    target: 60000,
  });

  // Smart Planner slider state (1: 3個月, 2: 6個月, 3: 9個月, 4: 12個月)
  const [plannerStep, setPlannerStep] = useState<number>(2);

  const isShared = currentLedger.type === 'shared';
  const targetAmount = currentLedger.targetAmount || (isShared ? 600000 : 100000);
  const percent = Math.min(100, Math.round((currentSavings / targetAmount) * 1000) / 10);
  const remaining = Math.max(0, targetAmount - currentSavings);

  // Sub-goal calculations
  const subGoalPercent = Math.min(
    100,
    Math.round((subGoal.saved / subGoal.target) * 1000) / 10
  );
  const subGoalRemaining = Math.max(0, subGoal.target - subGoal.saved);

  // Smart Planner Calculations based on active slider step
  const getPlannerConfig = (step: number) => {
    switch (step) {
      case 1:
        return {
          months: 3,
          label: '2025年 8月 (約 3 個月後)',
          amount: Math.ceil(remaining / 3) || 9330,
          dateStr: '2025 年 8 月 15 日',
          tip: '目標進度加快，注意檢視本月各項生活節約支出！',
        };
      case 2:
      default:
        return {
          months: 6,
          label: '2025年 10月 (約 5 個月後)',
          amount: Math.ceil(remaining / 6) || 5600,
          dateStr: '2025 年 10 月 15 日',
          tip: '每月多存 NT$ 1,200，即可提早 1 個月達成！',
        };
      case 3:
        return {
          months: 9,
          label: '2026年 1月 (約 9 個月後)',
          amount: Math.ceil(remaining / 9) || 3110,
          dateStr: '2026 年 1 月 20 日',
          tip: '儲蓄負擔輕鬆平穩，適合建立長期規律儲蓄慣性。',
        };
      case 4:
        return {
          months: 12,
          label: '2026年 4月 (約 12 個月後)',
          amount: Math.ceil(remaining / 12) || 2330,
          dateStr: '2026 年 4 月 30 日',
          tip: '每天少喝一杯手搖飲，就能輕鬆達標！',
        };
    }
  };

  const planner = getPlannerConfig(plannerStep);

  // Confetti celebration
  const handleCelebrate = () => {
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.65 },
      colors: ['#FB7185', '#F43F5E', '#EC4899', '#FFE4E6', '#F59E0B'],
    });
    if (onQuickDepositClick) onQuickDepositClick();
  };

  // Recent deposit history (incorporate actual transactions if any, plus realistic items)
  const depositTransactions = transactions
    .filter((tx) => tx.type === 'savings_deposit' || tx.type === 'income')
    .slice(0, 3);

  const fallbackHistory = [
    {
      id: 'h1',
      title: '5月獎金定存',
      date: '2026/05/10',
      amount: 10000,
      type: 'bonus',
    },
    {
      id: 'h2',
      title: '每月固定扣款',
      date: '2026/05/01',
      amount: 5000,
      type: 'auto',
    },
    {
      id: 'h3',
      title: '節流額外存入',
      date: '2026/04/18',
      amount: 3000,
      type: 'saving',
    },
  ];

  const historyItems =
    depositTransactions.length > 0
      ? depositTransactions.map((tx) => ({
        id: tx.id,
        title: tx.note || tx.category.name,
        date: tx.date,
        amount: tx.amount,
        type: 'deposit',
      }))
      : fallbackHistory;

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
                    <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 shadow-2xs">
                      <Plane className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-sm sm:text-base font-extrabold text-rose-950">
                        {subGoal.title}
                      </h2>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-glow-pink active:scale-95 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>新增存錢目標</span>
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

              {/* 4. Active Main Goal Overview Card */}
              <div className="glass-card rounded-3xl p-5 shadow-soft-pink border border-rose-100/80 flex flex-col gap-3.5 relative overflow-hidden">
                {/* Header Row */}
                <div className="flex items-start justify-between">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-rose-100/80 text-rose-700 text-[11px] font-bold border border-rose-200/60">
                        <Sparkles className="w-3 h-3 mr-1 text-rose-500" />
                        主力目標
                      </span>
                      <span className="text-xs font-medium text-slate-400">
                        倒數 140 天
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-extrabold text-rose-950 mt-0.5 tracking-tight">
                      {currentLedger.name}
                    </h3>
                  </div>

                  <div className="w-10 h-10 rounded-2xl bg-rose-100/70 border border-rose-200/60 flex items-center justify-center text-rose-600 shadow-2xs">
                    {isShared ? (
                      <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
                    ) : (
                      <Target className="w-5 h-5" />
                    )}
                  </div>
                </div>

                {/* Amount and Percentage */}
                <div className="flex items-baseline justify-between pt-1">
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-display font-extrabold text-3xl tracking-tight text-rose-600">
                      {formatCurrency(currentSavings).replace('NT$', '')}
                    </span>
                    <span className="text-xs font-bold text-rose-800/60">
                      / {formatCurrency(targetAmount)}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200/60 px-3 py-1 rounded-full shadow-2xs">
                    {percent}%
                  </div>
                </div>

                {/* Main Progress Bar */}
                <div className="w-full h-3 bg-rose-100 rounded-full overflow-hidden p-0.5">
                  <div
                    className="h-full bg-gradient-to-r from-rose-400 via-rose-500 to-pink-500 rounded-full transition-all duration-700 shadow-xs"
                    style={{ width: `${percent}%` }}
                  />
                </div>

                {/* Status Badges */}
                <div className="flex items-center justify-between pt-0.5">
                  <div className="flex items-center gap-1.5 text-rose-900 font-bold text-xs">
                    <PiggyBank className="w-4 h-4 text-rose-500" />
                    <span>尚差 {formatCurrency(remaining)}</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-400 font-medium text-xs">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>預計 11月 出發</span>
                  </div>
                </div>

                {/* Couple Contribution Breakdown (if shared) */}
                {isShared && (
                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-rose-100/80">
                    <div className="bg-rose-50/60 rounded-2xl p-2.5 border border-rose-100/70 flex items-center space-x-2">
                      <div className="w-7 h-7 rounded-full bg-rose-200/60 flex items-center justify-center text-xs font-bold border border-rose-300/60 shrink-0">
                        👦
                      </div>
                      <div className="overflow-hidden">
                        <div className="text-[10px] text-rose-800/70 truncate font-semibold">
                          培捷已存入
                        </div>
                        <div className="font-display font-bold text-xs text-rose-950 truncate">
                          {formatCurrency(userContribution)}
                        </div>
                      </div>
                    </div>

                    <div className="bg-rose-50/60 rounded-2xl p-2.5 border border-rose-100/70 flex items-center space-x-2">
                      <div className="w-7 h-7 rounded-full bg-pink-200/60 flex items-center justify-center text-xs font-bold border border-pink-300/60 shrink-0">
                        👧
                      </div>
                      <div className="overflow-hidden">
                        <div className="text-[10px] text-rose-800/70 truncate font-semibold">
                          婷婷已存入
                        </div>
                        <div className="font-display font-bold text-xs text-rose-950 truncate">
                          {formatCurrency(partnerContribution)}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions: Edit & Celebrate */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="py-2 px-3 rounded-2xl bg-rose-50 hover:bg-rose-100/70 text-rose-700 text-xs font-bold border border-rose-200/60 flex items-center justify-center gap-1 transition-all active:scale-98"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    <span>修改目標</span>
                  </button>

                  <button
                    onClick={handleCelebrate}
                    className="py-2 px-3 rounded-2xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white text-xs font-bold shadow-glow-pink flex items-center justify-center gap-1 transition-all active:scale-98"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>存入一筆 (彩帶)</span>
                  </button>
                </div>
              </div>

              {/* 5. Savings History List (近期存入明細) */}
              <div className="glass-card rounded-3xl p-5 shadow-soft-pink border border-rose-100/80 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Receipt className="w-4 h-4 text-rose-500" />
                    <h4 className="text-sm font-extrabold text-rose-950">
                      近期存入明細
                    </h4>
                  </div>
                  <button
                    onClick={() => setShowAllHistory(!showAllHistory)}
                    className="text-xs font-bold text-rose-800/70 hover:text-rose-600 transition-colors flex items-center gap-0.5"
                  >
                    <span>{showAllHistory ? '收起' : '查看全部'}</span>
                    <ChevronRight
                      className={`w-3.5 h-3.5 transition-transform ${showAllHistory ? 'rotate-90' : ''
                        }`}
                    />
                  </button>
                </div>

                <div className="flex flex-col divide-y divide-rose-100/60">
                  {historyItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between py-2.5 first:pt-1 last:pb-1"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 shrink-0">
                          <TrendingUp className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-rose-950">
                            {item.title}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">
                            {item.date}
                          </span>
                        </div>
                      </div>
                      <span className="font-display font-bold text-xs text-rose-600 bg-rose-50/80 border border-rose-100/70 px-2 py-0.5 rounded-lg">
                        +{formatCurrency(item.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 6. Smart Savings Calculator (智慧試算規劃) */}
              <div className="glass-card rounded-3xl p-5 shadow-soft-pink border border-rose-100/80 flex flex-col gap-3.5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-2xl bg-rose-100/80 border border-rose-200/50 flex items-center justify-center text-rose-500">
                    <Lightbulb className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-rose-950">
                      智慧試算規劃
                    </h4>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 font-medium">
                  滑動預計達成日期，自動為您計算最適月存計畫
                </p>

                {/* Slider & Timeline Container */}
                <div className="flex flex-col gap-3 py-1">
                  <div className="flex justify-between items-center bg-rose-50/70 border border-rose-100 rounded-2xl px-3.5 py-2">
                    <span className="text-xs font-semibold text-rose-800/70">
                      預定進程
                    </span>
                    <span className="text-xs font-bold text-rose-600 bg-white px-2.5 py-0.5 rounded-full border border-rose-200/60 shadow-2xs">
                      {planner.label}
                    </span>
                  </div>

                  <div className="relative px-1 pt-1">
                    <input
                      type="range"
                      min="1"
                      max="4"
                      step="1"
                      value={plannerStep}
                      onChange={(e) => setPlannerStep(parseInt(e.target.value))}
                      className="w-full h-2 bg-rose-200/60 rounded-full appearance-none cursor-pointer accent-rose-500"
                    />
                    <div className="flex justify-between items-center text-slate-400 font-semibold text-[10px] mt-2 px-1">
                      <span className={plannerStep === 1 ? 'text-rose-600 font-bold' : ''}>
                        3 個月
                      </span>
                      <span className={plannerStep === 2 ? 'text-rose-600 font-bold' : ''}>
                        6 個月
                      </span>
                      <span className={plannerStep === 3 ? 'text-rose-600 font-bold' : ''}>
                        9 個月
                      </span>
                      <span className={plannerStep === 4 ? 'text-rose-600 font-bold' : ''}>
                        12 個月
                      </span>
                    </div>
                  </div>
                </div>

                {/* Calculation Result Highlight Card */}
                <div className="w-full bg-rose-50/70 rounded-2xl p-4 border border-rose-100/80 flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-rose-800/70 font-semibold">
                      每月建議存入金額
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span className="font-display font-extrabold text-lg text-rose-600">
                        {formatCurrency(planner.amount)}
                      </span>
                      <span className="text-[11px] text-rose-800/60 font-medium">
                        / 月
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-rose-800/70 font-semibold">
                      預計完成日期
                    </span>
                    <span className="font-bold text-rose-950 font-sans">
                      {planner.dateStr}
                    </span>
                  </div>

                  <div className="w-full bg-white rounded-xl p-2.5 flex items-center gap-2 border border-rose-100/80 shadow-2xs">
                    <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                    <span className="text-[11px] text-rose-900 font-medium leading-relaxed">
                      {planner.tip}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* 7. Completed Tab (已完成) */
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
    </div>
  );
};

