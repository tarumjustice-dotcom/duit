import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Trash2,
  Edit2,
  Check,
  X,
  CreditCard,
  ArrowDownRight,
  ArrowUpRight,
  Shield,
  ChevronRight,
  Receipt,
} from 'lucide-react';
import { Member, Transaction, formatRupiah } from '../types';

interface MembersPageProps {
  members: Member[];
  transactions: Transaction[];
  onAddMember: (memberData: Omit<Member, 'id' | 'createdAt'>) => void;
  onEditMember: (id: string, memberData: Partial<Member>) => void;
  onDeleteMember: (id: string) => void;
  onSelectMemberFilter: (memberName: string) => void;
}

const AVATAR_COLORS = [
  '#0d9488', // teal
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#f97316', // orange
  '#10b981', // emerald
  '#eab308', // yellow
  '#6366f1', // indigo
];

export const MembersPage: React.FC<MembersPageProps> = ({
  members,
  transactions,
  onAddMember,
  onEditMember,
  onDeleteMember,
  onSelectMemberFilter,
}) => {
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state for add / edit
  const [name, setName] = useState<string>('');
  const [role, setRole] = useState<string>('Anggota');
  const [avatarColor, setAvatarColor] = useState<string>(AVATAR_COLORS[0]);
  const [error, setError] = useState<string>('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const startEdit = (member: Member) => {
    setEditingId(member.id);
    setName(member.name);
    setRole(member.role || 'Anggota');
    setAvatarColor(member.avatarColor || AVATAR_COLORS[0]);
    setIsAdding(true);
    setError('');
  };

  const cancelForm = () => {
    setIsAdding(false);
    setEditingId(null);
    setName('');
    setRole('Anggota');
    setAvatarColor(AVATAR_COLORS[0]);
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Masukkan nama anggota');
      return;
    }

    if (editingId) {
      onEditMember(editingId, {
        name: name.trim(),
        role: role.trim() || 'Anggota',
        avatarColor,
      });
    } else {
      onAddMember({
        name: name.trim(),
        role: role.trim() || 'Anggota',
        avatarColor,
      });
    }

    cancelForm();
  };

  // Helper to compute stats for each member
  const getMemberStats = (member: Member) => {
    const memberTx = transactions.filter(
      (tx) => tx.memberId === member.id || tx.memberName === member.name
    );

    const totalExpense = memberTx
      .filter((tx) => tx.type === 'expense')
      .reduce((sum, curr) => sum + curr.amount, 0);

    const totalIncome = memberTx
      .filter((tx) => tx.type === 'income')
      .reduce((sum, curr) => sum + curr.amount, 0);

    return {
      totalExpense,
      totalIncome,
      txCount: memberTx.length,
    };
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Editorial Header Banner */}
      <div className="neu-flat p-5 md:p-6 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
            Manajemen Tim & Keluarga
          </span>
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight flex items-center gap-2">
            Daftar Nama Anggota
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
              {members.length} Orang
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Kelola anggota penanggung jawab pengeluaran untuk pembagian dan pelacakan anggaran
          </p>
        </div>

        {/* Primary Tombol Tambah Anggota */}
        <button
          onClick={() => {
            if (isAdding && !editingId) {
              cancelForm();
            } else {
              setEditingId(null);
              setName('');
              setRole('Anggota');
              setIsAdding(true);
            }
          }}
          className="neu-btn-primary px-5 py-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-[0.98] transition-transform self-start sm:self-center"
        >
          <UserPlus size={16} />
          <span>+ Tambah Anggota</span>
        </button>
      </div>

      {/* Form Tambah / Edit Anggota (Expandable 3D Neumorphic) */}
      {isAdding && (
        <div className="neu-flat p-5 md:p-6 rounded-3xl border border-teal-500/25 space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <UserPlus size={16} className="text-teal-600 dark:text-teal-400" />
              {editingId ? 'Edit Data Anggota' : 'Tambah Anggota Baru'}
            </h3>
            <button
              onClick={cancelForm}
              className="neu-btn w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Input Nama Anggota */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                  Nama Lengkap / Panggilan
                </label>
                <div className="neu-sunken rounded-2xl px-4 py-2.5">
                  <input
                    type="text"
                    placeholder="Misal: Budi, Siti, Ayah, Rian"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (error) setError('');
                    }}
                    className="w-full bg-transparent border-none outline-none text-xs md:text-sm font-semibold text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
                    autoFocus
                  />
                </div>
              </div>

              {/* Input Peran / Jabatan */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                  Peran / Keterangan
                </label>
                <div className="neu-sunken rounded-2xl px-4 py-2.5">
                  <input
                    type="text"
                    placeholder="Misal: Pengelola, Bendahara, Rekan Tim, Keluarga"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-transparent border-none outline-none text-xs md:text-sm font-medium text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
                  />
                </div>
              </div>
            </div>

            {/* Pilihan Warna Avatar */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2">
                Pilih Warna Identitas Avatar
              </label>
              <div className="flex flex-wrap items-center gap-2.5">
                {AVATAR_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setAvatarColor(c)}
                    className={`w-7 h-7 rounded-xl transition-all cursor-pointer flex items-center justify-center ${
                      avatarColor === c ? 'scale-110 ring-2 ring-teal-500 shadow-md' : 'opacity-80 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: c }}
                  >
                    {avatarColor === c && <Check size={14} className="text-white stroke-[3]" />}
                  </button>
                ))}
              </div>
            </div>

            {error && <div className="text-xs text-rose-500 font-semibold">{error}</div>}

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={cancelForm}
                className="neu-btn px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="neu-btn-primary px-5 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Check size={15} />
                <span>{editingId ? 'Simpan Perubahan' : 'Simpan Anggota'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Grid of Member Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {members.map((member) => {
          const stats = getMemberStats(member);
          const initials = member.name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .substring(0, 2)
            .toUpperCase();

          const isDeleting = deletingId === member.id;

          return (
            <div
              key={member.id}
              className="neu-flat p-5 rounded-3xl relative overflow-hidden flex flex-col justify-between transition-transform hover:translate-y-[-2px] group"
            >
              <div>
                {/* Member Header: Avatar & Info */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-extrabold text-sm shadow-md"
                      style={{ backgroundColor: member.avatarColor || '#0d9488' }}
                    >
                      {initials}
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-800 dark:text-slate-100 leading-tight">
                        {member.name}
                      </h4>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        {member.role || 'Anggota'}
                      </span>
                    </div>
                  </div>

                  {/* Actions: Edit & Delete */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => startEdit(member)}
                      className="neu-btn w-7 h-7 rounded-xl flex items-center justify-center text-slate-400 hover:text-teal-600 cursor-pointer"
                      title="Edit Anggota"
                    >
                      <Edit2 size={13} />
                    </button>
                    {members.length > 1 && (
                      <button
                        onClick={() => setDeletingId(member.id)}
                        className="neu-btn w-7 h-7 rounded-xl flex items-center justify-center text-slate-400 hover:text-rose-500 cursor-pointer"
                        title="Hapus Anggota"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Member Statistics: Pengeluaran yang Bertanggung Jawab */}
                <div className="neu-sunken-sm p-3.5 rounded-2xl space-y-2 mb-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
                      <ArrowDownRight size={13} className="text-rose-500" />
                      Total Pengeluaran:
                    </span>
                    <span className="font-mono font-bold text-rose-600 dark:text-rose-400 tabular-nums">
                      {formatRupiah(stats.totalExpense)}
                    </span>
                  </div>

                  {stats.totalIncome > 0 && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
                        <ArrowUpRight size={13} className="text-emerald-500" />
                        Total Pemasukan:
                      </span>
                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                        {formatRupiah(stats.totalIncome)}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-black/[0.04] dark:border-white/[0.05]">
                    <span>Jumlah Transaksi</span>
                    <span className="font-mono font-semibold text-slate-700 dark:text-slate-200">
                      {stats.txCount} dicatat
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick action: View member transactions */}
              <button
                onClick={() => onSelectMemberFilter(member.name)}
                className="neu-btn w-full py-2 px-3 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-teal-600 dark:hover:text-teal-400 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Receipt size={13} />
                <span>Lihat Transaksi ({stats.txCount})</span>
                <ChevronRight size={13} />
              </button>

              {/* Delete Confirmation Overlay */}
              {isDeleting && (
                <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-xs rounded-3xl flex flex-col items-center justify-center p-4 z-10 animate-fade-in text-center space-y-3">
                  <span className="text-xs font-bold text-white">
                    Hapus anggota "{member.name}"?
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setDeletingId(null)}
                      className="px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white text-xs font-medium cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      onClick={() => {
                        onDeleteMember(member.id);
                        setDeletingId(null);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold cursor-pointer"
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
  );
};
