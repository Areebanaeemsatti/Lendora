import os
from pathlib import Path
from typing import List, Dict, Any
import pandas as pd

from schemas.borrower import (
    BorrowerInput,
    RiskAssessmentResponse,
    FinancialMetrics,
    ScoreBreakdown,
    FeatureImportanceItem
)


def _get_csv_path() -> Path:
    """Resolve the path to lendora_demo_borrowers_50.csv regardless of current working dir."""
    current_file_dir = Path(__file__).resolve().parent
    path_candidates = [
        current_file_dir.parent.parent / "data" / "lendora_demo_borrowers_50.csv",
        Path("data/lendora_demo_borrowers_50.csv"),
        Path("../data/lendora_demo_borrowers_50.csv"),
        Path("../../data/lendora_demo_borrowers_50.csv"),
    ]
    for p in path_candidates:
        if p.exists():
            return p
    # Return candidate 0 as fallback
    return path_candidates[0]


class ScoringService:
    @staticmethod
    def calculate_score(borrower: BorrowerInput) -> RiskAssessmentResponse:
        """
        Calculates an alternative credit score, risk tier, feature importance,
        and financial assessment specifically tailored for Pakistani informal economy workers.
        """
        # 1. Cash Flow & Debt Capacity Calculation (Weight: 35%)
        income = float(borrower.monthlyIncomePKR)
        expenses = float(borrower.monthlyExpensesPKR)
        existing_debt = float(borrower.existingDebtPKR)
        
        disposable_income = max(0.0, income - expenses - (existing_debt * 0.1))
        dti_ratio = round(((expenses + (existing_debt * 0.1)) / income * 100) if income > 0 else 100.0, 2)
        
        # Calculate monthly installment for requested loan (simple interest/straightline estimate)
        loan_amount = float(borrower.requestedLoanAmountPKR)
        term_months = max(1, borrower.loanTermMonths)
        estimated_monthly_installment = (loan_amount / term_months) * 1.15  # assuming 15% annualized markup
        
        dscr = round((disposable_income / estimated_monthly_installment) if estimated_monthly_installment > 0 else 0.0, 2)
        
        # Cash Flow Sub-score (0 - 100)
        cash_flow_score = 50.0
        if dti_ratio < 40:
            cash_flow_score += 30.0
        elif dti_ratio < 60:
            cash_flow_score += 15.0
        else:
            cash_flow_score -= 20.0
            
        if dscr >= 2.0:
            cash_flow_score += 20.0
        elif dscr >= 1.2:
            cash_flow_score += 10.0
        else:
            cash_flow_score -= 15.0
            
        cash_flow_score = max(0.0, min(100.0, cash_flow_score))

        # 2. Digital Footprint & Mobile Wallet Velocity (Weight: 25%)
        wallet_tx = borrower.monthlyEasypaisaTxCount + borrower.monthlyJazzCashTxCount
        recharge = borrower.monthlyMobileRechargePKR
        
        digital_score = 40.0
        if wallet_tx >= 40:
            digital_score += 35.0
        elif wallet_tx >= 20:
            digital_score += 20.0
        elif wallet_tx >= 5:
            digital_score += 10.0
        else:
            digital_score -= 10.0
            
        if recharge >= 3000:
            digital_score += 25.0
        elif recharge >= 1500:
            digital_score += 15.0
        elif recharge >= 500:
            digital_score += 5.0
            
        digital_score = max(0.0, min(100.0, digital_score))

        # 3. Utility Bill Payment Reliability (Weight: 20%)
        utility_rate = float(borrower.utilityBillOnTimeRate)
        utility_score = utility_rate * 0.9
        if borrower.monthlyUtilityBillPKR > 5000:
            utility_score += 10.0
        utility_score = max(0.0, min(100.0, utility_score))

        # 4. Credit & Repayment History (Weight: 20%)
        on_time_rate = float(borrower.onTimeRepaymentRate)
        defaults = borrower.previousDefaultsCount
        history_years = borrower.creditHistoryYears
        
        repayment_score = 60.0
        if borrower.previousLoansCount > 0:
            repayment_score = on_time_rate * 0.8
            repayment_score -= (defaults * 25.0)
        else:
            # Baseline for thin-file / new informal borrowers
            repayment_score = 70.0 if borrower.hasFormalCreditHistory in ["Yes", "Limited"] else 60.0
            
        if history_years >= 2:
            repayment_score += 10.0
            
        repayment_score = max(0.0, min(100.0, repayment_score))

        # Calculate Final Composite Normalized Credit Score (0 - 100)
        final_score_raw = (
            (cash_flow_score * 0.35) +
            (digital_score * 0.25) +
            (utility_score * 0.20) +
            (repayment_score * 0.20)
        )
        
        # Micro-adjustments for mock alignment
        final_score = int(round(max(20.0, min(98.0, final_score_raw))))
        scaled_score = int(300 + (final_score / 100.0) * 550)

        # Risk Tiering & Default Risk Mapping
        if final_score >= 80:
            risk_tier = "Low"
            default_risk_cat = "Low"
            default_prob = round(4.5 + (100 - final_score) * 0.2, 2)
            recommendation = "Approved"
            max_loan_mult = 3.5
        elif final_score >= 70:
            risk_tier = "Low-Moderate"
            default_risk_cat = "Low-Moderate"
            default_prob = round(8.5 + (80 - final_score) * 0.4, 2)
            recommendation = "Approved"
            max_loan_mult = 2.8
        elif final_score >= 60:
            risk_tier = "Moderate"
            default_risk_cat = "Moderate"
            default_prob = round(15.0 + (70 - final_score) * 0.8, 2)
            recommendation = "Approved with Conditions"
            max_loan_mult = 2.0
        elif final_score >= 50:
            risk_tier = "Moderate-High"
            default_risk_cat = "Moderate-High"
            default_prob = round(28.0 + (60 - final_score) * 1.2, 2)
            recommendation = "Manual Review Required"
            max_loan_mult = 1.2
        else:
            risk_tier = "High"
            default_risk_cat = "High"
            default_prob = round(45.0 + (50 - final_score) * 1.5, 2)
            recommendation = "Rejected"
            max_loan_mult = 0.5

        max_approved_loan = round(min(loan_amount * 1.2, disposable_income * max_loan_mult * 3), -3)

        # Feature Importance Analysis
        feature_importance: List[FeatureImportanceItem] = []
        top_positive_drivers: List[str] = []
        top_risk_drivers: List[str] = []

        # Signal 1: Mobile Wallet Transactions
        if wallet_tx >= 30:
            feature_importance.append(FeatureImportanceItem(
                featureName="monthlyWalletTxCount",
                displayName="Mobile Wallet Transaction Volume",
                impact="positive",
                weight=25.0,
                description=f"High digital wallet activity ({wallet_tx} txns/mo) demonstrates strong financial velocity."
            ))
            top_positive_drivers.append(f"Frequent mobile wallet usage ({wallet_tx} Easypaisa/JazzCash transactions/month)")
        else:
            feature_importance.append(FeatureImportanceItem(
                featureName="monthlyWalletTxCount",
                displayName="Mobile Wallet Transaction Volume",
                impact="negative" if wallet_tx < 15 else "neutral",
                weight=15.0,
                description=f"Limited digital wallet transactions ({wallet_tx} txns/mo)."
            ))
            if wallet_tx < 15:
                top_risk_drivers.append(f"Low digital wallet transaction frequency ({wallet_tx} transactions/month)")

        # Signal 2: Utility Bill On-Time Rate
        if utility_rate >= 85:
            feature_importance.append(FeatureImportanceItem(
                featureName="utilityBillOnTimeRate",
                displayName="Utility Payment Reliability",
                impact="positive",
                weight=20.0,
                description=f"Excellent utility payment history ({utility_rate}% on-time rate)."
            ))
            top_positive_drivers.append(f"Consistent utility bill payment record ({utility_rate}% on-time)")
        else:
            feature_importance.append(FeatureImportanceItem(
                featureName="utilityBillOnTimeRate",
                displayName="Utility Payment Reliability",
                impact="negative",
                weight=20.0,
                description=f"Irregular utility bill payments ({utility_rate}% on-time rate)."
            ))
            top_risk_drivers.append(f"Below average utility bill payment consistency ({utility_rate}%)")

        # Signal 3: Debt-to-Income (DTI)
        if dti_ratio < 45:
            feature_importance.append(FeatureImportanceItem(
                featureName="debtToIncomeRatio",
                displayName="Debt-to-Income Capacity",
                impact="positive",
                weight=30.0,
                description=f"Healthy debt-to-income ratio ({dti_ratio}%)."
            ))
            top_positive_drivers.append(f"Strong debt coverage with DTI at {dti_ratio}%")
        else:
            feature_importance.append(FeatureImportanceItem(
                featureName="debtToIncomeRatio",
                displayName="Debt-to-Income Capacity",
                impact="negative",
                weight=30.0,
                description=f"Elevated debt service burden ({dti_ratio}% DTI)."
            ))
            top_risk_drivers.append(f"High debt-to-income ratio ({dti_ratio}%)")

        # Signal 4: Previous Defaults
        if defaults > 0:
            feature_importance.append(FeatureImportanceItem(
                featureName="previousDefaultsCount",
                displayName="Prior Default History",
                impact="negative",
                weight=25.0,
                description=f"Borrower has {defaults} recorded previous default(s)."
            ))
            top_risk_drivers.append(f"History of {defaults} prior loan default(s)")
        else:
            feature_importance.append(FeatureImportanceItem(
                featureName="previousDefaultsCount",
                displayName="Prior Default History",
                impact="positive",
                weight=15.0,
                description="Clean record with zero prior loan defaults."
            ))
            top_positive_drivers.append("Zero previous loan defaults recorded")

        # Signal 5: Mobile Recharge Spending
        if recharge >= 2000:
            feature_importance.append(FeatureImportanceItem(
                featureName="monthlyMobileRechargePKR",
                displayName="Mobile Top-Up Consistency",
                impact="positive",
                weight=10.0,
                description=f"Regular mobile recharge spending (PKR {recharge:,.0f}/mo)."
            ))

        # Default fallbacks for drivers if lists are short
        if not top_positive_drivers:
            top_positive_drivers.append("Stable micro-business occupation in local market")
        if not top_risk_drivers:
            top_risk_drivers.append("Informal income without formal tax return verification")

        return RiskAssessmentResponse(
            borrowerId=borrower.borrowerId,
            fullName=borrower.fullName or "Anonymous Borrower",
            creditScore=final_score,
            scaledCreditScore=scaled_score,
            riskTier=risk_tier,
            defaultRiskCategory=default_risk_cat,
            estimatedDefaultProbability=default_prob,
            recommendation=recommendation,
            maxApprovedLoanAmountPKR=float(max_approved_loan),
            financialMetrics=FinancialMetrics(
                disposableIncomePKR=round(disposable_income, 2),
                debtToIncomeRatio=dti_ratio,
                debtServiceCoverageRatio=dscr,
                totalMonthlyWalletTx=wallet_tx,
                utilityPaymentReliability=utility_rate
            ),
            scoreBreakdown=ScoreBreakdown(
                cashFlowScore=round(cash_flow_score, 1),
                digitalFootprintScore=round(digital_score, 1),
                utilityPaymentScore=round(utility_score, 1),
                repaymentHistoryScore=round(repayment_score, 1)
            ),
            topPositiveDrivers=top_positive_drivers,
            topRiskDrivers=top_risk_drivers,
            featureImportance=feature_importance
        )

    @staticmethod
    def get_sample_borrowers(limit: int = 5) -> List[Dict[str, Any]]:
        """
        Reads sample borrower profiles directly from the CSV dataset.
        """
        csv_path = _get_csv_path()
        if not csv_path.exists():
            raise FileNotFoundError(f"Mock dataset CSV file not found at: {csv_path}")

        df = pd.read_csv(csv_path)
        # Select first 'limit' rows
        sample_df = df.head(limit)
        
        # Replace NaN with default values
        sample_df = sample_df.fillna({
            "borrowerId": "LND-DEMO-000",
            "fullName": "Sample Borrower",
            "existingDebtPKR": 0,
            "previousDefaultsCount": 0
        })

        records = sample_df.to_dict(orient="records")
        return records
