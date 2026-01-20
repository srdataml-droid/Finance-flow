
import { apiClient } from './apiClient';
import { Expense } from '../types';

export const expenseService = {
  getExpenses: async (): Promise<Expense[]> => {
    return apiClient.request('/expenses');
  },

  addExpense: async (expense: Omit<Expense, 'id' | 'createdAt' | 'userId'>): Promise<Expense> => {
    return apiClient.request('/expenses', {
      method: 'POST',
      body: JSON.stringify(expense),
    });
  },

  updateExpense: async (id: string, updates: Partial<Expense>): Promise<Expense> => {
    return apiClient.request(`/expenses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  deleteExpense: async (id: string): Promise<void> => {
    return apiClient.request(`/expenses/${id}`, {
      method: 'DELETE',
    });
  }
};
