import { Transaction, BudgetConfig, LoanRecord, Member, getISODateString } from '../types';

export const DEFAULT_BUDGET: BudgetConfig = {
  dailyLimit: 150000, // Rp 150.000 / hari
  monthlyLimit: 4500000,
  enabled: true,
};

export const DEFAULT_MEMBERS: Member[] = [
  {
    id: 'mem-1',
    name: 'Saya (Utama)',
    role: 'Pengelola',
    avatarColor: '#0d9488',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 30,
  },
  {
    id: 'mem-2',
    name: 'Rian Pratama',
    role: 'Anggota',
    avatarColor: '#3b82f6',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 20,
  },
  {
    id: 'mem-3',
    name: 'Dewi Lestari',
    role: 'Bendahara',
    avatarColor: '#8b5cf6',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 10,
  },
];

export const DEFAULT_LOANS: LoanRecord[] = [
  {
    id: 'loan-1',
    personName: 'Rian Pratama',
    type: 'lent',
    amount: 50000,
    note: 'Pinjam uang makan siang kantor',
    date: getISODateString(new Date()),
    status: 'unpaid',
    createdAt: Date.now() - 1000 * 60 * 60 * 12,
  },
  {
    id: 'loan-2',
    personName: 'Andi Saputra',
    type: 'lent',
    amount: 30000,
    note: 'Talangan beli bensin & parkir',
    date: getISODateString(new Date()),
    status: 'unpaid',
    createdAt: Date.now() - 1000 * 60 * 60 * 48,
  },
];

export function getInitialTransactions(): Transaction[] {
  const now = new Date();
  
  const d0 = getISODateString(now); // Today
  
  const d1Date = new Date(now);
  d1Date.setDate(d1Date.getDate() - 1);
  const d1 = getISODateString(d1Date); // Yesterday

  const d2Date = new Date(now);
  d2Date.setDate(d2Date.getDate() - 2);
  const d2 = getISODateString(d2Date);

  const d3Date = new Date(now);
  d3Date.setDate(d3Date.getDate() - 3);
  const d3 = getISODateString(d3Date);

  const d4Date = new Date(now);
  d4Date.setDate(d4Date.getDate() - 4);
  const d4 = getISODateString(d4Date);

  return [
    {
      id: 'tx-1',
      type: 'expense',
      amount: 25000,
      category: 'Makanan & Minuman',
      note: 'Sarapan Nasi Uduk & Es Teh Manis',
      date: d0,
      memberId: 'mem-1',
      memberName: 'Saya (Utama)',
      createdAt: Date.now() - 1000 * 60 * 60 * 5,
    },
    {
      id: 'tx-2',
      type: 'expense',
      amount: 35000,
      category: 'Makanan & Minuman',
      note: 'Makan Siang Nasi Padang Rendang',
      date: d0,
      memberId: 'mem-1',
      memberName: 'Saya (Utama)',
      createdAt: Date.now() - 1000 * 60 * 60 * 2,
    },
    {
      id: 'tx-3',
      type: 'expense',
      amount: 20000,
      category: 'Transportasi',
      note: 'Bensin Motor Pertalite',
      date: d0,
      memberId: 'mem-2',
      memberName: 'Rian Pratama',
      createdAt: Date.now() - 1000 * 60 * 30,
    },
    {
      id: 'tx-4',
      type: 'expense',
      amount: 45000,
      category: 'Makanan & Minuman',
      note: 'Kopi Susu & Toast sore',
      date: d1,
      memberId: 'mem-3',
      memberName: 'Dewi Lestari',
      createdAt: Date.now() - 1000 * 60 * 60 * 24,
    },
    {
      id: 'tx-5',
      type: 'expense',
      amount: 85000,
      category: 'Belanja Harian',
      note: 'Sabun, sampo, dan deterjen minimarket',
      date: d1,
      memberId: 'mem-1',
      memberName: 'Saya (Utama)',
      createdAt: Date.now() - 1000 * 60 * 60 * 28,
    },
    {
      id: 'tx-6',
      type: 'income',
      amount: 500000,
      category: 'Freelance & Proyek',
      note: 'Desain logo banner klien',
      date: d1,
      memberId: 'mem-1',
      memberName: 'Saya (Utama)',
      createdAt: Date.now() - 1000 * 60 * 60 * 30,
    },
    {
      id: 'tx-7',
      type: 'expense',
      amount: 60000,
      category: 'Hiburan & Santai',
      note: 'Tiket bioskop akhir pekan',
      date: d2,
      memberId: 'mem-2',
      memberName: 'Rian Pratama',
      createdAt: Date.now() - 1000 * 60 * 60 * 50,
    },
    {
      id: 'tx-8',
      type: 'expense',
      amount: 120000,
      category: 'Tagihan & Utilitas',
      note: 'Token Listrik PLN 100rb + admin',
      date: d3,
      memberId: 'mem-3',
      memberName: 'Dewi Lestari',
      createdAt: Date.now() - 1000 * 60 * 60 * 74,
    },
    {
      id: 'tx-9',
      type: 'expense',
      amount: 32000,
      category: 'Makanan & Minuman',
      note: 'Makan malam bakso urat',
      date: d4,
      memberId: 'mem-1',
      memberName: 'Saya (Utama)',
      createdAt: Date.now() - 1000 * 60 * 60 * 98,
    },
  ];
}
