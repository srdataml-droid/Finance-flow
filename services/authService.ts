
import { apiClient } from './apiClient';
import { UserProfile } from '../types';

export const authService = {
  login: async (email: string, pass: string): Promise<{ user: UserProfile; token: string }> => {
    const data = await apiClient.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password: pass }),
    });
    localStorage.setItem('token', data.token);
    return data;
  },

  register: async (email: string, pass: string): Promise<{ user: UserProfile; token: string }> => {
    const data = await apiClient.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password: pass }),
    });
    return data;
  },

  verifyEmail: async (email: string): Promise<void> => {
    await apiClient.request('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  getCurrentUser: async (): Promise<UserProfile> => {
    return apiClient.request('/auth/me');
  },

  logout: () => {
    // Only remove the auth token to preserve user preferences (theme, language)
    localStorage.removeItem('token');
    // We don't perform a redirect here; the App component state update handles the UI shift.
  }
};
