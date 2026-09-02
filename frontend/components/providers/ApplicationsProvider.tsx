'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  initialMockApplications,
  MOCK_QUEUE_STORAGE_KEY,
  type LoanApplication,
  type LoanStatus,
} from '@/lib/mockData';
import { updateStoredApplicationStatus } from '@/lib/storage';

interface ApplicationsContextValue {
  applications: LoanApplication[];
  addApplication: (application: LoanApplication) => void;
  updateStatus: (id: string, status: LoanStatus) => void;
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

  const value = useMemo(
    () => ({ applications, addApplication, updateStatus }),
    [applications, addApplication, updateStatus]
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
