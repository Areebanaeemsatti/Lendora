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
              className="text-xs font-semibold text-zinc-300 tracking-tight"
            >
              {label}
              {!optional && <span className="text-rose-500 ml-0.5">*</span>}
            </label>
            {optional && (
              <span className="text-[11px] font-medium text-zinc-500">Optional</span>
            )}
          </div>
        )}

        <div className="relative flex items-center rounded-lg">
          {prefixText && (
            <div className="absolute left-3 pointer-events-none flex items-center text-xs font-semibold text-zinc-500">
              {prefixText}
            </div>
          )}

          <input
            id={inputId}
            ref={ref}
            className={cn(
              'w-full text-xs sm:text-sm px-3.5 py-2.2 rounded-lg bg-zinc-900 border transition-all duration-150 text-zinc-100 placeholder-zinc-500',
              'focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600',
              prefixText ? 'pl-9' : '',
              suffixText ? 'pr-9' : '',
              error
                ? 'border-rose-500/60 bg-rose-500/5 focus:border-rose-500 focus:ring-rose-500/20'
                : 'border-zinc-800 hover:border-zinc-700',
              className
            )}
            {...props}
          />

          {suffixText && (
            <div className="absolute right-3 pointer-events-none flex items-center text-xs font-medium text-zinc-500">
              {suffixText}
            </div>
          )}
        </div>

        {error ? (
          <p className="text-[11px] font-medium text-rose-400 flex items-center gap-1 mt-1">
            {error}
          </p>
        ) : helperText ? (
          <p className="text-[11px] text-zinc-500 leading-normal mt-1">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
