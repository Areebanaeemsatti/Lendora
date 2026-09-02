from pathlib import Path
from typing import List, Dict, Any, Union
import pandas as pd

from schemas.borrower import (
    BorrowerInput,
    RiskAssessmentResponse,
    FinancialMetrics,
    ScoreBreakdown,
    FeatureImportanceItem
)
from services.feature_engineering import FeatureEngineeringService
from services.inference_service import InferenceService


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
    return path_candidates[0]


class ScoringService:

    @staticmethod
    def calculate_score(borrower: Union[BorrowerInput, Dict[str, Any]]) -> RiskAssessmentResponse:
        """
        Coordinates feature engineering, validation, inference via model or heuristic,
        and packages the structured risk assessment scorecard.
        """
        # Step 1: Feature Engineering & Edge-Case Validation
        features = FeatureEngineeringService.process_features(borrower)

        # Step 2: Inference via Model Artifact or Calibrated Heuristic Fallback
        pred = InferenceService.predict_score(features)

        # Step 3: Parse Feature Importance / SHAP Items
        feature_importance_items: List[FeatureImportanceItem] = []
        for factor in pred.get("top_contributing_factors", []):
            feature_importance_items.append(
                FeatureImportanceItem(
                    featureName=factor.get("featureName", "signal"),
                    displayName=factor.get("displayName", "Signal"),
                    impact=factor.get("impact", "neutral"),
                    weight=factor.get("weight", 0.0),
                    shapValue=factor.get("shapValue", 0.0),
                    description=factor.get("description", "")
                )
            )

        # Step 4: Parse Score Breakdown
        breakdown_dict = pred.get("score_breakdown", {
            "cashFlowScore": 75.0,
            "digitalFootprintScore": 75.0,
            "utilityPaymentScore": 75.0,
            "repaymentHistoryScore": 75.0
        })

        # Step 5: Construct Response
        return RiskAssessmentResponse(
            borrowerId=features.get("borrowerId"),
            fullName=features.get("fullName", "Anonymous Borrower"),
            creditScore=pred["normalized_score"],
            scaledCreditScore=pred["final_score"],
            riskTier=pred["risk_tier"],
            defaultRiskCategory=pred["default_risk_category"],
            estimatedDefaultProbability=pred["default_probability_pct"],
            recommendation=pred["recommendation"],
            maxApprovedLoanAmountPKR=pred["max_approved_loan_amount_pkr"],
            financialMetrics=FinancialMetrics(
                disposableIncomePKR=features["disposable_income_pkr"],
                debtToIncomeRatio=features["debt_to_income_ratio"],
                debtServiceCoverageRatio=features["debt_service_coverage_ratio"],
                totalMonthlyWalletTx=features["total_monthly_wallet_tx"],
                utilityPaymentReliability=features["utilityBillOnTimeRate"],
                transactionVelocityDaily=features["transaction_velocity_daily"],
                utilityDelayRatio=features["utility_delay_ratio"],
                walletCashBalanceProxy=features["wallet_cash_balance_proxy"]
            ),
            scoreBreakdown=ScoreBreakdown(
                cashFlowScore=breakdown_dict.get("cashFlowScore", 70.0),
                digitalFootprintScore=breakdown_dict.get("digitalFootprintScore", 70.0),
                utilityPaymentScore=breakdown_dict.get("utilityPaymentScore", 70.0),
                repaymentHistoryScore=breakdown_dict.get("repaymentHistoryScore", 70.0)
            ),
            topPositiveDrivers=pred.get("top_positive_drivers", []),
            topRiskDrivers=pred.get("top_risk_drivers", []),
            featureImportance=feature_importance_items,
            modelTypeUsed=pred.get("model_type_used", "calibrated_heuristic"),
            derivedFeatures={
                "transaction_velocity_daily": features.get("transaction_velocity_daily"),
                "transaction_velocity_weekly": features.get("transaction_velocity_weekly"),
                "utility_delay_ratio": features.get("utility_delay_ratio"),
                "wallet_cash_balance_proxy": features.get("wallet_cash_balance_proxy"),
                "debt_service_coverage_ratio": features.get("debt_service_coverage_ratio"),
                "repayment_discipline_index": features.get("repayment_discipline_index"),
                "digital_footprint_index": features.get("digital_footprint_index"),
            }
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
        sample_df = df.head(limit)
        sample_df = sample_df.fillna({
            "borrowerId": "LND-DEMO-000",
            "fullName": "Sample Borrower",
            "existingDebtPKR": 0,
            "previousDefaultsCount": 0
        })

        records = sample_df.to_dict(orient="records")
        return records
