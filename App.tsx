
import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProfile, Expense, Budget } from './types';
import { expenseService } from './services/expenseService';
import { budgetService } from './services/budgetService';
import { authService } from './services/authService';
import { SettingsProvider } from './context/SettingsContext';

// Layout & Pages
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import Budgets from './pages/Budgets';
import Reports from './pages/Reports';
import Login from './pages/Login';

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);

  const handleLogoutState = useCallback(() => {
    setUser(null);
    setExpenses([]);
    setBudgets([]);
    authService.logout();
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const userData = await authService.getCurrentUser();
          setUser(userData);
        } catch (err) {
          console.error("Auth initialization failed", err);
          handleLogoutState();
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };
    initAuth();
  }, [handleLogoutState]);

  const fetchData = useCallback(async () => {
    if (!user) return;
    try {
      const [expData, budData] = await Promise.all([
        expenseService.getExpenses(),
        budgetService.getBudgets()
      ]);
      setExpenses(expData);
      setBudgets(budData);
    } catch (err: any) {
      if (err.message === 'Unauthorized') {
        handleLogoutState();
      }
    }
  }, [user, handleLogoutState]);

  useEffect(() => {
    if (user) {
      fetchData();
      const interval = setInterval(fetchData, 60000); 
      return () => clearInterval(interval);
    }
  }, [user, fetchData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="w-14 h-14 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium tracking-wide animate-pulse">Launching FinanceFlow...</p>
        </div>
      </div>
    );
  }

  return (
    <SettingsProvider>
      <Router>
        <Routes>
          {/* Public Login Route */}
          <Route 
            path="/login" 
            element={user ? <Navigate to="/" replace /> : <Login onLogin={setUser} />} 
          />
          
          {/* Main App Routes */}
          <Route 
            path="/*" 
            element={
              user ? (
                <Layout onLogout={handleLogoutState}>
                  <Routes>
                    <Route path="/" element={<Dashboard expenses={expenses} budgets={budgets} />} />
                    <Route path="/expenses" element={<Expenses userId={user.uid} expenses={expenses} onUpdate={fetchData} />} />
                    <Route path="/budgets" element={<Budgets userId={user.uid} budgets={budgets} expenses={expenses} onUpdate={fetchData} />} />
                    <Route path="/reports" element={<Reports expenses={expenses} />} />
                    {/* Fallback for logged-in users */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Layout>
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
        </Routes>
      </Router>
    </SettingsProvider>
  );
};

export default App;
