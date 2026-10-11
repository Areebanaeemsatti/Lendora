import React from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export interface StatCardProps {
  title: string;
  value: string;
  subtext?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function StatCard({
  title,
  value,
  subtext,
  trend,
  trendValue,
  icon,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        'border border-white/80 bg-white/70 rounded-lg p-4 transition-colors duration-200 hover:border-slate-200',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#475569]">
          {title}
        </span>
        {icon && (
          <div className="w-8 h-8 rounded-md bg-slate-100 flex items-center justify-center text-[#1E293B]">
            {icon}
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <div className="text-2xl font-semibold tracking-tight text-[#0F172A] font-mono">
          {value}
        </div>
      </div>

      {(trend || subtext) && (
        <div className="mt-2.5 flex items-center gap-2 text-xs">
          {trend && trendValue && (
            <span
              className={cn(
                'inline-flex items-center gap-0.5 font-medium px-1.5 py-0.5 rounded',
                trend === 'up'
                  ? 'bg-emerald-500/10 text-emerald-600'
                  : trend === 'down'
                  ? 'bg-rose-500/10 text-rose-600'
                  : 'bg-slate-100 text-[#475569]'
              )}
            >
              {trend === 'up' && <TrendingUp className="w-3 h-3" />}
              {trend === 'down' && <TrendingDown className="w-3 h-3" />}
              {trend === 'neutral' && <Minus className="w-3 h-3" />}
              {trendValue}
            </span>
          )}
          {subtext && <span className="text-xs text-[#475569] truncate">{subtext}</span>}
        </div>
      )}
    </div>
  );
}
