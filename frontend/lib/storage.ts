import { BorrowerApplication } from '@/types';
import { toApplicationStatus, type LoanStatus } from '@/lib/mockData';
import { submitCreditScoreAssessment, formatBorrowerPayload, getApiBaseUrl } from '@/lib/api';

export { submitCreditScoreAssessment, formatBorrowerPayload, getApiBaseUrl };

const STORAGE_KEY = 'lendora_borrower_applications';

export function saveApplicationLocally(application: BorrowerApplication): void {
  if (typeof window === 'undefined') return;
  try {
    const existingRaw = localStorage.getItem(STORAGE_KEY);
    const applications: BorrowerApplication[] = existingRaw ? JSON.parse(existingRaw) : [];
    const index = applications.findIndex((app) => app.id === application.id);
    if (index >= 0) {
      applications[index] = application;
    } else {
      applications.unshift(application);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
  } catch (error) {
    console.error('Failed to save application locally', error);
  }
}

export function getApplicationById(id: string): BorrowerApplication | null {
  const applications = getAllStoredApplications();
  return applications.find((app) => app.id === id) || null;
}

export function updateStoredApplicationStatus(id: string, status: LoanStatus): void {
  if (typeof window === 'undefined') return;
  try {
    const applications = getAllStoredApplications();
    const index = applications.findIndex((app) => app.id === id);
    if (index < 0) return;
    applications[index] = {
      ...applications[index],
      status: toApplicationStatus(status),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
  } catch (error) {
    console.error('Failed to update application status', error);
  }
}

import { REAL_CSV_BORROWER_APPLICATIONS } from '@/lib/dataset';

/**
 * Real default borrower applications from ml/data/pk_alt_data_synthetic3.csv
 */
export const defaultSampleApplications: BorrowerApplication[] = REAL_CSV_BORROWER_APPLICATIONS;

export function getAllStoredApplications(): BorrowerApplication[] {
  if (typeof window === 'undefined') return defaultSampleApplications;
  try {
    const existingRaw = localStorage.getItem(STORAGE_KEY);
    if (!existingRaw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultSampleApplications));
      return defaultSampleApplications;
    }
    const parsed: BorrowerApplication[] = JSON.parse(existingRaw);
    return parsed.length > 0 ? parsed : defaultSampleApplications;
  } catch (error) {
    console.error('Failed to retrieve stored applications', error);
    return defaultSampleApplications;
  }
}
