import React from 'react';
import { cn } from '../../utils/cn';

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0 to 100
  label?: string;
  subLabel?: string;
  variant?: 'emerald' | 'gold' | 'rose';
  showPercentage?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  className,
  value,
  label,
  subLabel,
  variant = 'emerald',
  showPercentage = true,
  ...props
}) => {
  const clampedValue = Math.min(100, Math.max(0, value));

  const barVariants = {
    emerald: 'bg-gradient-to-r from-emerald-600 to-teal-400 shadow-sm shadow-emerald-500/50',
    gold: 'bg-gradient-to-r from-amber-500 to-yellow-400 shadow-sm shadow-amber-500/50',
    rose: 'bg-gradient-to-r from-rose-600 to-amber-500 shadow-sm shadow-rose-500/50',
  };

  return (
    <div className={cn('w-full space-y-1.5', className)} {...props}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center text-xs font-medium text-slate-655 dark:text-slate-300">
          <span>{label}</span>
          {showPercentage && <span className="font-bold font-mono text-emerald-600 dark:text-emerald-400">{clampedValue.toFixed(1)}%</span>}
        </div>
      )}
      <div className="w-full bg-slate-200 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-800 rounded-full h-3 p-0.5 overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all duration-500 ease-out', barVariants[variant])}
          style={{ width: `${clampedValue}%` }} // Note: width property for percentage layout, clean class-based bar styling
        />
      </div>
      {subLabel && <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal">{subLabel}</p>}
    </div>
  );
};
