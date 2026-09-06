from pathlib import Path
from typing import List, Dict, Any, Union
import pandas as pd

from schemas.borrower import (
    BorrowerInput,
    RiskAssessmentResponse,
    FinancialMetrics,
    ScoreBreakdown,
    FeatureImportanceItem,
    ShapExplanation
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

        # Step 2: Inference via Model Artifact & SHAP Explainer
        pred = InferenceService.predict_score(features)

        # Step 3: Parse SHAP Explanations
        shap_explanations_list: List[ShapExplanation] = []
        for exp in pred.get("shap_explanations", []):
            shap_explanations_list.append(
                ShapExplanation(
                    feature_name=exp.get("feature_name", "signal"),
                    raw_value=exp.get("raw_value", "-"),
                    impact=float(exp.get("impact", 0.0)),
                    direction=exp.get("direction", "positive"),
                    explanation=exp.get("explanation", "")
                )
            )

        # Step 4: Parse Backward-Compatible Feature Importance Items
        feature_importance_items: List[FeatureImportanceItem] = []
        for factor in pred.get("feature_importance_items", []):
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

        # Step 5: Parse Score Breakdown
        breakdown_dict = pred.get("score_breakdown", {
            "cashFlowScore": 75.0,
            "digitalFootprintScore": 75.0,
            "utilityPaymentScore": 75.0,
            "repaymentHistoryScore": 75.0
        })

        credit_score_300_850 = pred["credit_score"]
        norm_score_0_100 = pred["normalized_score"]
        risk_tier_str = pred["risk_tier"]  # e.g. "Low Risk", "Medium Risk", "High Risk"
        risk_tier_legacy = "low" if "low" in risk_tier_str.lower() else ("high" if "high" in risk_tier_str.lower() else "moderate")

        top_pos = pred.get("top_positive_drivers", [])
        top_neg = pred.get("top_negative_drivers", [])

        # Step 6: Construct Response satisfying both Step 3 & existing UI contracts
        return RiskAssessmentResponse(
            # Step 3 Required Core Contract Fields
            credit_score=credit_score_300_850,
            risk_tier=risk_tier_str,
            default_probability=pred["default_probability"],
            confidence_score=pred["confidence_score"],
            shap_explanations=shap_explanations_list,
            shap_values=[
                {
                    "feature_name": exp.feature_name,
                    "featureName": exp.feature_name,
                    "raw_value": exp.raw_value,
                    "impact": exp.impact,
                    "direction": exp.direction,
                    "explanation": exp.explanation,
                }
                for exp in shap_explanations_list
            ],
            recommendation=pred["recommendation"],
            top_positive_drivers=top_pos,
            top_negative_drivers=top_neg,

            # Backward-compatible fields
            borrowerId=features.get("borrowerId"),
            fullName=features.get("fullName", "Anonymous Borrower"),
            creditScore=norm_score_0_100,
            scaledCreditScore=credit_score_300_850,
            riskTier=risk_tier_legacy,
            defaultRiskCategory=pred.get("risk_band", risk_tier_str),
            estimatedDefaultProbability=pred["default_probability_pct"],
            maxApprovedLoanAmountPKR=pred["max_approved_loan_amount_pkr"],
            financialMetrics=FinancialMetrics(
                disposableIncomePKR=features.get("disposable_income_pkr", 0.0),
                debtToIncomeRatio=features.get("debt_to_income_ratio", 0.0),
                debtServiceCoverageRatio=features.get("debt_service_coverage_ratio", 0.0),
                totalMonthlyWalletTx=features.get("total_monthly_wallet_tx", 0),
                utilityPaymentReliability=features.get("utilityBillOnTimeRate", 0.0),
                transactionVelocityDaily=features.get("transaction_velocity_daily", 0.0),
                utilityDelayRatio=features.get("utility_delay_ratio", 0.0),
                walletCashBalanceProxy=features.get("wallet_cash_balance_proxy", 0.0)
            ),
            scoreBreakdown=ScoreBreakdown(
                cashFlowScore=breakdown_dict.get("cashFlowScore", 70.0),
                digitalFootprintScore=breakdown_dict.get("digitalFootprintScore", 70.0),
                utilityPaymentScore=breakdown_dict.get("utilityPaymentScore", 70.0),
                repaymentHistoryScore=breakdown_dict.get("repaymentHistoryScore", 70.0)
            ),
            topPositiveDrivers=top_pos,
            topRiskDrivers=top_neg,
            featureImportance=feature_importance_items,
            modelTypeUsed=pred.get("model_type_used", "trained_ml_model"),
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
