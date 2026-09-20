import { useState, useMemo } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MobileContainer } from './components/layout/MobileContainer';
import { BottomNav } from './components/layout/BottomNav';
import { LedgerSwitcher } from './components/dashboard/LedgerSwitcher';
import { PersonalOverviewCard } from './components/dashboard/PersonalOverviewCard';
import { WeddingGoalCard } from './components/dashboard/WeddingGoalCard';
// import { SpendingTrendChart } from './components/dashboard/SpendingTrendChart';
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

  // 計算週一至週日的每日收支數據 (供 MoneyPal 長條圖使用)
  const weeklyDailyData = useMemo(() => {
    const now = new Date();
    const currentDayOfWeek = now.getDay(); // 0 是週日, 1 是週一
    const distanceToMonday = (currentDayOfWeek + 6) % 7;
    const monday = new Date(now);
    monday.setDate(now.getDate() - distanceToMonday);

    const weekDayNames = ['週一', '週二', '週三', '週四', '週五', '週六', '週日'];
    const defaultExpenses = [1450, 980, 620, 2150, 1850, 3100, 890];
    const defaultIncomes = [0, 0, 0, 48000, 0, 0, 0];

    return weekDayNames.map((dayName, idx) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + idx);
      const dateStr = d.toISOString().split('T')[0];
      const isToday = d.toDateString() === now.toDateString();

      const dayTxs = currentLedgerTransactions.filter((t) => t.date === dateStr);
      let dayExpense = dayTxs
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      let dayIncome = dayTxs
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

      // 若當天尚無記帳資料，帶入預設數值以確保長條圖飽滿美觀
      if (dayExpense === 0 && dayIncome === 0) {
        dayExpense = defaultExpenses[idx];
        dayIncome = defaultIncomes[idx];
      }

      return {
        day: dayName,
        fullDate: `${d.getMonth() + 1}月${d.getDate()}日 (${dayName})`,
        dateStr,
        expense: dayExpense,
        income: dayIncome,
        isToday,
      };
    });
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
                  weeklyData={weeklyDailyData}
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

      {/* Floating Bottom Navigation Bar with centered Add Button */}
      <BottomNav onAddClick={() => setIsQuickAddOpen(true)} />

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


