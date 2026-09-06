import type { ApplicationStatus, RiskTier, ShapFeature, ShapValueItem, RiskAssessmentResponse } from '@/types';

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
  shap_values?: ShapValueItem[];
  assessment?: RiskAssessmentResponse;
  baseScore?: number;
  recommendation?: string;
  confidenceScore?: number;
  defaultProbability?: number;
}

import { REAL_CSV_APPLICATIONS } from '@/lib/dataset';

/**
 * Real borrower applications loaded from the trained ML dataset:
 * ml/data/pk_alt_data_synthetic3.csv
 */
export const initialMockApplications: LoanApplication[] = REAL_CSV_APPLICATIONS;

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

export function generateMockAssessment(params: {
  borrowerId?: string;
  fullName?: string;
  income: number;
  requestedAmount: number;
  utilityBillOnTimeRate?: number;
  onTimeRepaymentRate?: number;
  monthlyEasypaisaTxCount?: number;
  monthlyJazzCashTxCount?: number;
}): RiskAssessmentResponse {
  const score = deriveAltCreditScore({
    income: params.income,
    requestedAmount: params.requestedAmount,
    utilityOnTimeRate: params.utilityBillOnTimeRate,
    onTimeRepaymentRate: params.onTimeRepaymentRate,
  });

  const riskLevel = deriveRiskLevel(score);
  const defaultProbability = Math.max(0.02, Math.min(0.85, (850 - score) / 550 * 0.28));
  const walletTxns = (params.monthlyEasypaisaTxCount || 0) + (params.monthlyJazzCashTxCount || 0);

  const shapValues: ShapValueItem[] = [
    {
      feature_name: 'wallet_transaction_frequency',
      featureName: 'Mobile Wallet Velocity (90d)',
      impact: walletTxns >= 25 ? 42.5 : (walletTxns >= 10 ? 18.0 : -15.0),
      shap_value: walletTxns >= 25 ? 42.5 : (walletTxns >= 10 ? 18.0 : -15.0),
      direction: walletTxns >= 10 ? 'positive' : 'negative',
      raw_value: `${walletTxns} tx/mo`,
      category: 'Digital Footprint',
      explanation: walletTxns >= 25
        ? 'High-frequency mobile wallet throughput demonstrates strong informal business cash turnover'
        : 'Subdued monthly wallet activity indicates lower verified digital liquidity',
    },
    {
      feature_name: 'utility_payment_reliability',
      featureName: 'Utility Settlement Rate',
      impact: (params.utilityBillOnTimeRate ?? 80) >= 85 ? 38.0 : -22.5,
      shap_value: (params.utilityBillOnTimeRate ?? 80) >= 85 ? 38.0 : -22.5,
      direction: (params.utilityBillOnTimeRate ?? 80) >= 85 ? 'positive' : 'negative',
      raw_value: `${params.utilityBillOnTimeRate ?? 85}%`,
      category: 'Utility Payment',
      explanation: (params.utilityBillOnTimeRate ?? 80) >= 85
        ? 'Consistent on-time utility bill settlements demonstrate household repayment discipline'
        : 'Delayed utility payments highlight potential monthly cashflow volatility',
    },
    {
      feature_name: 'disposable_cashflow_margin',
      featureName: 'Disposable Cashflow Surplus',
      impact: params.income >= 80000 ? 55.0 : 20.0,
      shap_value: params.income >= 80000 ? 55.0 : 20.0,
      direction: 'positive',
      raw_value: `PKR ${params.income.toLocaleString()}`,
      category: 'Cash Flow',
      explanation: 'Sufficient income margin supports requested micro-loan installment obligations',
    },
    {
      feature_name: 'historical_repayment_consistency',
      featureName: 'Historical Repayment Discipline',
      impact: (params.onTimeRepaymentRate ?? 80) >= 90 ? 46.0 : -28.0,
      shap_value: (params.onTimeRepaymentRate ?? 90) >= 90 ? 46.0 : -28.0,
      direction: (params.onTimeRepaymentRate ?? 80) >= 90 ? 'positive' : 'negative',
      raw_value: `${params.onTimeRepaymentRate ?? 90}%`,
      category: 'Credit History',
      explanation: (params.onTimeRepaymentRate ?? 80) >= 90
        ? 'Zero past defaults and consistent supplier repayment history reinforce creditworthiness'
        : 'Past repayment delays increase predicted default hazard',
    },
    {
      feature_name: 'formal_ecib_record_depth',
      featureName: 'Formal eCIB Credit Depth',
      impact: -24.0,
      shap_value: -24.0,
      direction: 'negative',
      raw_value: 'Unbanked / Limited',
      category: 'Formal Credit Bureau',
      explanation: 'Absence of multi-year formal commercial banking records requires alternative data reliance',
    },
    {
      feature_name: 'requested_leverage_ratio',
      featureName: 'Financing Leverage Ratio',
      impact: params.requestedAmount > params.income * 5 ? -35.0 : 15.0,
      shap_value: params.requestedAmount > params.income * 5 ? -35.0 : 15.0,
      direction: params.requestedAmount > params.income * 5 ? 'negative' : 'positive',
      raw_value: `${Math.round(params.requestedAmount / Math.max(1, params.income))}x income`,
      category: 'Financial Capacity',
      explanation: params.requestedAmount > params.income * 5
        ? 'Requested loan principal is elevated relative to stated monthly business cash generation'
        : 'Requested loan principal is well-proportioned to monthly operating capacity',
    },
  ];

  const topPos = shapValues
    .filter((v) => v.direction === 'positive')
    .slice(0, 3)
    .map((v) => `${v.featureName}: ${v.explanation} (+${v.impact} pts)`);

  const topNeg = shapValues
    .filter((v) => v.direction === 'negative')
    .slice(0, 3)
    .map((v) => `${v.featureName}: ${v.explanation} (${v.impact} pts)`);

  return {
    credit_score: score,
    risk_tier: `${riskLevel} Risk`,
    default_probability: Number(defaultProbability.toFixed(4)),
    confidence_score: 0.88,
    shap_explanations: shapValues,
    shap_values: shapValues,
    recommendation: score >= 720 ? 'Approve Micro-Loan' : (score >= 620 ? 'Manual Review' : 'Decline'),
    top_positive_drivers: topPos,
    top_negative_drivers: topNeg,
    borrowerId: params.borrowerId,
    fullName: params.fullName || 'Borrower',
    creditScore: Math.round(((score - 300) / 550) * 100),
    scaledCreditScore: score,
    riskTier: toRiskTier(riskLevel),
    defaultRiskCategory: `${riskLevel} Risk`,
    estimatedDefaultProbability: Number((defaultProbability * 100).toFixed(1)),
    maxApprovedLoanAmountPKR: Math.round(params.requestedAmount * (score >= 700 ? 1.2 : 0.8)),
    modelTypeUsed: 'calibrated_heuristic',
  };
}
