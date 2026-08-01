import React, { useState } from 'react';
import { ShieldCheck, Mail, Lock, User as UserIcon, LogIn, UserPlus, Sparkles, ArrowRight } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';

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
      setError(err instanceof Error ? err.message : 'Authentication failed. Please check credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 selection:bg-emerald-500/30">
      <div className="w-full max-w-md space-y-6 animate-fade-in">
        {/* Sleek App Branding */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto shadow-md">
            <ShieldCheck className="w-7 h-7 text-emerald-400 stroke-[2.2]" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">
            Breaking Chains
          </h1>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            PMO Recovery & Spiritual Purification (Tazkiyah)
          </p>
        </div>

        {/* Card Gateway Container */}
        <Card variant="glass" className="p-6 border-slate-800/80 shadow-2xl space-y-5">
          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 p-1 bg-slate-950/80 rounded-xl border border-slate-900 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError('');
              }}
              className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${mode === 'login'
                  ? 'bg-slate-900 text-emerald-400 border border-slate-800 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
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
              className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${mode === 'register'
                  ? 'bg-slate-900 text-emerald-400 border border-slate-800 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
                }`}
            >
              <UserPlus className="w-3.5 h-3.5" /> Create Account
            </button>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/50 text-rose-300 text-xs text-center font-medium">
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
            <div className="flex-grow border-t border-slate-900"></div>
            <span className="flex-shrink mx-3 text-[10px] uppercase font-semibold text-slate-600">
              or
            </span>
            <div className="flex-grow border-t border-slate-900"></div>
          </div>

          {/* Guest / Demo Access Button */}
          <Button
            type="button"
            variant="subtle"
            size="md"
            onClick={loginAsGuest}
            className="w-full text-xs font-semibold flex items-center justify-center gap-2 border-slate-800 text-amber-300 hover:border-amber-500/40"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Try Offline Demo Session</span>
            <ArrowRight className="w-3.5 h-3.5 ml-auto" />
          </Button>
        </Card>

        {/* Confidentiality Footer */}
        <p className="text-center text-[11px] text-slate-500 max-w-xs mx-auto">
          🔒 100% Confidential & Encrypted
        </p>
      </div>
    </div>
  );
};
