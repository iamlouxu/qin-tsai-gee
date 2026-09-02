import React, { useState, useEffect } from 'react';
import { X, DollarSign, Check, Sparkles } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

interface EditBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  initialAmount: number;
  onSave: (amount: number) => void;
  quickPresets?: number[];
}

export const EditBudgetModal: React.FC<EditBudgetModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  initialAmount,
  onSave,
  quickPresets = [10000, 20000, 30000, 50000, 80000],
}) => {
  const [amount, setAmount] = useState<string>(String(initialAmount));

  useEffect(() => {
    setAmount(String(initialAmount));
  }, [initialAmount, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (!isNaN(num) && num >= 0) {
      onSave(num);
      onClose();
    }
  };

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
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-rose-950">{title}</h3>
            <p className="text-xs text-rose-800/60">{subtitle || '設定預算上限以避免超支'}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Amount Input */}
          <div>
            <label className="block text-xs font-bold text-rose-900 mb-1.5">
              月度預算金額 (NT$)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-display font-bold text-rose-400 text-sm">
                $
              </span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="25000"
                className="w-full pl-8 pr-3.5 py-2.5 bg-rose-50/50 border border-rose-200/80 rounded-2xl text-base font-display font-extrabold text-rose-950 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white transition-all"
                autoFocus
              />
            </div>
          </div>

          {/* Quick Preset Buttons */}
          {quickPresets.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold text-rose-800/70 mb-1.5 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-rose-400" />
                <span>推薦預算額度</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {quickPresets.map((preset) => (
                  <button
                    type="button"
                    key={preset}
                    onClick={() => setAmount(String(preset))}
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-all ${
                      amount === String(preset)
                        ? 'bg-rose-500 text-white border-rose-500 shadow-xs'
                        : 'bg-white text-rose-800 border-rose-200 hover:bg-rose-50'
                    }`}
                  >
                    {formatCurrency(preset)}
                  </button>
                ))}
              </div>
            </div>
          )}

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
              <span>確認儲存</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
