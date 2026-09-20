import React, { useState, useMemo } from 'react';
import {
  AlertTriangle,
  Calendar,
  Pencil,
  Utensils,
  Coffee,
  Car,
  ShoppingBag,
  Film,
  Building,
  Camera,
  Plane,
  HeartHandshake,
  Wallet,
  Sparkles,
  ReceiptText,
} from 'lucide-react';
import { Ledger, Transaction } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { categories } from '../../data/mockData';
import { EditBudgetModal } from './EditBudgetModal';


interface CategoryBudgetSectionProps {
  currentLedger: Ledger;
  transactions: Transaction[];
  onUpdateLedgerBudget?: (newBudget: number) => void;
}

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  Utensils,
  Coffee,
  Car,
  ShoppingBag,
  Film,
  Building,
  Camera,
  Plane,
  HeartHandshake,
  Wallet,
  Sparkles,
};

export const CategoryBudgetSection: React.FC<CategoryBudgetSectionProps> = ({
  currentLedger,
  transactions,
  onUpdateLedgerBudget,
}) => {
  const [isEditTotalModalOpen, setIsEditTotalModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<{
    id: string;
    name: string;
    limit: number;
  } | null>(null);

  // Category specific budget state (with sensible defaults)
  const [categoryBudgets, setCategoryBudgets] = useState<Record<string, number>>({
    food: 8000,
    drink: 2000,
    shopping: 5000,
    transport: 2500,
    entertainment: 3000,
    wedding_photo: 25000,
    wedding_venue: 35000,
  });

  const monthlyTotalBudget = currentLedger.monthlyBudget || (currentLedger.type === 'shared' ? 50000 : 25000);

  // Calculate current month's expenses
  const now = new Date();
  const currentMonthTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      if (tx.ledgerId !== currentLedger.id) return false;
      if (tx.type !== 'expense') return false;
      const d = new Date(tx.date);
      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
    });
  }, [transactions, currentLedger.id]);

  const totalSpent = useMemo(() => {
    return currentMonthTransactions.reduce((sum, tx) => sum + tx.amount, 0);
  }, [currentMonthTransactions]);

  const totalRemaining = monthlyTotalBudget - totalSpent;
  const overallBurnPct = Math.min(150, Math.round((totalSpent / monthlyTotalBudget) * 100));

  // Days left in current month
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const daysLeft = Math.max(1, lastDayOfMonth - now.getDate() + 1);
  const dailyAllowance = Math.max(0, Math.round(totalRemaining / daysLeft));

  // Category breakdown list
  const categoryStats = useMemo(() => {
    const expenseByCat: Record<string, number> = {};
    currentMonthTransactions.forEach((tx) => {
      expenseByCat[tx.categoryId] = (expenseByCat[tx.categoryId] || 0) + tx.amount;
    });

    // Pick categories relevant to current ledger
    const relevantCategoryIds = Object.keys(categoryBudgets);

    return relevantCategoryIds.map((catId) => {
      const cat = categories[catId] || {
        id: catId,
        name: catId,
        iconName: 'ReceiptText',
        color: '#F43F5E',
        bgColor: '#FFE4E6',
        type: 'expense',
      };

      const budget = categoryBudgets[catId] || 3000;
      const spent = expenseByCat[catId] || 0;
      const remaining = budget - spent;
      const pct = Math.round((spent / budget) * 100);

      return {
        ...cat,
        budget,
        spent,
        remaining,
        pct,
      };
    }).sort((a, b) => b.spent - a.spent);
  }, [currentMonthTransactions, categoryBudgets]);

  const handleSaveCategoryBudget = (newLimit: number) => {
    if (editingCategory) {
      setCategoryBudgets((prev) => ({
        ...prev,
        [editingCategory.id]: newLimit,
      }));
      setEditingCategory(null);
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* 1. Overall Monthly Budget Card */}
      <div className="bg-gradient-to-br from-[#FB7185] via-[#F43F5E] to-[#E11D48] rounded-4xl p-6 text-white relative overflow-hidden shadow-soft-pink">
        <div className="absolute -right-8 -top-8 w-36 h-36 bg-white/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-pink-950/30 rounded-full blur-2xl pointer-events-none" />

        {/* Card Header */}
        <div className="flex justify-between items-center mb-1">
          <div className="flex items-center space-x-1.5 text-rose-100 text-xs font-semibold">
            <Calendar className="w-3.5 h-3.5 text-rose-200" />
            <span>{now.getMonth() + 1} 月總預算消耗儀表</span>
          </div>

          <button
            onClick={() => setIsEditTotalModalOpen(true)}
            className="p-1 px-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-[11px] font-bold text-white border border-white/20 flex items-center gap-1 transition-all active:scale-95"
          >
            <Pencil className="w-3 h-3" />
            <span>編輯總額</span>
          </button>
        </div>

        {/* Hero Remaining & Budget */}
        <div className="flex items-baseline justify-between my-2">
          <div>
            <div className="text-[11px] text-rose-100 font-medium">剩餘可用預算</div>
            <div className="font-display font-extrabold text-[36px] tracking-tight text-white leading-tight">
              {formatCurrency(totalRemaining)}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[11px] text-rose-100 font-medium">本月總預算</div>
            <div className="font-display font-bold text-lg text-rose-100/90 leading-tight">
              {formatCurrency(monthlyTotalBudget)}
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="bg-black/15 backdrop-blur-sm rounded-2xl p-3 border border-white/15 my-3">
          <div className="w-full bg-white/25 h-3 rounded-full overflow-hidden p-0.5 mb-2 relative">
            <div
              className={`h-full rounded-full transition-all duration-700 shadow-sm ${
                overallBurnPct > 100
                  ? 'bg-amber-300'
                  : overallBurnPct > 80
                  ? 'bg-amber-200'
                  : 'bg-white'
              }`}
              style={{ width: `${Math.min(100, overallBurnPct)}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-xs text-rose-100">
            <span>
              已花費 <strong className="text-white font-bold">{formatCurrency(totalSpent)}</strong>
            </span>
            <span className="text-[11px] text-rose-100 font-bold">
              消耗 {overallBurnPct}%
            </span>
          </div>
        </div>

        {/* Daily Allowance Footer */}
        <div className="grid grid-cols-2 gap-2 text-xs pt-1">
          <div className="bg-white/15 backdrop-blur-md rounded-2xl p-2.5 border border-white/20 text-center">
            <div className="text-[10px] text-rose-100/80 font-medium">本月剩餘天數</div>
            <div className="font-display font-bold text-sm text-white mt-0.5">
              {daysLeft} 天
            </div>
          </div>

          <div className="bg-white/15 backdrop-blur-md rounded-2xl p-2.5 border border-white/20 text-center">
            <div className="text-[10px] text-rose-100/80 font-medium">每日平均可用</div>
            <div className="font-display font-bold text-sm text-white mt-0.5">
              {formatCurrency(dailyAllowance)} / 日
            </div>
          </div>
        </div>
      </div>

      {/* 2. Category Budget Cards List */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="text-sm font-extrabold text-rose-950 font-sans tracking-tight">
              各分類預算明細
            </h2>
            <p className="text-[10px] text-slate-400">點擊分類可自訂單項預算上限</p>
          </div>
          <span className="text-[11px] text-rose-700/60 font-medium">
            共 {categoryStats.length} 個分類
          </span>
        </div>

        <div className="space-y-2.5">
          {categoryStats.map((cat) => {
            const IconComponent = iconMap[cat.iconName] || ReceiptText;
            const isOver = cat.spent > cat.budget;
            const isWarning = !isOver && cat.pct >= 80;

            return (
              <div
                key={cat.id}
                onClick={() =>
                  setEditingCategory({
                    id: cat.id,
                    name: cat.name,
                    limit: cat.budget,
                  })
                }
                className="glass-card rounded-3xl p-3.5 shadow-xs border border-white/80 hover:border-rose-200 transition-all cursor-pointer active:scale-[0.99] group"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    {/* Icon */}
                    <div
                      className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-xs"
                      style={{
                        backgroundColor: cat.bgColor || '#FFE4E6',
                        color: cat.color || '#F43F5E',
                      }}
                    >
                      <IconComponent className="w-5 h-5 stroke-[2]" />
                    </div>

                    {/* Category Title & Status */}
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-extrabold text-rose-950">
                          {cat.name}
                        </span>
                        {isOver ? (
                          <span className="inline-flex items-center space-x-0.5 text-[9px] font-bold text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded-md border border-rose-200">
                            <AlertTriangle className="w-2.5 h-2.5 text-rose-600" />
                            <span>超支 {formatCurrency(cat.spent - cat.budget)}</span>
                          </span>
                        ) : isWarning ? (
                          <span className="text-[9px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-md border border-amber-200">
                            ⚠️ 已達 {cat.pct}%
                          </span>
                        ) : (
                          <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-100">
                            健康 {cat.pct}%
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        預算上限 {formatCurrency(cat.budget)}
                      </p>
                    </div>
                  </div>

                  {/* Spent & Remaining */}
                  <div className="text-right">
                    <div className="font-display font-bold text-xs text-rose-950">
                      已花費 {formatCurrency(cat.spent)}
                    </div>
                    <div
                      className={`text-[10px] font-medium mt-0.5 ${
                        isOver ? 'text-rose-600 font-bold' : 'text-slate-400'
                      }`}
                    >
                      {isOver
                        ? `超支 ${formatCurrency(Math.abs(cat.remaining))}`
                        : `剩餘 ${formatCurrency(cat.remaining)}`}
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-rose-100/70 h-2 rounded-full overflow-hidden p-0.5">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isOver
                        ? 'bg-rose-600'
                        : isWarning
                        ? 'bg-amber-400'
                        : 'bg-gradient-to-r from-rose-400 to-rose-500'
                    }`}
                    style={{ width: `${Math.min(100, cat.pct)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Edit Overall Budget Modal */}
      <EditBudgetModal
        isOpen={isEditTotalModalOpen}
        onClose={() => setIsEditTotalModalOpen(false)}
        title="調整每月總預算"
        subtitle={`設定【${currentLedger.name}】每月支出預算上限`}
        initialAmount={monthlyTotalBudget}
        onSave={(newAmount) => {
          if (onUpdateLedgerBudget) onUpdateLedgerBudget(newAmount);
        }}
        quickPresets={[15000, 25000, 35000, 50000, 80000]}
      />

      {/* Edit Individual Category Budget Modal */}
      {editingCategory && (
        <EditBudgetModal
          isOpen={!!editingCategory}
          onClose={() => setEditingCategory(null)}
          title={`設定【${editingCategory.name}】預算`}
          subtitle="為特定分類獨立控管每月開銷上限"
          initialAmount={editingCategory.limit}
          onSave={handleSaveCategoryBudget}
          quickPresets={[1000, 2000, 3000, 5000, 8000, 12000]}
        />
      )}
    </div>
  );
};
