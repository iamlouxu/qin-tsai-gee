import React, { useState, useMemo } from 'react';
import {
  ChevronDown,
  ReceiptText,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  Cell,
  CartesianGrid,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Ledger, Transaction, TransactionType } from '../../types';
import { formatCurrency, formatDateDisplay } from '../../utils/formatters';

interface AnalyticsViewProps {
  currentLedger: Ledger;
  transactions: Transaction[];
}

type PeriodType = 'week' | 'month' | 'year';

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  currentLedger,
  transactions,
}) => {
  const [activeType, setActiveType] = useState<TransactionType>('expense');
  const [period, setPeriod] = useState<PeriodType>('week');
  const [isPeriodDropdownOpen, setIsPeriodDropdownOpen] = useState(false);
  const [selectedBarIndex, setSelectedBarIndex] = useState<number>(5); // 預設週六 (Sat) 或有資料的一天
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // 1. 篩選當前帳本的所有記錄
  const ledgerTransactions = useMemo(() => {
    return transactions.filter((t) => t.ledgerId === currentLedger.id);
  }, [transactions, currentLedger.id]);

  // 2. 依據收支型態篩選 (預設為個人支出 expense / 收入 income)
  const typeFilteredTransactions = useMemo(() => {
    return ledgerTransactions.filter((tx) => tx.type === activeType);
  }, [ledgerTransactions, activeType]);

  // 3. 週長條圖資料生成 (Mon ~ Sun 7 天柱狀)
  // 找出基準日期（取交易中最新的一筆日期或今日）
  const chartDaysData = useMemo(() => {
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const dayFullLabels = ['週一', '週二', '週三', '週四', '週五', '週六', '週日'];

    // 取得最新交易日期作為參考基準週，若無則用今天
    let refDate = new Date();
    if (typeFilteredTransactions.length > 0) {
      const dates = typeFilteredTransactions.map((t) => new Date(t.date).getTime());
      refDate = new Date(Math.max(...dates));
    }

    // 計算該週週一的日期 (JS getDay(): 0 是週日, 1 是週一 ... 6 是週六)
    const currentDayOfWeek = refDate.getDay();
    const distanceToMonday = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;
    const monday = new Date(refDate);
    monday.setDate(refDate.getDate() + distanceToMonday);

    // 產生 Mon ~ Sun 七天的資料陣列
    const weekDays = dayNames.map((name, index) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + index);
      const dateStr = d.toISOString().slice(0, 10); // YYYY-MM-DD

      // 計算當天金額
      const dayTotal = typeFilteredTransactions
        .filter((t) => t.date === dateStr)
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        day: name,
        fullDay: dayFullLabels[index],
        date: dateStr,
        amount: dayTotal,
      };
    });

    const maxVal = Math.max(...weekDays.map((d) => d.amount), 1);

    return {
      days: weekDays,
      maxVal,
      totalAmount: weekDays.reduce((sum, d) => sum + d.amount, 0),
    };
  }, [typeFilteredTransactions]);

  // 如果 selectedBarIndex 超出範圍，重設為最後一天或最高的一天
  const activeSelectedDay = chartDaysData.days[selectedBarIndex] || chartDaysData.days[0];

  // 4. 分類金額統計 (2 欄卡片用)
  const categoryStats = useMemo(() => {
    const map: Record<
      string,
      {
        id: string;
        name: string;
        total: number;
        count: number;
        iconName: string;
        color: string;
      }
    > = {};

    let totalSum = 0;
    typeFilteredTransactions.forEach((tx) => {
      const cat = tx.category;
      if (!cat) return;
      if (!map[cat.id]) {
        map[cat.id] = {
          id: cat.id,
          name: cat.name,
          total: 0,
          count: 0,
          iconName: cat.iconName || 'ReceiptText',
          color: cat.color || '#F43F5E',
        };
      }
      map[cat.id].total += tx.amount;
      map[cat.id].count += 1;
      totalSum += tx.amount;
    });

    const sortedList = Object.values(map).sort((a, b) => b.total - a.total);

    // 取前 5 大類別，其餘歸類為 Other
    if (sortedList.length <= 6) {
      return sortedList;
    }

    const top5 = sortedList.slice(0, 5);
    const others = sortedList.slice(5);
    const otherTotal = others.reduce((sum, item) => sum + item.total, 0);
    const otherCount = others.reduce((sum, item) => sum + item.count, 0);

    return [
      ...top5,
      {
        id: 'other',
        name: '其他分類',
        total: otherTotal,
        count: otherCount,
        iconName: 'ReceiptText',
        color: '#94A3B8',
      },
    ];
  }, [typeFilteredTransactions]);

  // 當前選中分類之明細
  const filteredCategoryTransactions = useMemo(() => {
    if (!selectedCategory) return [];
    if (selectedCategory === 'other') {
      const top5Ids = categoryStats.slice(0, 5).map((c) => c.id);
      return typeFilteredTransactions.filter((tx) => !top5Ids.includes(tx.categoryId));
    }
    return typeFilteredTransactions.filter((tx) => tx.categoryId === selectedCategory);
  }, [typeFilteredTransactions, selectedCategory, categoryStats]);

  return (
    <div className="space-y-4 pb-12 select-none">
      {/* 1. 頂部導航列 (Top Bar: Centered Title) */}
      <div className="flex items-center justify-center pt-2 pb-1 px-1">
        <h1 className="text-base font-extrabold text-rose-950 tracking-tight font-sans">
          財務分析
        </h1>
      </div>

      {/* 2. 支出 / 收入 分段切換膠囊 (Expenses / Income Segmented Capsule) */}
      <div className="bg-rose-200/40 p-1 rounded-2xl flex items-center relative backdrop-blur-md border border-rose-200/50 shadow-inner">
        <button
          onClick={() => {
            setActiveType('expense');
            setSelectedCategory(null);
          }}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center space-x-1.5 ${
            activeType === 'expense'
              ? 'bg-white text-rose-950 shadow-sm font-extrabold scale-[1.01]'
              : 'text-rose-900/60 hover:text-rose-950'
          }`}
        >
          <TrendingDown className="w-3.5 h-3.5 text-rose-500" />
          <span>支出 (Expenses)</span>
        </button>

        <button
          onClick={() => {
            setActiveType('income');
            setSelectedCategory(null);
          }}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center space-x-1.5 ${
            activeType === 'income'
              ? 'bg-white text-rose-950 shadow-sm font-extrabold scale-[1.01]'
              : 'text-rose-900/60 hover:text-rose-950'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
          <span>收入 (Income)</span>
        </button>
      </div>

      {/* 3. 主趨勢卡片 (Main Analytics Card: Total, Period Switcher, Bar Chart with Tooltip) */}
      <div className="glass-card rounded-[28px] p-5 shadow-sm border border-white/90 relative overflow-visible">
        {/* 卡片頂部：總金額與週期下拉選單 */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <span className="text-[11px] font-medium text-slate-400 block mb-0.5 tracking-tight">
              {period === 'week' ? '本週總計' : period === 'month' ? '本月總計' : '本年度總計'}
            </span>
            <div className="font-display font-extrabold text-3xl text-rose-950 tracking-tight">
              {formatCurrency(chartDaysData.totalAmount)}
            </div>
          </div>

          {/* 週期下拉按鈕 */}
          <div className="relative">
            <button
              onClick={() => setIsPeriodDropdownOpen(!isPeriodDropdownOpen)}
              className="flex items-center space-x-1.5 bg-rose-50 hover:bg-rose-100/70 border border-rose-200/80 px-3 py-1.5 rounded-full text-xs font-bold text-rose-900 shadow-2xs active:scale-95 transition-all"
            >
              <span>{period === 'week' ? '週 (Week)' : period === 'month' ? '月 (Month)' : '年 (Year)'}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-rose-500 transition-transform duration-200 ${isPeriodDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* 下拉選單 */}
            {isPeriodDropdownOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-28 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-rose-100 py-1.5 z-30 animate-in fade-in zoom-in-95 duration-150">
                {(
                  [
                    { key: 'week', label: '週 (Week)' },
                    { key: 'month', label: '月 (Month)' },
                    { key: 'year', label: '年 (Year)' },
                  ] as const
                ).map((p) => (
                  <button
                    key={p.key}
                    onClick={() => {
                      setPeriod(p.key);
                      setIsPeriodDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-1.5 text-xs font-bold transition-colors ${
                      period === p.key ? 'text-rose-600 bg-rose-50/80' : 'text-slate-600 hover:bg-rose-50/50'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 柱狀長條圖區域 (shadcn BarChart Default Style with CartesianGrid & Click-to-highlight) */}
        <div className="pt-2 pb-1">
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartDaysData.days}
                margin={{ top: 28, right: 4, left: 4, bottom: 0 }}
                onClick={(state) => {
                  if (state && state.activeTooltipIndex !== undefined) {
                    setSelectedBarIndex(state.activeTooltipIndex);
                  }
                }}
              >
                {/* shadcn 標誌性的水平細格線 */}
                <CartesianGrid
                  vertical={false}
                  stroke="#FCE7F3"
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="day"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={12}
                  tick={({ x, y, payload, index }) => {
                    const isSelected = selectedBarIndex === index;
                    return (
                      <text
                        x={x}
                        y={y}
                        textAnchor="middle"
                        className={`text-[11px] select-none transition-colors duration-150 ${
                          isSelected
                            ? 'fill-rose-950 font-extrabold'
                            : 'fill-slate-400 font-medium'
                        }`}
                      >
                        {payload.value}
                      </text>
                    );
                  }}
                />

                <Tooltip
                  cursor={false}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-rose-950 text-white font-display font-extrabold text-[11px] px-2.5 py-1 rounded-xl shadow-lg shadow-rose-950/20 whitespace-nowrap flex items-center space-x-1 -translate-y-2 animate-in fade-in zoom-in-95 duration-100">
                          <span>{formatCurrency(data.amount)}</span>
                        </div>
                      );
                    }
                    return null;
                  }}
                />

                <Bar
                  dataKey="amount"
                  radius={[10, 10, 8, 8]}
                  barSize={32}
                  className="cursor-pointer"
                >
                  {chartDaysData.days.map((_entry, index) => {
                    const isSelected = selectedBarIndex === index;
                    return (
                      <Cell
                        key={`bar-cell-${index}`}
                        fill={isSelected ? '#F43F5E' : '#E2E8F0'}
                        className="transition-colors duration-200"
                        onClick={() => setSelectedBarIndex(index)}
                      />
                    );
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* 選取天數之微提示 */}
          <div className="mt-2 pt-3 border-t border-rose-100/60 flex items-center justify-between text-[11px] text-slate-400">
            <span>
              已選中：<strong className="text-rose-950 font-bold">{activeSelectedDay.fullDay} ({activeSelectedDay.date})</strong>
            </span>
            <span className="font-display font-bold text-rose-600">
              {formatCurrency(activeSelectedDay.amount)}
            </span>
          </div>
        </div>
      </div>

      {/* 4. 分類卡片 2 欄網格 (2-Column Category Grid) */}
      <div className="space-y-2.5 pt-1">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-extrabold text-rose-950 uppercase tracking-wider">
            分類排行 (Categories)
          </h2>
          {selectedCategory && (
            <button
              onClick={() => setSelectedCategory(null)}
              className="text-[11px] text-rose-600 font-bold hover:underline"
            >
              清除篩選
            </button>
          )}
        </div>

        {categoryStats.length === 0 ? (
          <div className="glass-card rounded-2xl p-8 text-center text-slate-400">
            <ReceiptText className="w-8 h-8 mx-auto mb-2 text-rose-200" />
            <p className="text-xs">尚無相關分類收支記錄</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {categoryStats.map((cat) => {
              const isSelected = selectedCategory === cat.id;

              return (
                <div
                  key={cat.id}
                  onClick={() =>
                    setSelectedCategory(selectedCategory === cat.id ? null : cat.id)
                  }
                  className={`glass-card rounded-2xl p-4 transition-all duration-200 cursor-pointer active:scale-97 border text-left flex flex-col justify-between h-[92px] ${
                    isSelected
                      ? 'ring-2 ring-rose-500 bg-rose-50/90 border-rose-300 shadow-md'
                      : 'hover:bg-white border-white/80'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500 truncate">
                      {cat.name}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {cat.count}筆
                    </span>
                  </div>

                  <div className="font-display font-extrabold text-base text-rose-950 tracking-tight">
                    {formatCurrency(cat.total)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. 點選分類卡片後展示的單筆明細清單 (Filtered Transactions Drawer/List) */}
      {selectedCategory && (
        <div className="glass-card rounded-3xl p-4 shadow-sm border border-white/90 space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <div className="flex items-center justify-between border-b border-rose-100/60 pb-2.5">
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <h3 className="text-xs font-bold text-rose-950">
                【{categoryStats.find((c) => c.id === selectedCategory)?.name}】近期明細
              </h3>
            </div>
            <span className="text-[11px] text-slate-400">
              共 {filteredCategoryTransactions.length} 筆
            </span>
          </div>

          <div className="divide-y divide-rose-100/40 max-h-64 overflow-y-auto">
            {filteredCategoryTransactions.length === 0 ? (
              <p className="text-center py-4 text-xs text-slate-400">查無此類別記錄</p>
            ) : (
              filteredCategoryTransactions.map((tx) => (
                <div key={tx.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-rose-950">
                      {tx.note || tx.category?.name || '無備註'}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {formatDateDisplay(tx.date)} · {tx.time}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-display font-bold text-rose-600 text-sm">
                      {formatCurrency(tx.amount)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
