import React, { useState, useEffect } from 'react';
import {
  Plus,
  Calendar,
  Tag,
  FileText,
  DollarSign,
  X,
  Check,
  Sparkles,
  UserCheck,
} from 'lucide-react';
import {
  Transaction,
  TransactionType,
  ExpenseCategory,
  IncomeCategory,
  Member,
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  getTodayDateString,
  getISODateString,
  formatRupiah,
} from '../types';
import { CategoryIcon } from './CategoryIcon';

interface TransactionFormProps {
  onSave: (transactionData: Omit<Transaction, 'id' | 'createdAt'>) => void;
  editingTransaction?: Transaction | null;
  onCancelEdit?: () => void;
  members?: Member[];
  onOpenAddMember?: () => void;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  onSave,
  editingTransaction,
  onCancelEdit,
  members = [],
  onOpenAddMember,
}) => {
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState<string>(EXPENSE_CATEGORIES[0].name);
  const [otherCategoryDetail, setOtherCategoryDetail] = useState<string>('');
  const [selectedMemberId, setSelectedMemberId] = useState<string>(() => members[0]?.id || '');
  const [note, setNote] = useState<string>('');
  const [date, setDate] = useState<string>(getTodayDateString());
  const [error, setError] = useState<string>('');
  const [showSuccessToast, setShowSuccessToast] = useState<boolean>(false);

  // If editing an existing transaction, populate fields
  useEffect(() => {
    if (editingTransaction) {
      setType(editingTransaction.type);
      setAmount(editingTransaction.amount.toString());
      setCategory(editingTransaction.category);
      setOtherCategoryDetail(editingTransaction.customCategory || '');
      setSelectedMemberId(editingTransaction.memberId || (members[0]?.id || ''));
      setNote(editingTransaction.note);
      setDate(editingTransaction.date);
    }
  }, [editingTransaction, members]);

  // When type changes, ensure valid default category
  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    if (newType === 'expense') {
      setCategory(EXPENSE_CATEGORIES[0].name);
    } else {
      setCategory(INCOME_CATEGORIES[0].name);
    }
  };

  const addQuickAmount = (val: number) => {
    const currentNum = parseInt(amount.replace(/\D/g, ''), 10) || 0;
    setAmount((currentNum + val).toString());
    setError('');
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    setAmount(rawValue);
    if (error) setError('');
  };

  const setDateToToday = () => setDate(getTodayDateString());
  const setDateToYesterday = () => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    setDate(getISODateString(d));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseInt(amount.replace(/\D/g, ''), 10);

    if (!parsedAmount || parsedAmount <= 0) {
      setError('Masukkan nominal pengeluaran yang valid');
      return;
    }

    if (!note.trim()) {
      setError('Catatan/keterangan pengeluaran diperlukan');
      return;
    }

    const chosenMember = members.find((m) => m.id === selectedMemberId) || members[0];

    onSave({
      type,
      amount: parsedAmount,
      category: category as ExpenseCategory | IncomeCategory,
      customCategory: category === 'Lainnya' && otherCategoryDetail.trim() ? otherCategoryDetail.trim() : undefined,
      note: note.trim(),
      date,
      memberId: chosenMember?.id,
      memberName: chosenMember?.name,
    });

    // Reset form if not editing
    if (!editingTransaction) {
      setAmount('');
      setNote('');
      setOtherCategoryDetail('');
      setDate(getTodayDateString());
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 2500);
    }
  };

  const numericAmount = parseInt(amount.replace(/\D/g, ''), 10) || 0;

  return (
    <div className="neu-flat p-5 md:p-6 rounded-3xl relative">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            {editingTransaction ? 'Edit Transaksi' : 'Catat Pengeluaran Baru'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {editingTransaction
              ? 'Perbarui detail transaksi yang dipilih'
              : 'Catat transaksi harian secara cepat dan rapi'}
          </p>
        </div>

        {editingTransaction && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="neu-btn px-3 py-1.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 flex items-center gap-1 cursor-pointer"
          >
            <X size={14} />
            Batal
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Soft 3D Segmented Control: Pengeluaran vs Pemasukan */}
        <div className="neu-sunken-sm p-1 rounded-2xl flex items-center gap-1">
          <button
            type="button"
            onClick={() => handleTypeChange('expense')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              type === 'expense'
                ? 'neu-btn text-rose-600 dark:text-rose-400'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
            }`}
          >
            Pengeluaran (-)
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange('income')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              type === 'income'
                ? 'neu-btn text-emerald-600 dark:text-emerald-400'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
            }`}
          >
            Pemasukan (+)
          </button>
        </div>

        {/* Input: Nominal (Rp) with Recessed Debossed 3D Style */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <DollarSign size={14} className="text-teal-600 dark:text-teal-400" />
              Nominal (Rupiah)
            </span>
            {numericAmount > 0 && (
              <span className="font-mono text-teal-600 dark:text-teal-400 font-semibold tabular-nums">
                {formatRupiah(numericAmount)}
              </span>
            )}
          </label>
          <div className="neu-sunken rounded-2xl px-4 py-3 flex items-center gap-2 transition-all focus-within:ring-2 focus-within:ring-teal-500/30">
            <span className="text-sm font-bold text-slate-400 select-none">Rp</span>
            <input
              type="text"
              inputMode="numeric"
              placeholder="Contoh: 25.000"
              value={amount ? parseInt(amount, 10).toLocaleString('id-ID') : ''}
              onChange={handleAmountChange}
              className="w-full bg-transparent border-none outline-none text-base md:text-lg font-mono font-bold text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 tabular-nums"
              autoFocus={!editingTransaction}
            />
          </div>

          {/* Quick Increment Shortcut Chips */}
          <div className="flex flex-wrap items-center gap-1.5 mt-2">
            <button
              type="button"
              onClick={() => addQuickAmount(10000)}
              className="neu-btn px-2.5 py-1 rounded-lg text-xs font-mono font-medium text-slate-600 dark:text-slate-300 hover:text-teal-600 cursor-pointer"
            >
              +10rb
            </button>
            <button
              type="button"
              onClick={() => addQuickAmount(20000)}
              className="neu-btn px-2.5 py-1 rounded-lg text-xs font-mono font-medium text-slate-600 dark:text-slate-300 hover:text-teal-600 cursor-pointer"
            >
              +20rb
            </button>
            <button
              type="button"
              onClick={() => addQuickAmount(50000)}
              className="neu-btn px-2.5 py-1 rounded-lg text-xs font-mono font-medium text-slate-600 dark:text-slate-300 hover:text-teal-600 cursor-pointer"
            >
              +50rb
            </button>
            <button
              type="button"
              onClick={() => addQuickAmount(100000)}
              className="neu-btn px-2.5 py-1 rounded-lg text-xs font-mono font-medium text-slate-600 dark:text-slate-300 hover:text-teal-600 cursor-pointer"
            >
              +100rb
            </button>
            {amount && (
              <button
                type="button"
                onClick={() => setAmount('')}
                className="text-xs text-rose-500 hover:underline ml-auto font-medium cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Input: Catatan / Keterangan */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
            <FileText size={14} className="text-teal-600 dark:text-teal-400" />
            Catatan / Keterangan
          </label>
          <div className="neu-sunken rounded-2xl px-4 py-3 flex items-center gap-2 transition-all focus-within:ring-2 focus-within:ring-teal-500/30">
            <input
              type="text"
              placeholder={
                type === 'expense'
                  ? 'Misal: Nasi Padang rendang, Bensin, Kopi'
                  : 'Misal: Gaji, Hasil jualan, Bonus lembur'
              }
              value={note}
              onChange={(e) => {
                setNote(e.target.value);
                if (error) setError('');
              }}
              className="w-full bg-transparent border-none outline-none text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 font-medium"
            />
          </div>
        </div>

        {/* Grid: Kategori & Anggota yang Bertanggung Jawab */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Category Dropdown/Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Tag size={14} className="text-teal-600 dark:text-teal-400" />
              Kategori
            </label>
            <div className="neu-sunken rounded-2xl px-3 py-2.5 relative flex items-center">
              <div className="mr-2 text-teal-600 dark:text-teal-400">
                <CategoryIcon name={category} size={16} />
              </div>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-transparent border-none outline-none text-xs font-semibold text-slate-800 dark:text-slate-100 cursor-pointer"
              >
                {type === 'expense'
                  ? EXPENSE_CATEGORIES.map((cat) => (
                      <option key={cat.name} value={cat.name} className="dark:bg-slate-900">
                        {cat.name}
                      </option>
                    ))
                  : INCOME_CATEGORIES.map((cat) => (
                      <option key={cat.name} value={cat.name} className="dark:bg-slate-900">
                        {cat.name}
                      </option>
                    ))}
              </select>
            </div>
          </div>

          {/* Form Pilihan Anggota yang Bertanggung Jawab */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                <UserCheck size={14} className="text-teal-600 dark:text-teal-400" />
                Penanggung Jawab
              </label>
              {onOpenAddMember && (
                <button
                  type="button"
                  onClick={onOpenAddMember}
                  className="text-[11px] text-teal-600 dark:text-teal-400 hover:underline font-semibold cursor-pointer"
                >
                  + Kelola
                </button>
              )}
            </div>
            <div className="neu-sunken rounded-2xl px-3 py-2.5 flex items-center gap-2">
              {(() => {
                const activeMember = members.find((m) => m.id === selectedMemberId);
                return (
                  <div
                    className="w-3.5 h-3.5 rounded-full shrink-0 shadow-xs"
                    style={{ backgroundColor: activeMember?.avatarColor || '#0d9488' }}
                  />
                );
              })()}
              <select
                value={selectedMemberId}
                onChange={(e) => setSelectedMemberId(e.target.value)}
                className="w-full bg-transparent border-none outline-none text-xs font-semibold text-slate-800 dark:text-slate-100 cursor-pointer"
              >
                {members.length > 0 ? (
                  members.map((m) => (
                    <option key={m.id} value={m.id} className="dark:bg-slate-900">
                      {m.name} ({m.role || 'Anggota'})
                    </option>
                  ))
                ) : (
                  <option value="" className="dark:bg-slate-900">
                    Saya (Utama)
                  </option>
                )}
              </select>
            </div>
          </div>
        </div>

        {/* Conditional Input: Form Keterangan Kategori jika Lain-lain / Lainnya dipilih */}
        {category === 'Lainnya' && (
          <div className="neu-sunken-sm p-3.5 rounded-2xl border border-teal-500/25 space-y-2.5 animate-fade-in">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                <Sparkles size={14} className="text-teal-600 dark:text-teal-400" />
                Keterangan Kategori Lain-lain
              </label>
              <span className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold">
                Spesifikasikan Kategori
              </span>
            </div>

            <div className="neu-sunken rounded-xl px-3.5 py-2.5 flex items-center gap-2 focus-within:ring-2 focus-within:ring-teal-500/30">
              <input
                type="text"
                placeholder={
                  type === 'expense'
                    ? 'Misal: Pajak Kendaraan, Donasi, Servis AC, Asuransi...'
                    : 'Misal: Refund Dana, Jual Barang Bekas, Dividen...'
                }
                value={otherCategoryDetail}
                onChange={(e) => setOtherCategoryDetail(e.target.value)}
                className="w-full bg-transparent border-none outline-none text-xs font-semibold text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                autoFocus
              />
              {otherCategoryDetail && (
                <button
                  type="button"
                  onClick={() => setOtherCategoryDetail('')}
                  className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  title="Hapus teks"
                >
                  ×
                </button>
              )}
            </div>

            {/* Quick Suggestions Chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                Pilihan Cepat:
              </span>
              {(type === 'expense'
                ? ['Pajak', 'Donasi/Sedekah', 'Servis & Perbaikan', 'Asuransi', 'Hobi', 'Hewan Peliharaan']
                : ['Refund / Pengembalian', 'Jual Barang Bekas', 'Dividen', 'Kasbon', 'Royalti']
              ).map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => setOtherCategoryDetail(suggestion)}
                  className={`neu-btn px-2 py-0.5 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
                    otherCategoryDetail === suggestion
                      ? 'text-teal-600 dark:text-teal-400 font-bold border border-teal-500/30'
                      : 'text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400'
                  }`}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Date Selector with Quick "Hari Ini" & "Kemarin" chips */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
              <Calendar size={14} className="text-teal-600 dark:text-teal-400" />
              Tanggal Transaksi
            </label>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={setDateToToday}
                className={`text-[11px] px-2 py-0.5 rounded-md font-medium transition-colors cursor-pointer ${
                  date === getTodayDateString()
                    ? 'bg-teal-500/15 text-teal-700 dark:text-teal-300 font-bold'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                }`}
              >
                Hari Ini
              </button>
              <button
                type="button"
                onClick={setDateToYesterday}
                className="text-[11px] px-2 py-0.5 rounded-md text-slate-500 hover:text-slate-800 dark:text-slate-400 font-medium transition-colors cursor-pointer"
              >
                Kemarin
              </button>
            </div>
          </div>
          <div className="neu-sunken rounded-2xl px-4 py-2.5">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-transparent border-none outline-none text-xs font-medium text-slate-800 dark:text-slate-100 cursor-pointer font-mono"
            />
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-medium flex items-center gap-1.5">
            <span>{error}</span>
          </div>
        )}

        {/* Tactile Neumorphic 3D Submit Button */}
        <button
          type="submit"
          className="w-full py-3.5 rounded-2xl neu-btn-primary font-bold text-sm tracking-wide flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-[0.99] transition-transform"
        >
          {editingTransaction ? (
            <>
              <Check size={18} />
              Simpan Perubahan
            </>
          ) : (
            <>
              <Plus size={18} />
              {type === 'expense' ? 'Catat Pengeluaran' : 'Catat Pemasukan'}
            </>
          )}
        </button>

        {/* Quick Success Toast Notification */}
        {showSuccessToast && (
          <div className="text-center py-1 text-xs font-semibold text-teal-600 dark:text-teal-400 animate-fade-in flex items-center justify-center gap-1">
            <Check size={14} /> Transaksi berhasil disimpan!
          </div>
        )}
      </form>
    </div>
  );
};
