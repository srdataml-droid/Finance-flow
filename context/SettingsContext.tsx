
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Currency, LanguageCode, CURRENCIES, LANGUAGES } from '../types';
import { translations } from '../translations';

interface SettingsContextType {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  currency: Currency;
  setCurrency: (code: string) => void;
  language: LanguageCode;
  setLanguage: (code: LanguageCode) => void;
  t: (key: string) => string;
  formatPrice: (amount: number) => string;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => 
    (localStorage.getItem('theme') as 'light' | 'dark') || 'light'
  );
  const [currency, setCurrencyState] = useState<Currency>(() => {
    const saved = localStorage.getItem('currency');
    return CURRENCIES.find(c => c.code === saved) || CURRENCIES[0];
  });
  const [language, setLanguageState] = useState<LanguageCode>(() => 
    (localStorage.getItem('language') as LanguageCode) || 'en'
  );

  useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const setCurrency = (code: string) => {
    const found = CURRENCIES.find(c => c.code === code);
    if (found) {
      setCurrencyState(found);
      localStorage.setItem('currency', code);
    }
  };

  const setLanguage = (code: LanguageCode) => {
    setLanguageState(code);
    localStorage.setItem('language', code);
  };

  const t = (key: string) => {
    const langSet = translations[language] || translations['en'];
    return langSet[key] || key;
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat(currency.locale, {
      style: 'currency',
      currency: currency.code,
    }).format(amount);
  };

  return (
    <SettingsContext.Provider value={{ 
      theme, setTheme, 
      currency, setCurrency, 
      language, setLanguage, 
      t, formatPrice 
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within SettingsProvider');
  return context;
};
