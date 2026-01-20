
export type Category = 'Food' | 'Transport' | 'Bills' | 'Entertainment' | 'Shopping' | 'Health' | 'Education' | 'Other';

export interface Expense {
  id: string;
  userId: string;
  amount: number;
  category: Category;
  description: string;
  date: string; // ISO string
  createdAt: number;
}

export interface Budget {
  id: string;
  userId: string;
  category: Category;
  amount: number;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  emailVerified: boolean;
}

export type Currency = {
  code: string;
  symbol: string;
  locale: string;
};

export const CURRENCIES: Currency[] = [
  { code: 'USD', symbol: '$', locale: 'en-US' },
  { code: 'NGN', symbol: '₦', locale: 'en-NG' },
  { code: 'EUR', symbol: '€', locale: 'de-DE' },
  { code: 'GBP', symbol: '£', locale: 'en-GB' },
  { code: 'JPY', symbol: '¥', locale: 'ja-JP' },
  { code: 'CNY', symbol: '¥', locale: 'zh-CN' },
  { code: 'INR', symbol: '₹', locale: 'en-IN' },
  { code: 'BRL', symbol: 'R$', locale: 'pt-BR' },
];

export type LanguageCode = 'en' | 'es' | 'fr' | 'de' | 'zh' | 'ja' | 'pt' | 'yo' | 'ig' | 'ha';

export const LANGUAGES: { code: LanguageCode; name: string }[] = [
  { code: 'en', name: 'English' },
  { code: 'yo', name: 'Yoruba' },
  { code: 'ig', name: 'Igbo' },
  { code: 'ha', name: 'Hausa' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'zh', name: '中文' },
  { code: 'ja', name: '日本語' },
  { code: 'pt', name: 'Português' },
];

export const CATEGORIES: Category[] = [
  'Food', 'Transport', 'Bills', 'Entertainment', 'Shopping', 'Health', 'Education', 'Other'
];

export const CATEGORY_COLORS: Record<Category, string> = {
  Food: '#f87171',
  Transport: '#fb923c',
  Bills: '#fbbf24',
  Entertainment: '#a855f7',
  Shopping: '#ec4899',
  Health: '#10b981',
  Education: '#3b82f6',
  Other: '#94a3b8'
};
