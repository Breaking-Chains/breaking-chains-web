import React, { useState } from 'react';
import { Lock, Link2Off } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { formatApiErrorMessage } from '../services/apiClient';

interface AuthPageProps {
  onBack?: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onBack }) => {
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
    <div className="bg-[#f8f9ff] text-[#0d1c2e] min-h-screen flex items-center justify-center p-container-padding font-body-md text-body-md antialiased w-full selection:bg-[#00236f]/30 relative">
      {onBack && (
        <button
          onClick={onBack}
          className="absolute top-6 left-6 flex items-center gap-1.5 text-xs font-semibold text-[#444651] hover:text-[#00236f] transition-colors cursor-pointer bg-white border border-[#c5c5d3] px-3 py-1.5 rounded-lg shadow-sm font-manrope outline-none"
        >
          ← Back to Product
        </button>
      )}
      {/* Main Container */}
      <main className="w-full max-w-[440px] animate-fade-in">
        {/* Logo & Header */}
        <div className="text-center mb-stack-lg">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-[#e6eeff] mb-stack-sm text-[#00236f]">
            <Link2Off className="w-8 h-8" />
          </div>
          <h1 className="font-manrope font-headline-lg text-headline-lg md:font-display-lg md:text-display-lg text-[#00236f] tracking-tight">
            Breaking Chains
          </h1>
          <p className="text-[#444651] mt-stack-sm font-body-md text-body-md font-manrope">
            {mode === 'login' ? 'Welcome back. Your journey continues here.' : 'Create an account to begin your journey.'}
          </p>
        </div>

        {/* Login/Auth Card */}
        <div className="bg-white rounded-xl border border-[#c5c5d3] p-container-padding">
          {/* Social Login */}
          <button
            type="button"
            onClick={() => loginAsGuest('USER')}
            className="w-full flex items-center justify-center gap-2 bg-[#e6eeff] hover:bg-[#d9e6ff] text-[#00236f] font-body-md text-body-md font-medium py-3 px-4 rounded-lg transition-colors border border-[#c5c5d3] mb-stack-md cursor-pointer font-manrope outline-none"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="currentColor"></path>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="relative flex py-5 items-center mb-stack-md">
            <div className="flex-grow border-t border-[#c5c5d3]"></div>
            <span className="flex-shrink-0 mx-4 text-[#444651] font-label-sm text-label-sm uppercase tracking-wider font-manrope">
              {mode === 'login' ? 'or sign in with email' : 'or sign up with email'}
            </span>
            <div className="flex-grow border-t border-[#c5c5d3]"></div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-3 mb-stack-md rounded-lg bg-[#ffdad6] border border-[#c5c5d3] text-[#93000a] text-xs font-semibold text-center animate-fade-in font-manrope">
              ⚠️ {error}
            </div>
          )}

          {/* Email Form */}
          <form onSubmit={handleSubmit} className="space-y-stack-md font-manrope">
            {mode === 'register' && (
              <>
                <div>
                  <label className="block font-label-sm text-label-sm text-[#444651] mb-1" htmlFor="fullName">
                    Full Name
                  </label>
                  <input
                    className="w-full bg-white border border-[#c5c5d3] text-[#0d1c2e] text-body-md rounded-lg focus:ring-2 focus:ring-[#00236f] focus:border-[#00236f] block p-2.5 transition-all outline-none"
                    id="fullName"
                    placeholder="e.g. Alex Smith"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block font-label-sm text-label-sm text-[#444651] mb-1" htmlFor="username">
                    Username
                  </label>
                  <input
                    className="w-full bg-white border border-[#c5c5d3] text-[#0d1c2e] text-body-md rounded-lg focus:ring-2 focus:ring-[#00236f] focus:border-[#00236f] block p-2.5 transition-all outline-none"
                    id="username"
                    placeholder="e.g. alexsmith"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
              </>
            )}

            <div>
              <label className="block font-label-sm text-label-sm text-[#444651] mb-1" htmlFor="email">
                Email Address
              </label>
              <input
                className="w-full bg-white border border-[#c5c5d3] text-[#0d1c2e] text-body-md rounded-lg focus:ring-2 focus:ring-[#00236f] focus:border-[#00236f] block p-2.5 transition-all outline-none"
                id="email"
                placeholder="you@example.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block font-label-sm text-label-sm text-[#444651]" htmlFor="password">
                  Password
                </label>
                {mode === 'login' && (
                  <a
                    className="font-label-sm text-label-sm text-[#00236f] hover:text-[#001b54] transition-colors hover:underline"
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      alert('Demo forgot password triggered. In production, this sends a password recovery email.');
                    }}
                  >
                    Forgot?
                  </a>
                )}
              </div>
              <input
                className="w-full bg-white border border-[#c5c5d3] text-[#0d1c2e] text-body-md rounded-lg focus:ring-2 focus:ring-[#00236f] focus:border-[#00236f] block p-2.5 transition-all outline-none"
                id="password"
                placeholder="••••••••"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              className="w-full text-white bg-[#00236f] hover:bg-[#001b54] focus:ring-4 focus:outline-none focus:ring-[#00236f]/20 font-body-md text-body-md font-medium rounded-lg px-5 py-3 text-center transition-colors shadow-sm disabled:opacity-50 cursor-pointer outline-none"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </span>
              ) : (
                mode === 'login' ? 'Sign In' : 'Sign Up'
              )}
            </button>
          </form>
        </div>

        {/* Registration Link */}
        <p className="text-center mt-stack-lg font-body-md text-body-md text-[#444651] font-manrope">
          {mode === 'login' ? (
            <>
              Don't have an account?{' '}
              <a
                className="text-[#00236f] font-semibold hover:underline"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setMode('register');
                  setError('');
                }}
              >
                Create one
              </a>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <a
                className="text-[#00236f] font-semibold hover:underline"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setMode('login');
                  setError('');
                }}
              >
                Sign in
              </a>
            </>
          )}
        </p>

        {/* Privacy Shield Banner */}
        <div className="mt-stack-lg bg-[#eff4ff] border border-[#c5c5d3] rounded-lg p-3 flex items-start gap-3">
          <Lock className="text-[#3d4143] mt-0.5 w-5 h-5 flex-shrink-0" />
          <div>
            <p className="font-label-sm text-label-sm text-[#3d4143] font-semibold uppercase tracking-wider mb-1 font-manrope">
              Privacy Focused
            </p>
            <p className="font-label-sm text-label-sm text-[#444651] leading-relaxed font-manrope">
              Your data is encrypted and secure. We prioritize your anonymity and maintain strict confidentiality standards throughout your recovery journey.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AuthPage;
