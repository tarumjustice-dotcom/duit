import React from 'react';
import {
  Sun,
  Moon,
  SlidersHorizontal,
  Download,
  Sparkles,
  LayoutDashboard,
  ReceiptText,
  HandCoins,
  Users,
  LogOut,
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'home' | 'transactions' | 'members';
  setActiveTab: (tab: 'home' | 'transactions' | 'members') => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  onOpenBudgetModal: () => void;
  onOpenExportModal: () => void;
  onOpenLoanModal: () => void;
  onLogout?: () => void;
  unpaidLoansCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isDarkMode,
  toggleDarkMode,
  onOpenBudgetModal,
  onOpenExportModal,
  onOpenLoanModal,
  onLogout,
  unpaidLoansCount = 0,
}) => {
  return (
    <header className="sticky top-0 z-30 px-4 md:px-8 py-2.5 backdrop-blur-md bg-opacity-95 transition-colors border-b border-black/[0.04] dark:border-white/[0.05]">
      <div className="max-w-6xl mx-auto space-y-2">
        {/* Baris Atas: Brand Wordmark (Kiri) & Tombol Utilitas (Kanan) */}
        <div className="flex items-center justify-between gap-4">
          {/* Brand Wordmark (Clickable to Home) */}
          <button
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2.5 shrink-0 text-left cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-2xl neu-convex flex items-center justify-center text-teal-600 dark:text-teal-400 group-hover:scale-105 transition-transform">
              <Sparkles size={18} className="stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                Kupit
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300">
                  Finansial
                </span>
              </h1>
            </div>
          </button>

          {/* Utility Action Buttons (Right) */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onOpenLoanModal}
              className="neu-btn px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-amber-600 dark:hover:text-amber-400 flex items-center gap-1.5 cursor-pointer"
              title="Kelola Catatan Uang Dipinjam"
            >
              <HandCoins size={14} className="text-amber-500" />
              <span className="hidden sm:inline">Dipinjam</span>
            </button>

            <button
              onClick={onOpenBudgetModal}
              className="neu-btn px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer"
              title="Atur Batas Anggaran Harian"
            >
              <SlidersHorizontal size={14} className="text-teal-600 dark:text-teal-400" />
              <span className="hidden sm:inline">Anggaran</span>
            </button>

            <button
              onClick={onOpenExportModal}
              className="neu-btn px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer"
              title="Ekspor CSV atau Kelola Data"
            >
              <Download size={14} className="text-slate-600 dark:text-slate-300" />
              <span className="hidden sm:inline">Ekspor</span>
            </button>

            <button
              onClick={toggleDarkMode}
              className="neu-btn w-8 h-8 rounded-xl flex items-center justify-center text-slate-700 dark:text-amber-400 transition-all cursor-pointer"
              title={isDarkMode ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap'}
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {onLogout && (
              <button
                onClick={onLogout}
                className="neu-btn w-8 h-8 rounded-xl flex items-center justify-center text-rose-500 hover:text-rose-600 transition-all cursor-pointer"
                title="Keluar dari Akun (Logout)"
                aria-label="Logout"
              >
                <LogOut size={15} />
              </button>
            )}
          </div>
        </div>

        {/* Baris Bawah: Tombol Beranda, Transaksi, Anggota Diturunkan & Posisi Ditengah */}
        <div className="flex justify-center items-center pt-1 border-t border-black/[0.03] dark:border-white/[0.04]">
          <nav className="neu-sunken-sm p-1 rounded-2xl flex items-center gap-1 max-w-md w-full sm:w-auto justify-center">
            <button
              onClick={() => setActiveTab('home')}
              className={`flex-1 sm:flex-initial px-4 md:px-6 py-2 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap shrink-0 ${
                activeTab === 'home'
                  ? 'neu-btn text-teal-600 dark:text-teal-400 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <LayoutDashboard size={15} />
              <span>Beranda</span>
            </button>

            <button
              onClick={() => setActiveTab('transactions')}
              className={`flex-1 sm:flex-initial px-4 md:px-6 py-2 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap shrink-0 ${
                activeTab === 'transactions'
                  ? 'neu-btn text-teal-600 dark:text-teal-400 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <ReceiptText size={15} />
              <span>Transaksi</span>
            </button>

            <button
              onClick={() => setActiveTab('members')}
              className={`flex-1 sm:flex-initial px-4 md:px-6 py-2 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap shrink-0 ${
                activeTab === 'members'
                  ? 'neu-btn text-teal-600 dark:text-teal-400 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <Users size={15} />
              <span>Anggota</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
