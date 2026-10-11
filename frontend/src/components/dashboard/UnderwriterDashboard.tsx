'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Search,
  PlusCircle,
  ShieldCheck,
  Activity,
  ArrowUpRight,
  Inbox,
  Eye,
  CheckCircle2,
  XCircle,
  Phone,
  Landmark,
  Wallet,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/Badge';
import { formatPKR, cn } from '@/lib/utils';
import {
  toApplicationStatus,
  type LoanApplication,
  type LoanStatus,
  type RiskLevel,
} from '@/lib/mockData';
import {
  readSharedQueue,
  subscribeSharedQueue,
  addSampleApplication,
  updateSharedApplicationStatus,
} from '@/lib/sharedQueue';

/**
 * Underwriter console — a clean, jargon-free workspace for a bank officer.
 *
 * The queue is LIVE: it reads straight from the shared localStorage store and
 * re-renders the moment a borrower applies (or another tab makes a change), so
 * there is no manual refresh. All copy is plain, consumer-friendly English —
 * no model names, metrics, or developer terminology anywhere on screen.
 */

interface UnderwriterDashboardProps {
  applications?: LoanApplication[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  onUpdateStatus?: (id: string, status: LoanStatus) => void;
}

const TABS = [
  { label: 'Overview', href: '/underwriter' },
  { label: 'New Applicant', href: '/new-application' },
  { label: 'Loan Risk Checks', href: '/risk-assessments' },
  { label: 'Payment History Feed', href: '/telecom-feed' },
] as const;

/** Plain-language review priority (replaces the old "Tier A/B/C/D" labels). */
function priorityMeta(level: RiskLevel): { label: string; className: string } {
  switch (level) {
    case 'Low':
      return { label: 'Low Priority', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    case 'Moderate':
      return { label: 'Standard Priority', className: 'bg-sky-50 text-[#0072ff] border-sky-200' };
    case 'Elevated':
      return { label: 'Elevated Priority', className: 'bg-amber-50 text-amber-700 border-amber-200' };
    case 'High':
      return { label: 'High Review Priority', className: 'bg-rose-50 text-rose-700 border-rose-200' };
    default:
      return { label: 'Standard Priority', className: 'bg-slate-50 text-[#475569] border-slate-200' };
  }
}

type ShapValue = NonNullable<LoanApplication['shap_values']>[number];

/** Alternative-data signals shown on the dashboard (demo values; full feed lives on /telecom-feed). */
const SIGNALS = [
  { label: 'Mobile top-ups', value: '8 per month', note: 'Regular phone credit activity', icon: Phone, color: 'bg-sky-100 text-sky-600' },
  { label: 'Utility bills', value: '92% on time', note: 'K-Electric, Sui Gas, PTCL', icon: Landmark, color: 'bg-emerald-100 text-emerald-600' },
  { label: 'Wallet activity', value: '32 transactions/mo', note: 'JazzCash / Easypaisa', icon: Wallet, color: 'bg-violet-100 text-violet-600' },
];

export function UnderwriterDashboard({ selectedId }: UnderwriterDashboardProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [search, setSearch] = useState('');
  const [modalId, setModalId] = useState<string | null>(null);

  // Live-sync from the shared queue (in-page + cross-tab).
  useEffect(() => {
    setApplications(readSharedQueue());
    return subscribeSharedQueue(() => setApplications(readSharedQueue()));
  }, []);

  const stats = useMemo(() => {
    const total = applications.length;
    const approved = applications.filter((app) => app.status === 'approved');
    const approvedVolume = approved.reduce((sum, app) => sum + (Number(app.requestedAmount) || 0), 0);
    const approvalRate = total === 0 ? 0 : Math.round((approved.length / total) * 100);
    const avgScore =
      total === 0 ? 0 : Math.round(applications.reduce((sum, app) => sum + app.altCreditScore, 0) / total);
    return { total, approvedVolume, approvalRate, avgScore };
  }, [applications]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return applications;
    return applications.filter(
      (app) =>
        app.applicantName.toLowerCase().includes(query) ||
        app.id.toLowerCase().includes(query)
    );
  }, [applications, search]);

  const modalApp = useMemo(
    () => applications.find((a) => a.id === modalId) ?? null,
    [applications, modalId]
  );

  const closeModal = useCallback(() => setModalId(null), []);

  const decide = useCallback((id: string, status: LoanStatus) => {
    updateSharedApplicationStatus(id, status);
    setModalId(null);
  }, []);

  return (
    <div className="space-y-5">
      {/* Top bar: title + officer profile + quick actions */}
      <div className="glass flex flex-col gap-4 rounded-3xl p-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#00C6FF] to-[#0072ff] text-sm font-bold text-white">
            LO
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-[#0F172A]">Loan Review Desk</h1>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                <Activity className="h-3 w-3" /> Instant Verification
              </span>
            </div>
            <p className="text-xs text-[#475569]">Loan Officer · Pakistan Desk</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => router.push('/new-application')}
            leftIcon={<PlusCircle className="h-4 w-4" />}
          >
            + New Applicant
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => addSampleApplication()}
            leftIcon={<PlusCircle className="h-4 w-4" />}
          >
            Add sample applicant
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => router.push('/risk-assessments')}
            leftIcon={<ShieldCheck className="h-4 w-4" />}
          >
            Loan Risk Checks
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/auth')}
            leftIcon={<ArrowUpRight className="h-4 w-4" />}
          >
            Switch Portal View
          </Button>
        </div>
      </div>

      {/* Section tabs */}
      <nav className="flex gap-1 overflow-x-auto border-b border-white/60" aria-label="Desk sections">
        {TABS.map((tab) => {
          const active = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                'relative shrink-0 px-4 py-3 text-sm font-semibold transition-colors',
                active ? 'text-[#0072ff]' : 'text-[#475569] hover:text-[#0F172A]'
              )}
            >
              {tab.label}
              <span
                className={cn(
                  'absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-[#0072ff] transition-opacity',
                  active ? 'opacity-100' : 'opacity-0'
                )}
              />
            </Link>
          );
        })}
      </nav>

      {/* Metrics grid */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <MetricCard
          label="Total Applicants"
          value={String(stats.total)}
          hint="Everyone who has applied"
        />
        <MetricCard
          label="Approved Volume"
          value={formatPKR(stats.approvedVolume)}
          hint="Total approved (PKR)"
          accent="emerald"
        />
        <MetricCard
          label="Approval Rate"
          value={`${stats.approvalRate}%`}
          hint="Share of applications approved"
          accent="teal"
        />
        <MetricCard
          label="Average Credit Score"
          value={String(stats.avgScore)}
          hint="Across all applicants"
          accent="sky"
        />
      </div>

      {/* Alternative data signals */}
      <Card className="border-white/60 bg-white/70 backdrop-blur-md">
        <div className="flex items-center justify-between border-b border-white/60 p-4">
          <div>
            <h2 className="text-base font-bold text-[#0F172A]">Everyday Money Signals</h2>
            <p className="text-xs text-[#475569]">The daily habits behind each score (sample values)</p>
          </div>
          <Link
            href="/telecom-feed"
            className="text-sm font-semibold text-[#0072ff] transition-colors hover:text-[#0059d6] hover:underline"
          >
            Open full feed
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-3">
          {SIGNALS.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex items-center gap-3 rounded-2xl bg-white/60 p-3">
                <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl', item.color)}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#475569]">{item.label}</p>
                  <p className="font-mono text-base font-bold text-[#0F172A]">{item.value}</p>
                  <p className="text-[11px] text-[#475569]">{item.note}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Applications queue */}
      <Card className="border-white/60 bg-white/70 backdrop-blur-md">
        <div className="flex flex-col gap-3 border-b border-white/60 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-bold text-[#0F172A]">Applications Queue</h2>
            <p className="text-xs text-[#475569]">Live list — updates the moment someone applies.</p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#475569]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search queue..."
              className="w-full rounded-xl border border-white/60 bg-white/70 py-2 pl-9 pr-3 text-sm text-[#0F172A] placeholder-slate-400 backdrop-blur-md transition focus:border-[#0072ff] focus:outline-none focus:ring-2 focus:ring-[#0072ff]/20"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-white/60 bg-white/50 text-[11px] font-semibold uppercase tracking-wider text-[#475569]">
              <tr>
                <th className="px-5 py-3.5">Applicant Name / ID</th>
                <th className="px-5 py-3.5">Monthly Income</th>
                <th className="px-5 py-3.5">Requested Loan</th>
                <th className="px-5 py-3.5">Credit Score</th>
                <th className="px-5 py-3.5">Review Priority</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/60 text-[#1E293B]">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-sm text-[#475569]">
                    <Inbox className="mx-auto mb-2 h-6 w-6 text-[#475569]" />
                    {applications.length === 0
                      ? 'No pending loan applications right now. Use “Add sample applicant” to load one.'
                      : 'No applicants match your search.'}
                  </td>
                </tr>
              )}
              {filtered.map((app) => {
                const priority = priorityMeta(app.riskLevel);
                const isSelected = selectedId === app.id;
                return (
                  <tr
                    key={app.id}
                    className={cn('transition-colors', isSelected ? 'bg-sky-50' : 'hover:bg-white/60')}
                  >
                    <td className="px-5 py-4">
                      <div className="font-semibold text-[#0F172A]">{app.applicantName}</div>
                      <div className="mt-0.5 text-[11px] font-mono text-[#475569]">{app.id}</div>
                    </td>
                    <td className="px-5 py-4 font-mono text-[#1E293B]">{formatPKR(app.income)}</td>
                    <td className="px-5 py-4 font-mono font-semibold text-[#0F172A]">
                      {formatPKR(app.requestedAmount)}
                    </td>
                    <td className="px-5 py-4 font-mono font-semibold text-[#0F172A]">{app.altCreditScore}</td>
                    <td className="px-5 py-4">
                      <span
                        className={cn(
                          'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
                          priority.className
                        )}
                      >
                        {priority.label}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={toApplicationStatus(app.status)} />
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => setModalId(app.id)}
                          className="inline-flex items-center gap-1 text-sm font-semibold text-[#0072ff] transition-colors hover:text-[#0059d6] hover:underline"
                        >
                          <Eye className="h-4 w-4" /> Why this score
                        </button>
                        <Link
                          href={`/risk-assessments?id=${app.id}`}
                          className="text-sm font-semibold text-[#475569] transition-colors hover:text-[#0F172A] hover:underline"
                        >
                          Review
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {modalApp && (
        <ScoreModal
          application={modalApp}
          onClose={closeModal}
          onApprove={() => decide(modalApp.id, 'approved')}
          onReject={() => decide(modalApp.id, 'rejected')}
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* "Why this score" explanation modal                                  */
/* ------------------------------------------------------------------ */

function ScoreModal({
  application,
  onClose,
  onApprove,
  onReject,
}: {
  application: LoanApplication;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
}) {
  const shap: ShapValue[] = application.shap_values ?? [];
  const positives = shap.filter((v) => v.direction === 'positive');
  const negatives = shap.filter((v) => v.direction === 'negative');
  const totalUp = positives.reduce((s, v) => s + Math.abs(v.impact || 0), 0);
  const totalDown = negatives.reduce((s, v) => s + Math.abs(v.impact || 0), 0);
  const maxImpact = Math.max(...shap.map((v) => Math.abs(v.impact || 0)), 1);

  // Final score matches the table; starting score is worked back so the numbers add up.
  const finalScore = application.altCreditScore;
  const startScore = Math.round(finalScore - totalUp + totalDown);
  const drivers = [...positives, ...negatives];

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Why this score was given"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/60 bg-white/90 shadow-xl backdrop-blur-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/60 px-6 py-4">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-[#0F172A]">Why this score was given</h2>
            <p className="text-xs text-[#475569]">{application.applicantName} · {application.id}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#475569] transition-colors hover:bg-slate-100"
            aria-label="Close"
          >
            <XCircle className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-5 p-6">
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-2xl bg-slate-50 p-3">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#475569]">Starting score</p>
              <p className="mt-1 font-mono text-2xl font-bold text-[#0F172A]">{startScore}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-3">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#475569]">Adjustments</p>
              <p className="mt-1 font-mono text-xl font-bold text-[#0F172A]">
                +{totalUp.toFixed(0)} / -{totalDown.toFixed(0)}
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-3">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#475569]">Final score</p>
              <p className="mt-1 font-mono text-2xl font-bold text-[#0F172A]">{finalScore}</p>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-[#0F172A]">What moved this score</p>
            {drivers.length === 0 ? (
              <p className="mt-3 text-sm text-[#475569]">No score breakdown is available for this applicant yet.</p>
            ) : (
              <div className="mt-3 space-y-4">
                {drivers.map((driver) => {
                  const isPositive = driver.direction === 'positive';
                  const impact = Math.abs(driver.impact || 0);
                  const pct = Math.min(100, Math.round((impact / maxImpact) * 100));
                  return (
                    <div key={driver.feature_name || driver.featureName}>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="text-[#0F172A]">{driver.featureName}</span>
                        <span className={cn('font-mono font-semibold', isPositive ? 'text-emerald-600' : 'text-rose-600')}>
                          {isPositive ? '+' : '-'}
                          {impact.toFixed(1)} pts
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={cn('h-full rounded-full', isPositive ? 'bg-emerald-400' : 'bg-rose-400')}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      {driver.explanation && <p className="mt-1 text-xs text-[#475569]">{driver.explanation}</p>}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            <Button variant="success" size="sm" onClick={onApprove} className="flex-1">
              <CheckCircle2 className="mr-1.5 h-4 w-4" /> Approve
            </Button>
            <Button variant="danger" size="sm" onClick={onReject} className="flex-1">
              <XCircle className="mr-1.5 h-4 w-4" /> Reject
            </Button>
            <Button variant="outline" size="sm" onClick={onClose} className="flex-1">
              Done reviewing
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  hint,
  accent,
}: {
  label: string;
  value: string;
  hint: string;
  accent?: 'emerald' | 'teal' | 'sky';
}) {
  return (
    <div className="rounded-2xl border border-white/60 bg-white/70 p-4 backdrop-blur-md">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-[#475569]">{label}</p>
      <p
        className={cn(
          'mt-1 text-2xl font-bold tracking-tight font-mono',
          accent === 'emerald' && 'text-emerald-600',
          accent === 'teal' && 'text-teal-600',
          accent === 'sky' && 'text-[#0072ff]',
          !accent && 'text-[#0F172A]'
        )}
      >
        {value}
      </p>
      <p className="mt-0.5 text-[11px] text-[#475569]">{hint}</p>
    </div>
  );
}
