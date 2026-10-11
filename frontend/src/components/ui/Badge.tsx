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
    default: 'bg-white/70 text-[#475569] border-white/80',
    secondary: 'bg-white/85 text-[#1E293B] border-white/90',
    outline: 'bg-transparent text-[#475569] border-slate-300/70',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
    info: 'bg-sky-50 text-[#0072ff] border-sky-200',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
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
  if (!tier) return <span className="text-[#475569] text-xs">Unscored</span>;

  switch (tier) {
    case 'low':
      return <Badge variant="success">Low Priority</Badge>;
    case 'moderate':
      return <Badge variant="info">Standard Priority</Badge>;
    case 'elevated':
      return <Badge variant="warning">Elevated Priority</Badge>;
    case 'high':
      return <Badge variant="danger">High Review Priority</Badge>;
    default:
      return <Badge variant="default">{tier}</Badge>;
  }
}
