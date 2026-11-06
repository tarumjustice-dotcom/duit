import React, { useState } from 'react';
import {
  X,
  HandCoins,
  Plus,
  CheckCircle2,
  Clock,
  Trash2,
  User,
  DollarSign,
  FileText,
  Calendar,
} from 'lucide-react';
import { LoanRecord, LoanType, formatRupiah, formatDateIndo, getTodayDateString } from '../types';

interface LoanModalProps {
  isOpen: boolean;
  onClose: () => void;
  loans: LoanRecord[];
  onAddLoan: (loan: Omit<LoanRecord, 'id' | 'createdAt'>) => void;
  onToggleStatus: (id: string) => void;
  onDeleteLoan: (id: string) => void;
}

export const LoanModal: React.FC<LoanModalProps> = ({
  isOpen,
  onClose,
  loans,
  onAddLoan,
  onToggleStatus,
  onDeleteLoan,
}) => {
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [personName, setPersonName] = useState<string>('');
  const [type, setType] = useState<LoanType>('lent');
  const [amount, setAmount] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [date, setDate] = useState<string>(getTodayDateString());
  const [error, setError] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseInt(amount.replace(/\D/g, ''), 10);

    if (!personName.trim()) {
      setError('Masukkan nama orang/peminjam');
      return;
    }
    if (!parsedAmount || parsedAmount <= 0) {
      setError('Masukkan nominal uang yang valid');
      return;
    }

    onAddLoan({
      personName: personName.trim(),
      type,
      amount: parsedAmount,
      note: note.trim() || (type === 'lent' ? 'Dipinjamkan' : 'Meminjam'),
      date,
      status: 'unpaid',
    });

    setPersonName('');
    setAmount('');
    setNote('');
    setDate(getTodayDateString());
    setIsAdding(false);
    setError('');
  };

  const totalUnpaidLent = loans
    .filter((l) => l.type === 'lent' && l.status === 'unpaid')
    .reduce((sum, curr) => sum + curr.amount, 0);

  const totalUnpaidBorrowed = loans
    .filter((l) => l.type === 'borrowed' && l.status === 'unpaid')
    .reduce((sum, curr) => sum + curr.amount, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
      <div className="neu-flat p-5 md:p-6 rounded-3xl max-w-lg w-full relative max-h-[90vh] flex flex-col space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-black/[0.04] dark:border-white/[0.05]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl neu-convex flex items-center justify-center text-amber-500">
              <HandCoins size={17} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                Catatan Uang Dipinjam & Pinjaman
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Kelola piutang uang yang dipinjam teman atau utang aktif
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="neu-btn w-8 h-8 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Quick KPI stats in Loan Modal */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="neu-sunken-sm p-3 rounded-2xl">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-0.5">
              Dipinjamkan ke Orang Lain
            </span>
            <div className="font-mono font-bold text-base text-amber-600 dark:text-amber-400 tabular-nums">
              {formatRupiah(totalUnpaidLent)}
            </div>
          </div>
          <div className="neu-sunken-sm p-3 rounded-2xl">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-0.5">
              Kita Meminjam (Utang)
            </span>
            <div className="font-mono font-bold text-base text-rose-600 dark:text-rose-400 tabular-nums">
              {formatRupiah(totalUnpaidBorrowed)}
            </div>
          </div>
        </div>

        {/* Toggle Add Form Button */}
        <div>
          {!isAdding ? (
            <button
              onClick={() => setIsAdding(true)}
              className="neu-btn w-full py-2.5 rounded-xl text-xs font-bold text-teal-600 dark:text-teal-400 flex items-center justify-center gap-1.5 cursor-pointer hover:bg-teal-500/10"
            >
              <Plus size={15} />
              <span>+ Catat Pinjaman Baru</span>
            </button>
          ) : (
            <form onSubmit={handleSubmit} className="neu-flat p-4 rounded-2xl space-y-3 border border-teal-500/20">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                  Formulir Catatan Pinjaman
                </span>
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="text-xs text-slate-400 hover:text-slate-600"
                >
                  Batal
                </button>
              </div>

              {/* Type Switcher: Dipinjamkan vs Meminjam */}
              <div className="neu-sunken-sm p-1 rounded-xl flex items-center gap-1 text-xs">
                <button
                  type="button"
                  onClick={() => setType('lent')}
                  className={`flex-1 py-1.5 font-bold rounded-lg transition-all cursor-pointer ${
                    type === 'lent' ? 'neu-btn text-amber-600 dark:text-amber-400' : 'text-slate-500'
                  }`}
                >
                  Uang Kita Dipinjam (Piutang)
                </button>
                <button
                  type="button"
                  onClick={() => setType('borrowed')}
                  className={`flex-1 py-1.5 font-bold rounded-lg transition-all cursor-pointer ${
                    type === 'borrowed' ? 'neu-btn text-rose-600 dark:text-rose-400' : 'text-slate-500'
                  }`}
                >
                  Kita Meminjam (Utang)
                </button>
              </div>

              {/* Person Name Input */}
              <div className="neu-sunken rounded-xl px-3 py-2 flex items-center gap-2">
                <User size={14} className="text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Nama orang (misal: Rian, Budi, Maya)"
                  value={personName}
                  onChange={(e) => setPersonName(e.target.value)}
                  className="w-full bg-transparent border-none outline-none text-xs font-medium text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
                />
              </div>

              {/* Amount Input */}
              <div className="neu-sunken rounded-xl px-3 py-2 flex items-center gap-2">
                <DollarSign size={14} className="text-slate-400 shrink-0" />
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Nominal uang (contoh: 50.000)"
                  value={amount ? parseInt(amount, 10).toLocaleString('id-ID') : ''}
                  onChange={(e) => setAmount(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-transparent border-none outline-none text-xs font-mono font-bold text-slate-800 dark:text-slate-100 placeholder:text-slate-400 tabular-nums"
                />
              </div>

              {/* Note Input */}
              <div className="neu-sunken rounded-xl px-3 py-2 flex items-center gap-2">
                <FileText size={14} className="text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Keterangan keperluan (misal: Makan siang, Talangan bensin)"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full bg-transparent border-none outline-none text-xs font-medium text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
                />
              </div>

              {/* Date Input */}
              <div className="neu-sunken rounded-xl px-3 py-2 flex items-center gap-2">
                <Calendar size={14} className="text-slate-400 shrink-0" />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-transparent border-none outline-none text-xs font-mono text-slate-800 dark:text-slate-100"
                />
              </div>

              {error && <div className="text-[11px] text-rose-500 font-medium">{error}</div>}

              <button
                type="submit"
                className="neu-btn-primary w-full py-2.5 rounded-xl text-xs font-bold cursor-pointer"
              >
                Simpan Catatan Pinjaman
              </button>
            </form>
          )}
        </div>

        {/* Loans List */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 max-h-64">
          {loans.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">
              Belum ada catatan pinjaman tersimpan.
            </div>
          ) : (
            loans.map((loan) => {
              const isUnpaid = loan.status === 'unpaid';
              const isLent = loan.type === 'lent';

              return (
                <div
                  key={loan.id}
                  className={`neu-flat p-3 rounded-2xl flex items-center justify-between gap-3 transition-opacity ${
                    !isUnpaid ? 'opacity-60' : ''
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                        {loan.personName}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-md font-semibold ${
                          isUnpaid
                            ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300'
                            : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                        }`}
                      >
                        {isUnpaid ? 'Belum Lunas' : 'Lunas'}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {isLent ? 'Dipinjamkan' : 'Meminjam'} · {loan.note} · {formatDateIndo(loan.date)}
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    <div className="text-right">
                      <div
                        className={`font-mono font-bold text-xs md:text-sm tabular-nums ${
                          isLent ? 'text-amber-600 dark:text-amber-400' : 'text-rose-600 dark:text-rose-400'
                        }`}
                      >
                        {formatRupiah(loan.amount)}
                      </div>
                    </div>

                    <button
                      onClick={() => onToggleStatus(loan.id)}
                      className={`neu-btn w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer ${
                        !isUnpaid ? 'text-emerald-500' : 'text-slate-400 hover:text-emerald-500'
                      }`}
                      title={isUnpaid ? 'Tandai Lunas' : 'Tandai Belum Lunas'}
                    >
                      <CheckCircle2 size={14} />
                    </button>

                    <button
                      onClick={() => onDeleteLoan(loan.id)}
                      className="neu-btn w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-500 cursor-pointer"
                      title="Hapus Catatan"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="pt-2 text-center border-t border-black/[0.04] dark:border-white/[0.05]">
          <button
            onClick={onClose}
            className="text-xs text-slate-500 dark:text-slate-400 hover:underline cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
