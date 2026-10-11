/**
 * Shared, real-time loan-application queue.
 *
 * Unlike the per-identity consumer data (wallet, transactions) which is
 * deliberately isolated per CNIC, the loan queue is a *shared* workspace:
 * a borrower submits an application and an underwriter reviews it moments
 * later. Both roles therefore read and write the SAME store.
 *
 * Real-time behaviour:
 *  - Writes persist to localStorage immediately (survives reloads).
 *  - Every write notifies in-page subscribers via a CustomEvent AND fires the
 *    native `storage` event, so separate tabs (e.g. borrower in one tab,
 *    underwriter in another) stay in sync without polling.
 *
 * The store starts empty on a fresh browser — the queue is populated only by
 * real submissions or the officer's "Add Sample Applicant" action.
 */

import {
  deriveAltCreditScore,
  deriveRiskLevel,
  type ApplicationSignals,
  type LoanApplication,
  type LoanStatus,
} from '@/lib/mockData';
import type { ShapValueItem } from '@/types';

export const SHARED_QUEUE_KEY = 'lendora_shared_loan_queue';
const CHANGE_EVENT = 'lendora:queue-change';

/** Friendly, jargon-free sample applicants used by "Add Sample Applicant". */
const SAMPLE_PEOPLE = [
  { name: 'Ayesha Siddiqui', job: 'Tailor' },
  { name: 'Bilal Ahmed', job: 'Delivery rider' },
  { name: 'Fatima Noor', job: 'Home baker' },
  { name: 'Hamza Iqbal', job: 'Mobile repair technician' },
  { name: 'Sana Tariq', job: 'Beautician' },
  { name: 'Usman Ghani', job: 'Fruit vendor' },
  { name: 'Zainab Malik', job: 'School teacher' },
  { name: 'Ali Raza', job: 'Sports-goods stitcher' },
];

let sampleCursor = 0;
let manualSampleCount = 0;

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

/** Read the shared queue from storage. Returns [] when empty/unreadable. */
export function readSharedQueue(): LoanApplication[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(SHARED_QUEUE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as LoanApplication[];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Failed to read shared loan queue', error);
    return [];
  }
}

function writeSharedQueue(queue: LoanApplication[]): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(SHARED_QUEUE_KEY, JSON.stringify(queue));
  } catch (error) {
    console.error('Failed to persist shared loan queue', error);
  }
  notify();
}

/** Notify in-page listeners that the queue changed. */
function notify(): void {
  if (!isBrowser()) return;
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
}

/** Subscribe to queue changes. Returns an unsubscribe function. */
export function subscribeSharedQueue(listener: () => void): () => void {
  if (!isBrowser()) return () => {};
  const onStorage = (event: StorageEvent) => {
    if (event.key === SHARED_QUEUE_KEY) listener();
  };
  window.addEventListener(CHANGE_EVENT, listener);
  // Cross-tab sync: the browser fires `storage` when another tab writes.
  window.addEventListener('storage', onStorage);
  return () => {
    window.removeEventListener(CHANGE_EVENT, listener);
    window.removeEventListener('storage', onStorage);
  };
}

/** Insert or replace an application (matched by id). */
export function upsertSharedApplication(application: LoanApplication): void {
  const queue = readSharedQueue();
  const index = queue.findIndex((item) => item.id === application.id);
  if (index >= 0) {
    const next = [...queue];
    next[index] = application;
    writeSharedQueue(next);
  } else {
    writeSharedQueue([application, ...queue]);
  }
}

/** Update just the status of one application. */
export function updateSharedApplicationStatus(id: string, status: LoanStatus): void {
  const queue = readSharedQueue();
  const next = queue.map((item) => (item.id === id ? { ...item, status } : item));
  writeSharedQueue(next);
}

/** Remove every application from the shared queue. */
export function clearSharedQueue(): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(SHARED_QUEUE_KEY);
  } catch (error) {
    console.error('Failed to clear shared loan queue', error);
  }
  notify();
}


/** Build plain-English signal copy from an applicant's raw activity. */
function buildSignals(input: {
  walletTx: number;
  billOnTime: number;
  topUps: number;
  pastLoans: number;
  hasBankAccount: boolean;
}): ApplicationSignals {
  return {
    walletActivity:
      input.walletTx >= 20
        ? 'Very active — uses mobile wallet almost daily'
        : input.walletTx >= 8
        ? 'Regular mobile wallet use'
        : 'Occasional mobile wallet use',
    billPayments:
      input.billOnTime >= 90
        ? 'Always pays utility bills on time'
        : input.billOnTime >= 70
        ? 'Usually pays utility bills on time'
        : 'Sometimes pays bills late',
    mobileTopUps:
      input.topUps >= 2000 ? 'Tops up phone credit regularly' : 'Light phone top-ups',
    repayment:
      input.pastLoans === 0
        ? 'No previous loans yet'
        : `Repaid ${input.pastLoans} past loan${input.pastLoans > 1 ? 's' : ''} on time`,
    hasBankAccount: input.hasBankAccount,
  };
}

/**
 * Create and add one sample applicant to the shared queue. Used by the
 * underwriter's "Add Sample Applicant" button to inject a test record for
 * demonstration without waiting for a real borrower submission.
 */
export function addSampleApplication(): LoanApplication {
  const person = SAMPLE_PEOPLE[sampleCursor % SAMPLE_PEOPLE.length];
  sampleCursor += 1;
  manualSampleCount += 1;

  const income = 45000 + ((sampleCursor * 17000) % 130000);
  const requestedAmount = 60000 + ((sampleCursor * 25000) % 320000);
  const walletTx = 6 + ((sampleCursor * 7) % 34);
  const billOnTime = 55 + ((sampleCursor * 13) % 45);
  const topUps = 500 + ((sampleCursor * 350) % 2500);
  const pastLoans = sampleCursor % 4;
  const hasBankAccount = sampleCursor % 3 !== 0;

  const altCreditScore = deriveAltCreditScore({
    income,
    requestedAmount,
    utilityOnTimeRate: billOnTime,
    onTimeRepaymentRate: billOnTime,
  });

  const shapValues: ShapValueItem[] = [
    {
      feature_name: 'wallet_activity',
      featureName: 'Mobile wallet activity',
      impact: walletTx >= 20 ? 38 : walletTx >= 8 ? 16 : -6,
      shap_value: walletTx >= 20 ? 38 : walletTx >= 8 ? 16 : -6,
      direction: walletTx >= 8 ? 'positive' : 'negative',
      category: 'Everyday money habits',
      explanation:
        walletTx >= 8
          ? 'Frequent wallet use shows steady day-to-day money handling.'
          : 'Limited wallet activity gives us less to go on.',
    },
    {
      feature_name: 'bill_payments',
      featureName: 'Utility bill payments',
      impact: billOnTime >= 90 ? 34 : billOnTime >= 70 ? 14 : -22,
      shap_value: billOnTime >= 90 ? 34 : billOnTime >= 70 ? 14 : -22,
      direction: billOnTime >= 70 ? 'positive' : 'negative',
      category: 'Bill payment habits',
      explanation:
        billOnTime >= 70
          ? 'Paying bills on time is a strong sign of reliability.'
          : 'Late bills suggest tighter monthly cash flow.',
    },
    {
      feature_name: 'loan_vs_income',
      featureName: 'Requested amount vs income',
      impact: requestedAmount > income * 5 ? -30 : 18,
      shap_value: requestedAmount > income * 5 ? -30 : 18,
      direction: requestedAmount > income * 5 ? 'negative' : 'positive',
      category: 'Affordability',
      explanation:
        requestedAmount > income * 5
          ? 'The requested amount is high compared with monthly income.'
          : 'The requested amount fits comfortably within monthly income.',
    },
  ];

  const application: LoanApplication = {
    id: `SAMPLE-${Date.now()}-${manualSampleCount}`,
    applicantName: person.name,
    income,
    requestedAmount,
    altCreditScore,
    riskLevel: deriveRiskLevel(altCreditScore),
    status: 'pending',
    baseScore: 520,
    recommendation:
      altCreditScore >= 720
        ? 'Looks safe to approve'
        : altCreditScore >= 620
        ? 'Needs a closer look'
        : 'Higher risk',
    shap_values: shapValues,
    shapFeatures: shapValues.map((v) => ({
      featureName: v.featureName || 'Signal',
      impact: v.impact,
      category: v.category || 'Signal',
    })),
    signals: buildSignals({ walletTx, billOnTime, topUps, pastLoans, hasBankAccount }),
  };

  upsertSharedApplication(application);
  return application;
}

