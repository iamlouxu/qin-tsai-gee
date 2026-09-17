import { useState, useMemo } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MobileContainer } from './components/layout/MobileContainer';
import { BottomNav } from './components/layout/BottomNav';
import { FloatingAddButton } from './components/layout/FloatingAddButton';
import { LedgerSwitcher } from './components/dashboard/LedgerSwitcher';
import { PersonalOverviewCard } from './components/dashboard/PersonalOverviewCard';
import { WeddingGoalCard } from './components/dashboard/WeddingGoalCard';
import { SpendingTrendChart } from './components/dashboard/SpendingTrendChart';
import { TransactionList } from './components/dashboard/TransactionList';
import { QuickAddDrawer } from './components/modal/QuickAddDrawer';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { GoalsView } from './components/goals/GoalsView';
import { initialLedgers, initialTransactions, currentUser } from './data/mockData';
import { Ledger, Transaction } from './types';

// App 根元件：負責全域狀態管理與路由配置
export function App() {
  const [ledgers, setLedgers] = useState<Ledger[]>(initialLedgers);
  // Default to Personal Ledger as requested by user
  const [currentLedger, setCurrentLedger] = useState<Ledger>(initialLedgers[0]);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  // Filter transactions for current ledger
  const currentLedgerTransactions = useMemo(() => {
    return transactions.filter((t) => t.ledgerId === currentLedger.id);
  }, [transactions, currentLedger.id]);

  // Compute Personal Ledger Stats
  const personalStats = useMemo(() => {
    let expense = 0;
    let income = 0;

    currentLedgerTransactions.forEach((t) => {
      if (t.type === 'expense') expense += t.amount;
      if (t.type === 'income') income += t.amount;
    });

    const balance = income - expense;
    return {
      balance,
      totalExpense: expense,
      totalIncome: income,
      monthlyBudget: currentLedger.monthlyBudget || 25000,
      savingsTarget: currentLedger.targetAmount || 100000,
      currentSavings: currentLedger.currentSavings || (balance > 0 ? balance : 35000),
    };
  }, [currentLedgerTransactions, currentLedger.monthlyBudget, currentLedger.targetAmount, currentLedger.currentSavings]);

  // Compute Wedding Fund Stats
  const weddingStats = useMemo(() => {
    let userContrib = 0;
    let partnerContrib = 0;
    let extraDeposits = 0;

    currentLedgerTransactions.forEach((t) => {
      if (t.type === 'savings_deposit' || t.type === 'income') {
        if (t.userId === currentUser.id) {
          userContrib += t.amount;
        } else {
          partnerContrib += t.amount;
        }
      }
    });

    const currentSavings =
      (currentLedger.currentSavings || 385000) + userContrib + partnerContrib + extraDeposits;

    return {
      targetAmount: currentLedger.targetAmount || 600000,
      currentSavings,
      userContribution: 210000 + userContrib,
      partnerContribution: 175000 + partnerContrib,
    };
  }, [currentLedgerTransactions, currentLedger.targetAmount, currentLedger.currentSavings]);

  // Compute 7-day trend chart data
  const trendData = useMemo(() => {
    const days: { day: string; amount: number; fullDate: string }[] = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const weekdayNames = ['日', '一', '二', '三', '四', '五', '六'];
      const dayLabel = i === 0 ? '今天' : i === 1 ? '昨天' : `週${weekdayNames[d.getDay()]}`;

      const dayExpense = currentLedgerTransactions
        .filter((t) => t.date === dateStr && t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      days.push({
        day: dayLabel,
        amount: dayExpense,
        fullDate: `${d.getMonth() + 1}月${d.getDate()}日 (${dayLabel})`,
      });
    }

    const totalWeekly = days.reduce((sum, d) => sum + d.amount, 0);
    return { days, totalWeekly };
  }, [currentLedgerTransactions]);

  const handleAddTransaction = (newTx: Transaction) => {
    setTransactions((prev) => [newTx, ...prev]);
  };

  const handleUpdateLedgerTarget = (newTarget: number) => {
    const updated = { ...currentLedger, targetAmount: newTarget };
    setCurrentLedger(updated);
    setLedgers((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
  };

  const handleUpdateLedgerBudget = (newBudget: number) => {
    const updated = { ...currentLedger, monthlyBudget: newBudget };
    setCurrentLedger(updated);
    setLedgers((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
  };

  return (
    <MobileContainer>
      <Routes>
        {/* 1. Home / Dashboard Route */}
        <Route
          path="/"
          element={
            <>
              {/* Header with Ledger Switcher */}
              <LedgerSwitcher
                ledgers={ledgers}
                currentLedger={currentLedger}
                onSelectLedger={setCurrentLedger}
              />

              {/* Hero Card: Dynamic switch based on ledger type */}
              {currentLedger.type === 'personal' ? (
                <PersonalOverviewCard
                  balance={personalStats.balance}
                  totalExpense={personalStats.totalExpense}
                  totalIncome={personalStats.totalIncome}
                  monthlyBudget={personalStats.monthlyBudget}
                />
              ) : (
                <WeddingGoalCard
                  targetAmount={weddingStats.targetAmount}
                  currentSavings={weddingStats.currentSavings}
                  userContribution={weddingStats.userContribution}
                  partnerContribution={weddingStats.partnerContribution}
                  onQuickDepositClick={() => setIsQuickAddOpen(true)}
                />
              )}

              {/* Spending Trend Chart (Mibu Minimalist Curve) */}
              <SpendingTrendChart
                data={trendData.days}
                totalWeekly={trendData.totalWeekly}
              />

              {/* Recent Transaction Feed */}
              <TransactionList
                transactions={currentLedgerTransactions}
                isSharedLedger={currentLedger.type === 'shared'}
              />
            </>
          }
        />

        {/* 2. Analytics Route */}
        <Route
          path="/analytics"
          element={
            <>
              <LedgerSwitcher
                ledgers={ledgers}
                currentLedger={currentLedger}
                onSelectLedger={setCurrentLedger}
              />
              <AnalyticsView
                currentLedger={currentLedger}
                transactions={transactions}
              />
            </>
          }
        />

        {/* 3. Goals & Budget Route */}
        <Route
          path="/goals"
          element={
            <>
              <LedgerSwitcher
                ledgers={ledgers}
                currentLedger={currentLedger}
                onSelectLedger={setCurrentLedger}
              />
              <GoalsView
                currentLedger={currentLedger}
                transactions={transactions}
                currentSavings={
                  currentLedger.type === 'shared'
                    ? weddingStats.currentSavings
                    : personalStats.currentSavings
                }
                userContribution={
                  currentLedger.type === 'shared'
                    ? weddingStats.userContribution
                    : personalStats.currentSavings
                }
                partnerContribution={
                  currentLedger.type === 'shared'
                    ? weddingStats.partnerContribution
                    : 0
                }
                onQuickDepositClick={() => setIsQuickAddOpen(true)}
                onUpdateLedgerTarget={handleUpdateLedgerTarget}
                onUpdateLedgerBudget={handleUpdateLedgerBudget}
              />
            </>
          }
        />

        {/* Fallback to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Right-Floating Quick Add FAB Button */}
      <FloatingAddButton onClick={() => setIsQuickAddOpen(true)} />

      {/* Floating Bottom Navigation Bar (Uses React Router) */}
      <BottomNav />

      {/* Quick Add Drawer Modal */}
      <QuickAddDrawer
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        currentLedger={currentLedger}
        onAddTransaction={handleAddTransaction}
      />
    </MobileContainer>
  );
}

export default App;


