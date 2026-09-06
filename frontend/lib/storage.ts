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

export const defaultSampleApplications: BorrowerApplication[] = [
  {
    id: 'app-sample-1',
    submittedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    status: 'pending_review',
    borrowerId: 'LEN-PK-2026-8942',
    fullName: 'Rashid Mahmood Ansari',
    age: 38,
    city: 'Lahore',
    province: 'Punjab',
    occupation: 'Textile Artisan & Retail Shopkeeper',
    employmentType: 'Small business owner',
    monthlyIncomePKR: 85000,
    monthlyExpensesPKR: 48000,
    existingDebtPKR: 5000,
    requestedLoanAmountPKR: 250000,
    loanTermMonths: 12,
    monthlyEasypaisaTxCount: 22,
    monthlyJazzCashTxCount: 15,
    monthlyMobileRechargePKR: 3200,
    utilityBillOnTimeRate: 92,
    monthlyUtilityBillPKR: 16500,
    previousLoansCount: 2,
    previousDefaultsCount: 0,
    onTimeRepaymentRate: 96,
    avgPreviousLoanAmountPKR: 120000,
    repaymentHistoryGrade: 'Good',
    supportingDocuments: [
      {
        id: 'doc-sample-1',
        fileName: 'lesco_electricity_bill_aug.jpg',
        fileSize: '1.4 MB',
        fileType: 'image/jpeg',
        documentType: 'Utility Bill',
        description: 'LESCO 3-phase commercial electricity bill with paid bank stamp',
      },
      {
        id: 'doc-sample-2',
        fileName: 'jazzcash_merchant_statement.png',
        fileSize: '820 KB',
        fileType: 'image/png',
        documentType: 'JazzCash Evidence',
        description: 'QR merchant receiving statement for past 30 days',
      },
    ],
    creditHistoryYears: '',
    hasBankAccount: 'yes',
    hasFormalCreditHistory: 'no',
    traditionalCreditNotes: 'Active JazzCash merchant with consistent seasonal sales.',
  },
  {
    id: 'app-sample-2',
    submittedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    status: 'underwriting',
    borrowerId: 'LEN-PK-2026-8940',
    fullName: 'Farhan Electronics & Mobile Care',
    age: 31,
    city: 'Karachi',
    province: 'Sindh',
    occupation: 'Mobile Accessories & Repair Merchant',
    employmentType: 'Self-employed',
    monthlyIncomePKR: 95000,
    monthlyExpensesPKR: 52000,
    existingDebtPKR: 10000,
    requestedLoanAmountPKR: 180000,
    loanTermMonths: 6,
    monthlyEasypaisaTxCount: 34,
    monthlyJazzCashTxCount: 28,
    monthlyMobileRechargePKR: 4500,
    utilityBillOnTimeRate: 88,
    monthlyUtilityBillPKR: 21000,
    previousLoansCount: 1,
    previousDefaultsCount: 0,
    onTimeRepaymentRate: 100,
    avgPreviousLoanAmountPKR: 80000,
    repaymentHistoryGrade: 'Excellent',
    supportingDocuments: [
      {
        id: 'doc-sample-3',
        fileName: 'k_electric_shop_bill.jpg',
        fileSize: '1.1 MB',
        fileType: 'image/jpeg',
        documentType: 'Utility Bill',
        description: 'K-Electric Saddar market verified commercial meter bill',
      },
    ],
    creditHistoryYears: 1,
    hasBankAccount: 'yes',
    hasFormalCreditHistory: 'yes',
    traditionalCreditNotes: 'Micro-loan cleared on time with local MFB.',
  },
];

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
