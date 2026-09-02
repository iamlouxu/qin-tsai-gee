import React, { useState, useMemo } from 'react';
import {
  PieChart as PieChartIcon,
  TrendingUp,
  Calendar,
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
  ChevronRight,
  UserCheck,
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { Ledger, Transaction, TransactionType } from '../../types';
import { formatCurrency, formatDateDisplay } from '../../utils/formatters';

interface AnalyticsViewProps {
  currentLedger: Ledger;
  transactions: Transaction[];
}

type PeriodType = 'week' | 'month' | 'year' | 'all';

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

const PALETTE_COLORS = [
  '#F43F5E', // Rose 500
  '#FB7185', // Rose 400
  '#EC4899', // Pink 500
  '#F472B6', // Pink 400
  '#8B5CF6', // Purple 500
  '#0284C7', // Sky 600
  '#059669', // Emerald 600
  '#F59E0B', // Amber 500
  '#E11D48', // Rose 600
  '#9333EA', // Violet 600
];

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  currentLedger,
  transactions,
}) => {
  const [period, setPeriod] = useState<PeriodType>('month');
  const [activeType, setActiveType] = useState<TransactionType>('expense');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Filter transactions by ledger
  const ledgerTransactions = useMemo(() => {
    return transactions.filter((t) => t.ledgerId === currentLedger.id);
  }, [transactions, currentLedger.id]);

  // Filter transactions by Period
  const periodTransactions = useMemo(() => {
    const now = new Date();
    return ledgerTransactions.filter((tx) => {
      const txDate = new Date(tx.date);
      if (period === 'week') {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(now.getDate() - 7);
        return txDate >= oneWeekAgo && txDate <= now;
      }
      if (period === 'month') {
        return (
          txDate.getFullYear() === now.getFullYear() &&
          txDate.getMonth() === now.getMonth()
        );
      }
      if (period === 'year') {
        return txDate.getFullYear() === now.getFullYear();
      }
      return true; // 'all'
    });
  }, [ledgerTransactions, period]);

  // Filter by Type (Expense / Income / Savings)
  const filteredByType = useMemo(() => {
    return periodTransactions.filter((tx) => {
      if (currentLedger.type === 'shared' && activeType === 'savings_deposit') {
        return tx.type === 'savings_deposit';
      }
      return tx.type === activeType;
    });
  }, [periodTransactions, activeType, currentLedger.type]);

  // Category aggregation for Donut Chart & Breakdown List
  const categoryStats = useMemo(() => {
    const map: Record<
      string,
      {
        id: string;
        name: string;
        color: string;
        bgColor: string;
        iconName: string;
        total: number;
        count: number;
      }
    > = {};

    let totalSum = 0;

    filteredByType.forEach((tx) => {
      const cat = tx.category;
      if (!cat) return;
      if (!map[cat.id]) {
        map[cat.id] = {
          id: cat.id,
          name: cat.name,
          color: cat.color || PALETTE_COLORS[0],
          bgColor: cat.bgColor || '#FFE4E6',
          iconName: cat.iconName || 'ReceiptText',
          total: 0,
          count: 0,
        };
      }
      map[cat.id].total += tx.amount;
      map[cat.id].count += 1;
      totalSum += tx.amount;
    });

    const list = Object.values(map)
      .map((item, idx) => ({
        ...item,
        percentage: totalSum > 0 ? (item.total / totalSum) * 100 : 0,
        fillColor: item.color || PALETTE_COLORS[idx % PALETTE_COLORS.length],
      }))
      .sort((a, b) => b.total - a.total);

    return { list, totalSum };
  }, [filteredByType]);

  // Partner stats (for shared ledger)
  const partnerStats = useMemo(() => {
    if (currentLedger.type !== 'shared') return null;

    let userTotal = 0;
    let partnerTotal = 0;

    filteredByType.forEach((tx) => {
      if (tx.userId === currentLedger.members[0]?.id) {
        userTotal += tx.amount;
      } else {
        partnerTotal += tx.amount;
      }
    });

    const sum = userTotal + partnerTotal;
    const userPct = sum > 0 ? Math.round((userTotal / sum) * 100) : 50;
    const partnerPct = sum > 0 ? 100 - userPct : 50;

    return {
      userTotal,
      partnerTotal,
      userPct,
      partnerPct,
      userName: currentLedger.members[0]?.name || '本人',
      partnerName: currentLedger.members[1]?.name || '伴侶',
    };
  }, [filteredByType, currentLedger]);

  // Highest transaction & daily average
  const maxTx = useMemo(() => {
    if (filteredByType.length === 0) return null;
    return [...filteredByType].sort((a, b) => b.amount - a.amount)[0];
  }, [filteredByType]);

  const dailyAvg = useMemo(() => {
    const days = period === 'week' ? 7 : period === 'month' ? 30 : 365;
    return Math.round(categoryStats.totalSum / days);
  }, [categoryStats.totalSum, period]);

  // Daily trend bar chart data (last 7 days or recent distribution)
  const barChartData = useMemo(() => {
    const dateMap: Record<string, number> = {};
    filteredByType.forEach((tx) => {
      const label = tx.date.slice(5); // MM-DD
      dateMap[label] = (dateMap[label] || 0) + tx.amount;
    });

    return Object.keys(dateMap)
      .sort()
      .slice(-7)
      .map((date) => ({
        date,
        amount: dateMap[date],
      }));
  }, [filteredByType]);

  // Detail transactions for selected category
  const activeCategoryTransactions = useMemo(() => {
    if (!selectedCategory) return [];
    return filteredByType.filter((tx) => tx.categoryId === selectedCategory);
  }, [filteredByType, selectedCategory]);

  return (
    <div className="space-y-5 pb-6">
      {/* 1. Header & Title */}
      <div className="flex items-center justify-between pt-1 px-1">
        <div>
          <h1 className="text-xl font-extrabold text-rose-950 font-sans tracking-tight">
            財務統計
          </h1>
          <p className="text-xs text-rose-800/60 font-medium mt-0.5">
            {currentLedger.name} · 週期數據與消費分佈
          </p>
        </div>

        <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-white/80 backdrop-blur-md rounded-2xl border border-rose-200/60 text-xs font-bold text-rose-800 shadow-xs">
          <Calendar className="w-3.5 h-3.5 text-rose-500" />
          <span>
            {period === 'week' ? '本週' : period === 'month' ? '本月' : period === 'year' ? '本年' : '全部'}
          </span>
        </div>
      </div>

      {/* 2. Period Filter Tabs */}
      <div className="bg-rose-100/50 p-1 rounded-2xl flex items-center justify-between border border-rose-200/40">
        {(
          [
            { key: 'week', label: '本週' },
            { key: 'month', label: '本月' },
            { key: 'year', label: '本年度' },
            { key: 'all', label: '全部' },
          ] as const
        ).map((item) => (
          <button
            key={item.key}
            onClick={() => {
              setPeriod(item.key);
              setSelectedCategory(null);
            }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all duration-200 ${
              period === item.key
                ? 'bg-white text-rose-600 shadow-xs scale-[1.02]'
                : 'text-slate-500 hover:text-rose-600'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* 3. Transaction Type Pills */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => {
            setActiveType('expense');
            setSelectedCategory(null);
          }}
          className={`flex-1 py-2 px-3 rounded-2xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all ${
            activeType === 'expense'
              ? 'bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-soft-pink'
              : 'bg-white/80 text-rose-900/70 border border-rose-100 hover:bg-rose-50'
          }`}
        >
          <span>支出分析</span>
        </button>

        <button
          onClick={() => {
            setActiveType('income');
            setSelectedCategory(null);
          }}
          className={`flex-1 py-2 px-3 rounded-2xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all ${
            activeType === 'income'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-xs'
              : 'bg-white/80 text-rose-900/70 border border-rose-100 hover:bg-rose-50'
          }`}
        >
          <span>收入分析</span>
        </button>

        {currentLedger.type === 'shared' && (
          <button
            onClick={() => {
              setActiveType('savings_deposit');
              setSelectedCategory(null);
            }}
            className={`flex-1 py-2 px-3 rounded-2xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all ${
              activeType === 'savings_deposit'
                ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-soft-pink'
                : 'bg-white/80 text-rose-900/70 border border-rose-100 hover:bg-rose-50'
            }`}
          >
            <span>💍 基金存入</span>
          </button>
        )}
      </div>

      {/* 4. Total Card */}
      <div className="bg-gradient-to-br from-[#FB7185] via-[#F43F5E] to-[#E11D48] rounded-3xl p-5 text-white shadow-[0_15px_35px_rgba(244,63,94,0.25)] relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-center justify-between text-rose-100 text-xs font-medium mb-1">
          <span>
            {period === 'week' ? '本週' : period === 'month' ? '本月' : period === 'year' ? '本年度' : '全部'}
            {activeType === 'expense' ? '總支出' : activeType === 'income' ? '總收入' : '累積存入'}
          </span>
          <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px] font-bold">
            共 {filteredByType.length} 筆
          </span>
        </div>

        <div className="font-display font-extrabold text-3xl tracking-tight my-1 text-white">
          {formatCurrency(categoryStats.totalSum)}
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-white/20 text-xs">
          <div>
            <div className="text-rose-100/80 text-[11px]">平均每日</div>
            <div className="font-display font-bold text-sm text-white mt-0.5">
              {formatCurrency(dailyAvg)}
            </div>
          </div>
          <div>
            <div className="text-rose-100/80 text-[11px]">單筆最高</div>
            <div className="font-display font-bold text-sm text-white mt-0.5 truncate">
              {maxTx ? `${formatCurrency(maxTx.amount)} (${maxTx.category?.name || '無'})` : 'NT$ 0'}
            </div>
          </div>
        </div>
      </div>

      {/* 5. Donut Chart (分類佔比圓環) */}
      <div className="glass-card rounded-3xl p-5 shadow-sm border border-white/80">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600">
              <PieChartIcon className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-rose-950">分類分佈佔比</h2>
              <p className="text-[10px] text-slate-400">點擊環狀區塊可快速篩選</p>
            </div>
          </div>

          {selectedCategory && (
            <button
              onClick={() => setSelectedCategory(null)}
              className="text-[11px] text-rose-600 font-bold bg-rose-50 px-2.5 py-1 rounded-xl border border-rose-200 hover:bg-rose-100"
            >
              清除篩選
            </button>
          )}
        </div>

        {categoryStats.list.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            <ReceiptText className="w-10 h-10 mx-auto mb-2 text-rose-200 stroke-[1.5]" />
            <p className="text-xs font-medium">該期間尚無此類型的收支記錄</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="w-full h-56 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryStats.list}
                    dataKey="total"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={58}
                    outerRadius={88}
                    paddingAngle={3}
                    onClick={(entry) =>
                      setSelectedCategory(selectedCategory === entry.id ? null : entry.id)
                    }
                  >
                    {categoryStats.list.map((entry) => (
                      <Cell
                        key={`cell-${entry.id}`}
                        fill={entry.fillColor}
                        stroke="#FFF"
                        strokeWidth={selectedCategory === entry.id ? 3 : 1}
                        className="cursor-pointer transition-all duration-200 hover:opacity-80"
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any) => [
                      formatCurrency(Number(value) || 0),
                      '金額',
                    ]}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      borderRadius: '16px',
                      border: '1px solid #FFE4E6',
                      boxShadow: '0 8px 20px rgba(244, 63, 94, 0.15)',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#831843',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Center Donut Label */}
              <div className="absolute flex flex-col items-center pointer-events-none text-center">
                <span className="text-[10px] text-slate-400 font-medium">
                  {selectedCategory
                    ? categoryStats.list.find((c) => c.id === selectedCategory)?.name
                    : '總計'}
                </span>
                <span className="text-sm font-display font-extrabold text-rose-950">
                  {selectedCategory
                    ? formatCurrency(
                        categoryStats.list.find((c) => c.id === selectedCategory)?.total || 0
                      )
                    : formatCurrency(categoryStats.totalSum)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 6. Partner Breakdown (結婚共同帳本專屬) */}
      {partnerStats && (
        <div className="glass-card rounded-3xl p-5 shadow-sm border border-white/80">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-pink-100 flex items-center justify-center text-pink-600">
                <UserCheck className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-rose-950">情侶貢獻對比</h2>
            </div>
            <span className="text-[11px] font-bold text-rose-600">
              💍 共同帳本
            </span>
          </div>

          <div className="space-y-2">
            {/* Progress Bar */}
            <div className="h-3 w-full bg-rose-100 rounded-full overflow-hidden flex shadow-inner">
              <div
                className="bg-gradient-to-r from-rose-500 to-rose-400 h-full transition-all duration-500"
                style={{ width: `${partnerStats.userPct}%` }}
              />
              <div
                className="bg-gradient-to-r from-pink-400 to-pink-300 h-full transition-all duration-500"
                style={{ width: `${partnerStats.partnerPct}%` }}
              />
            </div>

            {/* Member Details */}
            <div className="flex justify-between items-center text-xs pt-1">
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span className="font-bold text-rose-950">{partnerStats.userName}</span>
                <span className="text-slate-400">
                  ({partnerStats.userPct}%) · {formatCurrency(partnerStats.userTotal)}
                </span>
              </div>

              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-pink-400" />
                <span className="font-bold text-rose-950">{partnerStats.partnerName}</span>
                <span className="text-slate-400">
                  ({partnerStats.partnerPct}%) · {formatCurrency(partnerStats.partnerTotal)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. Bar Chart (趨勢分佈) */}
      {barChartData.length > 0 && (
        <div className="glass-card rounded-3xl p-5 shadow-sm border border-white/80">
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-8 h-8 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-rose-950">近 7 日花費柱狀圖</h2>
              <p className="text-[10px] text-slate-400">每日消費變化曲線</p>
            </div>
          </div>

          <div className="h-40 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 10, fill: '#888' }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 10, fill: '#888' }}
                  tickFormatter={(val) => `$${val}`}
                />
                <Tooltip
                  formatter={(val: any) => [
                    formatCurrency(Number(val) || 0),
                    '金額',
                  ]}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '12px',
                    border: '1px solid #FFE4E6',
                    fontSize: '11px',
                  }}
                />
                <Bar
                  dataKey="amount"
                  fill="#F43F5E"
                  radius={[6, 6, 0, 0]}
                  barSize={18}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* 8. Category Ranking List (分類排行) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-bold text-rose-950 font-sans tracking-tight">
            分類排行排行榜
          </h2>
          <span className="text-[11px] text-slate-400 font-medium">
            共 {categoryStats.list.length} 個類別
          </span>
        </div>

        <div className="glass-card rounded-3xl p-3 space-y-2 divide-y divide-rose-100/50">
          {categoryStats.list.map((cat, index) => {
            const IconComponent = iconMap[cat.iconName] || ReceiptText;
            const isSelected = selectedCategory === cat.id;

            return (
              <div
                key={cat.id}
                onClick={() =>
                  setSelectedCategory(selectedCategory === cat.id ? null : cat.id)
                }
                className={`p-2.5 rounded-2xl transition-all cursor-pointer ${
                  isSelected ? 'bg-rose-100/60 ring-2 ring-rose-400' : 'hover:bg-rose-50/60'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center space-x-3 overflow-hidden">
                    {/* Rank Number */}
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold ${
                        index === 0
                          ? 'bg-amber-400 text-white'
                          : index === 1
                          ? 'bg-slate-300 text-slate-700'
                          : index === 2
                          ? 'bg-amber-700/60 text-white'
                          : 'bg-rose-100 text-rose-600'
                      }`}
                    >
                      {index + 1}
                    </span>

                    {/* Icon */}
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                      style={{
                        backgroundColor: cat.bgColor || '#FFE4E6',
                        color: cat.color || '#F43F5E',
                      }}
                    >
                      <IconComponent className="w-4 h-4 stroke-[2]" />
                    </div>

                    {/* Title & Count */}
                    <div>
                      <span className="text-xs font-bold text-rose-950 block">
                        {cat.name}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {cat.count} 筆記錄 · {cat.percentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="text-right flex items-center space-x-1.5">
                    <span className="font-display font-bold text-sm text-rose-950">
                      {formatCurrency(cat.total)}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                  </div>
                </div>

                {/* Percentage Bar */}
                <div className="h-1.5 w-full bg-rose-100/80 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${cat.percentage}%`,
                      backgroundColor: cat.fillColor,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 9. Filtered Transactions List when a category is selected */}
      {selectedCategory && (
        <div className="space-y-2 mt-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold text-rose-900">
              【{categoryStats.list.find((c) => c.id === selectedCategory)?.name}】明細
            </h3>
            <span className="text-[10px] text-slate-400">
              {activeCategoryTransactions.length} 筆
            </span>
          </div>

          <div className="glass-card rounded-3xl p-3 divide-y divide-rose-100/40">
            {activeCategoryTransactions.map((tx) => (
              <div key={tx.id} className="py-2 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-rose-950">
                    {tx.note || tx.category.name}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {formatDateDisplay(tx.date)} · {tx.time}
                    {currentLedger.type === 'shared' && ` · 👤 ${tx.user.name}`}
                  </div>
                </div>
                <div className="font-display font-bold text-rose-600">
                  {formatCurrency(tx.amount)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
