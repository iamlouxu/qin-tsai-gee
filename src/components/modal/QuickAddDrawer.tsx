import React, { useState } from 'react';
import { X, Calendar as CalendarIcon, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { categories, currentUser, partnerUser } from '../../data/mockData';
import { Ledger, Transaction, TransactionType } from '../../types';

interface QuickAddDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentLedger: Ledger;
  onAddTransaction: (transaction: Transaction) => void;
}

export const QuickAddDrawer: React.FC<QuickAddDrawerProps> = ({
  isOpen,
  onClose,
  currentLedger,
  onAddTransaction,
}) => {
  if (!isOpen) return null;

  const todayStr = new Date().toISOString().split('T')[0];
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  const [type, setType] = useState<TransactionType>(
    currentLedger.type === 'shared' ? 'savings_deposit' : 'expense'
  );
  const [amount, setAmount] = useState<string>('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(
    currentLedger.type === 'shared' ? 'deposit_fund' : 'food'
  );
  const [date, setDate] = useState<string>(todayStr);
  const [note, setNote] = useState<string>('');
  const [selectedUserId, setSelectedUserId] = useState<string>(currentUser.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) return;

    const category = categories[selectedCategoryId] || categories.food;
    const user = selectedUserId === partnerUser.id ? partnerUser : currentUser;

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;

    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      ledgerId: currentLedger.id,
      userId: user.id,
      user,
      amount: numAmount,
      type,
      categoryId: category.id,
      category,
      date,
      time: timeStr,
      note: note.trim() || category.name,
    };

    onAddTransaction(newTx);

    if (type === 'savings_deposit') {
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FB7185', '#F43F5E', '#EC4899', '#F59E0B'],
      });
    }

    onClose();
  };

  const availableCategories = Object.values(categories).filter((cat) => {
    if (type === 'savings_deposit') return cat.type === 'savings_deposit';
    if (type === 'income') return cat.type === 'income';
    return cat.type === 'expense';
  });

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-rose-950/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Card */}
      <div className="w-full max-w-[430px] bg-white rounded-t-4xl p-6 shadow-2xl z-10 border-t border-rose-100 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
        {/* Drag Handle Bar */}
        <div className="w-12 h-1.5 bg-rose-200 rounded-full mx-auto mb-4" />

        {/* Drawer Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-base font-bold text-rose-950">快速記一筆</span>
            <span className="text-[11px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
              {currentLedger.name}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-rose-100 hover:text-rose-600 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type Segment Control */}
          <div className="grid grid-cols-3 gap-1 bg-rose-50/80 p-1 rounded-2xl border border-rose-100/70">
            <button
              type="button"
              onClick={() => {
                setType('expense');
                setSelectedCategoryId('food');
              }}
              className={`py-1.5 rounded-xl text-xs font-bold transition-all ${
                type === 'expense'
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-rose-600'
              }`}
            >
              💸 支出
            </button>
            <button
              type="button"
              onClick={() => {
                setType('savings_deposit');
                setSelectedCategoryId('deposit_fund');
              }}
              className={`py-1.5 rounded-xl text-xs font-bold transition-all ${
                type === 'savings_deposit'
                  ? 'bg-pink-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-rose-600'
              }`}
            >
              💍 存入基金
            </button>
            <button
              type="button"
              onClick={() => {
                setType('income');
                setSelectedCategoryId('salary');
              }}
              className={`py-1.5 rounded-xl text-xs font-bold transition-all ${
                type === 'income'
                  ? 'bg-emerald-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-rose-600'
              }`}
            >
              💰 收入
            </button>
          </div>

          {/* Amount Display & Input */}
          <div className="bg-rose-50/50 rounded-3xl p-4 border border-rose-100 text-center">
            <div className="text-[11px] font-bold text-rose-900/60 uppercase">
              輸入金額 (NT$)
            </div>
            <div className="flex items-center justify-center mt-1 space-x-1">
              <span className="text-2xl font-bold text-rose-500">$</span>
              <input
                type="number"
                step="any"
                inputMode="decimal"
                required
                placeholder="0"
                autoFocus
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-48 text-center text-3xl font-display font-extrabold text-rose-950 bg-transparent outline-none focus:ring-0 placeholder-rose-200"
              />
            </div>
          </div>

          {/* Custom Date Selection: Today / Yesterday / Calendar Picker */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">
              📅 記帳日期（可自訂）
            </label>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setDate(todayStr)}
                className={`py-1.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                  date === todayStr
                    ? 'bg-rose-500 text-white border-rose-500 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                今天
              </button>
              <button
                type="button"
                onClick={() => setDate(yesterdayStr)}
                className={`py-1.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                  date === yesterdayStr
                    ? 'bg-rose-500 text-white border-rose-500 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                昨天
              </button>
              {/* Date Input */}
              <div className="flex-1 relative">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-1.5 px-2.5 text-xs font-bold text-slate-800 outline-none focus:border-rose-400"
                />
                <CalendarIcon className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Shared Ledger: Select Member */}
          {currentLedger.type === 'shared' && (
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                👤 記錄者
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedUserId(currentUser.id)}
                  className={`py-1.5 px-3 rounded-xl text-xs font-bold border flex items-center justify-center space-x-1.5 transition-all ${
                    selectedUserId === currentUser.id
                      ? 'bg-rose-50 text-rose-800 border-rose-400'
                      : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}
                >
                  <span>👦 培捷</span>
                  {selectedUserId === currentUser.id && <Check className="w-3.5 h-3.5 text-rose-600 stroke-[3]" />}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedUserId(partnerUser.id)}
                  className={`py-1.5 px-3 rounded-xl text-xs font-bold border flex items-center justify-center space-x-1.5 transition-all ${
                    selectedUserId === partnerUser.id
                      ? 'bg-pink-50 text-pink-800 border-pink-400'
                      : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}
                >
                  <span>👧 婷婷</span>
                  {selectedUserId === partnerUser.id && <Check className="w-3.5 h-3.5 text-pink-600 stroke-[3]" />}
                </button>
              </div>
            </div>
          )}

          {/* Category Grid */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">
              🏷️ 選擇分類
            </label>
            <div className="grid grid-cols-4 gap-2">
              {availableCategories.map((cat) => {
                const isSelected = selectedCategoryId === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategoryId(cat.id)}
                    className={`flex flex-col items-center justify-center py-2 px-1 rounded-2xl border transition-all ${
                      isSelected
                        ? 'bg-rose-100/70 border-rose-400 text-rose-900 shadow-xs'
                        : 'bg-slate-50/80 border-slate-100 text-slate-600 hover:bg-rose-50/50'
                    }`}
                  >
                    <span className="text-xs font-bold">{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Note Input */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">
              📝 商家或備註（選填）
            </label>
            <input
              type="text"
              placeholder="例：買菜、婚禮訂金、晚餐..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-800 outline-none focus:border-rose-400"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-rose-500 via-rose-600 to-pink-600 text-white font-bold py-3.5 px-4 rounded-2xl shadow-glow-pink hover:opacity-95 active:scale-98 transition-all duration-150 text-sm flex items-center justify-center space-x-1.5 mt-2"
          >
            <span>確認記帳 ✨</span>
          </button>
        </form>
      </div>
    </div>
  );
};
