import React from 'react';
import { cn } from '@/lib/utils';
import { RiskTier, ApplicationStatus } from '@/types';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | 'default'
    | 'secondary'
    | 'outline'
    | 'success'
    | 'warning'
    | 'danger'
    | 'info'
    | 'emerald';
  dot?: boolean;
}

export function Badge({
  className,
  variant = 'default',
  dot = false,
  children,
  ...props
}: BadgeProps) {
  const variants = {
    default: 'bg-slate-100 text-slate-800 border-slate-200',
    secondary: 'bg-slate-800 text-slate-200 border-slate-700',
    outline: 'bg-transparent text-slate-700 border-slate-300',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
    info: 'bg-sky-50 text-sky-700 border-sky-200',
    emerald: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border tracking-tight',
        variants[variant],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            'w-1.5 h-1.5 rounded-full',
            variant === 'success' || variant === 'emerald'
              ? 'bg-emerald-500'
              : variant === 'warning'
              ? 'bg-amber-500'
              : variant === 'danger'
              ? 'bg-rose-500'
              : variant === 'info'
              ? 'bg-sky-500'
              : 'bg-slate-400'
          )}
        />
      )}
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  switch (status) {
    case 'approved':
      return <Badge variant="success" dot>Approved</Badge>;
    case 'underwriting':
      return <Badge variant="info" dot>Underwriting</Badge>;
    case 'pending_review':
      return <Badge variant="warning" dot>Pending Review</Badge>;
    case 'rejected':
      return <Badge variant="danger" dot>Declined</Badge>;
    case 'more_info':
      return <Badge variant="default" dot>More Info Needed</Badge>;
    default:
      return <Badge variant="default">{status}</Badge>;
  }
}

export function RiskTierBadge({ tier }: { tier?: RiskTier }) {
  if (!tier) return <span className="text-slate-400 text-xs">Unscored</span>;

  switch (tier) {
    case 'low':
      return <Badge variant="success">Tier A (Low Risk)</Badge>;
    case 'moderate':
      return <Badge variant="info">Tier B (Moderate)</Badge>;
    case 'elevated':
      return <Badge variant="warning">Tier C (Elevated)</Badge>;
    case 'high':
      return <Badge variant="danger">Tier D (High Risk)</Badge>;
    default:
      return <Badge variant="default">{tier}</Badge>;
  }
}
