import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-150 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#F4F8FB] disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

    const variants = {
      primary:
        'text-white border border-white/30 shadow-[0_8px_24px_rgba(0,114,255,0.28)] focus:ring-[#0072ff]/40 [background-image:linear-gradient(135deg,#00c6ff_0%,#0072ff_100%)] hover:[filter:brightness(1.05)]',
      secondary:
        'bg-white/70 text-[#1E293B] border border-white/80 hover:bg-white/95 focus:ring-[#0072ff]/30',
      outline:
        'bg-white/60 text-[#1E293B] border border-slate-300/70 hover:bg-white/95 hover:border-[#0072ff]/50 hover:text-[#0072ff] focus:ring-[#0072ff]/30',
      ghost:
        'bg-transparent text-[#475569] hover:bg-white/70 hover:text-[#0072ff] focus:ring-[#0072ff]/30',
      danger:
        'bg-rose-600 text-white hover:bg-rose-500 focus:ring-rose-500/40 border border-rose-500/30',
      success:
        'bg-emerald-600 text-white hover:bg-emerald-500 focus:ring-emerald-500/40 border border-emerald-500/30',
    };

    const sizes = {
      sm: 'text-xs px-3 py-1.5 gap-1.5',
      md: 'text-sm px-3.5 py-2 gap-2',
      lg: 'text-base px-5 py-2.5 gap-2.5',
      icon: 'h-9 w-9 p-0',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        {children}
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
