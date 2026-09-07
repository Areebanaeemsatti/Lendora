'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  initialMockApplications,
  MOCK_QUEUE_STORAGE_KEY,
  deriveRiskLevel,
  type LoanApplication,
  type LoanStatus,
} from '@/lib/mockData';
import { updateStoredApplicationStatus, saveApplicationLocally } from '@/lib/storage';
import { submitCreditScoreAssessment } from '@/lib/api';
import type { BorrowerApplication, RiskAssessmentResponse } from '@/types';

interface ApplicationsContextValue {
  applications: LoanApplication[];
  addApplication: (application: LoanApplication) => void;
  updateStatus: (id: string, status: LoanStatus) => void;
  submitApplication: (application: BorrowerApplication) => Promise<RiskAssessmentResponse>;
}

const ApplicationsContext = createContext<ApplicationsContextValue | null>(null);

export function ApplicationsProvider({ children }: { children: React.ReactNode }) {
  const [applications, setApplications] = useState<LoanApplication[]>(initialMockApplications);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(MOCK_QUEUE_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as LoanApplication[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setApplications(parsed);
        }
      }
    } catch (error) {
      console.error('Failed to hydrate loan queue', error);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(MOCK_QUEUE_STORAGE_KEY, JSON.stringify(applications));
    } catch (error) {
      console.error('Failed to persist loan queue', error);
    }
  }, [applications, hydrated]);

  const addApplication = useCallback((application: LoanApplication) => {
    setApplications((prev) => {
      const index = prev.findIndex((item) => item.id === application.id);
      if (index >= 0) {
        const next = [...prev];
        next[index] = application;
        return next;
      }
      return [application, ...prev];
    });
  }, []);

  const updateStatus = useCallback((id: string, status: LoanStatus) => {
    setApplications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
    updateStoredApplicationStatus(id, status);
  }, []);

  const submitApplication = useCallback(
    async (borrowerApp: BorrowerApplication): Promise<RiskAssessmentResponse> => {
      const assessment = await submitCreditScoreAssessment(borrowerApp);

      const income = Number(borrowerApp.monthlyIncomePKR) || 0;
      const requestedAmount = Number(borrowerApp.requestedLoanAmountPKR) || 0;
      const altScore = assessment.credit_score;
      const riskLevel = deriveRiskLevel(altScore);
      const shapItems = assessment.shap_values || assessment.shap_explanations || [];

      // Update and save local storage application with live assessment and SHAP items
      const updatedApp: BorrowerApplication = {
        ...borrowerApp,
        assessment,
        shap_values: shapItems,
      };
      saveApplicationLocally(updatedApp);

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
          featureName: v.featureName || v.feature_name || 'Feature',
          impact: v.impact,
          category: v.category || (v.impact >= 0 ? 'Score Driver' : 'Risk Flag'),
        })),
        assessment,
        recommendation: assessment.recommendation,
        confidenceScore: assessment.confidence_score,
        defaultProbability: assessment.default_probability,
        baseScore: 520,
      };

      addApplication(loanApp);
      return assessment;
    },
    [addApplication]
  );

  const value = useMemo(
    () => ({ applications, addApplication, updateStatus, submitApplication }),
    [applications, addApplication, updateStatus, submitApplication]
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
