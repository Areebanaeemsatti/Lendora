import { deriveAltCreditScore, deriveRiskLevel, type LoanApplication } from '@/lib/mockData';
import type { ShapValueItem } from '@/types';

/**
 * Demo data + builder for the borrower's one-tap "Auto-Fill Demo" flow.
 *
 * The values mirror a realistic Pakistani applicant so the underwriter queue
 * receives a fully-scored record without waiting on the ML backend. The
 * application is built locally (same approach as `addSampleApplication`) and
 * pushed through the shared queue, so it appears on the underwriter console
 * instantly and the officer's decision flows straight back to the borrower.
 */

export interface DemoForm {
  fullName: string;
  cnic: string;
  mobile: string;
  monthlyIncomePKR: string;
  requestedLoanAmountPKR: string;
  payout: string;
}

export const DEMO_FORM: DemoForm = {
  fullName: 'Kamran Ali',
  cnic: '42101-1234567-9',
  mobile: '03001234567',
  monthlyIncomePKR: '85000',
  requestedLoanAmountPKR: '25000',
  payout: 'JazzCash - 03001234567',
};

export const PAYOUT_OPTIONS = ['JazzCash - 03001234567', 'EasyPaisa - 03001234567', 'Bank Account - 0000 0000 0000'];

/** Placeholder filenames attached when Auto-Fill mocks the uploads. */
export const DEMO_FILES = {
  cnic: ['cnic_front.jpg', 'cnic_back.jpg'],
  salarySlip: ['salary_slip.pdf'],
  bankStatement: ['bank_statement.pdf'],
};

function buildShapValues(income: number, requested: number): ShapValueItem[] {
  const leverage = requested / Math.max(income, 1);
  return [
    {
      feature_name: 'income_stability',
      featureName: 'Monthly income',
      impact: income >= 80000 ? 34 : 12,
      shap_value: income >= 80000 ? 34 : 12,
      direction: income >= 80000 ? 'positive' : 'positive',
      category: 'Income',
      explanation:
        income >= 80000
          ? 'A steady monthly income comfortably supports this request.'
          : 'Income is enough for a small request.',
    },
    {
      feature_name: 'requested_vs_income',
      featureName: 'Requested amount vs income',
      impact: leverage < 0.5 ? 26 : -14,
      shap_value: leverage < 0.5 ? 26 : -14,
      direction: leverage < 0.5 ? 'positive' : 'negative',
      category: 'Affordability',
      explanation:
        leverage < 0.5
          ? 'The requested amount is small compared with monthly income.'
          : 'The requested amount is on the higher side for this income.',
    },
    {
      feature_name: 'wallet_payments',
      featureName: 'Mobile wallet payments',
      impact: 18,
      shap_value: 18,
      direction: 'positive',
      category: 'Everyday money habits',
      explanation: 'Regular JazzCash and EasyPaisa use shows healthy money habits.',
    },
  ];
}

/** Build a fully-scored LoanApplication from the (possibly demo) form values. */
export function buildLoanApplication(form: DemoForm): LoanApplication {
  const income = Number(form.monthlyIncomePKR) || 0;
  const requested = Number(form.requestedLoanAmountPKR) || 0;
  const altCreditScore = deriveAltCreditScore({
    income,
    requestedAmount: requested,
    utilityOnTimeRate: 92,
    onTimeRepaymentRate: 94,
  });

  const shapValues = buildShapValues(income, requested);

  return {
    id: `APP-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
    applicantName: form.fullName.trim() || 'Anonymous Borrower',
    income,
    requestedAmount: requested,
    altCreditScore,
    riskLevel: deriveRiskLevel(altCreditScore),
    status: 'pending',
    baseScore: 520,
    recommendation:
      altCreditScore >= 720 ? 'Looks safe to approve' : altCreditScore >= 620 ? 'Needs a closer look' : 'Higher risk',
    shap_values: shapValues,
    shapFeatures: shapValues.map((v) => ({
      featureName: v.featureName || 'Signal',
      impact: v.impact,
      category: v.category || 'Signal',
    })),
    signals: {
      walletActivity: 'About 32 wallet transactions a month',
      billPayments: 'Pays utility bills on time 92% of the time',
      mobileTopUps: `Pays out to ${form.payout.split(' - ')[0] || 'mobile wallet'} regularly`,
      repayment: 'Repaid 3 past loans on time',
      hasBankAccount: form.payout.startsWith('Bank'),
    },
  };
}
