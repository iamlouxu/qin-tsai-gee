import React from 'react';
import { Heart, Sparkles, PlusCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatCurrency, formatNumber } from '../../utils/formatters';

interface WeddingGoalCardProps {
  targetAmount: number;
  currentSavings: number;
  userContribution: number;
  partnerContribution: number;
  onQuickDepositClick?: () => void;
}

export const WeddingGoalCard: React.FC<WeddingGoalCardProps> = ({
  targetAmount,
  currentSavings,
  userContribution,
  partnerContribution,
  onQuickDepositClick,
}) => {
  const percent = Math.min(100, Math.round((currentSavings / targetAmount) * 1000) / 10);
  const remaining = Math.max(0, targetAmount - currentSavings);

  const handleCelebrate = () => {
    confetti({
      particleCount: 55,
      spread: 65,
      origin: { y: 0.7 },
      colors: ['#FB7185', '#F43F5E', '#EC4899', '#FFE4E6', '#F59E0B'],
    });
    if (onQuickDepositClick) onQuickDepositClick();
  };

  return (
    <div className="pink-gradient-card rounded-3xl p-5 text-white relative overflow-hidden mb-5 border border-white/30 shadow-[0_14px_34px_-6px_rgba(244,63,94,0.38)]">
      {/* Top Header */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center space-x-1.5 text-rose-100 text-xs font-medium">
          <Heart className="w-3.5 h-3.5 fill-rose-200 text-rose-200" />
          <span>2027 幸福結婚基金</span>
        </div>
        <div className="bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[11px] font-bold text-white border border-white/30 flex items-center gap-1 shadow-xs">
          <Sparkles className="w-3 h-3 text-amber-200 fill-amber-200" />
          <span>達成率 {percent}%</span>
        </div>
      </div>

      {/* Hero Numbers with Clear Typographic Hierarchy */}
      <div className="flex items-baseline justify-between mb-4">
        <div>
          <div className="text-xs text-rose-100/90 font-medium">目前已累積</div>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-base font-bold text-rose-100/90 font-display">NT$</span>
            <span className="font-display font-extrabold text-[38px] tracking-tight text-white leading-none">
              {formatNumber(currentSavings)}
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[11px] text-rose-100/80 font-medium">目標金額</div>
          <div className="font-display font-bold text-base text-rose-100 mt-1">
            {formatCurrency(targetAmount)}
          </div>
        </div>
      </div>

      {/* Main Target Progress Bar */}
      <div className="bg-black/15 backdrop-blur-md rounded-2xl p-3 border border-white/15 mb-3.5">
        <div className="w-full bg-black/20 h-2.5 rounded-full overflow-hidden p-[1px] mb-2">
          <div
            className="bg-gradient-to-r from-amber-200 via-rose-100 to-white h-full rounded-full transition-all duration-700 shadow-xs"
            style={{ width: `${percent}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-xs text-rose-100">
          <span className="font-medium">
            距目標還差 <strong className="text-white font-bold">{formatCurrency(remaining)}</strong>
          </span>
          <span className="text-[11px] text-rose-200/90 font-medium">已存 {formatNumber(currentSavings)} 元</span>
        </div>
      </div>

      {/* Couple Contribution Breakdown Grid */}
      <div className="grid grid-cols-2 gap-2.5 mb-3.5">
        {/* User Card */}
        <div className="bg-white/15 backdrop-blur-md rounded-2xl p-2.5 border border-white/20 flex items-center space-x-2.5 transition-transform active:scale-[0.98]">
          <div className="w-8 h-8 rounded-full bg-rose-200/30 flex items-center justify-center text-sm font-bold border border-white/30 shrink-0">
            👦
          </div>
          <div className="overflow-hidden">
            <div className="text-[11px] text-rose-100 truncate font-medium">培捷已存入</div>
            <div className="font-display font-bold text-sm text-white truncate">
              {formatCurrency(userContribution)}
            </div>
          </div>
        </div>

        {/* Partner Card */}
        <div className="bg-white/15 backdrop-blur-md rounded-2xl p-2.5 border border-white/20 flex items-center space-x-2.5 transition-transform active:scale-[0.98]">
          <div className="w-8 h-8 rounded-full bg-pink-200/30 flex items-center justify-center text-sm font-bold border border-white/30 shrink-0">
            👧
          </div>
          <div className="overflow-hidden">
            <div className="text-[11px] text-rose-100 truncate font-medium">婷婷已存入</div>
            <div className="font-display font-bold text-sm text-white truncate">
              {formatCurrency(partnerContribution)}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Deposit Action Button */}
      <button
        onClick={handleCelebrate}
        className="w-full bg-white hover:bg-rose-50 text-rose-600 font-bold py-2.5 px-4 rounded-2xl text-xs flex items-center justify-center space-x-2 shadow-[0_4px_16px_rgba(0,0,0,0.08)] active:scale-[0.98] transition-all duration-150"
      >
        <PlusCircle className="w-4 h-4 text-rose-500" />
        <span>存入一筆結婚基金 · 放慶祝彩帶 🎉</span>
      </button>
    </div>
  );
};

