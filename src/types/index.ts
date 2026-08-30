export type LedgerType = 'personal' | 'shared';

export interface UserProfile {
  id: string;
  name: string;
  avatarUrl?: string;
  email?: string;
  role?: string;
}

export interface Ledger {
  id: string;
  name: string;
  type: LedgerType;
  icon: string;
  color: string;
  description?: string;
  targetAmount?: number; // 結婚基金目標 (例: 600,000)
  currentSavings?: number; // 目前累積存款
  monthlyBudget?: number; // 每月支出預算
  members: UserProfile[];
}

export type TransactionType = 'expense' | 'income' | 'savings_deposit';

export interface Category {
  id: string;
  name: string;
  iconName: string;
  color: string;
  bgColor: string;
  type: TransactionType;
}

export interface Transaction {
  id: string;
  ledgerId: string;
  userId: string;
  user: UserProfile;
  amount: number;
  type: TransactionType;
  categoryId: string;
  category: Category;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  note: string;
}

export interface SpendingDayTrend {
  day: string; // e.g. "08/24", "週一"
  date: string;
  amount: number;
}
