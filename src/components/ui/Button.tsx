import React from 'react';
import { cn } from '../../utils/cn';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'emerald' | 'subtle' | 'danger' | 'ghost' | 'sos' | 'outline' | 'gold';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'emerald',
      size = 'md',
      isLoading = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] touch-manipulation';

    const variantStyles = {
      emerald:
        'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm font-semibold',
      gold:
        'bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-sm',
      subtle:
        'bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700/60 font-medium',
      danger:
        'bg-rose-600 hover:bg-rose-500 text-white font-semibold',
      ghost:
        'bg-transparent hover:bg-slate-800/50 text-slate-300',
      outline:
        'bg-transparent hover:bg-slate-900 text-emerald-400 border border-emerald-500/30',
      sos:
        'bg-rose-600 hover:bg-rose-500 text-white font-bold tracking-wide shadow-md shadow-rose-950/40',
    };

    const sizeStyles = {
      sm: 'text-xs px-3 py-2 min-h-[38px]',
      md: 'text-sm px-4 py-2.5 min-h-[44px]',
      lg: 'text-sm px-5 py-3 min-h-[48px] w-full',
      icon: 'p-2.5 min-h-[40px] min-w-[40px] rounded-xl',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin h-4 w-4 text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Processing...</span>
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
