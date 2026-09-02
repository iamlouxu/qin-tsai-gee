import React, { useState } from 'react';
import { X, Target, Sparkles, Check } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

interface EditGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTarget: number;
  initialTitle: string;
  onSave: (target: number, title: string) => void;
}

export const EditGoalModal: React.FC<EditGoalModalProps> = ({
  isOpen,
  onClose,
  initialTarget,
  initialTitle,
  onSave,
}) => {
  const [targetAmount, setTargetAmount] = useState<string>(String(initialTarget));
  const [title, setTitle] = useState<string>(initialTitle);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(targetAmount);
    if (!isNaN(num) && num > 0) {
      onSave(num, title.trim() || initialTitle);
      onClose();
    }
  };

  const quickPresets = [300000, 500000, 600000, 800000, 1000000];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl border border-rose-100 relative animate-scale-up">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-2.5 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-rose-950">設定存錢目標</h3>
            <p className="text-xs text-rose-800/60">調整夢想基金目標總金額與名稱</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Goal Name Input */}
          <div>
            <label className="block text-xs font-bold text-rose-900 mb-1.5">
              目標名稱
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例如：我們的結婚基金 💍"
              className="w-full px-3.5 py-2.5 bg-rose-50/50 border border-rose-200/80 rounded-2xl text-xs font-bold text-rose-950 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white transition-all"
            />
          </div>

          {/* Goal Target Amount Input */}
          <div>
            <label className="block text-xs font-bold text-rose-900 mb-1.5">
              目標金額 (NT$)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-display font-bold text-rose-400 text-sm">
                $
              </span>
              <input
                type="number"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                placeholder="600000"
                className="w-full pl-8 pr-3.5 py-2.5 bg-rose-50/50 border border-rose-200/80 rounded-2xl text-base font-display font-extrabold text-rose-950 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Quick Preset Buttons */}
          <div>
            <div className="text-[11px] font-semibold text-rose-800/70 mb-1.5 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-rose-400" />
              <span>快速選擇金額</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {quickPresets.map((amt) => (
                <button
                  type="button"
                  key={amt}
                  onClick={() => setTargetAmount(String(amt))}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-all ${
                    targetAmount === String(amt)
                      ? 'bg-rose-500 text-white border-rose-500 shadow-xs'
                      : 'bg-white text-rose-800 border-rose-200 hover:bg-rose-50'
                  }`}
                >
                  {formatCurrency(amt)}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-2xl text-xs font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-2xl text-xs font-bold text-white bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 shadow-soft-pink flex items-center justify-center space-x-1 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>儲存目標</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
