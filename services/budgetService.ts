
import { apiClient } from './apiClient';
import { Budget } from '../types';

export const budgetService = {
  getBudgets: async (): Promise<Budget[]> => {
    return apiClient.request('/budgets');
  },

  setBudget: async (budget: Omit<Budget, 'id' | 'userId'>): Promise<Budget> => {
    return apiClient.request('/budgets', {
      method: 'POST',
      body: JSON.stringify(budget),
    });
  }
};
