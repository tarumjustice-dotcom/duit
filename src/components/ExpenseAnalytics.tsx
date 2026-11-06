import React, { useMemo } from 'react';
import { PieChart, BarChart3, TrendingUp } from 'lucide-react';
import { Transaction, formatRupiah, EXPENSE_CATEGORIES, getISODateString } from '../types';
import { CategoryIcon } from './CategoryIcon';

interface ExpenseAnalyticsProps {
  transactions: Transaction[];
}

export const ExpenseAnalytics: React.FC<ExpenseAnalyticsProps> = ({ transactions }) => {
  // Compute category breakdown for expenses
  const { categoryTotals, totalExpenseAmount } = useMemo(() => {
    const expenseTx = transactions.filter((t) => t.type === 'expense');
    const total = expenseTx.reduce((acc, curr) => acc + curr.amount, 0);

    const map: Record<string, number> = {};
    expenseTx.forEach((t) => {
      map[t.category] = (map[t.category] || 0) + t.amount;
    });

    const list = Object.entries(map)
      .map(([name, amount]) => ({
        name,
        amount,
        percentage: total > 0 ? Math.round((amount / total) * 100) : 0,
        color: EXPENSE_CATEGORIES.find((c) => c.name === name)?.color || '#64748b',
      }))
      .sort((a, b) => b.amount - a.amount);

    return { categoryTotals: list, totalExpenseAmount: total };
  }, [transactions]);

  // Compute 7-day spending trend
  const last7DaysData = useMemo(() => {
    const days: { dateStr: string; label: string; amount: number }[] = [];
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = getISODateString(d);
      const label = new Intl.DateTimeFormat('id-ID', { weekday: 'short' }).format(d);

      const dayTotal = transactions
        .filter((t) => t.type === 'expense' && t.date === dateStr)
        .reduce((sum, curr) => sum + curr.amount, 0);

      days.push({ dateStr, label, amount: dayTotal });
    }

    const maxDayAmount = Math.max(...days.map((d) => d.amount), 1);
    return { days, maxDayAmount };
  }, [transactions]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* 7-Day Spending Trend */}
      <div className="neu-flat p-5 rounded-2xl flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl neu-convex flex items-center justify-center text-teal-600 dark:text-teal-400">
                <BarChart3 size={16} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  Tren Pengeluaran 7 Hari
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Aktivitas pengeluaran seminggu terakhir
                </p>
              </div>
            </div>
          </div>

          {/* Bar Chart Visualization */}
          <div className="h-40 pt-4 pb-2 flex items-end justify-between gap-2 border-b border-black/[0.04] dark:border-white/[0.06]">
            {last7DaysData.days.map((d, idx) => {
              const heightPct = Math.max(
                (d.amount / last7DaysData.maxDayAmount) * 100,
                d.amount > 0 ? 8 : 3
              );
              const isToday = idx === last7DaysData.days.length - 1;

              return (
                <div key={d.dateStr} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                  <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity truncate">
                    {d.amount > 0 ? `${Math.round(d.amount / 1000)}k` : '0'}
                  </div>
                  <div className="w-full max-w-[28px] h-full flex items-end">
                    <div
                      className={`w-full rounded-t-lg transition-all duration-300 ${
                        isToday
                          ? 'bg-teal-500 shadow-sm'
                          : d.amount > 0
                          ? 'bg-slate-300 dark:bg-slate-700 hover:bg-teal-400'
                          : 'bg-slate-200 dark:bg-slate-800'
                      }`}
                      style={{ height: `${heightPct}%` }}
                      title={`${d.label} (${d.dateStr}): ${formatRupiah(d.amount)}`}
                    />
                  </div>
                  <span
                    className={`text-[11px] font-medium uppercase ${
                      isToday
                        ? 'text-teal-600 dark:text-teal-400 font-bold'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {d.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Hari ini disorot dengan warna hijau toska</span>
          <span className="font-mono tabular-nums">
            Rata-rata:{' '}
            {formatRupiah(
              Math.round(
                last7DaysData.days.reduce((acc, c) => acc + c.amount, 0) / 7
              )
            )}
            /hari
          </span>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="neu-flat p-5 rounded-2xl flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl neu-convex flex items-center justify-center text-teal-600 dark:text-teal-400">
                <PieChart size={16} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  Distribusi Kategori
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Total pengeluaran: {formatRupiah(totalExpenseAmount)}
                </p>
              </div>
            </div>
          </div>

          {/* List of top categories with progress meter */}
          {categoryTotals.length === 0 ? (
            <div className="h-40 flex items-center justify-center text-xs text-slate-500">
              Belum ada data pengeluaran untuk dianalisis.
            </div>
          ) : (
            <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
              {categoryTotals.slice(0, 5).map((cat) => (
                <div key={cat.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-200">
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: cat.color }}
                      />
                      <span>{cat.name}</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono tabular-nums text-slate-600 dark:text-slate-300">
                      <span className="font-semibold">{formatRupiah(cat.amount)}</span>
                      <span className="text-slate-400 text-[11px] w-8 text-right">
                        {cat.percentage}%
                      </span>
                    </div>
                  </div>
                  <div className="h-1.5 rounded-full neu-sunken p-0.5 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${cat.percentage}%`,
                        backgroundColor: cat.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {categoryTotals.length > 5 && (
          <div className="mt-2 text-right text-[11px] text-slate-400">
            +{categoryTotals.length - 5} kategori lainnya
          </div>
        )}
      </div>
    </div>
  );
};
