import React, { useState } from 'react';
import { ArrowLeft, Calendar as CalendarIcon } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DepositGoalDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  goalTitle: string;
  onDeposit: (amount: number, date: string, note: string) => void;
}

export const DepositGoalDrawer: React.FC<DepositGoalDrawerProps> = ({
  isOpen,
  onClose,
  goalTitle,
  onDeposit,
}) => {
  if (!isOpen) return null;

  const todayStr = new Date().toISOString().split('T')[0];

  const [amount, setAmount] = useState<string>('');
  const [date, setDate] = useState<string>(todayStr);
  const [note, setNote] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) return;

    onDeposit(numAmount, date, note.trim() || `${goalTitle} 存入`);

    // Confetti celebration
    confetti({
      particleCount: 75,
      spread: 70,
      origin: { y: 0.65 },
      colors: ['#FB7185', '#F43F5E', '#EC4899', '#FFE4E6', '#F59E0B'],
    });

    // Reset and close
    setAmount('');
    setNote('');
    setDate(todayStr);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center font-sans">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Sheet matching the screenshot layout */}
      <div className="w-full max-w-[430px] bg-white rounded-t-3xl shadow-2xl z-10 border-t border-slate-100 max-h-[92vh] overflow-y-auto animate-in slide-in-from-bottom duration-300 flex flex-col">
        {/* Navigation Bar: ArrowLeft on left, centered title */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="p-1 -ml-1 text-slate-800 hover:text-rose-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-base font-semibold text-slate-900 tracking-tight">
            新增目標金額
          </h2>
          <div className="w-5" />
        </div>

        {/* Form Body matching screenshot fields */}
        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">
          {/* 1. Amount */}
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5">
              金額
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400">
                $
              </span>
              <input
                type="number"
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                autoFocus
                required
                className="w-full bg-white border border-slate-200 rounded-xl pl-8 pr-4 py-3 text-sm text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-100 transition-all"
              />
            </div>
          </div>

          {/* 2. Date */}
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5">
              日期
            </label>
            <div className="relative">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-100 transition-all cursor-pointer"
              />
              <CalendarIcon className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* 3. Note */}
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5">
              備註
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="例如：Breakfast、薪水存入"
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-100 transition-all"
            />
          </div>

          {/* Submit Action */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={!amount || parseFloat(amount) <= 0}
              className="w-full bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 px-4 rounded-xl text-sm shadow-glow-pink active:scale-98 transition-all flex items-center justify-center gap-1.5"
            >
              <span>確認存入</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
