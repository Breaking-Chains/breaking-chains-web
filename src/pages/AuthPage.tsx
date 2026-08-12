import React, { useState } from 'react';
import { Lock, Link2Off, ArrowLeft, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { formatApiErrorMessage } from '../services/apiClient';
import authContent from '../data/authContent.json';
import './AuthPage.css';

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, register } = useAuth();

  const handleGoogleLogin = () => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
    window.location.href = `${baseUrl}/api/v1/auth/google`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        if (!fullName || !username) {
          setError('Please provide full name and username.');
          setIsSubmitting(false);
          return;
        }
        await register(email, password, fullName, username);
      }
    } catch (err: unknown) {
      setError(formatApiErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentText = mode === 'login' ? authContent.login : authContent.register;
  const dividerLabel = mode === 'login' ? authContent.dividerText.login : authContent.dividerText.register;

  return (
    <div className="auth-container arabesque-pattern">
      <div className="auth-glow-1"></div>
      <div className="auth-glow-2"></div>

      {onBack && (
        <button onClick={onBack} className="auth-btn-back">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Product</span>
        </button>
      )}

      <main className="auth-card-wrapper animate-fade-in">
        {/* Header Branding */}
        <div className="auth-header">
          <div className="auth-logo-box">
            <Link2Off className="w-7 h-7" />
          </div>
          <h1 className="auth-title">Breaking Chains</h1>
          <p className="auth-subtitle">{currentText.subtitle}</p>
        </div>

        {/* Auth form Panel */}
        <div className="auth-card">
          
          {/* Google Login Button */}
          <button type="button" onClick={handleGoogleLogin} className="auth-google-btn">
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="currentColor"></path>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
            </svg>
            <span>{authContent.googleBtn}</span>
          </button>

          {/* Separation line */}
          <div className="auth-divider-container">
            <div className="auth-divider-line"></div>
            <span className="auth-divider-text">{dividerLabel}</span>
            <div className="auth-divider-line"></div>
          </div>

          {/* Validation Alert */}
          {error && (
            <div className="auth-error-banner animate-fade-in">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Input Form Fields */}
          <form onSubmit={handleSubmit} className="auth-form">
            {mode === 'register' && (
              <>
                <div className="auth-form-group">
                  <label className="auth-label" htmlFor="fullName">
                    {authContent.register.fullNameLabel}
                  </label>
                  <input
                    id="fullName"
                    className="auth-input"
                    placeholder="e.g. Alex Smith"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>

                <div className="auth-form-group">
                  <label className="auth-label" htmlFor="username">
                    {authContent.register.usernameLabel}
                  </label>
                  <input
                    id="username"
                    className="auth-input"
                    placeholder="e.g. alexsmith"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
              </>
            )}

            <div className="auth-form-group">
              <label className="auth-label" htmlFor="email">
                {currentText.emailLabel}
              </label>
              <input
                id="email"
                className="auth-input"
                placeholder="you@example.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="auth-form-group">
              <div className="auth-label-row">
                <label className="auth-label" htmlFor="password">
                  {currentText.passwordLabel}
                </label>
                {mode === 'login' && (
                  <a
                    className="auth-forgot-link"
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
                id="password"
                className="auth-input"
                placeholder="••••••••"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              className="auth-submit-btn"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing...</span>
                </span>
              ) : (
                <span>{currentText.submitBtn}</span>
              )}
            </button>
          </form>
        </div>

        {/* View Switcher Link */}
        <p className="auth-toggle-panel">
          <span>{currentText.toggleText}</span>
          <a
            className="auth-toggle-link"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setMode(mode === 'login' ? 'register' : 'login');
              setError('');
            }}
          >
            {currentText.toggleLink}
          </a>
        </p>

        {/* Privacy Sanctuary Trust Badge */}
        <div className="auth-privacy-banner">
          <div className="auth-privacy-glow"></div>
          <div className="auth-privacy-icon-box">
            <Lock className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h4 className="auth-privacy-title">{authContent.privacy.title}</h4>
            <p className="auth-privacy-desc">{authContent.privacy.text}</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AuthPage;
