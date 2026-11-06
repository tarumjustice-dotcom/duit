import React, { useState } from 'react';
import { X, SlidersHorizontal, Check, AlertCircle } from 'lucide-react';
import { BudgetConfig, formatRupiah } from '../types';

interface BudgetModalProps {
  budget: BudgetConfig;
  isOpen: boolean;
  onClose: () => void;
  onSave: (newBudget: BudgetConfig) => void;
}

export const BudgetModal: React.FC<BudgetModalProps> = ({
  budget,
  isOpen,
  onClose,
  onSave,
}) => {
  const [dailyLimit, setDailyLimit] = useState<number>(budget.dailyLimit);
  const [enabled, setEnabled] = useState<boolean>(budget.enabled);

  if (!isOpen) return null;

  const presets = [50000, 100000, 150000, 200000, 300000, 500000];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...budget,
      dailyLimit,
      enabled,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
      <div className="neu-flat p-6 rounded-3xl max-w-md w-full relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl neu-convex flex items-center justify-center text-teal-600 dark:text-teal-400">
              <SlidersHorizontal size={17} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                Atur Batas Anggaran Harian
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Kendalikan pengeluaran harian agar tidak boros
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

        <form onSubmit={handleSave} className="space-y-4">
          {/* Toggle Enable Budgeting */}
          <div className="neu-sunken-sm p-3 rounded-2xl flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
              Aktifkan Peringatan Anggaran
            </span>
            <button
              type="button"
              onClick={() => setEnabled(!enabled)}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                enabled ? 'bg-teal-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  enabled ? 'left-7' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* Amount input */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
              Batas Maksimal Pengeluaran per Hari (Rp)
            </label>
            <div className="neu-sunken rounded-2xl px-4 py-3 flex items-center gap-2">
              <span className="text-sm font-bold text-slate-400">Rp</span>
              <input
                type="text"
                inputMode="numeric"
                value={dailyLimit ? dailyLimit.toLocaleString('id-ID') : ''}
                onChange={(e) => {
                  const val = parseInt(e.target.value.replace(/\D/g, ''), 10) || 0;
                  setDailyLimit(val);
                }}
                className="w-full bg-transparent border-none outline-none text-base font-mono font-bold text-slate-800 dark:text-slate-100 tabular-nums"
                disabled={!enabled}
              />
            </div>
          </div>

          {/* Preset Buttons */}
          <div>
            <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-2">
              Pilihan Cepat Target Harian:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {presets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setDailyLimit(preset)}
                  className={`py-2 px-2 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer ${
                    dailyLimit === preset
                      ? 'neu-btn text-teal-600 dark:text-teal-400 font-bold border border-teal-500/20'
                      : 'neu-btn text-slate-600 dark:text-slate-300'
                  }`}
                  disabled={!enabled}
                >
                  {formatRupiah(preset)}
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/20 text-xs text-teal-800 dark:text-teal-300 flex items-start gap-2">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>
              Perkiraan batas sebulan: <strong>{formatRupiah(dailyLimit * 30)}</strong>
            </span>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="neu-btn px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="neu-btn-primary px-5 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Check size={15} />
              Simpan Target
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
