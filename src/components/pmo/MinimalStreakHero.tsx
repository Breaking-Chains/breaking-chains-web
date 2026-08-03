import React from 'react';
import { CalendarCheck, AlertTriangle, Flame, ShieldCheck } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface MinimalStreakHeroProps {
  currentStreak: number;
  cleanRatioPercent: number;
  onOpenCheckIn: () => void;
  onTriggerSos: () => void;
}

export const MinimalStreakHero: React.FC<MinimalStreakHeroProps> = ({
  currentStreak = 18,
  cleanRatioPercent = 94.7,
  onOpenCheckIn,
  onTriggerSos,
}) => {
  return (
    <Card variant="glass" className="p-6 md:p-8 space-y-6 text-center shadow-sm">
      {/* Sleek Minimalist Central Ring */}
      <div className="relative w-36 h-36 md:w-44 md:h-44 mx-auto rounded-full bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center p-4">
        <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium text-xs mb-0.5">
          <Flame className="w-4 h-4 text-amber-500 dark:text-amber-400 fill-amber-500 dark:fill-amber-400" />
          <span>Active Streak</span>
        </div>
        <span className="text-4xl md:text-5xl font-black text-slate-900 dark:text-slate-100 font-mono tracking-tight">
          {currentStreak}
        </span>
        <span className="text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-widest font-semibold mt-1">
          Days Clean
        </span>

        {/* Clean Ratio Badge Pill */}
        <div className="absolute -bottom-2.5 bg-white dark:bg-slate-900 border border-emerald-500/20 dark:border-emerald-500/30 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          {cleanRatioPercent === 0 ? (
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-300">
              Progress: Just starting out
            </span>
          ) : (
            <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-300">
              {cleanRatioPercent}% Ratio
            </span>
          )}
        </div>
      </div>

      {/* Sleek Minimalist Action Pair */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto pt-2">
        <Button
          variant="emerald"
          size="lg"
          onClick={onOpenCheckIn}
          className="flex items-center justify-center gap-2 py-3 text-sm font-semibold"
        >
          <CalendarCheck className="w-4 h-4" />
          <span>Daily Check-In</span>
        </Button>

        <Button
          variant="sos"
          size="lg"
          onClick={onTriggerSos}
          className="flex items-center justify-center gap-2 py-3 text-sm font-bold"
        >
          <AlertTriangle className="w-4 h-4" />
          <span>SOS Helper</span>
        </Button>
      </div>
    </Card>
  );
};
