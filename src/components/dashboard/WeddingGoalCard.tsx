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
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#FB7185', '#F43F5E', '#EC4899', '#FFE4E6', '#F59E0B'],
    });
    if (onQuickDepositClick) onQuickDepositClick();
  };

  return (
    <div className="pink-gradient-card rounded-4xl p-6 text-white relative overflow-hidden mb-5">
      {/* Decorative Sparkles & Glowing Circles */}
      <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/20 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-pink-900/30 rounded-full blur-2xl pointer-events-none" />

      {/* Top Header */}
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center space-x-1.5 text-rose-100 text-xs font-semibold">
          <Heart className="w-3.5 h-3.5 fill-rose-200 text-rose-200" />
          <span>2027 幸福結婚基金</span>
        </div>
        <div className="bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[11px] font-bold text-white border border-white/25 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-200 fill-amber-200" />
          <span>達成率 {percent}%</span>
        </div>
      </div>

      {/* Hero Numbers */}
      <div className="flex items-baseline justify-between mb-4">
        <div>
          <div className="text-[11px] text-rose-100 font-medium">目前已累積</div>
          <div className="font-display font-extrabold text-[36px] tracking-tight text-white leading-none mt-0.5">
            {formatCurrency(currentSavings)}
          </div>
        </div>
        <div className="text-right">
          <div className="text-[11px] text-rose-100 font-medium">目標總金額</div>
          <div className="font-display font-bold text-lg text-rose-100/90 leading-tight mt-0.5">
            {formatCurrency(targetAmount)}
          </div>
        </div>
      </div>

      {/* Main Target Progress Bar */}
      <div className="bg-black/15 backdrop-blur-sm rounded-2xl p-3.5 border border-white/15 mb-4">
        <div className="w-full bg-white/25 h-3.5 rounded-full overflow-hidden p-0.5 mb-2 relative">
          <div
            className="bg-gradient-to-r from-amber-200 via-rose-100 to-white h-full rounded-full transition-all duration-700 shadow-sm"
            style={{ width: `${percent}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-xs text-rose-100">
          <span>
            距目標還差 <strong className="text-white font-bold">{formatCurrency(remaining)}</strong>
          </span>
          <span className="text-[11px] text-rose-200">已累積 {formatNumber(currentSavings)} 元</span>
        </div>
      </div>

      {/* Couple Contribution Breakdown Grid */}
      <div className="grid grid-cols-2 gap-2.5 mb-3.5">
        {/* User Card */}
        <div className="bg-white/15 backdrop-blur-md rounded-2xl p-2.5 border border-white/20 flex items-center space-x-2.5">
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
        <div className="bg-white/15 backdrop-blur-md rounded-2xl p-2.5 border border-white/20 flex items-center space-x-2.5">
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
        className="w-full bg-white hover:bg-rose-50 text-rose-600 font-bold py-2.5 px-4 rounded-2xl text-xs flex items-center justify-center space-x-1.5 shadow-md active:scale-98 transition-all duration-150 group"
      >
        <PlusCircle className="w-4 h-4 text-rose-500 group-hover:scale-110 transition-transform" />
        <span>💖 存入一筆結婚基金（放個慶祝彩帶！）</span>
      </button>
    </div>
  );
};
