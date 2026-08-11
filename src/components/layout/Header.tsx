import React from 'react';
import { ShieldCheck, Sun, Moon, User as UserIcon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface HeaderProps {
  currentStreak?: number;
  cleanRatioPercent?: number;
  onOpenSettings?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSettings,
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 h-16 bg-surface border-b border-outline-variant md:hidden">
      <h1 className="font-manrope text-lg font-bold text-primary tracking-tight">Breaking Chains</h1>
      
      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="text-primary hover:opacity-85 transition-opacity cursor-pointer flex items-center justify-center"
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Security / Privacy Icon */}
        <div className="text-primary">
          <ShieldCheck className="w-5 h-5" />
        </div>

        {/* Profile / Settings Button */}
        {onOpenSettings && (
          <button
            onClick={onOpenSettings}
            className="text-primary hover:opacity-85 transition-opacity cursor-pointer flex items-center justify-center"
            aria-label="Open Settings"
          >
            <UserIcon className="w-5 h-5" />
          </button>
        )}
      </div>
    </header>
  );
};
