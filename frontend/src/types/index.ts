export type EmploymentType =
  | 'Salaried'
  | 'Self-employed'
  | 'Informal worker'
  | 'Daily wage worker'
  | 'Small business owner'
  | 'Freelancer';

export type RepaymentHistoryGrade =
  | 'Excellent'
  | 'Good'
  | 'Fair'
  | 'Poor'
  | 'No previous borrowing history';

export type ApplicationStatus =
  | 'pending_review'
  | 'underwriting'
  | 'approved'
  | 'rejected'
  | 'more_info';

export type RiskTier = 'low' | 'moderate' | 'elevated' | 'high';

export type DocumentType =
  | 'Utility Bill'
  | 'Easypaisa Evidence'
  | 'JazzCash Evidence'
  | 'Mobile Recharge Evidence'
  | 'Income / Business Proof'
  | 'Repayment Evidence'
  | 'Other';

export interface SupportingDocument {
  id: string;
  fileName: string;
  fileSize: string; // e.g. "1.8 MB"
  fileType: string;
  documentType: DocumentType;
  description?: string;
  previewUrl?: string; // Data URL or object URL for reviewer thumbnail reference
}

/**
 * Central Borrower Application Data Interface
 */
export interface BorrowerApplication {
  // Metadata
  id: string;
  submittedAt: string;
  status: ApplicationStatus;

  // Section 1: Basic Borrower Information
  borrowerId: string;
  fullName: string;
  age: number | '';
  city: string;
  province: string;
  occupation: string;
  employmentType: EmploymentType | '';

  // Section 2: Income & Financial Profile
  monthlyIncomePKR: number | '';
  monthlyExpensesPKR: number | '';
  existingDebtPKR: number | '';
  requestedLoanAmountPKR: number | '';
  loanTermMonths: number | '';

  // Section 3: Alternative Financial Signals (Digital Financial Activity)
  monthlyEasypaisaTxCount: number | '';
  monthlyJazzCashTxCount: number | '';
  monthlyMobileRechargePKR: number | '';
  utilityBillOnTimeRate: number | ''; // 0 - 100%
  monthlyUtilityBillPKR: number | '';

  // Section 4: Repayment Behavior
  previousLoansCount: number | '';
  previousDefaultsCount: number | '';
  onTimeRepaymentRate: number | ''; // 0 - 100%
  avgPreviousLoanAmountPKR: number | '';
  repaymentHistoryGrade: RepaymentHistoryGrade | '';

  // Supporting Documents & Image Proof (Optional)
  supportingDocuments?: SupportingDocument[];

  // Section 5: Optional Traditional Credit History
  creditHistoryYears?: number | '';
  hasBankAccount?: 'yes' | 'no' | '';
  hasFormalCreditHistory?: 'yes' | 'no' | '';
  traditionalCreditNotes?: string;

  // Step 03 ML Integration & Live SHAP fields
  assessment?: RiskAssessmentResponse;
  shap_values?: ShapValueItem[];
}

export interface BorrowerSummary {
  id: string;
  applicationNumber: string;
  fullName: string;
  cnic: string;
  city: string;
  province: string;
  businessType: string;
  requestedAmountPKR: number;
  appliedDate: string;
  status: ApplicationStatus;
  riskTier?: RiskTier;
  riskScore?: number;
}

export interface ShapFeature {
  featureName: string;
  impact: number;
  category: string;
}

export interface ShapValueItem {
  feature_name?: string;
  featureName?: string;
  feature?: string;
  raw_value?: any;
  rawValue?: any;
  impact: number;
  shap_value?: number;
  shapValue?: number;
  direction?: 'positive' | 'negative' | string;
  explanation?: string;
  description?: string;
  category?: string;
  weight?: number;
}

export interface RiskAssessmentResponse {
  credit_score: number;
  risk_tier: string;
  default_probability: number;
  confidence_score: number;
  shap_explanations: ShapValueItem[];
  shap_values?: ShapValueItem[];
  recommendation: string;
  top_positive_drivers: string[];
  top_negative_drivers: string[];

  // Backward compatible & extra fields
  borrowerId?: string;
  fullName?: string;
  creditScore?: number;
  scaledCreditScore?: number;
  riskTier?: RiskTier;
  defaultRiskCategory?: string;
  estimatedDefaultProbability?: number;
  maxApprovedLoanAmountPKR?: number;
  featureImportance?: ShapValueItem[];
  modelTypeUsed?: string;
}
