import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Trash2,
  Edit2,
  Calendar,
  CalendarRange,
  RotateCcw,
  Check,
  Inbox,
  CalendarDays,
  X,
  User,
} from 'lucide-react';
import {
  Transaction,
  Member,
  formatRupiah,
  formatDateIndo,
  formatShortDateIndo,
  getTodayDateString,
  getISODateString,
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
} from '../types';
import { CategoryIcon } from './CategoryIcon';

export type DatePeriodFilter =
  | 'all'
  | 'today'
  | 'yesterday'
  | 'this_week'
  | '7_days'
  | '30_days'
  | 'this_month'
  | 'last_month'
  | 'custom';

interface TransactionListProps {
  transactions: Transaction[];
  members?: Member[];
  initialMemberFilter?: string;
  onEdit: (tx: Transaction) => void;
  onDelete: (id: string) => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  members = [],
  initialMemberFilter = 'all',
  onEdit,
  onDelete,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'expense' | 'income'>('all');
  const [filterPeriod, setFilterPeriod] = useState<DatePeriodFilter>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedMember, setSelectedMember] = useState<string>(initialMemberFilter);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  React.useEffect(() => {
    if (initialMemberFilter) {
      setSelectedMember(initialMemberFilter);
    }
  }, [initialMemberFilter]);

  // Custom date range state
  const todayStr = getTodayDateString();
  const defaultSevenDaysAgo = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return getISODateString(d);
  }, []);

  const [customStartDate, setCustomStartDate] = useState<string>(defaultSevenDaysAgo);
  const [customEndDate, setCustomEndDate] = useState<string>(todayStr);
  const [isCustomDateOpen, setIsCustomDateOpen] = useState<boolean>(false);

  // Compute date boundaries
  const dateBoundaries = useMemo(() => {
    const now = new Date();
    const today = getISODateString(now);

    const yesterdayDate = new Date(now);
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterday = getISODateString(yesterdayDate);

    // This week (Monday to Sunday)
    const currentDay = now.getDay();
    const diffToMonday = now.getDate() - currentDay + (currentDay === 0 ? -6 : 1);
    const mondayDate = new Date(now);
    mondayDate.setDate(diffToMonday);
    const thisWeekStart = getISODateString(mondayDate);

    const sundayDate = new Date(mondayDate);
    sundayDate.setDate(sundayDate.getDate() + 6);
    const thisWeekEnd = getISODateString(sundayDate);

    // Last 7 days
    const sevenDaysAgoDate = new Date(now);
    sevenDaysAgoDate.setDate(sevenDaysAgoDate.getDate() - 6);
    const sevenDaysAgo = getISODateString(sevenDaysAgoDate);

    // Last 30 days
    const thirtyDaysAgoDate = new Date(now);
    thirtyDaysAgoDate.setDate(thirtyDaysAgoDate.getDate() - 29);
    const thirtyDaysAgo = getISODateString(thirtyDaysAgoDate);

    // This month
    const thisMonthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const thisMonthEnd = getISODateString(lastDayOfMonth);

    // Last month
    const lastMonthStartDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEndDate = new Date(now.getFullYear(), now.getMonth(), 0);
    const lastMonthStart = getISODateString(lastMonthStartDate);
    const lastMonthEnd = getISODateString(lastMonthEndDate);

    return {
      today,
      yesterday,
      thisWeekStart,
      thisWeekEnd,
      sevenDaysAgo,
      thirtyDaysAgo,
      thisMonthStart,
      thisMonthEnd,
      lastMonthStart,
      lastMonthEnd,
    };
  }, []);

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((tx) => {
        // Type filter
        if (filterType !== 'all' && tx.type !== filterType) return false;

        // Date Period filter
        switch (filterPeriod) {
          case 'today':
            if (tx.date !== dateBoundaries.today) return false;
            break;
          case 'yesterday':
            if (tx.date !== dateBoundaries.yesterday) return false;
            break;
          case 'this_week':
            if (tx.date < dateBoundaries.thisWeekStart || tx.date > dateBoundaries.thisWeekEnd) return false;
            break;
          case '7_days':
            if (tx.date < dateBoundaries.sevenDaysAgo || tx.date > dateBoundaries.today) return false;
            break;
          case '30_days':
            if (tx.date < dateBoundaries.thirtyDaysAgo || tx.date > dateBoundaries.today) return false;
            break;
          case 'this_month':
            if (tx.date < dateBoundaries.thisMonthStart || tx.date > dateBoundaries.thisMonthEnd) return false;
            break;
          case 'last_month':
            if (tx.date < dateBoundaries.lastMonthStart || tx.date > dateBoundaries.lastMonthEnd) return false;
            break;
          case 'custom':
            if (customStartDate && tx.date < customStartDate) return false;
            if (customEndDate && tx.date > customEndDate) return false;
            break;
          case 'all':
          default:
            break;
        }

        // Category filter
        if (selectedCategory !== 'all' && tx.category !== selectedCategory) return false;

        // Member filter
        if (selectedMember !== 'all') {
          if (tx.memberId !== selectedMember && tx.memberName !== selectedMember) {
            return false;
          }
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchNote = tx.note.toLowerCase().includes(q);
          const matchCategory =
            tx.category.toLowerCase().includes(q) ||
            Boolean(tx.customCategory && tx.customCategory.toLowerCase().includes(q));
          const matchMember = Boolean(tx.memberName && tx.memberName.toLowerCase().includes(q));
          const matchAmount = tx.amount.toString().includes(q);
          if (!matchNote && !matchCategory && !matchAmount && !matchMember) return false;
        }

        return true;
      })
      .sort((a, b) => {
        // Sort by date desc, then by createdAt desc
        if (b.date !== a.date) {
          return b.date.localeCompare(a.date);
        }
        return b.createdAt - a.createdAt;
      });
  }, [
    transactions,
    filterType,
    filterPeriod,
    dateBoundaries,
    customStartDate,
    customEndDate,
    selectedCategory,
    selectedMember,
    searchQuery,
  ]);

  // Subtotals for the currently filtered view
  const { totalFilteredExpense, totalFilteredIncome } = useMemo(() => {
    let exp = 0;
    let inc = 0;
    filteredTransactions.forEach((tx) => {
      if (tx.type === 'expense') exp += tx.amount;
      else inc += tx.amount;
    });
    return { totalFilteredExpense: exp, totalFilteredIncome: inc };
  }, [filteredTransactions]);

  // Group by date
  const groupedByDate = useMemo(() => {
    const groups: { date: string; displayDate: string; items: Transaction[]; totalDayExpense: number }[] = [];
    const map = new Map<string, Transaction[]>();

    filteredTransactions.forEach((tx) => {
      const list = map.get(tx.date) || [];
      list.push(tx);
      map.set(tx.date, list);
    });

    map.forEach((items, date) => {
      const totalDayExpense = items
        .filter((i) => i.type === 'expense')
        .reduce((sum, curr) => sum + curr.amount, 0);

      groups.push({
        date,
        displayDate: formatDateIndo(date),
        items,
        totalDayExpense,
      });
    });

    return groups;
  }, [filteredTransactions]);

  const confirmDelete = (id: string) => {
    onDelete(id);
    setDeletingId(null);
  };

  const handlePeriodChange = (newPeriod: DatePeriodFilter) => {
    setFilterPeriod(newPeriod);
    if (newPeriod === 'custom') {
      setIsCustomDateOpen(true);
    } else {
      setIsCustomDateOpen(false);
    }
  };

  const resetAllFilters = () => {
    setFilterPeriod('all');
    setFilterType('all');
    setSelectedCategory('all');
    setSelectedMember('all');
    setSearchQuery('');
    setIsCustomDateOpen(false);
  };

  // Human-readable active date range label
  const periodLabel = useMemo(() => {
    switch (filterPeriod) {
      case 'today':
        return 'Hari Ini';
      case 'yesterday':
        return 'Kemarin';
      case 'this_week':
        return `Minggu Ini (${formatShortDateIndo(dateBoundaries.thisWeekStart)} - ${formatShortDateIndo(dateBoundaries.thisWeekEnd)})`;
      case '7_days':
        return `7 Hari Terakhir (${formatShortDateIndo(dateBoundaries.sevenDaysAgo)} - ${formatShortDateIndo(dateBoundaries.today)})`;
      case '30_days':
        return `30 Hari Terakhir (${formatShortDateIndo(dateBoundaries.thirtyDaysAgo)} - ${formatShortDateIndo(dateBoundaries.today)})`;
      case 'this_month':
        return 'Bulan Ini';
      case 'last_month':
        return `Bulan Lalu (${formatShortDateIndo(dateBoundaries.lastMonthStart)} - ${formatShortDateIndo(dateBoundaries.lastMonthEnd)})`;
      case 'custom':
        if (customStartDate && customEndDate) {
          return `${formatShortDateIndo(customStartDate)} – ${formatShortDateIndo(customEndDate)}`;
        } else if (customStartDate) {
          return `Mulai ${formatShortDateIndo(customStartDate)}`;
        } else if (customEndDate) {
          return `Sampai ${formatShortDateIndo(customEndDate)}`;
        }
        return 'Rentang Kustom';
      case 'all':
      default:
        return 'Semua Waktu';
    }
  }, [filterPeriod, dateBoundaries, customStartDate, customEndDate]);

  return (
    <div className="neu-flat p-5 md:p-6 rounded-3xl space-y-5">
      {/* Header and Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            Riwayat Transaksi
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
              {filteredTransactions.length}
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Daftar pengeluaran dan pemasukan tersimpan
          </p>
        </div>

        {/* Search Input Bar (Recessed 3D Debossed) */}
        <div className="neu-sunken-sm px-3 py-1.5 rounded-xl flex items-center gap-2 w-full md:w-64">
          <Search size={14} className="text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Cari transaksi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-none outline-none text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
              title="Hapus pencarian"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Main Filter Bar */}
      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-black/[0.04] dark:border-white/[0.05]">
        {/* Type Filter Buttons */}
        <div className="neu-sunken-sm p-1 rounded-xl flex items-center gap-1 text-xs">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1 font-semibold rounded-lg transition-all cursor-pointer ${
              filterType === 'all'
                ? 'neu-btn text-teal-600 dark:text-teal-400'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
            }`}
          >
            Semua
          </button>
          <button
            onClick={() => setFilterType('expense')}
            className={`px-3 py-1 font-semibold rounded-lg transition-all cursor-pointer ${
              filterType === 'expense'
                ? 'neu-btn text-rose-600 dark:text-rose-400'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
            }`}
          >
            Pengeluaran
          </button>
          <button
            onClick={() => setFilterType('income')}
            className={`px-3 py-1 font-semibold rounded-lg transition-all cursor-pointer ${
              filterType === 'income'
                ? 'neu-btn text-emerald-600 dark:text-emerald-400'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
            }`}
          >
            Pemasukan
          </button>
        </div>

        {/* Date Period Dropdown Selector */}
        <div className="neu-sunken-sm px-2.5 py-1 rounded-xl flex items-center gap-1.5 text-xs">
          <CalendarDays size={14} className="text-teal-600 dark:text-teal-400 shrink-0" />
          <label htmlFor="period-select" className="sr-only">
            Rentang Waktu
          </label>
          <select
            id="period-select"
            value={filterPeriod}
            onChange={(e) => handlePeriodChange(e.target.value as DatePeriodFilter)}
            className="bg-transparent border-none outline-none text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer pr-1"
          >
            <option value="all" className="dark:bg-slate-900">
              Semua Waktu
            </option>
            <option value="today" className="dark:bg-slate-900">
              Hari Ini
            </option>
            <option value="yesterday" className="dark:bg-slate-900">
              Kemarin
            </option>
            <option value="this_week" className="dark:bg-slate-900">
              Minggu Ini (Sen - Min)
            </option>
            <option value="7_days" className="dark:bg-slate-900">
              7 Hari Terakhir
            </option>
            <option value="30_days" className="dark:bg-slate-900">
              30 Hari Terakhir
            </option>
            <option value="this_month" className="dark:bg-slate-900">
              Bulan Ini
            </option>
            <option value="last_month" className="dark:bg-slate-900">
              Bulan Lalu
            </option>
            <option value="custom" className="dark:bg-slate-900">
              Rentang Kustom...
            </option>
          </select>
        </div>

        {/* Toggle Button for Custom Date Range Picker */}
        <button
          onClick={() => {
            const next = !isCustomDateOpen;
            setIsCustomDateOpen(next);
            if (next && filterPeriod !== 'custom') {
              setFilterPeriod('custom');
            }
          }}
          className={`neu-btn px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
            filterPeriod === 'custom' || isCustomDateOpen
              ? 'neu-btn-active text-teal-600 dark:text-teal-400 font-bold'
              : 'text-slate-600 dark:text-slate-300'
          }`}
          title="Buka / Tutup Pemilih Rentang Tanggal Spesifik"
        >
          <CalendarRange size={13} className="text-teal-600 dark:text-teal-400" />
          <span>Rentang Kustom</span>
        </button>

        {/* Member Filter Selector */}
        {members && members.length > 0 && (
          <div className="neu-sunken-sm px-2.5 py-1 rounded-xl flex items-center gap-1.5 text-xs">
            <User size={13} className="text-teal-600 dark:text-teal-400 shrink-0" />
            <select
              value={selectedMember}
              onChange={(e) => setSelectedMember(e.target.value)}
              className="bg-transparent border-none outline-none text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
            >
              <option value="all" className="dark:bg-slate-900">
                Semua Anggota
              </option>
              {members.map((m) => (
                <option key={m.id} value={m.name} className="dark:bg-slate-900">
                  {m.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Category Filter Selector */}
        <div className="neu-sunken-sm px-2.5 py-1 rounded-xl flex items-center gap-1 text-xs ml-auto">
          <Filter size={13} className="text-slate-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-transparent border-none outline-none text-xs font-medium text-slate-700 dark:text-slate-200 cursor-pointer"
          >
            <option value="all" className="dark:bg-slate-900">
              Semua Kategori
            </option>
            {EXPENSE_CATEGORIES.map((c) => (
              <option key={c.name} value={c.name} className="dark:bg-slate-900">
                {c.name}
              </option>
            ))}
            {INCOME_CATEGORIES.map((c) => (
              <option key={c.name} value={c.name} className="dark:bg-slate-900">
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Expandable Custom Date Range Picker Panel */}
      {isCustomDateOpen && (
        <div className="neu-flat p-4 rounded-2xl space-y-3 border border-teal-500/20 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarRange size={15} className="text-teal-600 dark:text-teal-400" />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                Tentukan Rentang Tanggal Spesifik
              </span>
            </div>
            <button
              onClick={() => setIsCustomDateOpen(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              title="Tutup panel rentang kustom"
            >
              <X size={15} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Start Date */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Dari Tanggal (Mulai)
              </label>
              <div className="neu-sunken rounded-xl px-3 py-2 flex items-center">
                <input
                  type="date"
                  value={customStartDate}
                  max={customEndDate || todayStr}
                  onChange={(e) => {
                    const val = e.target.value;
                    setCustomStartDate(val);
                    if (filterPeriod !== 'custom') setFilterPeriod('custom');
                  }}
                  className="w-full bg-transparent border-none outline-none text-xs font-mono font-medium text-slate-800 dark:text-slate-100 cursor-pointer"
                />
              </div>
            </div>

            {/* End Date */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Sampai Tanggal (Selesai)
              </label>
              <div className="neu-sunken rounded-xl px-3 py-2 flex items-center">
                <input
                  type="date"
                  value={customEndDate}
                  min={customStartDate}
                  onChange={(e) => {
                    const val = e.target.value;
                    setCustomEndDate(val);
                    if (filterPeriod !== 'custom') setFilterPeriod('custom');
                  }}
                  className="w-full bg-transparent border-none outline-none text-xs font-mono font-medium text-slate-800 dark:text-slate-100 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Quick preset chips within custom range */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-black/[0.04] dark:border-white/[0.05]">
            <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
              <span className="text-slate-500 dark:text-slate-400 mr-1">Pintasan Cepat:</span>
              <button
                type="button"
                onClick={() => {
                  setCustomStartDate(todayStr);
                  setCustomEndDate(todayStr);
                  setFilterPeriod('custom');
                }}
                className="neu-btn px-2 py-0.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-teal-600 cursor-pointer"
              >
                Hari Ini
              </button>
              <button
                type="button"
                onClick={() => {
                  setCustomStartDate(dateBoundaries.sevenDaysAgo);
                  setCustomEndDate(todayStr);
                  setFilterPeriod('custom');
                }}
                className="neu-btn px-2 py-0.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-teal-600 cursor-pointer"
              >
                7 Hari
              </button>
              <button
                type="button"
                onClick={() => {
                  setCustomStartDate(dateBoundaries.thirtyDaysAgo);
                  setCustomEndDate(todayStr);
                  setFilterPeriod('custom');
                }}
                className="neu-btn px-2 py-0.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-teal-600 cursor-pointer"
              >
                30 Hari
              </button>
              <button
                type="button"
                onClick={() => {
                  setCustomStartDate(dateBoundaries.thisMonthStart);
                  setCustomEndDate(dateBoundaries.thisMonthEnd);
                  setFilterPeriod('custom');
                }}
                className="neu-btn px-2 py-0.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-teal-600 cursor-pointer"
              >
                Bulan Ini
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                setFilterPeriod('all');
                setIsCustomDateOpen(false);
              }}
              className="text-xs text-rose-500 hover:underline font-medium cursor-pointer"
            >
              Reset ke Semua Waktu
            </button>
          </div>
        </div>
      )}

      {/* Date Range Summary Bar */}
      {filterPeriod !== 'all' && (
        <div className="neu-flat p-3 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs bg-teal-500/5 border border-teal-500/10">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              Rentang Aktif: <strong className="text-teal-700 dark:text-teal-300">{periodLabel}</strong>
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono tabular-nums">
            {totalFilteredExpense > 0 && (
              <span className="text-slate-600 dark:text-slate-300">
                Pengeluaran:{' '}
                <strong className="text-rose-600 dark:text-rose-400 font-bold">
                  {formatRupiah(totalFilteredExpense)}
                </strong>
              </span>
            )}
            {totalFilteredIncome > 0 && (
              <span className="text-slate-600 dark:text-slate-300">
                Pemasukan:{' '}
                <strong className="text-emerald-600 dark:text-emerald-400 font-bold">
                  {formatRupiah(totalFilteredIncome)}
                </strong>
              </span>
            )}
            <button
              onClick={() => handlePeriodChange('all')}
              className="text-teal-600 dark:text-teal-400 hover:underline font-medium cursor-pointer font-sans"
            >
              Hapus Filter Tanggal
            </button>
          </div>
        </div>
      )}

      {/* Transaction List content */}
      {groupedByDate.length === 0 ? (
        <div className="py-12 text-center flex flex-col items-center justify-center">
          <div className="w-14 h-14 rounded-2xl neu-convex flex items-center justify-center text-slate-400 mb-3">
            <Inbox size={26} />
          </div>
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200">
            Tidak ada transaksi ditemukan
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-1">
            {searchQuery || filterType !== 'all' || filterPeriod !== 'all' || selectedCategory !== 'all'
              ? `Tidak ada transaksi yang cocok pada periode "${periodLabel}". Coba sesuaikan rentang waktu atau filter pencarian Anda.`
              : 'Belum ada transaksi yang tercatat. Silakan catat pengeluaran harian menggunakan formulir di sebelah kiri.'}
          </p>
          {(searchQuery || filterType !== 'all' || filterPeriod !== 'all' || selectedCategory !== 'all') && (
            <button
              onClick={resetAllFilters}
              className="neu-btn mt-3 px-3 py-1.5 rounded-xl text-xs font-semibold text-teal-600 dark:text-teal-400 flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw size={13} />
              Reset Semua Filter
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-5">
          {groupedByDate.map((group) => (
            <div key={group.date} className="space-y-2">
              {/* Date Group Header */}
              <div className="flex items-center justify-between px-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
                <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Calendar size={13} className="text-teal-600 dark:text-teal-400" />
                  {group.displayDate}
                </span>
                {group.totalDayExpense > 0 && (
                  <span className="font-mono tabular-nums text-[11px]">
                    Total belanja: {formatRupiah(group.totalDayExpense)}
                  </span>
                )}
              </div>

              {/* Transactions in Date Group */}
              <div className="space-y-2">
                {group.items.map((tx) => {
                  const isExpense = tx.type === 'expense';
                  const isDeleting = deletingId === tx.id;

                  return (
                    <div
                      key={tx.id}
                      className="neu-flat p-3.5 rounded-2xl flex items-center justify-between gap-3 group transition-transform hover:translate-y-[-1px] relative"
                    >
                      {/* Left: Icon & Note */}
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-10 h-10 rounded-xl neu-convex flex items-center justify-center shrink-0 ${
                            isExpense ? 'text-rose-500' : 'text-emerald-500'
                          }`}
                        >
                          <CategoryIcon name={tx.category} size={18} />
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">
                            {tx.note}
                          </div>
                          {/* Clean unboxed metadata with dot separator (Zero-pill discipline) */}
                          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                            <span>
                              {tx.category === 'Lainnya' && tx.customCategory
                                ? `Lainnya (${tx.customCategory})`
                                : tx.category}
                            </span>
                            {tx.memberName && (
                              <>
                                <span aria-hidden="true">·</span>
                                <span className="font-semibold text-slate-700 dark:text-slate-300">
                                  {tx.memberName}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right: Amount & Actions */}
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right">
                          <div
                            className={`text-sm md:text-base font-bold font-mono tracking-tight tabular-nums ${
                              isExpense
                                ? 'text-rose-600 dark:text-rose-400'
                                : 'text-emerald-600 dark:text-emerald-400'
                            }`}
                          >
                            {isExpense ? '-' : '+'} {formatRupiah(tx.amount)}
                          </div>
                          <div className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-semibold">
                            {isExpense ? 'Pengeluaran' : 'Pemasukan'}
                          </div>
                        </div>

                        {/* Action buttons (Edit & Delete) */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => onEdit(tx)}
                            className="neu-btn w-8 h-8 rounded-xl flex items-center justify-center text-slate-500 hover:text-teal-600 dark:hover:text-teal-400 transition-colors cursor-pointer"
                            title="Edit Transaksi"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            onClick={() => setDeletingId(tx.id)}
                            className="neu-btn w-8 h-8 rounded-xl flex items-center justify-center text-slate-500 hover:text-rose-500 transition-colors cursor-pointer"
                            title="Hapus Transaksi"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>

                      {/* Inline Delete Confirmation Dialog */}
                      {isDeleting && (
                        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs rounded-2xl flex items-center justify-between px-4 z-10 animate-fade-in">
                          <span className="text-xs font-semibold text-white truncate max-w-[60%]">
                            Hapus transaksi "{tx.note}"?
                          </span>
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => setDeletingId(null)}
                              className="px-2.5 py-1 text-xs rounded-lg bg-white/20 hover:bg-white/30 text-white font-medium cursor-pointer"
                            >
                              Batal
                            </button>
                            <button
                              onClick={() => confirmDelete(tx.id)}
                              className="px-2.5 py-1 text-xs rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold cursor-pointer"
                            >
                              Ya, Hapus
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
