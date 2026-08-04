import React from 'react';
import { ShieldCheck, Flame, Settings, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface HeaderProps {
  currentStreak?: number;
  cleanRatioPercent?: number;
  onOpenSettings?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentStreak = 18,
  onOpenSettings,
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-900/40 px-4 py-2.5">
      <div className="max-w-md mx-auto flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400 stroke-[2.2] flex-shrink-0" />
          <h1 className="text-xs font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-1">
            Breaking Chains
            <span className="text-[10px] font-normal text-slate-400 dark:text-slate-500">| PMO Recovery</span>
          </h1>
        </div>

        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1 px-2.5 py-0.5 bg-slate-50 dark:bg-slate-900 rounded-full border border-slate-100 dark:border-slate-800/50">
            <Flame className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 fill-amber-500 dark:fill-amber-400 animate-pulse" />
            <span className="text-xs font-bold text-amber-600 dark:text-amber-300 font-mono">{currentStreak}d</span>
          </div>

          <button
            onClick={toggleTheme}
            className="p-1.5 bg-transparent hover:bg-slate-50 dark:hover:bg-slate-900 rounded-full text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors cursor-pointer min-h-[32px] min-w-[32px] flex items-center justify-center"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {onOpenSettings && (
            <button
              onClick={onOpenSettings}
              className="p-1.5 bg-transparent hover:bg-slate-50 dark:hover:bg-slate-900 rounded-full text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors cursor-pointer min-h-[32px] min-w-[32px] flex items-center justify-center"
              aria-label="Open Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
