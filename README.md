# Kupit - Pelacak Keuangan Harian (3D Neumorphic)

Aplikasi pencatat dan pelacak keuangan harian (*personal finance tracker*) berbasis web dengan desain antarmuka **3D Neumorphic** yang elegan, taktil, dan intuitif.

## ✨ Fitur Utama

- 🔐 **Halaman Login 3D Neumorphic**: Modeled after *Aduok 3D Login Page* dengan cekungan debossed dan tombol taktil.
  - **Username**: `admin`
  - **Password**: `Admin123`
- 📊 **Halaman Utama (Ringkasan Keuangan)**:
  - 4 Kartu metrik finansial: **Total Pemasukan**, **Total Pengeluaran**, **Dipinjam (Piutang/Utang)**, dan **Sisa Saldo**.
  - Monitor Anggaran Harian dengan peringatan dinamis jika melebihi target.
- ⚡ **Pencatatan Instan 1-Klik**: Shortcut pengeluaran umum (Kopi, Makan Siang, Bensin, Parkir, Minimarket).
- 📝 **Pencatatan & Riwayat Transaksi**:
  - Formulir transaksi dengan opsi kategori dan penanggung jawab anggota.
  - Form keterangan kustom otomatis saat memilih kategori "Lainnya".
  - Filter rentang tanggal fleksibel (Hari Ini, 7 Hari, 30 Hari, Bulan Ini, dan Custom Date Range Picker).
  - Filter transaksi berdasarkan anggota penanggung jawab.
- 👥 **Manajemen Anggota**:
  - Kelola nama dan peran anggota keluarga/tim.
  - Pantau total kontribusi belanja per anggota.
- 🤝 **Catatan Uang Dipinjam**:
  - Lacak siapa yang meminjam dana, status pelunasan, dan tanggal jatuh tempo.
- 📁 **Ekspor Data CSV & Backup**:
  - Unduh riwayat pembukuan dalam format file CSV.
- 🌓 **Dukungan Dark Mode & Light Mode**:
  - Desain neumorphic yang beradaptasi mulus di mode terang maupun gelap.

---

## 🛠️ Teknologi & Stack

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler**: [Vite](https://vite.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Persistence**: Browser `localStorage` (Privat dan offline-ready)

---

## 🚀 Panduan Menjalankan di Komputer Lokal

### 1. Prasyarat
Pastikan Anda telah menginstal [Node.js](https://nodejs.org/) (versi 18 ke atas) atau [Bun](https://bun.sh/).

### 2. Instalasi Dependensi
Jalankan perintah berikut di terminal:

```bash
npm install
```

### 3. Menjalankan Server Pengembangan (Dev Server)
```bash
npm run dev
```
Buka browser di `http://localhost:3000` (atau port yang tertera pada terminal).

### 4. Build untuk Produksi
```bash
npm run build
```
Hasil build akan tersimpan di direktori `dist/`.

---

## 📦 Cara Upload ke GitHub

1. Buat repositori baru di [GitHub](https://github.com/new).
2. Di terminal folder proyek ini, jalankan:

```bash
# Inisialisasi Git
git init

# Tambahkan semua file
git add .

# Buat commit pertama
git commit -m "feat: initial commit aplikasi pelacak keuangan kupit"

# Ubah branch utama menjadi main
git branch -M main

# Hubungkan ke remote repositori GitHub Anda
git remote add origin https://github.com/USERNAME/NAMA-REPO-ANDA.git

# Push ke GitHub
git push -u origin main
```
