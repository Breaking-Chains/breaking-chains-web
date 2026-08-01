import React from 'react';
import { cn } from '../../utils/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'emerald' | 'gold' | 'rose' | 'slate' | 'amber';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'emerald',
  size = 'md',
  children,
  ...props
}) => {
  const variantStyles = {
    emerald: 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40',
    gold: 'bg-amber-950/80 text-amber-300 border border-amber-500/40',
    rose: 'bg-rose-950/80 text-rose-300 border border-rose-500/40',
    slate: 'bg-slate-800/80 text-slate-300 border border-slate-700/50',
    amber: 'bg-orange-950/80 text-orange-300 border border-orange-500/40',
  };

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5 font-medium rounded-md',
    md: 'text-xs px-2.5 py-1 font-semibold rounded-full tracking-wide',
  };

  return (
    <span
      className={cn('inline-flex items-center gap-1.5 backdrop-blur-sm', variantStyles[variant], sizeStyles[size], className)}
      {...props}
    >
      {children}
    </span>
  );
};
