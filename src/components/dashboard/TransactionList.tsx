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
              {/* Date Header & Subtotal */}
              <div className="flex justify-between items-baseline text-xs text-slate-400 font-semibold px-1 mb-2">
                <span className="lowercase">{isToday ? 'today' : formatDateDisplay(date)}</span>
                {dayTotalExpense > 0 && (
                  <span className="font-display font-semibold text-slate-500">
                    -{formatCurrency(dayTotalExpense)}
                  </span>
                )}
              </div>

              {/* MONOX-style Independent Rounded White Cards */}
              <div className="space-y-2.5">
                {items.map((tx) => {
                  const emoji = categoryEmojiMap[tx.category?.id];
                  const IconComponent = iconMap[tx.category?.iconName] || ReceiptText;
                  const isExpense = tx.type === 'expense';
                  const isDeposit = tx.type === 'savings_deposit';

                  return (
                    <div
                      key={tx.id}
                      className="bg-white rounded-2xl p-3.5 px-4 border border-slate-100/90 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.04)] flex items-center justify-between transition-all duration-150 active:scale-[0.985] cursor-pointer"
                    >
                      {/* Left: Icon Container (Squircle) & Title/Subtitle */}
                      <div className="flex items-center space-x-3.5 overflow-hidden">
                        <div className="w-11 h-11 rounded-2xl bg-slate-50/90 border border-slate-100 flex items-center justify-center shrink-0 text-xl select-none shadow-2xs">
                          {emoji ? (
                            <span>{emoji}</span>
                          ) : (
                            <div
                              className="w-full h-full rounded-2xl flex items-center justify-center"
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
                          <div className="text-[15px] font-bold text-slate-900 truncate leading-snug">
                            {tx.category?.name || tx.note}
                          </div>
                          <div className="flex items-center space-x-1.5 mt-0.5">
                            <span className="text-xs text-slate-400 font-normal truncate">
                              {tx.note ? tx.note : tx.category.name}
                            </span>
                            {isSharedLedger && (
                              <span className="inline-flex items-center text-[10px] font-medium text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full">
                                {tx.user.name.split(' ')[0]}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right: Clean & Bold Amount Display */}
                      <div className="text-right shrink-0 pl-3">
                        <div
                          className={`font-display font-bold text-base leading-tight tracking-tight ${
                            isExpense
                              ? 'text-slate-900'
                              : isDeposit
                              ? 'text-pink-600 font-extrabold'
                              : 'text-emerald-600 font-extrabold'
                          }`}
                        >
                          {isExpense ? '-' : '+'}
                          {formatCurrency(tx.amount)}
                        </div>
                        {isDeposit && (
                          <div className="text-[10px] font-bold text-pink-500 mt-0.5">
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

