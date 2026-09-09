'use client';

import React, { useEffect, useMemo, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { BorrowerApplication } from '@/types';
import { getApplicationById, getAllStoredApplications } from '@/lib/storage';
import { BorrowerOverviewCard } from '@/components/assessment/BorrowerOverviewCard';
import { FinancialProfileCard } from '@/components/assessment/FinancialProfileCard';
import { AlternativeSignalsCard } from '@/components/assessment/AlternativeSignalsCard';
import { RepaymentBehaviorCard } from '@/components/assessment/RepaymentBehaviorCard';
import { SupportingEvidenceCard } from '@/components/assessment/SupportingEvidenceCard';
import { AssessmentSummaryCard } from '@/components/assessment/AssessmentSummaryCard';
import { DecisionSupportCard } from '@/components/assessment/DecisionSupportCard';
import { ApplicationSwitcher } from '@/components/assessment/ApplicationSwitcher';
import { ShapModal } from '@/components/ShapModal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { UnderwriterDashboard } from '@/components/dashboard/UnderwriterDashboard';
import { useApplications } from '@/components/providers/ApplicationsProvider';
import { formatPKR, cn } from '@/lib/utils';
import { PlusCircle, FileCheck, ShieldCheck, UserCheck, LayoutList, Layers } from 'lucide-react';

type ViewMode = 'all' | 'queue' | 'scorecard';

function RiskAssessmentsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedId = searchParams?.get('id');
  const { applications, updateStatus } = useApplications();

  const [currentApp, setCurrentApp] = useState<BorrowerApplication | null>(null);
  const [allApplications, setAllApplications] = useState<BorrowerApplication[]>([]);
  const [shapModalOpen, setShapModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('all');

  useEffect(() => {
    const stored = getAllStoredApplications();
    setAllApplications(stored);

    const targetId = requestedId ?? applications[0]?.id;
    if (targetId) {
      setCurrentApp(getApplicationById(targetId));
      return;
    }

    setCurrentApp(null);
  }, [requestedId, applications]);

  const selectedQueueItem = useMemo(() => {
    if (requestedId) {
      return applications.find((app) => app.id === requestedId) ?? applications[0] ?? null;
    }
    return applications[0] ?? null;
  }, [applications, requestedId]);

  const handleSelectApplication = (id: string) => {
    router.push(`/risk-assessments?id=${id}`);
  };

  return (
    <AppLayout>
      <div className="space-y-6 max-w-7xl mx-auto pb-16">
        {/* Header Banner & Navigation Tabs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border border-zinc-800/80 bg-zinc-900/60 rounded-xl p-4 shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h1 className="text-lg font-bold text-zinc-100 tracking-tight">
                Loan Applications &amp; Review
              </h1>
              <Badge variant="emerald" dot>
                Active Queue
              </Badge>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Review applicant profiles, see why each score was given, and approve or decline loan applications.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex items-center p-1 bg-zinc-950 rounded-lg border border-zinc-800">
              <button
                onClick={() => setViewMode('all')}
                className={cn(
                  'px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5',
                  viewMode === 'all'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                )}
              >
                <Layers className="w-3.5 h-3.5" />
                All Views
              </button>
              <button
                onClick={() => setViewMode('queue')}
                className={cn(
                  'px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5',
                  viewMode === 'queue'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                )}
              >
                <LayoutList className="w-3.5 h-3.5" />
                Applications List
              </button>
              <button
                onClick={() => setViewMode('scorecard')}
                className={cn(
                  'px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5',
                  viewMode === 'scorecard'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                )}
              >
                <UserCheck className="w-3.5 h-3.5" />
                Applicant Profile
              </button>
            </div>

            <Link href="/new-application">
              <Button variant="primary" size="sm" leftIcon={<PlusCircle className="w-4 h-4" />}>
                New Application
              </Button>
            </Link>
          </div>
        </div>

        {/* Section 1: Underwriter Decision Queue Table */}
        {(viewMode === 'all' || viewMode === 'queue') && (
          <UnderwriterDashboard
            applications={applications}
            selectedId={selectedQueueItem?.id}
            onSelect={handleSelectApplication}
            onUpdateStatus={updateStatus}
          />
        )}

        {/* Section Switcher for Scorecard View */}
        {(viewMode === 'all' || viewMode === 'scorecard') && currentApp && (
          <div className="pt-2">
            <ApplicationSwitcher
              applications={allApplications}
              selectedId={currentApp.id}
              onSelect={handleSelectApplication}
            />
          </div>
        )}

        {/* Section 2: Detailed Borrower Scorecard */}
        {(viewMode === 'all' || viewMode === 'scorecard') && (
          currentApp ? (
            <div className="space-y-6 animate-in fade-in duration-300">
              <BorrowerOverviewCard application={currentApp} />
              <AssessmentSummaryCard
                application={currentApp}
                assessment={currentApp.assessment}
                selectedQueueItem={selectedQueueItem}
                onOpenShapModal={() => setShapModalOpen(true)}
              />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <FinancialProfileCard application={currentApp} />
                <AlternativeSignalsCard application={currentApp} />
              </div>
              <RepaymentBehaviorCard application={currentApp} />
              <SupportingEvidenceCard application={currentApp} />
              <DecisionSupportCard
                applicationId={currentApp.id}
                status={selectedQueueItem?.status ?? 'pending'}
                onUpdateStatus={updateStatus}
              />
            </div>
          ) : selectedQueueItem ? (
              <div className="space-y-6 animate-in fade-in duration-300">
              <AssessmentSummaryCard
                selectedQueueItem={selectedQueueItem}
                assessment={selectedQueueItem.assessment}
                onOpenShapModal={() => setShapModalOpen(true)}
              />
              <Card className="p-5 border-emerald-500/30 bg-emerald-500/5">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                    Selected Application
                  </p>
                  <Badge variant="emerald">Queue Record</Badge>
                </div>
                <h3 className="text-lg font-bold text-zinc-100 mt-1">{selectedQueueItem.applicantName}</h3>
                <span className="text-sm text-zinc-300 mt-2">
                  Monthly income {formatPKR(selectedQueueItem.income)} · requested {formatPKR(selectedQueueItem.requestedAmount)} ·
                  credit score <strong className="text-emerald-400">{selectedQueueItem.altCreditScore}</strong> ({selectedQueueItem.riskLevel} risk)
                </span>
                <p className="text-xs text-zinc-400 mt-3">
                  Full applicant details appear for applications submitted through the new application form. This record is active in your review queue.
                </p>
              </Card>
            </div>
          ) : (
            <Card className="p-12 text-center">
              <div className="max-w-md mx-auto space-y-4">
                <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 mx-auto">
                  <FileCheck className="w-6 h-6 text-zinc-500" />
                </div>
                <h3 className="text-base font-bold text-zinc-100">No Applicant Selected</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Submit a new loan application or select an existing one from the list above to view the applicant’s credit score summary and payment history.
                </p>
                <Link href="/new-application">
                  <Button variant="primary" size="md" leftIcon={<PlusCircle className="w-4 h-4" />}>
                    Create New Application
                  </Button>
                </Link>
              </div>
            </Card>
          )
        )}

        {/* Why This Score Was Given Modal */}
        <ShapModal
          isOpen={shapModalOpen}
          onClose={() => setShapModalOpen(false)}
          applicantName={currentApp?.fullName || selectedQueueItem?.applicantName || 'Applicant'}
          altCreditScore={currentApp?.assessment?.credit_score ?? selectedQueueItem?.altCreditScore ?? 742}
          baseScore={selectedQueueItem?.baseScore ?? 520}
          shap_values={
            currentApp?.shap_values && currentApp.shap_values.length > 0
              ? currentApp.shap_values
              : (currentApp?.assessment?.shap_values && currentApp.assessment.shap_values.length > 0
                ? currentApp.assessment.shap_values
                : (selectedQueueItem?.shap_values ?? []))
          }
          shapFeatures={selectedQueueItem?.shapFeatures ?? []}
        />
      </div>
    </AppLayout>
  );
}

export default function RiskAssessmentsPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<div className="p-8 text-center text-xs text-zinc-500">Loading underwriter workdesk...</div>}>
        <RiskAssessmentsContent />
      </Suspense>
    </ProtectedRoute>
  );
}