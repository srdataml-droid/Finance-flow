
import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Download } from 'lucide-react';
import { Expense } from '../types';
import { useSettings } from '../context/SettingsContext';

interface ReportsProps {
  expenses: Expense[];
}

const Reports: React.FC<ReportsProps> = ({ expenses }) => {
  const { t, formatPrice, theme, currency } = useSettings();
  
  const generateTrendData = () => {
    const data = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = monthDate.toLocaleString('default', { month: 'short' });
      const monthTotal = expenses
        .filter(exp => {
          const d = new Date(exp.date);
          return d.getMonth() === monthDate.getMonth() && d.getFullYear() === monthDate.getFullYear();
        })
        .reduce((sum, exp) => sum + exp.amount, 0);
      data.push({ name: monthName, Total: monthTotal });
    }
    return data;
  };

  const trendData = generateTrendData();
  const totalLifetime = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const avgMonthly = totalLifetime / (expenses.length > 0 ? 6 : 1);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{t('reports')}</h1>
          <p className="text-slate-500 dark:text-slate-400">Analyze your long-term spending patterns.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
          <Download className="w-4 h-4" /> {t('exportData')}
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-8">{t('spendingTrend')}</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#1e293b' : '#f1f5f9'} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#64748b' }} 
                  tickFormatter={(val) => `${currency.symbol}${val}`} 
                />
                <Tooltip 
                  formatter={(val: number) => [formatPrice(val), 'Total']}
                  contentStyle={{ backgroundColor: theme === 'dark' ? '#0f172a' : '#fff', border: 'none', borderRadius: '12px', color: theme === 'dark' ? '#fff' : '#000' }}
                />
                <Area type="monotone" dataKey="Total" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-indigo-600 p-6 rounded-2xl text-white shadow-lg">
            <h4 className="text-indigo-100 text-sm font-medium mb-1">{t('lifetimeSpending')}</h4>
            <div className="text-3xl font-bold">{formatPrice(totalLifetime)}</div>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h4 className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">{t('monthlyAverage')}</h4>
            <div className="text-2xl font-bold text-slate-800 dark:text-white">{formatPrice(avgMonthly)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
