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
    default: 'bg-zinc-800/60 text-zinc-300 border-zinc-700',
    secondary: 'bg-zinc-800 text-zinc-200 border-zinc-700',
    outline: 'bg-transparent text-zinc-300 border-zinc-700',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/25',
    danger: 'bg-rose-500/10 text-rose-400 border-rose-500/25',
    info: 'bg-sky-500/10 text-sky-400 border-sky-500/25',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
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
              : 'bg-zinc-400'
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
  if (!tier) return <span className="text-zinc-500 text-xs">Unscored</span>;

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
