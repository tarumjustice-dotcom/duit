/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { HomeDashboard } from './components/HomeDashboard';
import { TransactionForm } from './components/TransactionForm';
import { ExpenseAnalytics } from './components/ExpenseAnalytics';
import { TransactionList } from './components/TransactionList';
import { MembersPage } from './components/MembersPage';
import { QuickExpenseShortcuts } from './components/QuickExpenseShortcuts';
import { BudgetModal } from './components/BudgetModal';
import { ExportModal } from './components/ExportModal';
import { LoanModal } from './components/LoanModal';
import { Transaction, BudgetConfig, LoanRecord, Member, getTodayDateString } from './types';
import { getInitialTransactions, DEFAULT_BUDGET, DEFAULT_LOANS, DEFAULT_MEMBERS } from './data/initialData';
import { ArrowLeft } from 'lucide-react';
import { LoginPage } from './components/LoginPage';

const STORAGE_KEYS = {
  TRANSACTIONS: 'kupit_transactions_v1',
  BUDGET: 'kupit_budget_v1',
  THEME: 'kupit_theme_v1',
  LOANS: 'kupit_loans_v1',
  MEMBERS: 'kupit_members_v1',
  AUTH: 'kupit_auth_v1',
};

export default function App() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEYS.AUTH) === 'true';
  });

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    localStorage.setItem(STORAGE_KEYS.AUTH, 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem(STORAGE_KEYS.AUTH);
  };

  // Navigation tab state ('home' | 'transactions' | 'members')
  const [activeTab, setActiveTab] = useState<'home' | 'transactions' | 'members'>('home');
  const [initialMemberFilter, setInitialMemberFilter] = useState<string>('all');

  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    if (saved) return saved === 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Sync dark class on document element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem(STORAGE_KEYS.THEME, 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem(STORAGE_KEYS.THEME, 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  // Members state
  const [members, setMembers] = useState<Member[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MEMBERS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return DEFAULT_MEMBERS;
  });

  // Transactions state
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return getInitialTransactions();
  });

  // Loans state (for "Dipinjam" card)
  const [loans, setLoans] = useState<LoanRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LOANS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
    return DEFAULT_LOANS;
  });

  // Budget state
  const [budget, setBudget] = useState<BudgetConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BUDGET);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return DEFAULT_BUDGET;
  });

  // Persist members
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members));
  }, [members]);

  // Persist transactions
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  }, [transactions]);

  // Persist loans
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LOANS, JSON.stringify(loans));
  }, [loans]);

  // Persist budget
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BUDGET, JSON.stringify(budget));
  }, [budget]);

  // Modals & Editing states
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isLoanModalOpen, setIsLoanModalOpen] = useState<boolean>(false);

  // Financial calculations
  const todayStr = getTodayDateString();

  const { totalIncome, totalExpense, todayExpense, todayIncome, netBalance, incomeCount, expenseCount } = useMemo(() => {
    let tIncome = 0;
    let tExpense = 0;
    let tdExpense = 0;
    let tdIncome = 0;
    let inCount = 0;
    let expCount = 0;

    transactions.forEach((tx) => {
      if (tx.type === 'expense') {
        tExpense += tx.amount;
        expCount += 1;
        if (tx.date === todayStr) {
          tdExpense += tx.amount;
        }
      } else {
        tIncome += tx.amount;
        inCount += 1;
        if (tx.date === todayStr) {
          tdIncome += tx.amount;
        }
      }
    });

    return {
      totalIncome: tIncome,
      totalExpense: tExpense,
      todayExpense: tdExpense,
      todayIncome: tdIncome,
      netBalance: tIncome - tExpense,
      incomeCount: inCount,
      expenseCount: expCount,
    };
  }, [transactions, todayStr]);

  // Dipinjam calculations
  const { totalBorrowed, unpaidLoansCount } = useMemo(() => {
    const unpaidLent = loans
      .filter((l) => l.type === 'lent' && l.status === 'unpaid')
      .reduce((sum, curr) => sum + curr.amount, 0);

    const count = loans.filter((l) => l.status === 'unpaid').length;
    return { totalBorrowed: unpaidLent, unpaidLoansCount: count };
  }, [loans]);

  // Member Handlers
  const handleAddMember = (memberData: Omit<Member, 'id' | 'createdAt'>) => {
    const newMember: Member = {
      ...memberData,
      id: `mem-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: Date.now(),
    };
    setMembers((prev) => [...prev, newMember]);
  };

  const handleEditMember = (id: string, memberData: Partial<Member>) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...memberData } : m))
    );
  };

  const handleDeleteMember = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  // Transaction Handlers
  const handleSaveTransaction = (txData: Omit<Transaction, 'id' | 'createdAt'>) => {
    if (editingTransaction) {
      setTransactions((prev) =>
        prev.map((item) =>
          item.id === editingTransaction.id
            ? { ...item, ...txData }
            : item
        )
      );
      setEditingTransaction(null);
    } else {
      const newTx: Transaction = {
        ...txData,
        id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        createdAt: Date.now(),
      };
      setTransactions((prev) => [newTx, ...prev]);
    }
  };

  const handleQuickAdd = (txData: Omit<Transaction, 'id' | 'createdAt'>) => {
    const defaultMember = members[0];
    const newTx: Transaction = {
      ...txData,
      memberId: defaultMember?.id,
      memberName: defaultMember?.name,
      id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: Date.now(),
    };
    setTransactions((prev) => [newTx, ...prev]);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((item) => item.id !== id));
    if (editingTransaction?.id === id) {
      setEditingTransaction(null);
    }
  };

  const handleRestoreDefaults = () => {
    const initial = getInitialTransactions();
    setTransactions(initial);
    setLoans(DEFAULT_LOANS);
    setMembers(DEFAULT_MEMBERS);
    setBudget(DEFAULT_BUDGET);
  };

  const handleClearAll = () => {
    setTransactions([]);
    setEditingTransaction(null);
  };

  // Loan Handlers
  const handleAddLoan = (loanData: Omit<LoanRecord, 'id' | 'createdAt'>) => {
    const newLoan: LoanRecord = {
      ...loanData,
      id: `loan-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: Date.now(),
    };
    setLoans((prev) => [newLoan, ...prev]);
  };

  const handleToggleLoanStatus = (id: string) => {
    setLoans((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: l.status === 'unpaid' ? 'paid' : 'unpaid' } : l))
    );
  };

  const handleDeleteLoan = (id: string) => {
    setLoans((prev) => prev.filter((l) => l.id !== id));
  };

  if (!isAuthenticated) {
    return (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
      />
    );
  }

  return (
    <div className="min-h-screen pb-16 flex flex-col transition-colors selection:bg-teal-500/20">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        onOpenBudgetModal={() => setIsBudgetModalOpen(true)}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        onOpenLoanModal={() => setIsLoanModalOpen(true)}
        onLogout={handleLogout}
        unpaidLoansCount={unpaidLoansCount}
      />

      <main className="max-w-6xl mx-auto w-full px-4 md:px-8 pt-6 space-y-6 flex-1">
        {/* TAB 1: Halaman Paling Awal (Home Dashboard) */}
        {activeTab === 'home' && (
          <HomeDashboard
            totalIncome={totalIncome}
            totalExpense={totalExpense}
            totalBorrowed={totalBorrowed}
            netBalance={netBalance}
            incomeCount={incomeCount}
            expenseCount={expenseCount}
            unpaidLoansCount={unpaidLoansCount}
            budget={budget}
            todayExpense={todayExpense}
            recentTransactions={transactions}
            onNavigateToMembers={() => setActiveTab('members')}
            onOpenQuickAddForm={() => {
              setInitialMemberFilter('all');
              setActiveTab('transactions');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenLoanModal={() => setIsLoanModalOpen(true)}
            onOpenBudgetModal={() => setIsBudgetModalOpen(true)}
            onQuickAdd={handleQuickAdd}
          />
        )}

        {/* TAB 2: Halaman Transaksi (Form Input Pengeluaran & Riwayat) */}
        {activeTab === 'transactions' && (
          <div className="space-y-6 animate-fade-in">
            {/* Context breadcrumb & Back button */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setActiveTab('home')}
                className="neu-btn px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer hover:text-teal-600"
              >
                <ArrowLeft size={14} />
                <span>Kembali ke Beranda</span>
              </button>

              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Pencatatan & Riwayat Transaksi
              </div>
            </div>

            {/* Quick 1-Click Expense shortcuts */}
            <QuickExpenseShortcuts onQuickAdd={handleQuickAdd} />

            {/* 2-Column Split: Neumorphic Transaction Form (Left/Top) & Transaction List (Right/Bottom) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: 3D Form Card with Member Responsible Selector */}
              <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-6">
                <TransactionForm
                  onSave={handleSaveTransaction}
                  editingTransaction={editingTransaction}
                  onCancelEdit={() => setEditingTransaction(null)}
                  members={members}
                  onOpenAddMember={() => setActiveTab('members')}
                />
              </div>

              {/* Right Column: Transaction List with Custom Date Range Filter and Member Filter */}
              <div className="lg:col-span-7 space-y-6">
                <TransactionList
                  transactions={transactions}
                  members={members}
                  initialMemberFilter={initialMemberFilter}
                  onEdit={(tx) => {
                    setEditingTransaction(tx);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onDelete={handleDeleteTransaction}
                />
              </div>
            </div>

            {/* Analytics Section: 7-Day Spending Trend & Category Distribution */}
            <div className="pt-2">
              <ExpenseAnalytics transactions={transactions} />
            </div>
          </div>
        )}

        {/* TAB 3: Halaman Nama Anggota (Kelola Anggota & Tombol Tambah Anggota) */}
        {activeTab === 'members' && (
          <MembersPage
            members={members}
            transactions={transactions}
            onAddMember={handleAddMember}
            onEditMember={handleEditMember}
            onDeleteMember={handleDeleteMember}
            onSelectMemberFilter={(memberName) => {
              setInitialMemberFilter(memberName);
              setActiveTab('transactions');
            }}
          />
        )}
      </main>

      {/* Modals */}
      <BudgetModal
        budget={budget}
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        onSave={(newBudget) => setBudget(newBudget)}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        transactions={transactions}
        onRestoreDefaults={handleRestoreDefaults}
        onClearAll={handleClearAll}
      />

      <LoanModal
        isOpen={isLoanModalOpen}
        onClose={() => setIsLoanModalOpen(false)}
        loans={loans}
        onAddLoan={handleAddLoan}
        onToggleStatus={handleToggleLoanStatus}
        onDeleteLoan={handleDeleteLoan}
      />

      {/* Footer */}
      <footer className="mt-12 border-t border-black/[0.04] dark:border-white/[0.05] py-6 text-center text-xs text-slate-500 dark:text-slate-400">
        <p>
          Kupit · Pelacak Keuangan Harian Sederhana & Taktil
        </p>
      </footer>
    </div>
  );
}
