import React from 'react';
import { ShieldCheck, Flame } from 'lucide-react';
import { QuickHideButton } from '../ui/QuickHideButton';

interface HeaderProps {
  currentStreak?: number;
  cleanRatioPercent?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentStreak = 18,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/60 px-4 py-3">
      <div className="max-w-md mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-500/30 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-emerald-400 stroke-[2.2]" />
          </div>
          <div>
            <h1 className="text-xs font-bold text-slate-100 tracking-tight">
              Breaking Chains
            </h1>
            <p className="text-[10px] text-slate-400 font-medium">PMO Recovery</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-full">
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="text-xs font-bold text-amber-300 font-mono">{currentStreak}d</span>
          </div>

          <QuickHideButton />
        </div>
      </div>
    </header>
  );
};
