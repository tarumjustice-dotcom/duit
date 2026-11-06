import React, { useState } from 'react';
import { X, Download, RotateCcw, Trash2, Check, FileSpreadsheet, ShieldAlert, FolderArchive } from 'lucide-react';
import { Transaction } from '../types';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: Transaction[];
  onRestoreDefaults: () => void;
  onClearAll: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  transactions,
  onRestoreDefaults,
  onClearAll,
}) => {
  const [confirmClear, setConfirmClear] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleExportCSV = () => {
    // Generate CSV content
    const headers = ['ID', 'Tanggal', 'Tipe', 'Kategori', 'Keterangan', 'Nominal (Rp)', 'Penanggung Jawab'];
    const rows = transactions.map((t) => [
      t.id,
      t.date,
      t.type === 'expense' ? 'Pengeluaran' : 'Pemasukan',
      t.category === 'Lainnya' && t.customCategory
        ? `"${t.category} (${t.customCategory.replace(/"/g, '""')})"`
        : `"${t.category.replace(/"/g, '""')}"`,
      `"${t.note.replace(/"/g, '""')}"`,
      t.amount,
      `"${(t.memberName || '-').replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `laporan-keuangan-kupit-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
      <div className="neu-flat p-6 rounded-3xl max-w-md w-full relative space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl neu-convex flex items-center justify-center text-teal-600 dark:text-teal-400">
              <FileSpreadsheet size={17} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                Ekspor & Cadangan Data
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Unduh file spreadsheet atau kelola database
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

        {/* Section 1: Export CSV */}
        <div className="neu-flat p-4 rounded-2xl space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
              Unduh Format CSV (Excel/Sheets)
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
              {transactions.length} baris
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Simpan salinan data riwayat keuangan Anda ke format file spreadsheet (.csv).
          </p>
          <button
            onClick={handleExportCSV}
            className="neu-btn-primary w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {downloadSuccess ? (
              <>
                <Check size={15} /> File Berhasil Diunduh!
              </>
            ) : (
              <>
                <Download size={15} /> Unduh CSV Sekarang
              </>
            )}
          </button>
        </div>

        {/* Section: Download Source Code Project (ZIP) */}
        <div className="neu-flat p-4 rounded-2xl space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
              <FolderArchive size={15} className="text-teal-600 dark:text-teal-400" />
              Download Source Code Proyek (ZIP)
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-300 font-semibold">
              Siap GitHub
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Unduh seluruh berkas kode proyek (React + Vite + TypeScript + Tailwind) dalam format ZIP yang bersih untuk diunggah ke GitHub atau dijalankan lokal.
          </p>
          <a
            href="/kupit-project.zip"
            download="kupit-finance-tracker.zip"
            className="neu-btn w-full py-2.5 rounded-xl text-xs font-bold text-teal-600 dark:text-teal-400 flex items-center justify-center gap-1.5 cursor-pointer hover:text-teal-700 transition-colors"
          >
            <Download size={15} />
            <span>Download Project ZIP (60 KB)</span>
          </a>
        </div>

        {/* Section 2: Reset / Restore default sample data */}
        <div className="neu-flat p-4 rounded-2xl space-y-3">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-200 block">
            Kelola Cadangan Data
          </span>

          <div className="flex flex-col gap-2">
            <button
              onClick={() => {
                onRestoreDefaults();
                onClose();
              }}
              className="neu-btn py-2 px-3 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-1.5 hover:text-teal-600 cursor-pointer"
            >
              <RotateCcw size={14} />
              Muat Ulang Contoh Data Awal
            </button>

            {!confirmClear ? (
              <button
                onClick={() => setConfirmClear(true)}
                className="neu-btn py-2 px-3 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 flex items-center justify-center gap-1.5 hover:bg-rose-500/10 cursor-pointer"
              >
                <Trash2 size={14} />
                Kosongkan Semua Transaksi
              </button>
            ) : (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400">
                  <ShieldAlert size={14} />
                  <span>Yakin ingin menghapus semua data?</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setConfirmClear(false)}
                    className="flex-1 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-xs font-medium cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    onClick={() => {
                      onClearAll();
                      setConfirmClear(false);
                      onClose();
                    }}
                    className="flex-1 py-1.5 rounded-lg bg-rose-600 text-white font-bold text-xs cursor-pointer"
                  >
                    Hapus Semua
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={onClose}
            className="text-xs text-slate-500 dark:text-slate-400 hover:underline cursor-pointer"
          >
            Tutup Jendela
          </button>
        </div>
      </div>
    </div>
  );
};
