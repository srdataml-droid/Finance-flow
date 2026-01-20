
import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell, 
  PieChart as RePieChart, 
  Pie 
} from 'recharts';
import { TrendingUp, TrendingDown, Wallet, PieChart } from 'lucide-react';
import { Expense, Budget, CATEGORY_COLORS, CATEGORIES } from '../types';
import { useSettings } from '../context/SettingsContext';

interface DashboardProps {
  expenses: Expense[];
  budgets: Budget[];
}

const Dashboard: React.FC<DashboardProps> = ({ expenses, budgets }) => {
  const { t, formatPrice, theme, language } = useSettings();
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const currentMonthExpenses = expenses.filter(exp => {
    const d = new Date(exp.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const totalSpent = currentMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);
  
  const categoryData = CATEGORIES.map(cat => ({
    name: cat,
    value: currentMonthExpenses
      .filter(exp => exp.category === cat)
      .reduce((sum, exp) => sum + exp.amount, 0)
  })).filter(d => d.value > 0);

  const compareData = CATEGORIES.map(cat => {
    const budget = budgets.find(b => b.category === cat)?.amount || 0;
    const spent = currentMonthExpenses
      .filter(exp => exp.category === cat)
      .reduce((sum, exp) => sum + exp.amount, 0);
    return {
      name: cat,
      Budget: budget,
      Spent: spent
    };
  }).filter(d => d.Budget > 0 || d.Spent > 0);

  const dateLabel = new Date().toLocaleString(language, { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{t('dashboard')}</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">{t('welcome')}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-tight">
            {dateLabel}
          </span>
        </div>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-2xl">
              <TrendingDown className="w-6 h-6" />
            </div>
            <span className="text-slate-500 dark:text-slate-400 font-bold text-sm uppercase tracking-wider">{t('totalSpent')}</span>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">{formatPrice(totalSpent)}</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl">
              <Wallet className="w-6 h-6" />
            </div>
            <span className="text-slate-500 dark:text-slate-400 font-bold text-sm uppercase tracking-wider">{t('monthlyBudget')}</span>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">{formatPrice(totalBudget)}</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl">
              <TrendingUp className="w-6 h-6" />
            </div>
            <span className="text-slate-500 dark:text-slate-400 font-bold text-sm uppercase tracking-wider">{t('remaining')}</span>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">
            {formatPrice(Math.max(0, totalBudget - totalSpent))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Spending Breakdown */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-xl font-black text-slate-800 dark:text-white mb-6 tracking-tight">Spending Distribution</h3>
          <div className="h-64">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={8} dataKey="value" stroke="none">
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name as keyof typeof CATEGORY_COLORS]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => formatPrice(value)} 
                    contentStyle={{ backgroundColor: theme === 'dark' ? '#0f172a' : '#fff', border: 'none', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} 
                  />
                </RePieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-2">
                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                  <PieChart className="w-6 h-6 opacity-40" />
                </div>
                <p className="text-sm font-medium">No spending data this month</p>
              </div>
            )}
          </div>
        </div>

        {/* Budget vs Actual */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-xl font-black text-slate-800 dark:text-white mb-6 tracking-tight">Budget Performance</h3>
          <div className="h-[400px]">
            {compareData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={compareData} margin={{ left: 20, right: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke={theme === 'dark' ? '#1e293b' : '#f1f5f9'} />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600, fill: theme === 'dark' ? '#94a3b8' : '#64748b' }} width={90} />
                  <Tooltip 
                    formatter={(value: number) => formatPrice(value)} 
                    contentStyle={{ backgroundColor: theme === 'dark' ? '#0f172a' : '#fff', border: 'none', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} 
                  />
                  {/* Budget bar: Silver (#94a3b8) in dark mode */}
                  <Bar dataKey="Budget" fill={theme === 'dark' ? '#94a3b8' : '#cbd5e1'} radius={[0, 6, 6, 0]} barSize={14} />
                  <Bar dataKey="Spent" fill="#4f46e5" radius={[0, 6, 6, 0]} barSize={14} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-2">
                <p className="text-sm font-medium italic">Set some budgets to see comparison</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
