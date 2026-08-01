import React from 'react';
import { ShieldCheck, Flame } from 'lucide-react';
import { QuickHideButton } from '../ui/QuickHideButton';
import { Badge } from '../ui/Badge';

interface HeaderProps {
  currentStreak?: number;
  cleanRatioPercent?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentStreak = 18,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 py-3">
      <div className="max-w-md mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-0.5 shadow-md shadow-emerald-900/40 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-100 tracking-tight flex items-center gap-1.5">
              Breaking Chains
              <Badge variant="emerald" size="sm">
                PMO
              </Badge>
            </h1>
            <p className="text-[11px] text-slate-400 font-medium">Purity & Habit Recovery</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-2.5 py-1 bg-amber-950/60 border border-amber-500/30 rounded-full">
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-pulse" />
            <span className="text-xs font-bold text-amber-300 font-mono">{currentStreak}d</span>
          </div>

          <QuickHideButton />
        </div>
      </div>
    </header>
  );
};
