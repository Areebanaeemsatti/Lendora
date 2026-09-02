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
              className="text-xs font-semibold text-slate-800 tracking-tight"
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
              'w-full text-xs sm:text-sm px-3.5 py-2.2 pr-9 rounded-lg bg-white border transition-all duration-150 text-slate-900 appearance-none cursor-pointer',
              'focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600',
              error
                ? 'border-rose-300 bg-rose-50/20 focus:border-rose-500 focus:ring-rose-500/20'
                : 'border-slate-200 hover:border-slate-300',
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
          <p className="text-[11px] text-slate-500 leading-normal mt-1">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = 'Select';
