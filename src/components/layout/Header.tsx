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
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/60 px-4 py-3">
      <div className="max-w-md mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 border border-emerald-500/20 dark:border-emerald-500/30 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 stroke-[2.2]" />
          </div>
          <div>
            <h1 className="text-xs font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Breaking Chains
            </h1>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">PMO Recovery</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-2.5 py-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full">
            <Flame className="w-3.5 h-3.5 text-amber-550 dark:text-amber-400 fill-amber-500 dark:fill-amber-400" />
            <span className="text-xs font-bold text-amber-600 dark:text-amber-300 font-mono">{currentStreak}d</span>
          </div>

          <button
            onClick={toggleTheme}
            className="p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 transition-all cursor-pointer"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {onOpenSettings && (
            <button
              onClick={onOpenSettings}
              className="p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 transition-all cursor-pointer"
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
