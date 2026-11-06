import React from 'react';
import {
  ArrowDownRight,
  ArrowUpRight,
  HandCoins,
  Wallet,
  ArrowRightLeft,
  Plus,
  ReceiptText,
  Calendar,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Users,
} from 'lucide-react';
import { Transaction, BudgetConfig, LoanRecord, formatRupiah, formatDateIndo } from '../types';
import { CategoryIcon } from './CategoryIcon';
import { QuickExpenseShortcuts } from './QuickExpenseShortcuts';

interface HomeDashboardProps {
  totalIncome: number;
  totalExpense: number;
  totalBorrowed: number; // Dipinjam
  netBalance: number; // Sisa Saldo
  incomeCount: number;
  expenseCount: number;
  unpaidLoansCount: number;
  budget: BudgetConfig;
  todayExpense: number;
  recentTransactions: Transaction[];
  onNavigateToMembers?: () => void;
  onOpenQuickAddForm: () => void;
  onOpenLoanModal: () => void;
  onOpenBudgetModal: () => void;
  onQuickAdd: (tx: Omit<Transaction, 'id' | 'createdAt'>) => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  totalIncome,
  totalExpense,
  totalBorrowed,
  netBalance,
  incomeCount,
  expenseCount,
  unpaidLoansCount,
  budget,
  todayExpense,
  recentTransactions,
  onNavigateToMembers,
  onOpenQuickAddForm,
  onOpenLoanModal,
  onOpenBudgetModal,
  onQuickAdd,
}) => {
  const dailyLimit = budget.enabled ? budget.dailyLimit : 0;
  const budgetPercentage = dailyLimit > 0 ? Math.min(Math.round((todayExpense / dailyLimit) * 100), 100) : 0;
  const isOverBudget = dailyLimit > 0 && todayExpense > dailyLimit;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 4 Core Financial Cards: Pemasukan, Pengeluaran, Dipinjam, Sisa Saldo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Kartu Pemasukan */}
        <div className="neu-flat p-5 rounded-3xl relative overflow-hidden transition-all hover:translate-y-[-2px] group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
              Total Pemasukan
            </span>
            <div className="w-10 h-10 rounded-2xl neu-convex flex items-center justify-center text-emerald-500 group-hover:scale-105 transition-transform">
              <ArrowUpRight size={20} className="stroke-[2.5]" />
            </div>
          </div>
          <div className="text-2xl font-extrabold font-mono tracking-tight text-emerald-600 dark:text-emerald-400 tabular-nums">
            {formatRupiah(totalIncome)}
          </div>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <span>{incomeCount} transaksi masuk</span>
            <span aria-hidden="true">·</span>
            <span>Arus Kas Masuk</span>
          </div>
        </div>

        {/* Card 2: Kartu Pengeluaran */}
        <div className="neu-flat p-5 rounded-3xl relative overflow-hidden transition-all hover:translate-y-[-2px] group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
              Total Pengeluaran
            </span>
            <div className="w-10 h-10 rounded-2xl neu-convex flex items-center justify-center text-rose-500 group-hover:scale-105 transition-transform">
              <ArrowDownRight size={20} className="stroke-[2.5]" />
            </div>
          </div>
          <div className="text-2xl font-extrabold font-mono tracking-tight text-rose-600 dark:text-rose-400 tabular-nums">
            {formatRupiah(totalExpense)}
          </div>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <span>{expenseCount} transaksi belanja</span>
            <span aria-hidden="true">·</span>
            <span>Arus Kas Keluar</span>
          </div>
        </div>

        {/* Card 3: Kartu Dipinjam */}
        <div
          onClick={onOpenLoanModal}
          className="neu-flat p-5 rounded-3xl relative overflow-hidden transition-all hover:translate-y-[-2px] group cursor-pointer"
          title="Klik untuk melihat dan kelola rincian pinjaman"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
              Dipinjam
            </span>
            <div className="w-10 h-10 rounded-2xl neu-convex flex items-center justify-center text-amber-500 group-hover:scale-105 transition-transform">
              <HandCoins size={20} className="stroke-[2.5]" />
            </div>
          </div>
          <div className="text-2xl font-extrabold font-mono tracking-tight text-amber-600 dark:text-amber-400 tabular-nums">
            {formatRupiah(totalBorrowed)}
          </div>
          <div className="mt-2.5 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>{unpaidLoansCount} belum lunas</span>
            <span className="text-[11px] font-semibold text-teal-600 dark:text-teal-400 group-hover:underline">
              Kelola →
            </span>
          </div>
        </div>

        {/* Card 4: Kartu Sisa Saldo */}
        <div className="neu-flat p-5 rounded-3xl relative overflow-hidden transition-all hover:translate-y-[-2px] group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
              Sisa Saldo
            </span>
            <div className="w-10 h-10 rounded-2xl neu-convex flex items-center justify-center text-teal-600 dark:text-teal-400 group-hover:scale-105 transition-transform">
              <Wallet size={20} className="stroke-[2.5]" />
            </div>
          </div>
          <div
            className={`text-2xl font-extrabold font-mono tracking-tight tabular-nums ${
              netBalance >= 0 ? 'text-teal-600 dark:text-teal-400' : 'text-rose-600 dark:text-rose-400'
            }`}
          >
            {formatRupiah(netBalance)}
          </div>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <span>{netBalance >= 0 ? 'Saldo Positif' : 'Defisit Saldo'}</span>
            <span aria-hidden="true">·</span>
            <span>Kas Tersedia</span>
          </div>
        </div>
      </div>

      {/* Kartu Halaman Utama Finansial (Dipindahkan tepat di bawah Kartu Sisa Saldo) */}
      <div className="neu-flat p-5 md:p-6 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
            Halaman Utama Finansial
          </span>
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
            Ringkasan Keuangan Anda
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Pantau arus kas harian, catatan uang dipinjam, dan sisa saldo riil
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            type="button"
            onClick={onOpenQuickAddForm}
            className="neu-btn px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer hover:text-teal-600 dark:hover:text-teal-400"
          >
            <Plus size={15} />
            <span>+ Catat Baru</span>
          </button>

          <button
            onClick={onOpenLoanModal}
            className="neu-btn px-3.5 py-2 rounded-xl text-xs font-semibold text-amber-700 dark:text-amber-300 flex items-center gap-1.5 cursor-pointer"
            title="Kelola Catatan Uang Dipinjam"
          >
            <HandCoins size={14} className="text-amber-500" />
            <span>Kelola Pinjaman</span>
          </button>
        </div>
      </div>

      {/* Daily Budget Limit Alert Card */}
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
                    ? 'Peringatan: Pengeluaran Hari Ini Melebihi Batas Anggaran!'
                    : 'Target Anggaran Harian'}
                </span>
              </div>
              <span className="font-mono tabular-nums">
                {formatRupiah(todayExpense)} / {formatRupiah(dailyLimit)} ({budgetPercentage}%)
              </span>
            </div>

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
            <button
              onClick={onOpenBudgetModal}
              className="text-xs text-teal-600 dark:text-teal-400 hover:underline font-semibold cursor-pointer"
            >
              Atur Limit Harian
            </button>
          </div>
        </div>
      )}

      {/* 1-Click Fast Expense Shortcuts */}
      <QuickExpenseShortcuts onQuickAdd={onQuickAdd} />

      {/* Recent Transactions Preview Section on Starting Page */}
      <div className="neu-flat p-5 md:p-6 rounded-3xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              Aktivitas Transaksi Terkini
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Transaksi terakhir yang baru dicatat
            </p>
          </div>
        </div>

        {recentTransactions.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500">
            Belum ada transaksi. Klik tombol transaksi di atas untuk mulai mencatat!
          </div>
        ) : (
          <div className="space-y-2.5">
            {recentTransactions.slice(0, 4).map((tx) => {
              const isExpense = tx.type === 'expense';
              return (
                <div
                  key={tx.id}
                  className="neu-flat p-3 rounded-2xl flex items-center justify-between gap-3 transition-transform hover:translate-y-[-1px]"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl neu-convex flex items-center justify-center shrink-0 ${
                        isExpense ? 'text-rose-500' : 'text-emerald-500'
                      }`}
                    >
                      <CategoryIcon name={tx.category} size={16} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs md:text-sm font-bold text-slate-800 dark:text-slate-100 truncate">
                        {tx.note}
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                        <span>{formatDateIndo(tx.date)}</span>
                        <span aria-hidden="true">·</span>
                        <span>
                          {tx.category === 'Lainnya' && tx.customCategory
                            ? `Lainnya (${tx.customCategory})`
                            : tx.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div
                      className={`text-xs md:text-sm font-bold font-mono tracking-tight tabular-nums ${
                        isExpense ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
                      }`}
                    >
                      {isExpense ? '-' : '+'} {formatRupiah(tx.amount)}
                    </div>
                    {tx.memberName && (
                      <div className="text-[10px] text-slate-400">{tx.memberName}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
