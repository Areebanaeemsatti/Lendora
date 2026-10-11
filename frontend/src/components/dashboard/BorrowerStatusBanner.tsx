'use client';

import React, { useMemo } from 'react';
import { CheckCircle2, XCircle, HelpCircle, Clock, Wallet } from 'lucide-react';
import { cn, formatPKR } from '@/lib/utils';
import { useApplications } from '@/components/providers/ApplicationsProvider';
import { useSession } from '@/components/providers/SessionProvider';
import type { LoanStatus } from '@/lib/mockData';

/**
 * Live status banner on the borrower dashboard.
 *
 * Finds the signed-in borrower's most recent application in the SHARED queue
 * and reflects the officer's decision in plain language the moment it changes
 * (approved / declined / more info needed / still waiting).
 */

interface BannerCopy {
  title: string;
  body: string;
  icon: React.ComponentType<{ className?: string }>;
  className: string;
  iconClass: string;
}

function copyFor(status: LoanStatus, amount: number): BannerCopy {
  const money = formatPKR(amount);
  switch (status) {
    case 'approved':
      return {
        title: 'Loan Approved — Funds Transferring to Wallet',
        body: `Great news! Your ${money} loan is approved and the money is on its way to your wallet now.`,
        icon: CheckCircle2,
        className: 'border-emerald-200 bg-emerald-50',
        iconClass: 'text-emerald-600',
      };
    case 'rejected':
      return {
        title: 'Application Not Approved',
        body: 'Thanks for applying. We are not able to approve this loan right now. You can apply again later.',
        icon: XCircle,
        className: 'border-rose-200 bg-rose-50',
        iconClass: 'text-rose-600',
      };
    case 'more_info':
      return {
        title: 'We Need a Little More Information',
        body: 'A reviewer has asked for more details about your application. Please check and update your info.',
        icon: HelpCircle,
        className: 'border-amber-200 bg-amber-50',
        iconClass: 'text-amber-600',
      };
    default:
      return {
        title: 'Application Received — Under Review',
        body: `Your ${money} loan request is with our team. We will update you here as soon as there is a decision.`,
        icon: Clock,
        className: 'border-sky-200 bg-sky-50',
        iconClass: 'text-[#0072ff]',
      };
  }
}

export function BorrowerStatusBanner() {
  const { session } = useSession();
  const { applications } = useApplications();
  const cnic = session?.cnic ?? null;

  // The borrower's own most-recent application (newest first in the queue).
  const myApplication = useMemo(() => {
    if (!cnic) return null;
    return applications.find((app) => app.borrowerCnic === cnic) ?? null;
  }, [applications, cnic]);

  if (!myApplication) return null;

  const copy = copyFor(myApplication.status, myApplication.requestedAmount);
  const Icon = copy.icon;

  return (
    <div className={cn('animate-fade-up flex items-start gap-3 rounded-3xl border p-4 sm:p-5', copy.className)}>
      <div className={cn('mt-0.5 shrink-0', copy.iconClass)}>
        {myApplication.status === 'approved' ? (
          <Wallet className="h-6 w-6" />
        ) : (
          <Icon className="h-6 w-6" />
        )}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-bold text-[#0F172A]">{copy.title}</p>
        <p className="mt-1 text-sm text-[#475569]">{copy.body}</p>
      </div>
    </div>
  );
}
