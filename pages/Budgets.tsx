
import React, { useState } from 'react';
import { Target, Save } from 'lucide-react';
import { Budget, CATEGORIES, Category, CATEGORY_COLORS, Expense } from '../types';
import { budgetService } from '../services/budgetService';
import { useSettings } from '../context/SettingsContext';

interface BudgetsProps {
  userId: string;
  budgets: Budget[];
  expenses: Expense[];
  onUpdate?: () => void;
}

const Budgets: React.FC<BudgetsProps> = ({ userId, budgets, expenses, onUpdate }) => {
  const { t, formatPrice } = useSettings();
  const [editingBudget, setEditingBudget] = useState<{ category: Category; amount: string } | null>(null);

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const getSpentForCategory = (category: Category) => {
    return expenses
      .filter(exp => {
        const d = new Date(exp.date);
        return exp.category === category && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      })
      .reduce((sum, exp) => sum + exp.amount, 0);
  };

  const handleSaveBudget = async () => {
    if (!editingBudget) return;
    const amountNum = parseFloat(editingBudget.amount);
    if (isNaN(amountNum)) return;

    await budgetService.setBudget({
      category: editingBudget.category,
      amount: amountNum
    });
    onUpdate?.();
    setEditingBudget(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{t('budgets')}</h1>
        <p className="text-slate-500 dark:text-slate-400">Plan your monthly spending limits.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CATEGORIES.map(category => {
          const budget = budgets.find(b => b.category === category);
          const spent = getSpentForCategory(category);
          const isEditing = editingBudget?.category === category;
          const percentage = budget ? Math.min((spent / budget.amount) * 100, 100) : 0;
          const isOverBudget = budget && spent > budget.amount;

          return (
            <div key={category} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
              <div className="p-6 flex-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: CATEGORY_COLORS[category] }}
                    >
                      {category[0]}
                    </div>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{category}</span>
                  </div>
                  {isOverBudget && (
                    <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs px-2 py-1 rounded-md font-bold uppercase">
                      {t('overLimit')}
                    </span>
                  )}
                </div>

                {isEditing ? (
                  <div className="space-y-4">
                    <div className="relative">
                      <input
                        autoFocus
                        type="number"
                        className="w-full px-4 py-2 bg-black text-white border border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        placeholder="0.00"
                        value={editingBudget.amount}
                        onChange={(e) => setEditingBudget({ ...editingBudget, amount: e.target.value })}
                        onKeyDown={(e) => e.key === 'Enter' && handleSaveBudget()}
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveBudget}
                        className="flex-1 bg-indigo-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <Save className="w-4 h-4" /> {t('save')}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-baseline justify-between">
                      <div className="text-xl font-bold text-slate-900 dark:text-white">
                        {formatPrice(spent)} <span className="text-xs font-normal text-slate-400">/ {formatPrice(budget?.amount || 0)}</span>
                      </div>
                    </div>

                    <div className="relative w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className={`absolute top-0 left-0 h-full transition-all duration-500 rounded-full ${isOverBudget ? 'bg-red-500' : 'bg-indigo-600'}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs font-medium">
                      <span className="text-slate-400">{t('remainingBudget')}</span>
                      <span className={isOverBudget ? 'text-red-500' : 'text-emerald-500 font-bold'}>
                        {budget ? formatPrice(Math.max(0, budget.amount - spent)) : 'N/A'}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {!isEditing && (
                <button
                  onClick={() => setEditingBudget({ category, amount: budget?.amount.toString() || '' })}
                  className="p-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 text-indigo-600 dark:text-indigo-400 font-semibold text-sm hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors flex items-center justify-center gap-2"
                >
                  <Target className="w-4 h-4" /> {t('setBudget')}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Budgets;
