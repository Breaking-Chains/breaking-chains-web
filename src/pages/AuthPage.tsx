import React, { useState } from 'react';
import { ShieldCheck, Mail, Lock, User as UserIcon, LogIn, UserPlus } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';
import { formatApiErrorMessage } from '../services/apiClient';

export const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const { login, register, loginAsGuest, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        if (!fullName || !username) {
          setError('Please provide full name and username.');
          return;
        }
        await register(email, password, fullName, username);
      }
    } catch (err: unknown) {
      setError(formatApiErrorMessage(err));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center items-center p-4 selection:bg-emerald-500/30 transition-colors duration-300">
      <div className="w-full max-w-md space-y-6 animate-fade-in">
        {/* Sleek App Branding */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center mx-auto shadow-md">
            <ShieldCheck className="w-7 h-7 text-emerald-600 dark:text-emerald-400 stroke-[2.2]" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Breaking Chains
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xs mx-auto">
            PMO Recovery & Spiritual Growth
          </p>
        </div>

        {/* Card Gateway Container */}
        <Card variant="glass" className="p-6 shadow-2xl space-y-5">
          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-950/80 rounded-xl border border-slate-200 dark:border-slate-900 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError('');
              }}
              className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${mode === 'login'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 border border-slate-200 dark:border-slate-800 shadow-sm font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
            >
              <LogIn className="w-3.5 h-3.5" /> Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setError('');
              }}
              className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${mode === 'register'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 border border-slate-200 dark:border-slate-800 shadow-sm font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
            >
              <UserPlus className="w-3.5 h-3.5" /> Create Account
            </button>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-3 rounded-xl bg-rose-55/60 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/50 text-rose-800 dark:text-rose-300 text-xs text-center font-medium animate-fade-in">
              {error}
            </div>
          )}

          {/* Auth Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === 'register' && (
              <>
                <Input
                  label="Full Name"
                  placeholder="e.g. Alex Smith"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  icon={<UserIcon className="w-4 h-4 text-slate-500" />}
                  required
                />
                <Input
                  label="Username"
                  placeholder="e.g. alexsmith"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  icon={<UserIcon className="w-4 h-4 text-slate-500" />}
                  required
                />
              </>
            )}

            <Input
              label="Email Address"
              type="email"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="w-4 h-4 text-slate-500" />}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock className="w-4 h-4 text-slate-500" />}
              required
            />

            <Button
              type="submit"
              variant="emerald"
              size="lg"
              isLoading={isLoading}
              className="w-full mt-2 text-sm"
            >
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-200 dark:border-slate-900"></div>
            <span className="flex-shrink mx-3 text-[10px] uppercase font-semibold text-slate-500 dark:text-slate-600">
              or
            </span>
            <div className="flex-grow border-t border-slate-200 dark:border-slate-900"></div>
          </div>

          {/* Guest / Demo Access Buttons */}
          <div className="space-y-2 pt-1">
            <span className="block text-[9px] uppercase tracking-wider font-bold text-slate-750 dark:text-slate-500 text-center mb-1.5">
              Select Demo Access Role
            </span>
            <div className="grid grid-cols-3 gap-2">
              <Button
                type="button"
                variant="subtle"
                size="sm"
                onClick={() => loginAsGuest('USER')}
                className="text-[10px] py-2.5 px-1 text-slate-800 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-bold cursor-pointer"
              >
                Recoverer
              </Button>
              <Button
                type="button"
                variant="subtle"
                size="sm"
                onClick={() => loginAsGuest('MENTOR')}
                className="text-[10px] py-2.5 px-1 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 border border-emerald-250 dark:border-emerald-900/50 rounded-xl font-bold cursor-pointer"
              >
                Mentor
              </Button>
              <Button
                type="button"
                variant="subtle"
                size="sm"
                onClick={() => loginAsGuest('ADMIN')}
                className="text-[10px] py-2.5 px-1 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/20 border border-amber-250 dark:border-amber-900/50 rounded-xl font-bold cursor-pointer"
              >
                Admin
              </Button>
            </div>
          </div>
        </Card>

        {/* Confidentiality Footer */}
        <p className="text-center text-[11px] text-slate-500 max-w-xs mx-auto">
          🔒 100% Confidential & Encrypted
        </p>
      </div>
    </div>
  );
};
