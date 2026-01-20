
import React, { useState } from 'react';
import { authService } from '../services/authService';
import { UserProfile } from '../types';
import { Mail, Lock, LogIn, UserPlus, ShieldCheck, PieChart, ArrowLeft, Bell, ExternalLink } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

interface LoginProps {
  onLogin: (user: UserProfile) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const { t } = useSettings();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showVerificationSent, setShowVerificationSent] = useState(false);
  const [simulatedInbox, setSimulatedInbox] = useState<{ email: string, provider: string } | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        const response = await authService.login(email, password);
        onLogin(response.user);
      } else {
        const response = await authService.register(email, password);
        setShowVerificationSent(true);
        const provider = email.toLowerCase().includes('gmail') ? 'Gmail' : 
                         email.toLowerCase().includes('yahoo') ? 'Yahoo Mail' : 'Account';
        
        // Simulation of incoming mail from samuelirenikase@gmail.com
        setTimeout(() => {
          setSimulatedInbox({ email, provider });
        }, 3500);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyFromInbox = async () => {
    if (!simulatedInbox) return;
    try {
      await authService.verifyEmail(simulatedInbox.email);
      setSimulatedInbox(null);
      setShowVerificationSent(false);
      setIsLogin(true);
      setError('');
      alert(`Account verified! You can now sign in with your email and password.`);
    } catch (err: any) {
      alert('Verification failed.');
    }
  };

  if (showVerificationSent) {
    return (
      <div className="min-h-screen bg-indigo-600 flex items-center justify-center p-4 relative overflow-hidden font-sans">
        <div className="max-w-md w-full relative z-10 animate-in fade-in zoom-in duration-500">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl p-10 border border-white/20 text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-indigo-100 dark:bg-indigo-900/30 rounded-full text-indigo-600">
                <Mail className="w-12 h-12" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">Check your {simulatedInbox?.provider || 'Inbox'}</h2>
            <p className="text-slate-500 text-sm mb-4">
              A verification link was sent to <span className="font-bold text-slate-800 dark:text-slate-200">{email}</span>.
            </p>
            <p className="text-slate-400 text-xs mb-8">
              Check for a message from: <br/> <span className="font-semibold text-indigo-600 dark:text-indigo-400">samuelirenikase@gmail.com</span>
            </p>
            
            <button
              onClick={() => setShowVerificationSent(false)}
              className="flex items-center justify-center gap-2 text-slate-500 font-semibold hover:text-indigo-600 w-full transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Login
            </button>
          </div>
        </div>

        {simulatedInbox && (
          <div className="fixed top-8 right-8 max-w-sm w-full bg-white dark:bg-slate-800 shadow-2xl rounded-2xl p-6 border-l-4 border-indigo-500 animate-in slide-in-from-right duration-700 z-[60]">
            <div className="flex gap-4">
              <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-lg h-fit">
                <Bell className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-bold text-slate-800 dark:text-white text-sm">New Message Received</h4>
                </div>
                <p className="text-[11px] text-slate-500">From: <span className="text-indigo-600 font-bold">samuelirenikase@gmail.com</span></p>
                <p className="text-xs text-slate-700 dark:text-slate-300 mt-2 leading-relaxed">
                  Hi, please click the button below to verify your FinanceFlow account.
                </p>
                <button
                  onClick={handleVerifyFromInbox}
                  className="mt-4 w-full bg-indigo-600 text-white text-xs py-2.5 rounded-lg font-bold hover:bg-indigo-700 flex items-center justify-center gap-2 shadow-md"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Verify Account
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-indigo-600 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-400 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-md w-full relative z-10 animate-in fade-in zoom-in duration-500">
        <div className="text-center mb-8 text-white">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-white/10 rounded-3xl backdrop-blur-lg border border-white/20">
              <PieChart className="w-10 h-10" />
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight">FinanceFlow</h1>
        </div>

        <div className="bg-white dark:bg-slate-900 backdrop-blur-xl rounded-[2.5rem] shadow-2xl p-8 lg:p-10 border border-white/20">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
              {isLogin ? t('login') : t('register')}
            </h2>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 z-10" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all dark:text-white"
                  placeholder={t('email')}
                />
              </div>
            </div>

            <div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 z-10" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all dark:text-white"
                  placeholder={t('password')}
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-100 dark:border-red-900 text-red-600 text-xs flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2 shadow-lg shadow-indigo-200 dark:shadow-none"
            >
              {loading ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : (isLogin ? t('login') : t('register'))}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-500 text-sm font-medium">
              {isLogin ? t('noAccount') : t('alreadyMember')}
              <button onClick={() => setIsLogin(!isLogin)} className="ml-2 text-indigo-600 font-bold hover:underline focus:outline-none">
                {isLogin ? t('createAccount') : t('backToLogin')}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
