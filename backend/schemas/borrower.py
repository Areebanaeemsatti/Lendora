from typing import List, Optional
from pydantic import BaseModel, Field, ConfigDict


class BorrowerInput(BaseModel):
    model_config = ConfigDict(
        populate_by_name=True,
        json_schema_extra={
            "example": {
                "borrowerId": "LND-2026-001",
                "fullName": "Ayesha Khan",
                "age": 28,
                "city": "Lahore",
                "province": "Punjab",
                "occupation": "Textile Retailer",
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
    age: int = Field(..., ge=18, le=100, description="Borrower Age in Years")
    city: str = Field(..., description="City of Residence (e.g. Lahore, Karachi, Peshawar)")
    province: str = Field(..., description="Province (e.g. Punjab, Sindh, KPK, Balochistan)")
    occupation: str = Field(..., description="Occupation / Micro-business type")
    employmentType: str = Field(..., description="Employment Classification (e.g. Self-employed, Informal Worker, Small Business Owner)")
    monthlyIncomePKR: float = Field(..., ge=0, description="Monthly Income in PKR")
    monthlyExpensesPKR: float = Field(..., ge=0, description="Estimated Monthly Living Expenses in PKR")
    existingDebtPKR: float = Field(0, ge=0, description="Total Outstanding Existing Debt in PKR")
    requestedLoanAmountPKR: float = Field(..., gt=0, description="Loan Amount Requested in PKR")
    loanTermMonths: int = Field(..., gt=0, le=60, description="Requested Loan Duration in Months")
    monthlyEasypaisaTxCount: int = Field(0, ge=0, description="Monthly Easypaisa Mobile Wallet Transaction Count")
    monthlyJazzCashTxCount: int = Field(0, ge=0, description="Monthly JazzCash Mobile Wallet Transaction Count")
    monthlyMobileRechargePKR: float = Field(0, ge=0, description="Monthly Mobile Top-up/Recharge Amount in PKR")
    utilityBillOnTimeRate: float = Field(..., ge=0, le=100, description="On-time Utility Bill Payment Percentage (0-100)")
    monthlyUtilityBillPKR: float = Field(0, ge=0, description="Average Monthly Utility Bill in PKR")
    previousLoansCount: int = Field(0, ge=0, description="Number of Previous Loans Taken")
    previousDefaultsCount: int = Field(0, ge=0, description="Number of Previous Defaulted Loans")
    onTimeRepaymentRate: float = Field(0, ge=0, le=100, description="Historical On-Time Repayment Percentage (0-100)")
    avgPreviousLoanAmountPKR: float = Field(0, ge=0, description="Average Amount of Previous Loans in PKR")
    repaymentHistoryGrade: str = Field("No previous borrowing history", description="Grade (Excellent, Good, Fair, Poor, No previous borrowing history)")
    creditHistoryYears: int = Field(0, ge=0, description="Years of Credit / Financial Activity History")
    hasBankAccount: str = Field("No", description="Has Bank Account (Yes / No)")
    hasFormalCreditHistory: str = Field("No", description="Has Formal Credit Bureau Record (Yes / No / Limited)")


class FeatureImportanceItem(BaseModel):
    featureName: str = Field(..., description="Internal Signal Name")
    displayName: str = Field(..., description="Human Readable Signal Label")
    impact: str = Field(..., description="Impact Direction: 'positive', 'negative', or 'neutral'")
    weight: float = Field(..., description="Calculated Relative Weight Contribution (%)")
    description: str = Field(..., description="Explanation of signal impact on creditworthiness")


class FinancialMetrics(BaseModel):
    disposableIncomePKR: float = Field(..., description="Monthly Income minus Expenses and Debt payments")
    debtToIncomeRatio: float = Field(..., description="Debt-to-Income Ratio Percentage (DTI %)")
    debtServiceCoverageRatio: float = Field(..., description="Debt Service Coverage Ratio (DSCR)")
    totalMonthlyWalletTx: int = Field(..., description="Combined Monthly Mobile Wallet Transactions (Easypaisa + JazzCash)")
    utilityPaymentReliability: float = Field(..., description="Utility On-time Payment Percentage")


class ScoreBreakdown(BaseModel):
    cashFlowScore: float = Field(..., description="Cashflow & Debt Capacity Sub-score (0-100)")
    digitalFootprintScore: float = Field(..., description="Digital Wallet & Mobile Recharge Sub-score (0-100)")
    utilityPaymentScore: float = Field(..., description="Utility Reliability Sub-score (0-100)")
    repaymentHistoryScore: float = Field(..., description="Credit & Repayment History Sub-score (0-100)")


class RiskAssessmentResponse(BaseModel):
    borrowerId: Optional[str] = Field(None, description="Borrower Identifier")
    fullName: str = Field(..., description="Borrower Full Name")
    creditScore: int = Field(..., ge=0, le=100, description="Lendora Normalized Credit Score (0 - 100)")
    scaledCreditScore: int = Field(..., ge=300, le=850, description="Scaled Standard Credit Score Equivalent (300 - 850)")
    riskTier: str = Field(..., description="Risk Tier: 'Low', 'Low-Moderate', 'Moderate', 'Moderate-High', 'High'")
    defaultRiskCategory: str = Field(..., description="Risk Level Classification")
    estimatedDefaultProbability: float = Field(..., description="Estimated Probability of Default (%)")
    recommendation: str = Field(..., description="Underwriting Recommendation (Approved, Approved with Conditions, Manual Review, Rejected)")
    maxApprovedLoanAmountPKR: float = Field(..., description="Maximum Recommended Loan Capacity in PKR")
    financialMetrics: FinancialMetrics = Field(..., description="Key Financial Ratios & Signal Indicators")
    scoreBreakdown: ScoreBreakdown = Field(..., description="Detailed Component Sub-scores")
    topPositiveDrivers: List[str] = Field(..., description="Top Key Positive Credit Signals")
    topRiskDrivers: List[str] = Field(..., description="Top Key Risk Signals")
    featureImportance: List[FeatureImportanceItem] = Field(..., description="Comprehensive Feature Importance Analysis")


class HealthResponse(BaseModel):
    status: str = Field("healthy", description="Service Operational Status")
    service: str = Field("Lendora Credit Scoring API", description="Service Name")
    version: str = Field("1.0.0", description="API Version")
    environment: str = Field("development", description="Environment Mode")
