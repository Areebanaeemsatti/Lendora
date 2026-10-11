import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
  optional?: boolean;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      label,
      helperText,
      error,
      options,
      placeholder = 'Select option...',
      optional = false,
      id,
      ...props
    },
    ref
  ) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="space-y-1.5 w-full">
        {label && (
          <div className="flex items-center justify-between">
            <label
              htmlFor={selectId}
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

        <div className="relative flex items-center">
          <select
            id={selectId}
            ref={ref}
            className={cn(
              'w-full text-xs sm:text-sm px-3.5 py-2.5 pr-9 rounded-xl bg-white/90 border transition-all duration-150 text-[#0F172A] appearance-none cursor-pointer',
              'focus:outline-none focus:ring-2 focus:ring-[#0072ff]/20 focus:border-[#0072ff]/50',
              error
                ? 'border-rose-400 bg-rose-500/5 focus:border-rose-500 focus:ring-rose-500/20'
                : 'border-white/80 hover:border-slate-300/70',
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 pointer-events-none" />
        </div>

        {error ? (
          <p className="text-[11px] font-medium text-rose-600 mt-1">{error}</p>
        ) : helperText ? (
          <p className="text-[11px] text-[#475569] leading-normal mt-1">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = 'Select';
