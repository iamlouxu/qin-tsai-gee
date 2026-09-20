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

// Cute high-res emojis matching the reference design screenshot
const categoryEmojiMap: Record<string, string> = {
  food: '🍜',
  drink: '☕',
  transport: '🚕',
  shopping: '🛍️',
  entertainment: '🎬',
  wedding_venue: '💒',
  photography: '📸',
  honeymoon: '✈️',
  engagement: '💍',
  salary: '💰',
  bonus: '✨',
  pet: '🐶',
  repair: '🛠️',
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
    <div className="space-y-6 mb-10 px-1">
      {dates.length === 0 ? (
        <div className="py-12 text-center text-slate-400">
          <ReceiptText className="w-10 h-10 mx-auto mb-2 text-rose-300 stroke-[1.5]" />
          <p className="text-xs font-medium">目前尚無收支記錄，點擊下方 ➕ 開始記帳！</p>
        </div>
      ) : (
        dates.map((date, index) => {
          const items = groupedTransactions[date];
          const isToday = index === 0;
          const dayTotalExpense = items
            .filter((t) => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

          return (
            <div key={date} className="space-y-1">
              {/* Date Header & Subtotal matching screenshot: "today   -$308.89" */}
              <div className="flex justify-between items-baseline text-xs text-slate-400 font-medium px-1">
                <span className="lowercase">{isToday ? 'today' : formatDateDisplay(date)}</span>
                {dayTotalExpense > 0 && (
                  <span className="font-display font-medium text-slate-500">
                    -{formatCurrency(dayTotalExpense)}
                  </span>
                )}
              </div>

              {/* Clean Thin Divider Line under date */}
              <div className="w-full border-b border-slate-200/90 pt-0.5 pb-1 mb-2" />

              {/* Unboxed Clean Rows without thick cards */}
              <div className="space-y-1">
                {items.map((tx) => {
                  const emoji = categoryEmojiMap[tx.category?.id];
                  const IconComponent = iconMap[tx.category?.iconName] || ReceiptText;
                  const isExpense = tx.type === 'expense';
                  const isDeposit = tx.type === 'savings_deposit';

                  return (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between py-2 px-1 hover:bg-white/50 rounded-2xl transition-all duration-150 active:scale-[0.985] cursor-pointer"
                    >
                      {/* Left: Icon/Emoji & Title/Subtitle */}
                      <div className="flex items-center space-x-3.5 overflow-hidden">
                        <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 text-2xl select-none">
                          {emoji ? (
                            <span>{emoji}</span>
                          ) : (
                            <div
                              className="w-9 h-9 rounded-xl flex items-center justify-center shadow-2xs"
                              style={{
                                backgroundColor: tx.category?.bgColor || '#FFE4E6',
                                color: tx.category?.color || '#F43F5E',
                              }}
                            >
                              <IconComponent className="w-5 h-5 stroke-[2]" />
                            </div>
                          )}
                        </div>

                        <div className="truncate">
                          <div className="text-[15px] font-bold text-slate-900 truncate leading-tight">
                            {tx.category?.name || tx.note}
                          </div>
                          <div className="flex items-center space-x-1.5 mt-0.5">
                            <span className="text-xs text-slate-400 font-normal truncate">
                              {tx.note ? tx.note : tx.category.name}
                            </span>
                            {isSharedLedger && (
                              <span className="inline-flex items-center text-[9px] font-medium text-slate-400 bg-slate-100 px-1 py-0.2 rounded">
                                {tx.user.name.split(' ')[0]}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right: Clean Amount Display matching screenshot */}
                      <div className="text-right shrink-0 pl-3">
                        <div
                          className={`font-display font-bold text-[15px] leading-tight tracking-tight ${
                            isExpense
                              ? 'text-slate-900'
                              : isDeposit
                              ? 'text-pink-600 font-extrabold'
                              : 'text-emerald-600'
                          }`}
                        >
                          {isExpense ? '-' : '+'}
                          {formatCurrency(tx.amount)}
                        </div>
                        {isDeposit && (
                          <div className="text-[9px] font-bold text-pink-500 mt-0.5">
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

