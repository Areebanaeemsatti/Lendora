'use client';

import React, { useEffect, useMemo, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
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
import { formatPKR } from '@/lib/utils';
import { PlusCircle, FileCheck } from 'lucide-react';

function RiskAssessmentsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedId = searchParams.get('id');
  const { applications, updateStatus } = useApplications();

  const [currentApp, setCurrentApp] = useState<BorrowerApplication | null>(null);
  const [allApplications, setAllApplications] = useState<BorrowerApplication[]>([]);
  const [shapModalOpen, setShapModalOpen] = useState(false);

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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Underwriter Dashboard
              </h2>
              <Badge variant="emerald" dot>
                Mock queue active
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Review local loan applications, toggle Approve / Reject, and inspect alternative-signal scorecards.
            </p>
          </div>

          <Link href="/new-application">
            <Button variant="primary" size="sm" leftIcon={<PlusCircle className="w-4 h-4" />}>
              New Application
            </Button>
          </Link>
        </div>

        <UnderwriterDashboard
          applications={applications}
          selectedId={selectedQueueItem?.id}
          onSelect={handleSelectApplication}
          onUpdateStatus={updateStatus}
        />

        {currentApp && (
          <ApplicationSwitcher
            applications={allApplications}
            selectedId={currentApp.id}
            onSelect={handleSelectApplication}
          />
        )}

        {currentApp ? (
          <div className="space-y-6">
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
          <div className="space-y-6">
            <AssessmentSummaryCard
              selectedQueueItem={selectedQueueItem}
              assessment={selectedQueueItem.assessment}
              onOpenShapModal={() => setShapModalOpen(true)}
            />
            <Card className="p-6 border-emerald-200 bg-emerald-50/40">
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">Selected queue record</p>
              <h3 className="text-lg font-bold text-slate-900 mt-1">{selectedQueueItem.applicantName}</h3>
              <p className="text-sm text-slate-600 mt-2">
                Monthly income {formatPKR(selectedQueueItem.income)} · requested {formatPKR(selectedQueueItem.requestedAmount)} ·
                alt score {selectedQueueItem.altCreditScore} ({selectedQueueItem.riskLevel} risk)
              </p>
              <p className="text-xs text-slate-500 mt-3">
                Full scorecards appear for applications submitted through the borrower form. This seed record lives in the mock queue only.
              </p>
            </Card>
          </div>
        ) : (
          <Card className="p-12 text-center">
            <div className="max-w-md mx-auto space-y-4">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
                <FileCheck className="w-6 h-6 text-slate-500" />
              </div>
              <h3 className="text-base font-bold text-slate-900">No Borrower Application Selected</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Submit a new borrower application or select an existing record to review alternative financial signals and risk assessment scorecards.
              </p>
              <Link href="/new-application">
                <Button variant="primary" size="md" leftIcon={<PlusCircle className="w-4 h-4" />}>
                  Create New Application
                </Button>
              </Link>
            </div>
          </Card>
        )}

        {/* Live SHAP Explainability Decomposition Modal */}
        <ShapModal
          isOpen={shapModalOpen}
          onClose={() => setShapModalOpen(false)}
          applicantName={currentApp?.fullName || selectedQueueItem?.applicantName || 'Borrower'}
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
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Loading underwriter dashboard...</div>}>
      <RiskAssessmentsContent />
    </Suspense>
  );
}
