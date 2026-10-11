import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  prefixText?: string;
  suffixText?: string;
  optional?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      helperText,
      error,
      prefixText,
      suffixText,
      optional = false,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="space-y-1.5 w-full">
        {label && (
          <div className="flex items-center justify-between">
            <label
              htmlFor={inputId}
              className="text-xs font-semibold text-slate-600 tracking-tight"
            >
              {label}
              {!optional && <span className="text-rose-500 ml-0.5">*</span>}
            </label>
            {optional && (
              <span className="text-[11px] font-medium text-slate-400">Optional</span>
            )}
          </div>
        )}

        <div className="relative flex items-center rounded-xl">
          {prefixText && (
            <div className="absolute left-3 pointer-events-none flex items-center text-xs font-semibold text-slate-400">
              {prefixText}
            </div>
          )}

          <input
            id={inputId}
            ref={ref}
            className={cn(
              'w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl bg-white/90 border transition-all duration-150 text-[#0F172A] placeholder-slate-400',
              'focus:outline-none focus:ring-2 focus:ring-[#0072ff]/20 focus:border-[#0072ff]/50',
              prefixText ? 'pl-9' : '',
              suffixText ? 'pr-9' : '',
              error
                ? 'border-rose-400 bg-rose-500/5 focus:border-rose-500 focus:ring-rose-500/20'
                : 'border-white/80 hover:border-slate-300/70',
              className
            )}
            {...props}
          />

          {suffixText && (
            <div className="absolute right-3 pointer-events-none flex items-center text-xs font-medium text-slate-400">
              {suffixText}
            </div>
          )}
        </div>

        {error ? (
          <p className="text-[11px] font-medium text-rose-600 flex items-center gap-1 mt-1">
            {error}
          </p>
        ) : helperText ? (
          <p className="text-[11px] text-[#475569] leading-normal mt-1">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
