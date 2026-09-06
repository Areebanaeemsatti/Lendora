from typing import List, Optional, Dict, Any, Union
from pydantic import BaseModel, Field, ConfigDict


class SupportingDocument(BaseModel):
    id: Optional[str] = None
    fileName: Optional[str] = None
    fileSize: Optional[str] = None
    fileType: Optional[str] = None
    documentType: Optional[str] = None
    description: Optional[str] = None
    previewUrl: Optional[str] = None


class BorrowerInput(BaseModel):
    model_config = ConfigDict(
        populate_by_name=True,
        extra="allow",
        json_schema_extra={
            "example": {
                "borrowerId": "LND-2026-001",
                "fullName": "Ayesha Khan",
                "age": 28,
                "city": "Lahore",
                "province": "Punjab",
                "occupation": "small_shopkeeper",
                "employmentType": "Small Business Owner",
                "monthlyIncomePKR": 85000,
                "monthlyExpensesPKR": 42000,
                "existingDebtPKR": 15000,
                "requestedLoanAmountPKR": 250000,
                "loanTermMonths": 12,
                "monthlyEasypaisaTxCount": 24,
                "monthlyJazzCashTxCount": 35,
                "monthlyMobileRechargePKR": 2500,
                "utilityBillOnTimeRate": 95,
                "monthlyUtilityBillPKR": 6500,
                "previousLoansCount": 2,
                "previousDefaultsCount": 0,
                "onTimeRepaymentRate": 92,
                "avgPreviousLoanAmountPKR": 75000,
                "repaymentHistoryGrade": "Good",
                "creditHistoryYears": 2,
                "hasBankAccount": "Yes",
                "hasFormalCreditHistory": "Limited"
            }
        }
    )

    borrowerId: Optional[str] = Field(None, description="Unique Borrower ID (e.g. LND-2026-001)")
    fullName: Optional[str] = Field("Anonymous Borrower", description="Borrower Full Name")
    age: Optional[Union[int, float]] = Field(None, description="Borrower Age in Years")
    city: Optional[str] = Field(None, description="City of Residence (e.g. Lahore, Karachi, Peshawar)")
    province: Optional[str] = Field(None, description="Province (e.g. Punjab, Sindh, KPK, Balochistan)")
    occupation: Optional[str] = Field(None, description="Occupation / Micro-business type")
    employmentType: Optional[str] = Field(None, description="Employment Classification (e.g. Self-employed, Informal Worker, Small Business Owner)")
    monthlyIncomePKR: Optional[Union[int, float]] = Field(None, description="Monthly Income in PKR")
    monthlyExpensesPKR: Optional[Union[int, float]] = Field(None, description="Estimated Monthly Living Expenses in PKR")
    existingDebtPKR: Optional[Union[int, float]] = Field(0, description="Total Outstanding Existing Debt in PKR")
    requestedLoanAmountPKR: Optional[Union[int, float]] = Field(None, description="Loan Amount Requested in PKR")
    loanTermMonths: Optional[Union[int, float]] = Field(None, description="Requested Loan Duration in Months")
    monthlyEasypaisaTxCount: Optional[Union[int, float]] = Field(0, description="Monthly Easypaisa Mobile Wallet Transaction Count")
    monthlyJazzCashTxCount: Optional[Union[int, float]] = Field(0, description="Monthly JazzCash Mobile Wallet Transaction Count")
    monthlyMobileRechargePKR: Optional[Union[int, float]] = Field(0, description="Monthly Mobile Top-up/Recharge Amount in PKR")
    utilityBillOnTimeRate: Optional[Union[int, float]] = Field(None, description="On-time Utility Bill Payment Percentage (0-100)")
    monthlyUtilityBillPKR: Optional[Union[int, float]] = Field(0, description="Average Monthly Utility Bill in PKR")
    previousLoansCount: Optional[Union[int, float]] = Field(0, description="Number of Previous Loans Taken")
    previousDefaultsCount: Optional[Union[int, float]] = Field(0, description="Number of Previous Defaulted Loans")
    onTimeRepaymentRate: Optional[Union[int, float]] = Field(0, description="Historical On-Time Repayment Percentage (0-100)")
    avgPreviousLoanAmountPKR: Optional[Union[int, float]] = Field(0, description="Average Amount of Previous Loans in PKR")
    repaymentHistoryGrade: Optional[str] = Field("No previous borrowing history", description="Grade (Excellent, Good, Fair, Poor, No previous borrowing history)")
    creditHistoryYears: Optional[Union[int, float]] = Field(0, description="Years of Credit / Financial Activity History")
    hasBankAccount: Optional[str] = Field("No", description="Has Bank Account (Yes / No)")
    hasFormalCreditHistory: Optional[str] = Field("No", description="Has Formal Credit Bureau Record (Yes / No / Limited)")
    traditionalCreditNotes: Optional[str] = Field(None, description="Optional notes on credit background")
    supportingDocuments: Optional[List[SupportingDocument]] = Field(default_factory=list, description="Uploaded proof documents")

    # Optional direct alternative data fields from ML model schema
    provider: Optional[str] = Field(None, description="Preferred alternative telecom wallet provider (Easypaisa, JazzCash, SadaPay, NayaPay)")
    wallet_active_days_ratio_90d: Optional[float] = None
    wallet_txn_count_90d: Optional[float] = None
    wallet_txn_count_30d: Optional[float] = None
    wallet_days_since_last_txn: Optional[float] = None
    wallet_topup_count_90d: Optional[float] = None
    wallet_topup_avg_amount: Optional[float] = None
    wallet_topup_frequency_per_month: Optional[float] = None
    wallet_bill_payment_count_90d: Optional[float] = None
    wallet_bill_payment_share: Optional[float] = None
    wallet_distinct_billers_90d: Optional[float] = None
    wallet_avg_balance: Optional[float] = None
    wallet_inflow_outflow_ratio: Optional[float] = None
    wallet_txn_amount_volatility: Optional[float] = None


class ShapExplanation(BaseModel):
    feature_name: str = Field(..., description="Name of the model feature")
    raw_value: Any = Field(..., description="Observed applicant value for this feature")
    impact: float = Field(..., description="+/- points or log-odds impact on credit score")
    direction: str = Field(..., description="'positive' (improves creditworthiness) or 'negative' (increases default risk)")
    explanation: str = Field(..., description="Human-readable reason for feature contribution")


class FeatureImportanceItem(BaseModel):
    featureName: str = Field(..., description="Internal Signal Name")
    displayName: str = Field(..., description="Human Readable Signal Label")
    impact: str = Field(..., description="Impact Direction: 'positive', 'negative', or 'neutral'")
    weight: float = Field(..., description="Calculated Relative Weight Contribution (%)")
    shapValue: Optional[float] = Field(0.0, description="SHAP-style additive impact on credit score")
    description: str = Field(..., description="Explanation of signal impact on creditworthiness")


class FinancialMetrics(BaseModel):
    disposableIncomePKR: float = Field(..., description="Monthly Income minus Expenses and Debt payments")
    debtToIncomeRatio: float = Field(..., description="Debt-to-Income Ratio Percentage (DTI %)")
    debtServiceCoverageRatio: float = Field(..., description="Debt Service Coverage Ratio (DSCR)")
    totalMonthlyWalletTx: int = Field(..., description="Combined Monthly Mobile Wallet Transactions (Easypaisa + JazzCash)")
    utilityPaymentReliability: float = Field(..., description="Utility On-time Payment Percentage")
    transactionVelocityDaily: Optional[float] = Field(0.0, description="Average daily mobile wallet transaction velocity")
    utilityDelayRatio: Optional[float] = Field(0.0, description="Ratio of delayed utility payments (0.0 - 1.0)")
    walletCashBalanceProxy: Optional[float] = Field(0.0, description="Estimated wallet cash-in vs cash-out balance index")


class ScoreBreakdown(BaseModel):
    cashFlowScore: float = Field(..., description="Cashflow & Debt Capacity Sub-score (0-100)")
    digitalFootprintScore: float = Field(..., description="Digital Wallet & Mobile Recharge Sub-score (0-100)")
    utilityPaymentScore: float = Field(..., description="Utility Reliability Sub-score (0-100)")
    repaymentHistoryScore: float = Field(..., description="Credit & Repayment History Sub-score (0-100)")


class RiskAssessmentResponse(BaseModel):
    # Step 3 Required Core Contract Fields
    credit_score: int = Field(..., ge=300, le=850, description="Standard credit score scaled from 300 to 850")
    risk_tier: str = Field(..., description="Risk tier: 'Low Risk', 'Medium Risk', or 'High Risk'")
    default_probability: float = Field(..., ge=0.0, le=1.0, description="Predicted probability of default (0.0 to 1.0)")
    confidence_score: float = Field(..., ge=0.0, le=1.0, description="Metric based on input completeness and verified proof (0.0 to 1.0)")
    shap_explanations: List[ShapExplanation] = Field(..., description="Structured list containing feature names, raw values, and directional impacts")
    shap_values: Optional[List[Dict[str, Any]]] = Field(default_factory=list, description="Dynamic SHAP impact values for frontend explainability visualizer")
    recommendation: str = Field(..., description="Auto-generated underwriting action (e.g. Approve Micro-Loan, Manual Review, Decline)")

    # Top drivers
    top_positive_drivers: List[str] = Field(default_factory=list, description="Top 3 positive drivers (+ impact on score)")
    top_negative_drivers: List[str] = Field(default_factory=list, description="Top 3 negative risk flags (- impact on score)")

    # Backward-compatible fields for frontend UI components and previous steps
    borrowerId: Optional[str] = Field(None, description="Borrower Identifier")
    fullName: str = Field("Anonymous Borrower", description="Borrower Full Name")
    creditScore: Optional[int] = Field(None, description="Lendora Normalized Credit Score (0 - 100)")
    scaledCreditScore: Optional[int] = Field(None, description="Scaled Standard Credit Score Equivalent (300 - 850)")
    riskTier: Optional[str] = Field(None, description="Risk Tier ('low', 'moderate', 'elevated', 'high')")
    defaultRiskCategory: Optional[str] = Field(None, description="Risk Level Classification")
    estimatedDefaultProbability: Optional[float] = Field(None, description="Estimated Probability of Default (%)")
    maxApprovedLoanAmountPKR: Optional[float] = Field(None, description="Maximum Recommended Loan Capacity in PKR")
    financialMetrics: Optional[FinancialMetrics] = Field(None, description="Key Financial Ratios & Signal Indicators")
    scoreBreakdown: Optional[ScoreBreakdown] = Field(None, description="Detailed Component Sub-scores")
    topPositiveDrivers: Optional[List[str]] = Field(default_factory=list, description="Top Key Positive Credit Signals")
    topRiskDrivers: Optional[List[str]] = Field(default_factory=list, description="Top Key Risk Signals")
    featureImportance: Optional[List[FeatureImportanceItem]] = Field(default_factory=list, description="Comprehensive Feature Importance & SHAP Factors")
    modelTypeUsed: Optional[str] = Field("trained_ml_model", description="Underlying scoring engine: 'trained_ml_model' or 'calibrated_heuristic'")
    derivedFeatures: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Raw engineered features passed to inference engine")


class HealthResponse(BaseModel):
    status: str = Field("healthy", description="Service Operational Status")
    service: str = Field("Lendora Credit Scoring API", description="Service Name")
    version: str = Field("3.0.0", description="API Version")
    environment: str = Field("development", description="Environment Mode")
    model_loaded: bool = Field(True, description="Whether ML model artifact is loaded in memory")
    model_used: Optional[str] = Field("lightgbm", description="Trained model architecture used")
    explainer_ready: bool = Field(True, description="Whether SHAP explainer is ready for real-time explanations")
