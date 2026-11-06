import React from 'react';
import { Coffee, Utensils, Fuel, CarFront, Cookie, ShoppingCart, Zap } from 'lucide-react';
import { Transaction, getTodayDateString, formatRupiah } from '../types';

interface QuickExpenseShortcutsProps {
  onQuickAdd: (tx: Omit<Transaction, 'id' | 'createdAt'>) => void;
}

export const QuickExpenseShortcuts: React.FC<QuickExpenseShortcutsProps> = ({ onQuickAdd }) => {
  const presets = [
    {
      title: 'Makan Siang',
      amount: 25000,
      category: 'Makanan & Minuman' as const,
      icon: Utensils,
    },
    {
      title: 'Kopi / Minum',
      amount: 18000,
      category: 'Makanan & Minuman' as const,
      icon: Coffee,
    },
    {
      title: 'Bensin Motor',
      amount: 25000,
      category: 'Transportasi' as const,
      icon: Fuel,
    },
    {
      title: 'Parkir',
      amount: 5000,
      category: 'Transportasi' as const,
      icon: CarFront,
    },
    {
      title: 'Camilan',
      amount: 15000,
      category: 'Makanan & Minuman' as const,
      icon: Cookie,
    },
    {
      title: 'Minimarket',
      amount: 50000,
      category: 'Belanja Harian' as const,
      icon: ShoppingCart,
    },
  ];

  return (
    <div className="neu-flat p-4 rounded-2xl">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-200">
          <Zap size={14} className="text-amber-500 fill-amber-500" />
          <span>Catat Instan 1-Klik</span>
        </div>
        <span className="text-[11px] text-slate-500 dark:text-slate-400">
          Pengeluaran harian umum
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {presets.map((item, idx) => {
          const Icon = item.icon;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => {
                onQuickAdd({
                  type: 'expense',
                  amount: item.amount,
                  category: item.category,
                  note: item.title,
                  date: getTodayDateString(),
                });
              }}
              className="neu-btn p-2.5 rounded-xl text-left flex flex-col justify-between hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer group"
              title={`Klik untuk langsung mencatat ${item.title} (${formatRupiah(item.amount)})`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="w-6 h-6 rounded-lg neu-convex flex items-center justify-center text-teal-600 dark:text-teal-400 group-hover:text-teal-500">
                  <Icon size={13} />
                </div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                  +Catat
                </span>
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                  {item.title}
                </div>
                <div className="text-[11px] font-mono font-semibold text-teal-600 dark:text-teal-400 tabular-nums">
                  {formatRupiah(item.amount)}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
