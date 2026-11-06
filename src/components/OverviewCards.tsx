import React from 'react';
import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarCheck,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { formatRupiah, BudgetConfig } from '../types';

interface OverviewCardsProps {
  todayExpense: number;
  todayIncome: number;
  monthExpense: number;
  netBalance: number;
  budget: BudgetConfig;
  onOpenBudgetModal: () => void;
}

export const OverviewCards: React.FC<OverviewCardsProps> = ({
  todayExpense,
  todayIncome,
  monthExpense,
  netBalance,
  budget,
  onOpenBudgetModal,
}) => {
  const dailyLimit = budget.enabled ? budget.dailyLimit : 0;
  const budgetPercentage = dailyLimit > 0 ? Math.min(Math.round((todayExpense / dailyLimit) * 100), 100) : 0;
  const remainingDailyBudget = dailyLimit > 0 ? dailyLimit - todayExpense : 0;
  const isOverBudget = dailyLimit > 0 && todayExpense > dailyLimit;

  return (
    <div className="space-y-4">
      {/* 4 Responsive Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Pengeluaran Hari Ini */}
        <div className="neu-flat p-4 rounded-2xl relative overflow-hidden transition-all hover:translate-y-[-2px]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Pengeluaran Hari Ini
            </span>
            <div className="w-8 h-8 rounded-xl neu-convex flex items-center justify-center text-rose-500">
              <ArrowDownRight size={17} />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono tracking-tight text-rose-600 dark:text-rose-400 tabular-nums">
            {formatRupiah(todayExpense)}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <span>Batas: {budget.enabled ? formatRupiah(budget.dailyLimit) : 'Tanpa Batas'}</span>
          </div>
        </div>

        {/* Card 2: Pemasukan Hari Ini */}
        <div className="neu-flat p-4 rounded-2xl relative overflow-hidden transition-all hover:translate-y-[-2px]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Pemasukan Hari Ini
            </span>
            <div className="w-8 h-8 rounded-xl neu-convex flex items-center justify-center text-emerald-500">
              <ArrowUpRight size={17} />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono tracking-tight text-emerald-600 dark:text-emerald-400 tabular-nums">
            {formatRupiah(todayIncome)}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <span>Arus masuk hari ini</span>
          </div>
        </div>

        {/* Card 3: Pengeluaran Bulan Ini */}
        <div className="neu-flat p-4 rounded-2xl relative overflow-hidden transition-all hover:translate-y-[-2px]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Pengeluaran Bulan Ini
            </span>
            <div className="w-8 h-8 rounded-xl neu-convex flex items-center justify-center text-indigo-500">
              <CalendarCheck size={17} />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono tracking-tight text-slate-800 dark:text-slate-100 tabular-nums">
            {formatRupiah(monthExpense)}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <span>Akumulasi bulan berjalan</span>
          </div>
        </div>

        {/* Card 4: Saldo Arus Kas Bersih */}
        <div className="neu-flat p-4 rounded-2xl relative overflow-hidden transition-all hover:translate-y-[-2px]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Arus Kas Bersih
            </span>
            <div className="w-8 h-8 rounded-xl neu-convex flex items-center justify-center text-teal-600 dark:text-teal-400">
              <TrendingDown size={17} />
            </div>
          </div>
          <div
            className={`text-2xl font-bold font-mono tracking-tight tabular-nums ${
              netBalance >= 0 ? 'text-teal-600 dark:text-teal-400' : 'text-rose-600 dark:text-rose-400'
            }`}
          >
            {formatRupiah(netBalance)}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <span>Total Pemasukan - Pengeluaran</span>
          </div>
        </div>
      </div>

      {/* Daily Budget Progress Banner (Neumorphic Card) */}
      {budget.enabled && (
        <div className="neu-flat p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
              <div className="flex items-center gap-1.5">
                {isOverBudget ? (
                  <AlertTriangle size={15} className="text-rose-500" />
                ) : (
                  <CheckCircle2 size={15} className="text-emerald-500" />
                )}
                <span>
                  {isOverBudget
                    ? 'Peringatan: Melebihi Batas Anggaran Harian!'
                    : 'Target Anggaran Harian Terkendali'}
                </span>
              </div>
              <span className="font-mono tabular-nums">
                {formatRupiah(todayExpense)} / {formatRupiah(dailyLimit)} ({budgetPercentage}%)
              </span>
            </div>

            {/* Recessed Neumorphic Progress Bar */}
            <div className="h-3 rounded-full neu-sunken p-0.5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isOverBudget
                    ? 'bg-rose-500'
                    : budgetPercentage > 80
                    ? 'bg-amber-500'
                    : 'bg-teal-500'
                }`}
                style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between md:justify-end gap-3 text-xs shrink-0">
            <div className="text-slate-500 dark:text-slate-400">
              Sisa hari ini:{' '}
              <span
                className={`font-semibold font-mono tabular-nums ${
                  remainingDailyBudget < 0
                    ? 'text-rose-600 dark:text-rose-400'
                    : 'text-teal-600 dark:text-teal-400'
                }`}
              >
                {remainingDailyBudget < 0
                  ? `-${formatRupiah(Math.abs(remainingDailyBudget))}`
                  : formatRupiah(remainingDailyBudget)}
              </span>
            </div>
            <button
              onClick={onOpenBudgetModal}
              className="text-xs text-teal-600 dark:text-teal-400 hover:underline font-medium cursor-pointer"
            >
              Ubah Limit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
