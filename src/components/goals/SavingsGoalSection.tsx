import React, { useState } from 'react';
import {
  Heart,
  Sparkles,
  Calculator,
  PlusCircle,
  Pencil,
  Check,
  Award,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Ledger, SavingsMilestone } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { EditGoalModal } from './EditGoalModal';


interface SavingsGoalSectionProps {
  currentLedger: Ledger;
  currentSavings: number;
  userContribution: number;
  partnerContribution: number;
  onQuickDepositClick?: () => void;
  onUpdateGoal?: (targetAmount: number, title?: string) => void;
}

export const SavingsGoalSection: React.FC<SavingsGoalSectionProps> = ({
  currentLedger,
  currentSavings,
  userContribution,
  partnerContribution,
  onQuickDepositClick,
  onUpdateGoal,
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [targetMonths, setTargetMonths] = useState<number>(8); // Default 8 months target

  const isShared = currentLedger.type === 'shared';
  const targetAmount = currentLedger.targetAmount || (isShared ? 600000 : 100000);
  const percent = Math.min(100, Math.round((currentSavings / targetAmount) * 1000) / 10);
  const remaining = Math.max(0, targetAmount - currentSavings);

  // Dynamic Milestone Definitions based on targetAmount
  const weddingMilestones: SavingsMilestone[] = [
    {
      id: 'm1',
      title: '法式婚紗攝影包套',
      targetAmount: Math.round(targetAmount * 0.25),
      percentage: 25,
      icon: '📸',
      description: '拍攝訂金與精修包套',
    },
    {
      id: 'm2',
      title: '預訂婚宴頂級會館',
      targetAmount: Math.round(targetAmount * 0.5),
      percentage: 50,
      icon: '🏰',
      description: '宴會廳預定與試菜訂金',
    },
    {
      id: 'm3',
      title: '蜜月雙人機票與飯店',
      targetAmount: Math.round(targetAmount * 0.75),
      percentage: 75,
      icon: '✈️',
      description: '夢幻海外蜜月自由行',
    },
    {
      id: 'm4',
      title: '幸福圓滿婚禮達標',
      targetAmount: targetAmount,
      percentage: 100,
      icon: '💍',
      description: '所有款項與備用金全數到位！',
    },
  ];

  const personalMilestones: SavingsMilestone[] = [
    {
      id: 'pm1',
      title: '第一階段應急預備金',
      targetAmount: Math.round(targetAmount * 0.25),
      percentage: 25,
      icon: '🛡️',
      description: '1 個月生活基本開銷',
    },
    {
      id: 'pm2',
      title: '年度充電小旅行',
      targetAmount: Math.round(targetAmount * 0.5),
      percentage: 50,
      icon: '🎒',
      description: '放鬆身心的假期基金',
    },
    {
      id: 'pm3',
      title: '生產力設備升級',
      targetAmount: Math.round(targetAmount * 0.75),
      percentage: 75,
      icon: '💻',
      description: '工作與學習好夥伴',
    },
    {
      id: 'pm4',
      title: '年度存錢總目標達標',
      targetAmount: targetAmount,
      percentage: 100,
      icon: '🎯',
      description: '達成自我設定的夢想里程碑！',
    },
  ];

  const milestones = isShared ? weddingMilestones : personalMilestones;

  // Celebrate Confetti
  const handleCelebrate = () => {
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.65 },
      colors: ['#FB7185', '#F43F5E', '#EC4899', '#FFE4E6', '#F59E0B'],
    });
    if (onQuickDepositClick) onQuickDepositClick();
  };

  // Smart Savings Projection
  const monthlyNeeded = targetMonths > 0 ? Math.ceil(remaining / targetMonths) : 0;
  const perPersonMonthly = isShared && targetMonths > 0 ? Math.ceil(monthlyNeeded / 2) : monthlyNeeded;

  const targetDate = new Date();
  targetDate.setMonth(targetDate.getMonth() + targetMonths);
  const targetDateStr = `${targetDate.getFullYear()} 年 ${targetDate.getMonth() + 1} 月`;

  return (
    <div className="space-y-4 animate-fade-in">
      {/* 1. Main Hero Goal Card */}
      <div className="pink-gradient-card rounded-4xl p-6 text-white relative overflow-hidden shadow-soft-pink">
        {/* Glow Circles */}
        <div className="absolute -right-8 -top-8 w-36 h-36 bg-white/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -left-10 -bottom-10 w-44 h-44 bg-pink-900/30 rounded-full blur-2xl pointer-events-none" />

        {/* Header with Title & Edit */}
        <div className="flex justify-between items-center mb-1">
          <div className="flex items-center space-x-1.5 text-rose-100 text-xs font-semibold">
            {isShared ? (
              <Heart className="w-3.5 h-3.5 fill-rose-200 text-rose-200" />
            ) : (
              <Award className="w-3.5 h-3.5 text-rose-200" />
            )}
            <span>{currentLedger.name}</span>
          </div>

          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="p-1 px-2 rounded-xl bg-white/15 hover:bg-white/25 text-[11px] font-bold text-white border border-white/20 flex items-center gap-1 transition-all active:scale-95"
            >
              <Pencil className="w-3 h-3" />
              <span>修改目標</span>
            </button>
            <div className="bg-white/25 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[11px] font-bold text-white border border-white/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-200 fill-amber-200" />
              <span>{percent}%</span>
            </div>
          </div>
        </div>

        {/* Hero Balance Numbers */}
        <div className="flex items-baseline justify-between my-2">
          <div>
            <div className="text-[11px] text-rose-100 font-medium">目前已累積存入</div>
            <div className="font-display font-extrabold text-[36px] tracking-tight text-white leading-tight">
              {formatCurrency(currentSavings)}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[11px] text-rose-100 font-medium">目標總額</div>
            <div className="font-display font-bold text-lg text-rose-100/90 leading-tight">
              {formatCurrency(targetAmount)}
            </div>
          </div>
        </div>

        {/* Progress Bar with Glow */}
        <div className="bg-black/15 backdrop-blur-sm rounded-2xl p-3 border border-white/15 my-3">
          <div className="w-full bg-white/25 h-3.5 rounded-full overflow-hidden p-0.5 mb-2 relative">
            <div
              className="bg-gradient-to-r from-amber-200 via-rose-100 to-white h-full rounded-full transition-all duration-700 shadow-sm"
              style={{ width: `${percent}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-xs text-rose-100">
            <span>
              還差 <strong className="text-white font-bold">{formatCurrency(remaining)}</strong>
            </span>
            <span className="text-[11px] text-rose-200">
              {percent >= 100 ? '🎉 已全數達標！' : `進度 ${percent}%`}
            </span>
          </div>
        </div>

        {/* Couple Contribution Breakdown (if shared) */}
        {isShared && (
          <div className="grid grid-cols-2 gap-2.5 mb-3">
            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-2.5 border border-white/20 flex items-center space-x-2">
              <div className="w-7 h-7 rounded-full bg-rose-200/30 flex items-center justify-center text-xs font-bold border border-white/30 shrink-0">
                👦
              </div>
              <div className="overflow-hidden">
                <div className="text-[10px] text-rose-100 truncate font-medium">培捷已存入</div>
                <div className="font-display font-bold text-xs text-white truncate">
                  {formatCurrency(userContribution)}
                </div>
              </div>
            </div>

            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-2.5 border border-white/20 flex items-center space-x-2">
              <div className="w-7 h-7 rounded-full bg-pink-200/30 flex items-center justify-center text-xs font-bold border border-white/30 shrink-0">
                👧
              </div>
              <div className="overflow-hidden">
                <div className="text-[10px] text-rose-100 truncate font-medium">婷婷已存入</div>
                <div className="font-display font-bold text-xs text-white truncate">
                  {formatCurrency(partnerContribution)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Deposit Action Button */}
        <button
          onClick={handleCelebrate}
          className="w-full bg-white hover:bg-rose-50 text-rose-600 font-bold py-2.5 px-4 rounded-2xl text-xs flex items-center justify-center space-x-1.5 shadow-md active:scale-98 transition-all duration-150 group"
        >
          <PlusCircle className="w-4 h-4 text-rose-500 group-hover:scale-110 transition-transform" />
          <span>💖 存入一筆夢想基金（慶祝彩帶！）</span>
        </button>
      </div>

      {/* 2. Milestones Checkpoint List (階段里程碑) */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center space-x-1.5">
            <Sparkles className="w-4 h-4 text-rose-500" />
            <h2 className="text-sm font-extrabold text-rose-950 font-sans tracking-tight">
              階段里程碑 ({milestones.filter((m) => currentSavings >= m.targetAmount).length}/
              {milestones.length})
            </h2>
          </div>
          <span className="text-[11px] text-rose-700/60 font-medium">依目標進度自動解鎖</span>
        </div>

        <div className="glass-card rounded-3xl p-3.5 space-y-2.5 shadow-xs border border-white/80">
          {milestones.map((m, idx) => {
            const isCompleted = currentSavings >= m.targetAmount;
            const isNext = !isCompleted && (idx === 0 || currentSavings >= milestones[idx - 1].targetAmount);
            const mRemaining = Math.max(0, m.targetAmount - currentSavings);

            return (
              <div
                key={m.id}
                className={`p-3 rounded-2xl border transition-all ${
                  isCompleted
                    ? 'bg-rose-50/60 border-rose-200/80'
                    : isNext
                    ? 'bg-white border-rose-300 shadow-xs ring-1 ring-rose-200'
                    : 'bg-white/40 border-rose-100/50 opacity-70'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    {/* Icon / Emoji badge */}
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg ${
                        isCompleted
                          ? 'bg-rose-100 text-rose-600'
                          : isNext
                          ? 'bg-amber-100 text-amber-600'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      <span>{m.icon}</span>
                    </div>

                    <div>
                      <div className="flex items-center space-x-1.5">
                        <span className="text-xs font-bold text-rose-950">{m.title}</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-rose-100/70 text-rose-700">
                          {m.percentage}%
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5">{m.description}</p>
                    </div>
                  </div>

                  {/* Status / Amount */}
                  <div className="text-right">
                    <div className="font-display font-bold text-xs text-rose-950">
                      {formatCurrency(m.targetAmount)}
                    </div>
                    {isCompleted ? (
                      <span className="inline-flex items-center space-x-0.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full mt-0.5">
                        <Check className="w-3 h-3" />
                        <span>已解鎖 ✨</span>
                      </span>
                    ) : (
                      <span className="text-[10px] text-rose-500 font-medium">
                        還差 {formatCurrency(mRemaining)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Progress bar inside next step */}
                {isNext && (
                  <div className="mt-2.5 pt-2 border-t border-rose-100/80">
                    <div className="flex justify-between items-center text-[10px] text-slate-500 mb-1">
                      <span>當前衝刺中...</span>
                      <span className="font-bold text-rose-600">
                        {Math.min(100, Math.round((currentSavings / m.targetAmount) * 100))}%
                      </span>
                    </div>
                    <div className="w-full bg-rose-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-rose-400 to-rose-600 h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(
                            100,
                            (currentSavings / m.targetAmount) * 100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Smart Savings Projection Calculator (智慧存錢試算) */}
      <div className="glass-card rounded-3xl p-4 shadow-xs border border-white/80 space-y-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600">
            <Calculator className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-rose-950">智慧存錢試算規劃</h3>
            <p className="text-[10px] text-slate-400">滑動調整預計達成時間，即時估算每月需存額度</p>
          </div>
        </div>

        {/* Month Slider */}
        <div className="bg-rose-50/60 rounded-2xl p-3 border border-rose-200/50 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-rose-900">預計達成時程</span>
            <span className="font-display font-extrabold text-sm text-rose-600 bg-white px-2.5 py-0.5 rounded-full border border-rose-200 shadow-2xs">
              {targetMonths} 個月 ({targetDateStr})
            </span>
          </div>

          <input
            type="range"
            min="2"
            max="36"
            step="1"
            value={targetMonths}
            onChange={(e) => setTargetMonths(parseInt(e.target.value))}
            className="w-full accent-rose-500 h-2 bg-rose-200 rounded-lg cursor-pointer"
          />

          <div className="flex justify-between text-[10px] text-slate-400 font-medium">
            <span>2 個月 (短期衝刺)</span>
            <span>12 個月 (1年)</span>
            <span>36 個月 (3年)</span>
          </div>
        </div>

        {/* Projection Results Cards */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-3 bg-white rounded-2xl border border-rose-100 text-center">
            <div className="text-[10px] text-slate-400 font-medium mb-0.5">
              {isShared ? '雙方每月合計需存' : '每月建議存入'}
            </div>
            <div className="font-display font-extrabold text-base text-rose-950">
              {formatCurrency(monthlyNeeded)}
            </div>
            <div className="text-[10px] text-rose-500/80 mt-0.5 font-medium">
              約 {formatCurrency(Math.ceil(monthlyNeeded / 30))} / 日
            </div>
          </div>

          <div className="p-3 bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl border border-rose-200 text-center">
            <div className="text-[10px] text-rose-800/70 font-medium mb-0.5">
              {isShared ? '👫 雙方每人每月' : '🎯 預計達標時間'}
            </div>
            <div className="font-display font-extrabold text-base text-rose-600">
              {isShared ? formatCurrency(perPersonMonthly) : targetDateStr}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5 font-medium">
              {isShared ? `預計 ${targetDateStr} 達標` : `倒數 ${targetMonths} 個月`}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <EditGoalModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialTarget={targetAmount}
        initialTitle={currentLedger.name}
        onSave={(newTarget) => {
          if (onUpdateGoal) onUpdateGoal(newTarget);
        }}
      />
    </div>
  );
};
