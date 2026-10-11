'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  deriveRiskLevel,
  type LoanApplication,
  type LoanStatus,
} from '@/lib/mockData';
import {
  addSampleApplication,
  readSharedQueue,
  subscribeSharedQueue,
  updateSharedApplicationStatus,
  upsertSharedApplication,
} from '@/lib/sharedQueue';
import { submitCreditScoreAssessment } from '@/lib/api';
import { useSession } from '@/components/providers/SessionProvider';
import type { BorrowerApplication, RiskAssessmentResponse } from '@/types';

interface ApplicationsContextValue {
  applications: LoanApplication[];
  addApplication: (application: LoanApplication) => void;
  updateStatus: (id: string, status: LoanStatus) => void;
  submitApplication: (application: BorrowerApplication) => Promise<RiskAssessmentResponse>;
  /** Inject a ready-made sample applicant into the shared queue (officer tool). */
  addSample: () => void;
}

const ApplicationsContext = createContext<ApplicationsContextValue | null>(null);

/**
 * Holds the SHARED loan queue used by both the borrower and underwriter sides.
 *
 * The queue lives in one global store (see lib/sharedQueue) rather than being
 * namespaced per CNIC — that is what makes a borrower's submission appear on
 * the underwriter's screen instantly, and the officer's decision flow back to
 * the borrower. All writes go through the shared module, which notifies every
 * subscriber (in-page and cross-tab) so the UI stays live without polling.
 */
export function ApplicationsProvider({ children }: { children: React.ReactNode }) {
  const { session } = useSession();

  const [applications, setApplications] = useState<LoanApplication[]>([]);

  // Initial read + live subscription to the shared queue.
  useEffect(() => {
    setApplications(readSharedQueue());
    const unsubscribe = subscribeSharedQueue(() => {
      setApplications(readSharedQueue());
    });
    return unsubscribe;
  }, []);

  const addApplication = useCallback((application: LoanApplication) => {
    // Stamp the submitting borrower's CNIC so their own dashboard can find it.
    const withOwner: LoanApplication = session?.cnic
      ? { ...application, borrowerCnic: session.cnic }
      : application;
    upsertSharedApplication(withOwner);
    setApplications(readSharedQueue());
  }, [session?.cnic]);

  const updateStatus = useCallback((id: string, status: LoanStatus) => {
    updateSharedApplicationStatus(id, status);
    setApplications(readSharedQueue());
  }, []);

  const addSample = useCallback(() => {
    addSampleApplication();
    setApplications(readSharedQueue());
  }, []);

  const submitApplication = useCallback(
    async (borrowerApp: BorrowerApplication): Promise<RiskAssessmentResponse> => {
      const assessment = await submitCreditScoreAssessment(borrowerApp);

      const income = Number(borrowerApp.monthlyIncomePKR) || 0;
      const requestedAmount = Number(borrowerApp.requestedLoanAmountPKR) || 0;
      const altScore = assessment.credit_score;
      const riskLevel = deriveRiskLevel(altScore);
      const shapItems = assessment.shap_values || assessment.shap_explanations || [];

      const loanApp: LoanApplication = {
        id: borrowerApp.id,
        applicantName: borrowerApp.fullName,
        income,
        requestedAmount,
        altCreditScore: altScore,
        riskLevel,
        status: 'pending',
        shap_values: shapItems,
        shapFeatures: shapItems.map((v) => ({
          featureName: v.featureName || v.feature_name || 'Signal',
          impact: v.impact,
          category: v.category || (v.impact >= 0 ? 'Helps your score' : 'Needs attention'),
        })),
        assessment,
        recommendation: assessment.recommendation,
        confidenceScore: assessment.confidence_score,
        defaultProbability: assessment.default_probability,
        baseScore: 520,
        borrowerCnic: session?.cnic,
      };

      upsertSharedApplication(loanApp);
      setApplications(readSharedQueue());
      return assessment;
    },
    [session?.cnic]
  );

  const value = useMemo(
    () => ({ applications, addApplication, updateStatus, submitApplication, addSample }),
    [applications, addApplication, updateStatus, submitApplication, addSample]
  );

  return (
    <ApplicationsContext.Provider value={value}>{children}</ApplicationsContext.Provider>
  );
}

export function useApplications() {
  const context = useContext(ApplicationsContext);
  if (!context) {
    throw new Error('useApplications must be used within ApplicationsProvider');
  }
  return context;
}
