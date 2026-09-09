'use client';

import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { RiskTierBadge, StatusBadge } from '@/components/ui/Badge';
import { ShapModal } from '@/components/ShapModal';
import { useToast } from '@/components/ui/Toast';
import { formatPKR, cn } from '@/lib/utils';
import {
  toApplicationStatus,
  toRiskTier,
  type LoanApplication,
  type LoanStatus,
} from '@/lib/mockData';
import { Check, X, Filter, ShieldCheck, Scale, Search, RefreshCw } from 'lucide-react';

type StatusFilter = 'all' | LoanStatus;

interface UnderwriterDashboardProps {
  applications: LoanApplication[];
  selectedId?: string | null;
  onSelect: (id: string) => void;
  onUpdateStatus: (id: string, status: LoanStatus) => void;
}

export function UnderwriterDashboard({
  applications,
  selectedId,
  onSelect,
  onUpdateStatus,
}: UnderwriterDashboardProps) {
  const [filter, setFilter] = useState<StatusFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [shapModalOpen, setShapModalOpen] = useState(false);
  const [selectedAppForShap, setSelectedAppForShap] = useState<LoanApplication | null>(null);

  const { toast } = useToast();

  const stats = useMemo(() => {
    const pending = applications.filter((app) => app.status === 'pending').length;
    const approved = applications.filter((app) => app.status === 'approved').length;
    const rejected = applications.filter((app) => app.status === 'rejected').length;
    const avgScore =
      applications.length === 0
        ? 0
        : Math.round(
            applications.reduce((sum, app) => sum + app.altCreditScore, 0) / applications.length
          );
    return { pending, approved, rejected, avgScore, total: applications.length };
  }, [applications]);

  const visible = useMemo(() => {
    return applications.filter((app) => {
      const matchesStatus = filter === 'all' ? true : app.status === filter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        app.applicantName.toLowerCase().includes(q) ||
        app.id.toLowerCase().includes(q) ||
        String(app.altCreditScore).includes(q) ||
        String(app.requestedAmount).includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [applications, filter, searchQuery]);

  const toggleStatus = (app: LoanApplication, next: LoanStatus) => {
    const isClearing = app.status === next;
    const targetStatus = isClearing ? 'pending' : next;
    onUpdateStatus(app.id, targetStatus);

    if (targetStatus === 'approved') {
      toast({
        type: 'success',
        title: `Application Approved`,
        description: `${app.applicantName} (${app.id}) cleared for disbursement.`,
      });
    } else if (targetStatus === 'rejected') {
      toast({
        type: 'error',
        title: `Application Declined`,
        description: `${app.applicantName} (${app.id}) marked as rejected.`,
      });
    } else {
      toast({
        type: 'info',
        title: `Status Reset to Pending`,
        description: `${app.applicantName} (${app.id}) returned to decision queue.`,
      });
    }
  };

  const openShapModal = (app: LoanApplication) => {
    setSelectedAppForShap(app);
    setShapModalOpen(true);
  };

  const closeShapModal = () => {
    setShapModalOpen(false);
    setSelectedAppForShap(null);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MiniStat label="Total Applicants" value={String(stats.total)} hint="In review queue" />
        <MiniStat label="Awaiting Decision" value={String(stats.pending)} hint="Needs loan officer review" accent="amber" />
        <MiniStat label="Approved Loans" value={String(stats.approved)} hint="Cleared for disbursement" accent="emerald" />
        <MiniStat label="Average Credit Score" value={String(stats.avgScore)} hint={`${stats.rejected} declined overall`} accent="teal" />
      </div>

      <Card>
        <CardHeader className="bg-zinc-950 text-zinc-100 border-b border-zinc-800/80">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <CardTitle className="text-zinc-100">Applications Needing Review</CardTitle>
              </div>
              <CardDescription className="text-zinc-500">
                Review applicant profiles, see why scores were given, and make instant loan approval decisions.
              </CardDescription>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              {/* Search input */}
              <div className="relative flex-1 sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Search applicant name or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-md pl-8 pr-3 py-1 text-xs text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 text-xs"
                  >
                    ×
                  </button>
                )}
              </div>

              {/* Status Filter Buttons */}
              <div className="flex items-center gap-1">
                {(
                  [
                    ['all', 'All'],
                    ['pending', 'Pending'],
                    ['approved', 'Approved'],
                    ['rejected', 'Declined'],
                  ] as const
                ).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setFilter(value)}
                    className={cn(
                      'px-2.5 py-1 rounded-md text-xs font-medium border transition-colors',
                      filter === value
                        ? 'bg-emerald-600 text-white border-emerald-500'
                        : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-emerald-500/40'
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm" aria-label="Applications Needing Review Table">
              <thead className="bg-zinc-900/80 border-b border-zinc-800/80 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                <tr>
                  <th scope="col" className="px-5 py-3.5">Applicant</th>
                  <th scope="col" className="px-5 py-3.5">Monthly Income</th>
                  <th scope="col" className="px-5 py-3.5">Requested Loan</th>
                  <th scope="col" className="px-5 py-3.5">Credit Score</th>
                  <th scope="col" className="px-5 py-3.5">Risk Level</th>
                  <th scope="col" className="px-5 py-3.5">Status</th>
                  <th scope="col" className="px-5 py-3.5 text-right">Decision Actions</th>
                  <th scope="col" className="px-5 py-3.5 text-right">Score Breakdown</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                {visible.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-5 py-12 text-center text-sm text-zinc-400">
                      <div className="max-w-xs mx-auto space-y-2">
                        <Filter className="w-6 h-6 inline-block text-zinc-500" />
                        <p className="font-medium text-zinc-300">No matching applicants found</p>
                        <p className="text-xs text-zinc-500">
                          {searchQuery
                            ? `No records matching "${searchQuery}" under ${filter} filter.`
                            : `There are no applications in the "${filter}" list.`}
                        </p>
                        {(searchQuery || filter !== 'all') && (
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSearchQuery('');
                              setFilter('all');
                            }}
                            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
                            className="mt-2"
                          >
                            Reset Search &amp; Filters
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
                {visible.map((app) => {
                  const isSelected = selectedId === app.id;
                  return (
                    <tr
                      key={app.id}
                      onClick={() => onSelect(app.id)}
                      className={cn(
                        'cursor-pointer transition-colors',
                        isSelected ? 'bg-zinc-800/60 ring-1 ring-emerald-500/30' : 'hover:bg-zinc-800/30'
                      )}
                    >
                      <td className="px-5 py-4">
                        <div className="font-semibold text-zinc-100">{app.applicantName}</div>
                        <div className="text-[11px] font-mono text-zinc-500 mt-0.5">{app.id}</div>
                      </td>
                      <td className="px-5 py-4 font-mono text-zinc-300">{formatPKR(app.income)}</td>
                      <td className="px-5 py-4 font-mono font-semibold text-zinc-100">
                        {formatPKR(app.requestedAmount)}
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-mono font-bold text-emerald-400">{app.altCreditScore}</span>
                      </td>
                      <td className="px-5 py-4">
                        <RiskTierBadge tier={toRiskTier(app.riskLevel)} />
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={toApplicationStatus(app.status)} />
                      </td>
                      <td className="px-5 py-4">
                        <div
                          className="flex items-center justify-end gap-1.5"
                          onClick={(event) => event.stopPropagation()}
                        >
                          <Button
                            type="button"
                            size="sm"
                            variant={app.status === 'approved' ? 'success' : 'outline'}
                            onClick={() => toggleStatus(app, 'approved')}
                            leftIcon={<Check className="w-3.5 h-3.5" />}
                            aria-label={`Approve loan for ${app.applicantName}`}
                          >
                            Approve
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant={app.status === 'rejected' ? 'danger' : 'outline'}
                            onClick={() => toggleStatus(app, 'rejected')}
                            leftIcon={<X className="w-3.5 h-3.5" />}
                            aria-label={`Decline loan for ${app.applicantName}`}
                          >
                            Decline
                          </Button>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div
                          className="flex items-center justify-end"
                          onClick={(event) => event.stopPropagation()}
                        >
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => openShapModal(app)}
                            leftIcon={<Scale className="w-3.5 h-3.5 text-emerald-400" />}
                            className="text-xs"
                            aria-label={`Why this score was given for ${app.applicantName}`}
                          >
                            Why this score was given
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>


      {/* SHAP Modal */}
      {selectedAppForShap && (
        <ShapModal
          isOpen={shapModalOpen}
          onClose={closeShapModal}
          applicantName={selectedAppForShap.applicantName}
          altCreditScore={selectedAppForShap.altCreditScore}
          baseScore={selectedAppForShap.baseScore ?? 520}
          shapFeatures={selectedAppForShap.shapFeatures ?? []}
          shap_values={selectedAppForShap.shap_values ?? []}
        />
      )}
    </div>
  );
}

function MiniStat({
  label,
  value,
  hint,
  accent,
}: {
  label: string;
  value: string;
  hint: string;
  accent?: 'amber' | 'emerald' | 'teal';
}) {
  return (
    <div className="rounded-lg border border-zinc-800/80 bg-zinc-900/50 px-4 py-3">
      <p className="text-[11px] uppercase tracking-wider font-semibold text-zinc-400">{label}</p>
      <p
        className={cn(
          'text-2xl font-bold tracking-tight mt-1 font-mono',
          accent === 'emerald' && 'text-emerald-400',
          accent === 'amber' && 'text-amber-400',
          accent === 'teal' && 'text-teal-400',
          !accent && 'text-zinc-100'
        )}
      >
        {value}
      </p>
      <p className="text-[11px] text-zinc-500 mt-0.5">{hint}</p>
    </div>
  );
}

