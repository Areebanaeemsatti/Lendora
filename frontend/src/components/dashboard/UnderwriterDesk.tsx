'use client';

import React, { useMemo, useState } from 'react';
import {
  Inbox,
  UserPlus,
  Check,
  X,
  HelpCircle,
  Wallet,
  ReceiptText,
  Smartphone,
  History,
  Landmark,
  Clock,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatPKR, cn } from '@/lib/utils';
import { toRiskTier, type LoanApplication, type LoanStatus } from '@/lib/mockData';
import { useApplications } from '@/components/providers/ApplicationsProvider';
import type { ApplicationSignals } from '@/lib/mockData';

/**
 * Underwriter console — a clean, jargon-free workspace for a bank officer.
 *
 * Reads the SHARED loan queue (live): a borrower's submission appears here the
 * moment it is made, and every decision here flows straight back to the
 * borrower's dashboard. The queue starts empty and is filled by real
 * submissions or the "Add Sample Applicant" button.
 */

const STATUS_LABEL: Record<LoanStatus, string> = {
  pending: 'Waiting for review',
  approved: 'Approved',
  rejected: 'Declined',
  more_info: 'More info needed',
};

function StatusPill({ status }: { status: LoanStatus }) {
  const variant =
    status === 'approved'
      ? 'success'
      : status === 'rejected'
      ? 'danger'
      : status === 'more_info'
      ? 'warning'
      : 'info';
  return (
    <Badge variant={variant} dot>
      {STATUS_LABEL[status]}
    </Badge>
  );
}

function RiskPill({ app }: { app: LoanApplication }) {
  const tier = toRiskTier(app.riskLevel);
  const map: Record<string, { label: string; className: string }> = {
    low: { label: 'Low risk', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    moderate: { label: 'Moderate', className: 'bg-sky-50 text-[#0072ff] border-sky-200' },
    elevated: { label: 'Elevated', className: 'bg-amber-50 text-amber-700 border-amber-200' },
    high: { label: 'High risk', className: 'bg-rose-50 text-rose-700 border-rose-200' },
  };
  const conf = map[tier] ?? map.moderate;
  return (
    <span className={cn('inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium', conf.className)}>
      {conf.label}
    </span>
  );
}

/** Plain-English list of the applicant's everyday financial activity. */
function SignalsList({ signals }: { signals?: ApplicationSignals }) {
  if (!signals) {
    return (
      <p className="text-xs text-[#475569]">
        Everyday activity details will appear here once the borrower shares them.
      </p>
    );
  }
  const rows: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }[] = [
    { icon: Wallet, label: 'Wallet use', value: signals.walletActivity },
    { icon: ReceiptText, label: 'Bill payments', value: signals.billPayments },
    { icon: Smartphone, label: 'Phone top-ups', value: signals.mobileTopUps },
    { icon: History, label: 'Past loans', value: signals.repayment },
    {
      icon: Landmark,
      label: 'Bank account',
      value: signals.hasBankAccount ? 'Has a bank account' : 'No bank account',
    },
  ];
  return (
    <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {rows.map((row) => {
        const Icon = row.icon;
        return (
          <li key={row.label} className="flex items-start gap-2 rounded-xl bg-white/70 px-3 py-2 text-xs text-[#1E293B]">
            <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[#0072ff]" />
            <span>
              <span className="font-semibold text-[#0F172A]">{row.label}: </span>
              {row.value}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

export function UnderwriterDesk() {
  const { applications, updateStatus, addSample } = useApplications();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const pendingCount = useMemo(
    () => applications.filter((app) => app.status === 'pending').length,
    [applications]
  );

  const selected = useMemo(() => {
    if (applications.length === 0) return null;
    return applications.find((app) => app.id === selectedId) ?? applications[0];
  }, [applications, selectedId]);

  return (
    <div className="space-y-6">
      {/* Top bar — plain language, no model tags. Live pending counter badge. */}
      <div className="glass flex flex-col gap-4 rounded-3xl p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-[#0F172A]">Loan Applications</h1>
            {/* Live counter badge — updates the instant a borrower applies. */}
            <span
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold',
                pendingCount > 0
                  ? 'border-amber-200 bg-amber-50 text-amber-700'
                  : 'border-slate-200 bg-white/70 text-[#475569]'
              )}
            >
              <span
                className={cn(
                  'h-1.5 w-1.5 rounded-full',
                  pendingCount > 0 ? 'animate-pulse bg-amber-500' : 'bg-slate-400'
                )}
              />
              {pendingCount} waiting
            </span>
          </div>
          <p className="mt-1 text-sm text-[#475569]">
            Review who has applied and decide in real time. New applications show up here instantly.
          </p>
        </div>

        <Button
          variant="secondary"
          size="md"
          onClick={addSample}
          leftIcon={<UserPlus className="h-4 w-4" />}
        >
          Add Sample Applicant
        </Button>
      </div>

      {/* Empty state — shown when no borrower has applied yet. */}
      {applications.length === 0 ? (
        <Card className="glass border-white/80 p-12 text-center">
          <div className="mx-auto max-w-md space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/70 text-[#0072ff]">
              <Inbox className="h-7 w-7" />
            </div>
            <h2 className="text-base font-bold text-[#0F172A]">No pending loan applications right now.</h2>
            <p className="text-sm text-[#475569]">
              When someone applies for a loan, their request will appear here right away. You can also
              add a sample applicant to try the review flow.
            </p>
            <Button
              variant="primary"
              size="md"
              onClick={addSample}
              leftIcon={<UserPlus className="h-4 w-4" />}
            >
              Add Sample Applicant
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
          {/* Queue list */}
          <div className="space-y-3 lg:col-span-3">
            {applications.map((app) => {
              const isActive = selected?.id === app.id;
              return (
                <button
                  key={app.id}
                  type="button"
                  onClick={() => setSelectedId(app.id)}
                  className={cn(
                    'w-full rounded-2xl border p-4 text-left transition-all',
                    isActive
                      ? 'border-[#0072ff]/40 bg-white/85 shadow-[0_8px_32px_rgba(15,23,42,0.06)]'
                      : 'border-white/80 bg-white/60 hover:bg-white/80'
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-[#0F172A]">{app.applicantName}</p>
                      <p className="mt-0.5 text-xs text-[#475569]">
                        Wants {formatPKR(app.requestedAmount)} · earns {formatPKR(app.income)}/mo
                      </p>
                    </div>
                    <StatusPill status={app.status} />
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-[#475569]">
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/70 px-2 py-0.5 font-mono font-semibold text-emerald-600">
                      Score {app.altCreditScore}
                    </span>
                    <RiskPill app={app} />
                    <span className="inline-flex items-center gap-1 text-[#475569]">
                      <Clock className="h-3.5 w-3.5" /> Just now
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Detail + decision panel */}
          <div className="lg:col-span-2">
            {selected && (
              <Card className="glass sticky top-20 border-white/80 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-base font-bold text-[#0F172A]">{selected.applicantName}</h2>
                    <p className="mt-0.5 text-xs text-[#475569]">
                      Requested {formatPKR(selected.requestedAmount)} over a short term
                    </p>
                  </div>
                  <StatusPill status={selected.status} />
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-white/70 p-3">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[#475569]">Score</p>
                    <p className="mt-1 text-2xl font-bold font-mono text-emerald-600">{selected.altCreditScore}</p>
                  </div>
                  <div className="rounded-2xl bg-white/70 p-3">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[#475569]">Risk</p>
                    <div className="mt-1.5">
                      <RiskPill app={selected} />
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-xs font-semibold text-[#0F172A]">Everyday money habits</p>
                  <div className="mt-2">
                    <SignalsList signals={selected.signals} />
                  </div>
                </div>

                <div className="mt-5 space-y-2">
                  <p className="text-xs font-semibold text-[#0F172A]">Your decision</p>
                  <div className="grid grid-cols-1 gap-2">
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => updateStatus(selected.id, 'approved')}
                      leftIcon={<Check className="h-4 w-4" />}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => updateStatus(selected.id, 'rejected')}
                      leftIcon={<X className="h-4 w-4" />}
                    >
                      Decline
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateStatus(selected.id, 'more_info')}
                      leftIcon={<HelpCircle className="h-4 w-4" />}
                    >
                      Request more info
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

