
import React, { useState, useEffect } from 'react';
import { X, Plus, Calendar, Tag, FileText } from 'lucide-react';
import { CATEGORIES, Expense, Category } from '../types';
import { expenseService } from '../services/expenseService';
import { useSettings } from '../context/SettingsContext';

interface ExpenseFormProps {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
  editingExpense?: Expense | null;
  onUpdate?: () => void;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ userId, isOpen, onClose, editingExpense, onUpdate }) => {
  const { t } = useSettings();
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Category>('Food');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingExpense) {
      setAmount(editingExpense.amount.toString());
      setCategory(editingExpense.category);
      setDescription(editingExpense.description);
      setDate(editingExpense.date);
    } else {
      setAmount('');
      setCategory('Food');
      setDescription('');
      setDate(new Date().toISOString().split('T')[0]);
    }
  }, [editingExpense, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !userId) return;

    setLoading(true);
    try {
      const expenseData = {
        amount: parseFloat(amount),
        category,
        description,
        date,
      };

      if (editingExpense) {
        await expenseService.updateExpense(editingExpense.id, expenseData);
      } else {
        await expenseService.addExpense(expenseData);
      }
      onUpdate?.();
      onClose();
    } catch (err) {
      console.error(err);
      alert('Failed to save expense');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">
            {editingExpense ? t('editExpense') : t('addExpense')}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              {t('amount')}
            </label>
            <input
              type="number"
              step="0.01"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-2 bg-black text-white border border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-2">
              <Tag className="w-4 h-4" /> {t('category')}
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="w-full px-4 py-2 bg-black text-white border border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat} className="bg-slate-900">{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-2">
              <FileText className="w-4 h-4" /> {t('description')}
            </label>
            <input
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 bg-black text-white border border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder={t('description')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-2">
              <Calendar className="w-4 h-4" /> {t('date')}
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2 bg-black text-white border border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
            >
              {loading ? (
                '...'
              ) : (
                <><Plus className="w-5 h-5" /> {editingExpense ? t('save') : t('addExpense')}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseForm;
