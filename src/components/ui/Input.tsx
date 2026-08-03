import React from 'react';
import { cn } from '../../utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, type = 'text', ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5 text-left">
        {label && <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">{label}</label>}
        <div className="relative flex items-center">
          {icon && <div className="absolute left-3 text-slate-500 pointer-events-none">{icon}</div>}
          <input
            ref={ref}
            type={type}
            className={cn(
              'w-full bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all min-h-[48px]',
              icon && 'pl-10',
              error && 'border-rose-500/80 focus:ring-rose-500/50 focus:border-rose-500',
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-rose-400 font-medium">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
