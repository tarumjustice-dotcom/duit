import React from 'react';
import {
  UtensilsCrossed,
  Car,
  ShoppingBag,
  Receipt,
  Gamepad2,
  HeartPulse,
  GraduationCap,
  Users,
  Sparkles,
  Wallet,
  Store,
  Laptop,
  TrendingUp,
  Gift,
  Coins,
  Banknote,
  Landmark,
  QrCode,
  Smartphone,
  CreditCard,
  CircleDollarSign,
} from 'lucide-react';

interface CategoryIconProps {
  name: string;
  className?: string;
  size?: number;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ name, className = '', size = 18 }) => {
  switch (name) {
    case 'Makanan & Minuman':
    case 'UtensilsCrossed':
      return <UtensilsCrossed size={size} className={className} />;
    case 'Transportasi':
    case 'Car':
      return <Car size={size} className={className} />;
    case 'Belanja Harian':
    case 'ShoppingBag':
      return <ShoppingBag size={size} className={className} />;
    case 'Tagihan & Utilitas':
    case 'Receipt':
      return <Receipt size={size} className={className} />;
    case 'Hiburan & Santai':
    case 'Gamepad2':
      return <Gamepad2 size={size} className={className} />;
    case 'Kesehatan':
    case 'HeartPulse':
      return <HeartPulse size={size} className={className} />;
    case 'Pendidikan':
    case 'GraduationCap':
      return <GraduationCap size={size} className={className} />;
    case 'Keluarga':
    case 'Users':
      return <Users size={size} className={className} />;
    case 'Gaji & Upah':
    case 'Wallet':
      return <Wallet size={size} className={className} />;
    case 'Bisnis & Jualan':
    case 'Store':
      return <Store size={size} className={className} />;
    case 'Freelance & Proyek':
    case 'Laptop':
      return <Laptop size={size} className={className} />;
    case 'Investasi':
    case 'TrendingUp':
      return <TrendingUp size={size} className={className} />;
    case 'Hadiah & Bonus':
    case 'Gift':
      return <Gift size={size} className={className} />;
    case 'Tunai':
    case 'Banknote':
      return <Banknote size={size} className={className} />;
    case 'Transfer Bank':
    case 'Landmark':
      return <Landmark size={size} className={className} />;
    case 'QRIS':
    case 'QrCode':
      return <QrCode size={size} className={className} />;
    case 'E-Wallet':
    case 'Smartphone':
      return <Smartphone size={size} className={className} />;
    case 'Kartu Debit/Kredit':
    case 'CreditCard':
      return <CreditCard size={size} className={className} />;
    case 'Coins':
      return <Coins size={size} className={className} />;
    default:
      return <CircleDollarSign size={size} className={className} />;
  }
};
