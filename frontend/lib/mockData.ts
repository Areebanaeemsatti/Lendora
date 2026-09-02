import type { ApplicationStatus, RiskTier, ShapFeature } from '@/types';

export type LoanStatus = 'pending' | 'approved' | 'rejected';
export type RiskLevel = 'Low' | 'Moderate' | 'Elevated' | 'High';

export interface LoanApplication {
  id: string;
  applicantName: string;
  income: number;
  requestedAmount: number;
  altCreditScore: number;
  riskLevel: RiskLevel;
  status: LoanStatus;
  shapFeatures?: ShapFeature[];
  baseScore?: number;
}

export const initialMockApplications: LoanApplication[] = [
  {
    id: 'app-001',
    applicantName: 'Muhammad Tariq Enterprises',
    income: 185000,
    requestedAmount: 3500000,
    altCreditScore: 785,
    riskLevel: 'Low',
    status: 'approved',
    baseScore: 520,
    shapFeatures: [
      { featureName: 'High Income', impact: 90, category: 'Income' },
      { featureName: 'Low Leverage', impact: 45, category: 'Financial' },
      { featureName: 'On-time Utility Payments', impact: 52, category: 'Payment Behavior' },
      { featureName: 'Excellent Repayment History', impact: 64, category: 'Credit History' },
      { featureName: 'Digital Transaction Volume', impact: 14, category: 'Digital Activity' },
    ],
  },
  {
    id: 'app-sample-2',
    applicantName: 'Farhan Electronics & Mobile Care',
    income: 95000,
    requestedAmount: 180000,
    altCreditScore: 690,
    riskLevel: 'Moderate',
    status: 'pending',
    baseScore: 520,
    shapFeatures: [
      { featureName: 'Moderate Income', impact: 70, category: 'Income' },
      { featureName: 'Low Leverage', impact: 80, category: 'Financial' },
      { featureName: 'On-time Utility Payments', impact: 38, category: 'Payment Behavior' },
      { featureName: 'Good Repayment History', impact: 42, category: 'Credit History' },
      { featureName: 'Short Credit History', impact: -60, category: 'Credit History' },
    ],
  },
  {
    id: 'app-sample-1',
    applicantName: 'Rashid Mahmood Ansari',
    income: 85000,
    requestedAmount: 250000,
    altCreditScore: 742,
    riskLevel: 'Low',
    status: 'pending',
    baseScore: 520,
    shapFeatures: [
      { featureName: 'Moderate Income', impact: 70, category: 'Income' },
      { featureName: 'Moderate Leverage', impact: 45, category: 'Financial' },
      { featureName: 'Excellent Utility Payment Rate', impact: 52, category: 'Payment Behavior' },
      { featureName: 'Strong Repayment History', impact: 55, category: 'Credit History' },
      { featureName: 'Consistent Digital Activity', impact: 0, category: 'Digital Activity' },
    ],
  },
  {
    id: 'app-003',
    applicantName: 'Noor Modern Pharmacy',
    income: 210000,
    requestedAmount: 2800000,
    altCreditScore: 810,
    riskLevel: 'Low',
    status: 'approved',
    baseScore: 520,
    shapFeatures: [
      { featureName: 'High Income', impact: 90, category: 'Income' },
      { featureName: 'Moderate Leverage', impact: 45, category: 'Financial' },
      { featureName: 'Perfect Utility Payment Rate', impact: 55, category: 'Payment Behavior' },
      { featureName: 'Excellent Repayment History', impact: 70, category: 'Credit History' },
      { featureName: 'Strong Digital Footprint', impact: 30, category: 'Digital Activity' },
    ],
  },
  {
    id: 'app-004',
    applicantName: 'Khyber Agro Logistics',
    income: 140000,
    requestedAmount: 5000000,
    altCreditScore: 610,
    riskLevel: 'Elevated',
    status: 'pending',
    baseScore: 520,
    shapFeatures: [
      { featureName: 'Moderate Income', impact: 70, category: 'Income' },
      { featureName: 'High Leverage', impact: -40, category: 'Financial' },
      { featureName: 'Good Utility Payment Rate', impact: 44, category: 'Payment Behavior' },
      { featureName: 'Limited Repayment History', impact: -25, category: 'Credit History' },
      { featureName: 'Inconsistent Digital Activity', impact: -41, category: 'Digital Activity' },
    ],
  },
  {
    id: 'app-005',
    applicantName: 'Apex Digital Solutions',
    income: 320000,
    requestedAmount: 4000000,
    altCreditScore: 760,
    riskLevel: 'Low',
    status: 'approved',
    baseScore: 520,
    shapFeatures: [
      { featureName: 'Very High Income', impact: 90, category: 'Income' },
      { featureName: 'Moderate Leverage', impact: 45, category: 'Financial' },
      { featureName: 'Perfect Utility Payment Rate', impact: 55, category: 'Payment Behavior' },
      { featureName: 'Excellent Repayment History', impact: 50, category: 'Credit History' },
    ],
  },
  {
    id: 'app-006',
    applicantName: 'Sana Boutique & Stitching House',
    income: 42000,
    requestedAmount: 320000,
    altCreditScore: 548,
    riskLevel: 'High',
    status: 'rejected',
    baseScore: 520,
    shapFeatures: [
      { featureName: 'Low Income', impact: 15, category: 'Income' },
      { featureName: 'High Leverage', impact: -40, category: 'Financial' },
      { featureName: 'Poor Utility Payment Rate', impact: -20, category: 'Payment Behavior' },
      { featureName: 'Limited Repayment History', impact: -35, category: 'Credit History' },
      { featureName: 'Low Digital Activity', impact: -12, category: 'Digital Activity' },
    ],
  },
];

export function deriveAltCreditScore(input: {
  income: number;
  requestedAmount: number;
  utilityOnTimeRate?: number;
  onTimeRepaymentRate?: number;
}): number {
  const annualIncome = Math.max(input.income * 12, 1);
  const leverage = input.requestedAmount / annualIncome;

  let score = 520;
  if (input.income >= 150000) score += 90;
  else if (input.income >= 80000) score += 70;
  else if (input.income >= 50000) score += 40;
  else score += 15;

  if (leverage < 0.25) score += 80;
  else if (leverage < 0.5) score += 45;
  else if (leverage < 1) score += 15;
  else score -= 40;

  score += Math.round((input.utilityOnTimeRate ?? 70) * 0.55);
  score += Math.round((input.onTimeRepaymentRate ?? 70) * 0.7);

  return Math.min(850, Math.max(300, score));
}

export function deriveRiskLevel(altCreditScore: number): RiskLevel {
  if (altCreditScore >= 740) return 'Low';
  if (altCreditScore >= 670) return 'Moderate';
  if (altCreditScore >= 600) return 'Elevated';
  return 'High';
}

export function toRiskTier(level: RiskLevel): RiskTier {
  switch (level) {
    case 'Low':
      return 'low';
    case 'Moderate':
      return 'moderate';
    case 'Elevated':
      return 'elevated';
    case 'High':
      return 'high';
  }
}

export function toApplicationStatus(status: LoanStatus): ApplicationStatus {
  if (status === 'approved') return 'approved';
  if (status === 'rejected') return 'rejected';
  return 'pending_review';
}

export const MOCK_QUEUE_STORAGE_KEY = 'lendora_loan_queue';
