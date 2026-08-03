import React from 'react';
import { cn } from '../../utils/cn';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'glass' | 'subtle' | 'alert' | 'gold' | 'emerald' | 'dark';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'glass', children, ...props }, ref) => {
    const variantStyles = {
      glass:
        'bg-white/70 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800/60 backdrop-blur-md text-slate-900 dark:text-slate-100 shadow-sm rounded-2xl',
      subtle:
        'bg-slate-100/60 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-900 text-slate-800 dark:text-slate-200 rounded-2xl',
      alert:
        'bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/40 text-rose-800 dark:text-rose-100 rounded-2xl',
      gold:
        'bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 text-amber-800 dark:text-amber-100 rounded-2xl',
      emerald:
        'bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-100 rounded-2xl',
      dark:
        'bg-slate-100/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/60 text-slate-900 dark:text-slate-100 rounded-2xl',
    };

    return (
      <div
        ref={ref}
        className={cn('p-5 transition-all duration-200', variantStyles[variant], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
