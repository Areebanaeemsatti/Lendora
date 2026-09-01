'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { BorrowerApplication } from '@/types';
import { getApplicationById, getAllStoredApplications, defaultSampleApplications } from '@/lib/storage';
import { BorrowerOverviewCard } from '@/components/assessment/BorrowerOverviewCard';
import { FinancialProfileCard } from '@/components/assessment/FinancialProfileCard';
import { AlternativeSignalsCard } from '@/components/assessment/AlternativeSignalsCard';
import { RepaymentBehaviorCard } from '@/components/assessment/RepaymentBehaviorCard';
import { SupportingEvidenceCard } from '@/components/assessment/SupportingEvidenceCard';
import { AssessmentSummaryCard } from '@/components/assessment/AssessmentSummaryCard';
import { DecisionSupportCard } from '@/components/assessment/DecisionSupportCard';
import { ApplicationSwitcher } from '@/components/assessment/ApplicationSwitcher';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { PlusCircle, FileCheck, ArrowLeft, RotateCcw } from 'lucide-react';

function RiskAssessmentsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedId = searchParams.get('id');

  const [currentApp, setCurrentApp] = useState<BorrowerApplication | null>(defaultSampleApplications[0]);
  const [allApplications, setAllApplications] = useState<BorrowerApplication[]>(defaultSampleApplications);

  useEffect(() => {
    const stored = getAllStoredApplications();
    setAllApplications(stored);

    if (requestedId) {
      const found = getApplicationById(requestedId);
      if (found) {
        setCurrentApp(found);
        return;
      }
    }

    if (stored.length > 0) {
      setCurrentApp(stored[0]);
    }
  }, [requestedId]);

  const handleSelectApplication = (id: string) => {
    router.push(`/risk-assessments?id=${id}`);
  };

  return (
    <AppLayout>
      <div className="space-y-6 max-w-7xl mx-auto pb-16">
        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Risk Assessment &amp; Decision Support Dashboard
              </h2>
              <Badge variant="emerald" dot>
                Underwriting Engine Active
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Alternative financial signal evaluation for Pakistani borrowers without conventional credit records.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/new-application">
              <Button
                variant="primary"
                size="sm"
                leftIcon={<PlusCircle className="w-4 h-4" />}
              >
                New Application
              </Button>
            </Link>
          </div>
        </div>

        {/* Application Queue Switcher if multiple records exist */}
        {currentApp && (
          <ApplicationSwitcher
            applications={allApplications}
            selectedId={currentApp.id}
            onSelect={handleSelectApplication}
          />
        )}

        {currentApp ? (
          <div className="space-y-6">
            {/* 1. Borrower Overview */}
            <BorrowerOverviewCard application={currentApp} />

            {/* 6. Assessment Summary Card (Prominent Mock Scorecard Panel) */}
            <AssessmentSummaryCard />

            {/* 2 & 3. Split Grid: Financial Profile & Alternative Signals */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FinancialProfileCard application={currentApp} />
              <AlternativeSignalsCard application={currentApp} />
            </div>

            {/* 4. Repayment Behavior & Credit History */}
            <RepaymentBehaviorCard application={currentApp} />

            {/* 5. Supporting Documents & Image Proof */}
            <SupportingEvidenceCard application={currentApp} />

            {/* 7. Decision Support & Underwriting Remarks */}
            <DecisionSupportCard />
          </div>
        ) : (
          /* Empty State */
          <Card className="p-12 text-center">
            <div className="max-w-md mx-auto space-y-4">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
                <FileCheck className="w-6 h-6 text-slate-500" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                No Borrower Application Selected
              </h3>
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
      </div>
    </AppLayout>
  );
}

export default function RiskAssessmentsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Loading risk assessments...</div>}>
      <RiskAssessmentsContent />
    </Suspense>
  );
}
