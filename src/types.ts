export type TransactionType = 'expense' | 'income';

export type ExpenseCategory =
  | 'Makanan & Minuman'
  | 'Transportasi'
  | 'Belanja Harian'
  | 'Tagihan & Utilitas'
  | 'Hiburan & Santai'
  | 'Kesehatan'
  | 'Pendidikan'
  | 'Keluarga'
  | 'Lainnya';

export type IncomeCategory =
  | 'Gaji & Upah'
  | 'Bisnis & Jualan'
  | 'Freelance & Proyek'
  | 'Investasi'
  | 'Hadiah & Bonus'
  | 'Lainnya';

export interface Member {
  id: string;
  name: string;
  role: string;
  avatarColor: string;
  createdAt: number;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: ExpenseCategory | IncomeCategory;
  customCategory?: string;
  note: string;
  date: string; // YYYY-MM-DD
  paymentMethod?: string; // Opsional untuk kompatibilitas data lawas
  memberId?: string; // Anggota penanggung jawab
  memberName?: string;
  createdAt: number;
}

export type LoanType = 'lent' | 'borrowed'; // 'lent': Dipinjamkan ke orang lain (Piutang), 'borrowed': Kita meminjam (Utang)

export interface LoanRecord {
  id: string;
  personName: string;
  type: LoanType;
  amount: number;
  note: string;
  date: string; // YYYY-MM-DD
  dueDate?: string;
  status: 'unpaid' | 'paid';
  createdAt: number;
}

export interface BudgetConfig {
  dailyLimit: number;
  monthlyLimit: number;
  enabled: boolean;
}

export interface CategoryInfo {
  name: string;
  color: string;
  bgColor: string;
  iconName: string;
}

export const EXPENSE_CATEGORIES: { name: ExpenseCategory; icon: string; color: string }[] = [
  { name: 'Makanan & Minuman', icon: 'UtensilsCrossed', color: '#f97316' },
  { name: 'Transportasi', icon: 'Car', color: '#3b82f6' },
  { name: 'Belanja Harian', icon: 'ShoppingBag', color: '#ec4899' },
  { name: 'Tagihan & Utilitas', icon: 'Receipt', color: '#ef4444' },
  { name: 'Hiburan & Santai', icon: 'Gamepad2', color: '#8b5cf6' },
  { name: 'Kesehatan', icon: 'HeartPulse', color: '#10b981' },
  { name: 'Pendidikan', icon: 'GraduationCap', color: '#06b6d4' },
  { name: 'Keluarga', icon: 'Users', color: '#eab308' },
  { name: 'Lainnya', icon: 'Sparkles', color: '#64748b' },
];

export const INCOME_CATEGORIES: { name: IncomeCategory; icon: string; color: string }[] = [
  { name: 'Gaji & Upah', icon: 'Wallet', color: '#059669' },
  { name: 'Bisnis & Jualan', icon: 'Store', color: '#0284c7' },
  { name: 'Freelance & Proyek', icon: 'Laptop', color: '#7c3aed' },
  { name: 'Investasi', icon: 'TrendingUp', color: '#16a34a' },
  { name: 'Hadiah & Bonus', icon: 'Gift', color: '#d97706' },
  { name: 'Lainnya', icon: 'Coins', color: '#475569' },
];

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDateIndo(dateStr: string): string {
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));

  const todayStr = getTodayDateString();
  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterdayStr = getISODateString(yesterdayDate);

  if (dateStr === todayStr) {
    return 'Hari Ini';
  } else if (dateStr === yesterdayStr) {
    return 'Kemarin';
  }

  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export function formatShortDateIndo(dateStr: string): string {
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export function getTodayDateString(): string {
  const now = new Date();
  return getISODateString(now);
}

export function getISODateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
