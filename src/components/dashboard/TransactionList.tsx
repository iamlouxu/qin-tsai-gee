import React from 'react';
import {
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
import { Transaction } from '../../types';
import { formatCurrency, formatDateDisplay } from '../../utils/formatters';

interface TransactionListProps {
  transactions: Transaction[];
  isSharedLedger: boolean;
}

// Icon Mapping
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

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  isSharedLedger,
}) => {
  // Group transactions by date
  const groupedTransactions: Record<string, Transaction[]> = transactions.reduce(
    (acc, tx) => {
      if (!acc[tx.date]) {
        acc[tx.date] = [];
      }
      acc[tx.date].push(tx);
      return acc;
    },
    {} as Record<string, Transaction[]>
  );

  const dates = Object.keys(groupedTransactions).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <div className="space-y-4 mb-8">
      <div className="flex justify-between items-center px-1">
        <h2 className="text-sm font-bold text-rose-950 font-sans tracking-tight">
          近期收支明細
        </h2>
        <span className="text-xs text-rose-600/80 font-semibold cursor-pointer hover:text-rose-700">
          查看全部
        </span>
      </div>

      {dates.length === 0 ? (
        <div className="glass-card rounded-3xl p-8 text-center text-slate-400">
          <ReceiptText className="w-10 h-10 mx-auto mb-2 text-rose-300 stroke-[1.5]" />
          <p className="text-xs font-medium">目前尚無收支記錄，點擊右下角 ➕ 開始記帳吧！</p>
        </div>
      ) : (
        dates.map((date) => {
          const items = groupedTransactions[date];
          return (
            <div key={date} className="space-y-2">
              {/* Date Header Pill */}
              <div className="text-[11px] font-bold text-rose-800/70 px-2 uppercase tracking-wide">
                {formatDateDisplay(date)}
              </div>

              {/* Transactions in Date */}
              <div className="glass-card rounded-3xl p-2.5 space-y-1 divide-y divide-rose-100/50">
                {items.map((tx) => {
                  const IconComponent = iconMap[tx.category?.iconName] || ReceiptText;
                  const isExpense = tx.type === 'expense';
                  const isDeposit = tx.type === 'savings_deposit';

                  return (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between p-2 hover:bg-rose-50/50 rounded-2xl transition-colors"
                    >
                      {/* Left: Icon & Title */}
                      <div className="flex items-center space-x-3 overflow-hidden">
                        <div
                          className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-xs"
                          style={{
                            backgroundColor: tx.category?.bgColor || '#FFE4E6',
                            color: tx.category?.color || '#F43F5E',
                          }}
                        >
                          <IconComponent className="w-5 h-5 stroke-[2]" />
                        </div>
                        <div className="truncate">
                          <div className="text-xs font-bold text-rose-950 truncate leading-tight">
                            {tx.note || tx.category.name}
                          </div>
                          <div className="flex items-center space-x-1.5 mt-0.5">
                            <span className="text-[10px] text-slate-400 font-medium">
                              {tx.category.name} · {tx.time}
                            </span>
                            {isSharedLedger && (
                              <span className="inline-flex items-center gap-0.5 text-[9px] font-bold bg-rose-100/70 text-rose-700 px-1.5 py-0.2 rounded-md">
                                👤 {tx.user.name.split(' ')[0]}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right: Amount */}
                      <div className="text-right shrink-0 pl-2">
                        <div
                          className={`font-display font-bold text-sm leading-tight ${
                            isExpense
                              ? 'text-rose-600'
                              : isDeposit
                              ? 'text-pink-600 font-extrabold'
                              : 'text-emerald-600'
                          }`}
                        >
                          {isExpense ? '-' : '+'} {formatCurrency(tx.amount)}
                        </div>
                        {isDeposit && (
                          <div className="text-[9px] font-bold text-pink-500">
                            💍 存入基金
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};
