import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff, Sparkles, ArrowRight, Sun, Moon, ShieldAlert } from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  isDarkMode,
  toggleDarkMode,
}) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Silakan masukkan username dan password');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      // Validate credentials: username admin, password Admin123
      if (username.trim() === 'admin' && password === 'Admin123') {
        onLoginSuccess();
      } else {
        setError('Username atau password salah! (Gunakan: admin / Admin123)');
        setIsLoading(false);
      }
    }, 300);
  };

  const handleAutoFill = () => {
    setUsername('admin');
    setPassword('Admin123');
    setError('');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative selection:bg-teal-500/20">
      {/* Theme Toggle Button in top right */}
      <div className="absolute top-4 right-4 z-10">
        <button
          type="button"
          onClick={toggleDarkMode}
          className="neu-btn w-10 h-10 rounded-2xl flex items-center justify-center text-slate-700 dark:text-amber-400 transition-all cursor-pointer"
          title={isDarkMode ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap'}
        >
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>

      {/* 3D Title Kicker */}
      <div className="text-center mb-6">
        <span className="text-xl md:text-2xl font-black tracking-tight text-slate-600 dark:text-slate-400 select-none">
          3D Login Page
        </span>
      </div>

      {/* Main Neumorphic 3D Card (modeled after the uploaded Aduok 3D Login) */}
      <div className="w-full max-w-sm neu-flat p-8 rounded-[36px] relative animate-fade-in">
        {/* Brand Header */}
        <div className="text-center mb-7">
          <div className="w-14 h-14 rounded-2xl neu-convex mx-auto flex items-center justify-center text-teal-600 dark:text-teal-400 mb-3 shadow-md">
            <Sparkles size={28} className="stroke-[2.5]" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
            Kupit Login
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Masuk untuk mengakses pelacak keuangan
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Username Input (Sunken / Debossed slot) */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <User size={13} className="text-teal-600 dark:text-teal-400" />
              Username
            </label>
            <div className="neu-sunken rounded-2xl px-4 py-3 flex items-center gap-2.5 transition-all focus-within:ring-2 focus-within:ring-teal-500/30">
              <input
                type="text"
                placeholder="Username (admin)"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (error) setError('');
                }}
                className="w-full bg-transparent border-none outline-none text-xs md:text-sm font-semibold text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                autoFocus
              />
            </div>
          </div>

          {/* Password Input (Sunken / Debossed slot) */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Lock size={13} className="text-teal-600 dark:text-teal-400" />
              Password
            </label>
            <div className="neu-sunken rounded-2xl px-4 py-3 flex items-center gap-2.5 transition-all focus-within:ring-2 focus-within:ring-teal-500/30">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password (Admin123)"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                className="w-full bg-transparent border-none outline-none text-xs md:text-sm font-semibold text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                title={showPassword ? 'Sembunyikan password' : 'Lihat password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-2 animate-fade-in">
              <ShieldAlert size={15} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Sign In Button (Tactile 3D Neumorphic Button) */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-2xl neu-btn-primary font-bold text-sm tracking-wide flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-[0.98] transition-transform"
            >
              <span>{isLoading ? 'Memeriksa...' : 'Sign In'}</span>
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Preset Fill Helper */}
          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={handleAutoFill}
              className="text-[11px] text-teal-600 dark:text-teal-400 hover:underline font-medium cursor-pointer"
            >
              Isi Otomatis Akun Admin (admin / Admin123)
            </button>
          </div>
        </form>

        {/* Footer credentials reminder */}
        <div className="mt-6 pt-4 border-t border-black/[0.04] dark:border-white/[0.05] text-center">
          <div className="text-[11px] text-slate-400 dark:text-slate-500">
            Username: <strong className="text-slate-700 dark:text-slate-300 font-mono">admin</strong>
            <span className="mx-1.5">·</span>
            Password: <strong className="text-slate-700 dark:text-slate-300 font-mono">Admin123</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
