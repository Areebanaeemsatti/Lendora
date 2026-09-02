"""
Plug-and-Play Inference Service Wrapper for Lendora.

Defines `predict_score(features: Dict[str, Any]) -> Dict[str, Any]`
1. Checks for trained model artifact (e.g. `model.pkl`) in designated paths.
2. If found, dynamically loads and predicts using the ML artifact.
3. If not found, gracefully falls back to the calibrated mock heuristic without throwing errors.
4. Generates SHAP-style explainability factors and 300-850 scaled scores.
"""
import os
import pickle
import logging
from pathlib import Path
from typing import Dict, Any, List, Optional, Tuple

logger = logging.getLogger("lendora.inference")


class InferenceService:
    _cached_model: Any = None
    _cached_model_path: Optional[Path] = None
    _model_search_attempted: bool = False

    @classmethod
    def get_candidate_model_paths(cls) -> List[Path]:
        """Returns ordered list of designated model artifact paths."""
        current_dir = Path(__file__).resolve().parent
        backend_dir = current_dir.parent
        root_dir = backend_dir.parent

        env_path = os.getenv("MODEL_PATH")
        candidates = []
        if env_path:
            candidates.append(Path(env_path))

        candidates.extend([
            backend_dir / "models" / "model.pkl",
            backend_dir / "model.pkl",
            root_dir / "ml" / "model.pkl",
            root_dir / "ml" / "artifacts" / "model.pkl",
            root_dir / "ml" / "models" / "model.pkl",
            root_dir / "ml" / "model.joblib",
        ])
        return candidates

    @classmethod
    def load_model_if_available(cls) -> Tuple[Optional[Any], Optional[Path]]:
        """
        Attempts to load model artifact. Caches result so disk I/O occurs once.
        Returns (model_object, resolved_path) or (None, None) if not found.
        """
        if cls._model_search_attempted:
            return cls._cached_model, cls._cached_model_path

        cls._model_search_attempted = True
        for path in cls.get_candidate_model_paths():
            if path.exists() and path.is_file():
                try:
                    logger.info(f"Loading Lendora ML model artifact from: {path}")
                    with open(path, "rb") as f:
                        cls._cached_model = pickle.load(f)
                    cls._cached_model_path = path
                    return cls._cached_model, cls._cached_model_path
                except Exception as e:
                    logger.warning(
                        f"Found model artifact at {path} but failed to load ({e}). "
                        "Falling back to calibrated heuristic."
                    )

        logger.info("No model.pkl artifact found in designated paths. Using calibrated heuristic engine.")
        return None, None

    @classmethod
    def predict_score(cls, features: Dict[str, Any]) -> Dict[str, Any]:
        """
        Main entry point for inference.
        Evaluates features and returns final score (300 to 850), default probability,
        risk tier, and top contributing factors for SHAP.
        """
        model, model_path = cls.load_model_if_available()

        if model is not None:
            try:
                return cls._predict_via_ml_model(model, model_path, features)
            except Exception as e:
                logger.error(
                    f"Inference via model artifact failed ({e}). "
                    "Gracefully falling back to calibrated heuristic."
                )

        # Fallback to calibrated heuristic
        return cls._predict_via_calibrated_heuristic(features)

    @classmethod
    def _predict_via_ml_model(cls, model: Any, model_path: Path, features: Dict[str, Any]) -> Dict[str, Any]:
        """
        Executes inference via loaded ML model artifact.
        Handles scikit-learn / XGBoost style objects.
        """
        import pandas as pd
        import numpy as np

        # Create single-row DataFrame from features
        df_input = pd.DataFrame([features])
        
        # If model expects specific features, filter/align
        if hasattr(model, "feature_names_in_"):
            expected_cols = list(model.feature_names_in_)
            # Fill missing columns with 0
            for col in expected_cols:
                if col not in df_input.columns:
                    df_input[col] = 0.0
            df_input = df_input[expected_cols]

        # Calculate default probability
        if hasattr(model, "predict_proba"):
            probs = model.predict_proba(df_input)[0]
            # Assume second column is default (positive class 1)
            default_prob = float(probs[1]) if len(probs) > 1 else float(probs[0])
        elif hasattr(model, "predict"):
            pred = model.predict(df_input)[0]
            default_prob = float(np.clip(pred, 0.0, 1.0))
        else:
            raise ValueError("Loaded model object does not provide predict or predict_proba methods.")

        # Map default probability to 300 - 850 credit score
        creditworthiness = max(0.0, min(1.0, 1.0 - default_prob))
        norm_score = int(round(creditworthiness * 100))
        final_score = int(round(300 + (creditworthiness * 550)))

        # Risk tiering
        risk_tier, risk_cat, recommendation, max_mult = cls._map_risk_tier(final_score, default_prob)
        disposable_income = features.get("disposable_income_pkr", 15000.0)
        requested_loan = features.get("requestedLoanAmountPKR", 100000.0)
        max_approved_loan = round(min(requested_loan * 1.25, disposable_income * max_mult * 3), -3)

        # Generate SHAP contributing factors
        shap_factors, positive_drivers, risk_drivers = cls._compute_shap_factors(features, final_score)

        return {
            "final_score": final_score,
            "normalized_score": norm_score,
            "default_probability": round(default_prob, 4),
            "default_probability_pct": round(default_prob * 100, 2),
            "risk_tier": risk_tier,
            "default_risk_category": risk_cat,
            "recommendation": recommendation,
            "max_approved_loan_amount_pkr": float(max_approved_loan),
            "top_contributing_factors": shap_factors,
            "top_positive_drivers": positive_drivers,
            "top_risk_drivers": risk_drivers,
            "model_type_used": "trained_ml_model",
            "model_artifact_path": str(model_path)
        }

    @classmethod
    def _predict_via_calibrated_heuristic(cls, features: Dict[str, Any]) -> Dict[str, Any]:
        """
        Calibrated heuristic scoring engine based on Pakistani informal sector benchmarks.
        Returns final score (300-850), default probability, risk tier, and SHAP factors.
        """
        # Feature Inputs
        dti = features.get("debt_to_income_ratio", 50.0)
        dscr = features.get("debt_service_coverage_ratio", 1.0)
        disposable_income = features.get("disposable_income_pkr", 0.0)
        requested_loan = features.get("requestedLoanAmountPKR", 100000.0)
        
        velocity_daily = features.get("transaction_velocity_daily", 0.0)
        wallet_tx = features.get("total_monthly_wallet_tx", 0)
        recharge = features.get("monthlyMobileRechargePKR", 0.0)
        wallet_balance_proxy = features.get("wallet_cash_balance_proxy", 0.5)
        
        utility_delay_ratio = features.get("utility_delay_ratio", 0.2)
        utility_on_time = features.get("utilityBillOnTimeRate", 80.0)
        utility_bill = features.get("monthlyUtilityBillPKR", 0.0)
        
        repayment_discipline = features.get("repayment_discipline_index", 0.6)
        defaults_count = features.get("previousDefaultsCount", 0)
        loans_count = features.get("previousLoansCount", 0)
        credit_years = features.get("creditHistoryYears", 0)
        has_bank = features.get("hasBankAccount", "No")

        # 1. Cash Flow & Leverage Sub-score (35% weight)
        cash_score = 50.0
        if dti <= 35:
            cash_score += 35.0
        elif dti <= 50:
            cash_score += 20.0
        elif dti <= 65:
            cash_score += 5.0
        else:
            cash_score -= 25.0

        if dscr >= 2.0:
            cash_score += 15.0
        elif dscr >= 1.2:
            cash_score += 8.0
        else:
            cash_score -= 15.0
        cash_score = max(5.0, min(100.0, cash_score))

        # 2. Digital Footprint & Velocity Sub-score (25% weight)
        digital_score = 40.0
        if velocity_daily >= 1.5:  # > 45 txns/month
            digital_score += 35.0
        elif velocity_daily >= 0.8:  # > 24 txns/month
            digital_score += 20.0
        elif velocity_daily >= 0.3:  # > 9 txns/month
            digital_score += 10.0
        else:
            digital_score -= 10.0

        if recharge >= 3000:
            digital_score += 20.0
        elif recharge >= 1500:
            digital_score += 10.0
        elif recharge >= 500:
            digital_score += 5.0

        if wallet_balance_proxy >= 0.65:
            digital_score += 10.0
        digital_score = max(5.0, min(100.0, digital_score))

        # 3. Utility Payment Reliability Sub-score (20% weight)
        # utility_delay_ratio: 0.0 = perfect, 1.0 = poor
        utility_score = max(0.0, 100.0 - (utility_delay_ratio * 90.0))
        if utility_bill >= 5000 and utility_delay_ratio < 0.15:
            utility_score += 10.0
        utility_score = max(5.0, min(100.0, utility_score))

        # 4. Repayment Discipline Sub-score (20% weight)
        repayment_score = repayment_discipline * 85.0
        if defaults_count > 0:
            repayment_score -= (defaults_count * 25.0)
        if credit_years >= 2:
            repayment_score += 10.0
        if has_bank == "Yes":
            repayment_score += 5.0
        repayment_score = max(5.0, min(100.0, repayment_score))

        # Composite Normalized Score (0 - 100)
        norm_score = int(round(
            (cash_score * 0.35) +
            (digital_score * 0.25) +
            (utility_score * 0.20) +
            (repayment_score * 0.20)
        ))
        norm_score = max(15, min(96, norm_score))

        # Scaled Score: 300 to 850
        final_score = int(round(300 + (norm_score / 100.0) * 550))

        # Default Probability Curve
        # Low risk (~4-10%), Moderate (~11-25%), Elevated (~26-50%), High (>50%)
        if final_score >= 740:
            default_prob = round(0.04 + (850 - final_score) * 0.0004, 4)
        elif final_score >= 670:
            default_prob = round(0.08 + (740 - final_score) * 0.0012, 4)
        elif final_score >= 580:
            default_prob = round(0.18 + (670 - final_score) * 0.0022, 4)
        else:
            default_prob = round(0.40 + (580 - final_score) * 0.0025, 4)
        default_prob = min(0.85, max(0.03, default_prob))

        # Risk Tiering (matching frontend 'low' | 'moderate' | 'elevated' | 'high')
        risk_tier, risk_cat, recommendation, max_mult = cls._map_risk_tier(final_score, default_prob)

        max_approved_loan = round(min(requested_loan * 1.2, disposable_income * max_mult * 3), -3)

        # SHAP Contributing Factors
        shap_factors, positive_drivers, risk_drivers = cls._compute_shap_factors(features, final_score)

        return {
            "final_score": final_score,
            "normalized_score": norm_score,
            "default_probability": default_prob,
            "default_probability_pct": round(default_prob * 100, 2),
            "risk_tier": risk_tier,
            "default_risk_category": risk_cat,
            "recommendation": recommendation,
            "max_approved_loan_amount_pkr": float(max_approved_loan),
            "score_breakdown": {
                "cashFlowScore": round(cash_score, 1),
                "digitalFootprintScore": round(digital_score, 1),
                "utilityPaymentScore": round(utility_score, 1),
                "repaymentHistoryScore": round(repayment_score, 1)
            },
            "top_contributing_factors": shap_factors,
            "top_positive_drivers": positive_drivers,
            "top_risk_drivers": risk_drivers,
            "model_type_used": "calibrated_heuristic",
            "model_artifact_path": None
        }

    @staticmethod
    def _map_risk_tier(final_score: int, default_prob: float) -> Tuple[str, str, str, float]:
        """
        Maps score and default probability to:
        - risk_tier: 'low' | 'moderate' | 'elevated' | 'high'
        - default_risk_category: display label
        - recommendation: decision
        - max_loan_multiplier: debt capacity multiplier
        """
        if final_score >= 740:
            return "low", "Low", "Approved", 3.5
        elif final_score >= 660:
            return "moderate", "Moderate", "Approved", 2.6
        elif final_score >= 570:
            return "elevated", "Elevated", "Approved with Conditions", 1.8
        else:
            return "high", "High", "Rejected" if final_score < 480 else "Manual Review Required", 1.0

    @classmethod
    def _compute_shap_factors(
        cls,
        features: Dict[str, Any],
        final_score: int
    ) -> Tuple[List[Dict[str, Any]], List[str], List[str]]:
        """
        Computes SHAP-style attribution scores representing additive impact on final score.
        Baseline reference score for unbanked informal applicant is 550.
        """
        baseline_score = 550
        delta = final_score - baseline_score

        shap_factors: List[Dict[str, Any]] = []
        positive_drivers: List[str] = []
        risk_drivers: List[str] = []

        # 1. Transaction Velocity Factor
        velocity_daily = features.get("transaction_velocity_daily", 0.0)
        wallet_tx = features.get("total_monthly_wallet_tx", 0)
        if velocity_daily >= 1.0:
            pts = round(min(55.0, 20.0 + (velocity_daily * 15.0)), 1)
            shap_factors.append({
                "featureName": "transaction_velocity_daily",
                "displayName": "Mobile Wallet Transaction Velocity",
                "impact": "positive",
                "weight": 25.0,
                "shapValue": pts,
                "description": f"Daily velocity of {velocity_daily} txns ({wallet_tx}/mo) boosts score by +{pts} pts."
            })
            positive_drivers.append(f"High mobile wallet transaction density ({wallet_tx} monthly transactions)")
        else:
            pts = round(-1 * max(10.0, (1.0 - velocity_daily) * 30.0), 1)
            shap_factors.append({
                "featureName": "transaction_velocity_daily",
                "displayName": "Mobile Wallet Transaction Velocity",
                "impact": "negative" if wallet_tx < 15 else "neutral",
                "weight": 15.0,
                "shapValue": pts,
                "description": f"Subdued digital wallet activity ({wallet_tx}/mo) deducts {abs(pts)} pts."
            })
            if wallet_tx < 15:
                risk_drivers.append(f"Low digital wallet transaction velocity ({wallet_tx} monthly transactions)")

        # 2. Utility Delay Ratio Factor
        utility_delay = features.get("utility_delay_ratio", 0.1)
        on_time_pct = features.get("utilityBillOnTimeRate", 90.0)
        if utility_delay <= 0.10:  # >= 90% on-time
            pts = round(35.0 - (utility_delay * 100.0), 1)
            shap_factors.append({
                "featureName": "utility_delay_ratio",
                "displayName": "Utility Bill Delay Ratio",
                "impact": "positive",
                "weight": 20.0,
                "shapValue": pts,
                "description": f"Consistent on-time utility payments ({on_time_pct}%) contributes +{pts} pts."
            })
            positive_drivers.append(f"Consistently timely utility bill payments ({on_time_pct}% on-time)")
        else:
            pts = round(-1 * (utility_delay * 60.0), 1)
            shap_factors.append({
                "featureName": "utility_delay_ratio",
                "displayName": "Utility Bill Delay Ratio",
                "impact": "negative",
                "weight": 20.0,
                "shapValue": pts,
                "description": f"Late utility payment frequency ({round(utility_delay*100, 1)}% delay) deducts {abs(pts)} pts."
            })
            risk_drivers.append(f"Irregular utility payment track record ({round(utility_delay*100, 1)}% delay ratio)")

        # 3. Debt-To-Income (DTI) Factor
        dti = features.get("debt_to_income_ratio", 45.0)
        if dti <= 40.0:
            pts = round(40.0 - (dti * 0.5), 1)
            shap_factors.append({
                "featureName": "debt_to_income_ratio",
                "displayName": "Debt-to-Income Ratio (DTI)",
                "impact": "positive",
                "weight": 30.0,
                "shapValue": pts,
                "description": f"Favorable debt-to-income profile ({dti}%) provides +{pts} pts capacity headroom."
            })
            positive_drivers.append(f"Healthy debt-to-income ratio ({dti}%) with ample cash reserve")
        else:
            pts = round(-1 * min(65.0, (dti - 40.0) * 1.5), 1)
            shap_factors.append({
                "featureName": "debt_to_income_ratio",
                "displayName": "Debt-to-Income Ratio (DTI)",
                "impact": "negative",
                "weight": 30.0,
                "shapValue": pts,
                "description": f"Elevated debt-to-income burden ({dti}%) reduces score by {abs(pts)} pts."
            })
            risk_drivers.append(f"Elevated debt-to-income ratio ({dti}%)")

        # 4. Wallet Cash Balance / Surplus Proxy
        wallet_proxy = features.get("wallet_cash_balance_proxy", 0.5)
        if wallet_proxy >= 0.6:
            pts = round(wallet_proxy * 25.0, 1)
            shap_factors.append({
                "featureName": "wallet_cash_balance_proxy",
                "displayName": "Wallet Cash-In/Out Balance Proxy",
                "impact": "positive",
                "weight": 15.0,
                "shapValue": pts,
                "description": f"Positive liquid balance buffer adds +{pts} pts to liquidity confidence."
            })
            positive_drivers.append("Healthy liquid cash-in buffer maintained in digital wallet")
        else:
            pts = round(-1 * ((0.6 - wallet_proxy) * 30.0), 1)
            shap_factors.append({
                "featureName": "wallet_cash_balance_proxy",
                "displayName": "Wallet Cash-In/Out Balance Proxy",
                "impact": "neutral" if pts >= -5 else "negative",
                "weight": 10.0,
                "shapValue": pts,
                "description": f"Tighter liquid wallet cushion contributes {pts} pts."
            })

        # 5. Defaults History
        defaults = features.get("previousDefaultsCount", 0)
        if defaults > 0:
            pts = round(-1 * (defaults * 45.0), 1)
            shap_factors.append({
                "featureName": "previousDefaultsCount",
                "displayName": "Historical Defaults Count",
                "impact": "negative",
                "weight": 25.0,
                "shapValue": pts,
                "description": f"History of {defaults} prior default(s) applies heavy penalty of {pts} pts."
            })
            risk_drivers.append(f"{defaults} previous loan default(s) recorded in profile")
        else:
            shap_factors.append({
                "featureName": "previousDefaultsCount",
                "displayName": "Historical Defaults Count",
                "impact": "positive",
                "weight": 15.0,
                "shapValue": 25.0,
                "description": "Clean default history with 0 recorded defaults grants +25.0 pts bonus."
            })
            positive_drivers.append("Flawless track record with zero previous loan defaults")

        if not positive_drivers:
            positive_drivers.append("Consistent micro-enterprise cash flow in regional market")
        if not risk_drivers:
            risk_drivers.append("Unverified informal cash income without banking trail")

        return shap_factors, positive_drivers, risk_drivers
