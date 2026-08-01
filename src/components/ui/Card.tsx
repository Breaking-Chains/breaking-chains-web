import React from 'react';
import { cn } from '../../utils/cn';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'emerald' | 'gold' | 'dark' | 'glass' | 'alert';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'glass', children, ...props }, ref) => {
    const variantStyles = {
      glass:
        'bg-slate-900/80 border border-slate-800/80 backdrop-blur-md text-slate-100 shadow-xl shadow-slate-950/40',
      emerald:
        'bg-gradient-to-br from-emerald-950/90 to-slate-900/90 border border-emerald-800/40 text-emerald-50 shadow-xl shadow-emerald-950/40',
      gold:
        'bg-gradient-to-br from-amber-950/40 to-slate-900/90 border border-amber-500/30 text-amber-50 shadow-xl shadow-amber-950/30',
      dark:
        'bg-slate-900 border border-slate-800 text-slate-100 shadow-lg',
      alert:
        'bg-gradient-to-br from-rose-950/90 to-slate-900/90 border border-rose-600/40 text-rose-100 shadow-xl shadow-rose-950/50',
    };

    return (
      <div
        ref={ref}
        className={cn('rounded-2xl p-5 transition-all duration-200', variantStyles[variant], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
