"""
Shared model-loading and inference logic.

Both the FastAPI service (api.py) and the CLI script (predict_credit_model.py)
import from here, so there is exactly one place that knows how to turn raw
features into a score. Do not duplicate this logic elsewhere.
"""
from __future__ import annotations

import json
from functools import lru_cache
from pathlib import Path

import joblib
import pandas as pd
import shap

from feature_engineering import prepare_features

ARTIFACT_DIR = Path(__file__).resolve().parent / "artifacts"
PREPROCESSOR_PATH = ARTIFACT_DIR / "preprocessor.joblib"
MODEL_PATH = ARTIFACT_DIR / "best_model.joblib"
SUMMARY_PATH = ARTIFACT_DIR / "training_summary.json"


class ModelNotTrainedError(RuntimeError):
    pass


@lru_cache(maxsize=1)
def _load_summary() -> dict:
    if SUMMARY_PATH.exists():
        return json.loads(SUMMARY_PATH.read_text(encoding="utf-8"))
    return {}


@lru_cache(maxsize=1)
def load_artifacts():
    """Load preprocessor + model once per process, then cache them."""
    if not PREPROCESSOR_PATH.exists() or not MODEL_PATH.exists():
        raise ModelNotTrainedError(
            "Model artifacts not found. Run `python ml/train_credit_model.py` first."
        )
    preprocessor = joblib.load(PREPROCESSOR_PATH)
    model = joblib.load(MODEL_PATH)
    return preprocessor, model


def model_name() -> str:
    """Name of whichever model actually won training (was previously hardcoded)."""
    return _load_summary().get("best_model", "unknown")


def feature_row(payload: dict) -> pd.DataFrame:
    row = {
        "provider": payload.get("provider", "unknown"),
        "occupation": payload.get("occupation", "unknown"),
        "wallet_active_days_ratio_90d": float(
            payload.get("wallet_active_days_ratio_90d", 0.5)
        ),
        "wallet_txn_count_90d": float(payload.get("wallet_txn_count_90d", 30)),
        "wallet_txn_count_30d": float(payload.get("wallet_txn_count_30d", 10)),
        "wallet_days_since_last_txn": float(
            payload.get("wallet_days_since_last_txn", 5)
        ),
        "wallet_topup_count_90d": float(payload.get("wallet_topup_count_90d", 5)),
        "wallet_topup_avg_amount": float(
            payload.get("wallet_topup_avg_amount", 2000)
        ),
        "wallet_topup_frequency_per_month": float(
            payload.get("wallet_topup_frequency_per_month", 1.5)
        ),
        "wallet_bill_payment_count_90d": float(
            payload.get("wallet_bill_payment_count_90d", 3)
        ),
        "wallet_bill_payment_share": float(
            payload.get("wallet_bill_payment_share", 0.2)
        ),
        "wallet_distinct_billers_90d": float(
            payload.get("wallet_distinct_billers_90d", 2)
        ),
        "wallet_avg_balance": float(payload.get("wallet_avg_balance", 3000)),
        "wallet_inflow_outflow_ratio": float(
            payload.get("wallet_inflow_outflow_ratio", 1.0)
        ),
        "wallet_txn_amount_volatility": float(
            payload.get("wallet_txn_amount_volatility", 0.5)
        ),
    }
    # Same clean_data + engineer_features pass used at training time, so the
    # preprocessor sees an identical column set here as it did during fit().
    # See feature_engineering.py — this must not diverge from
    # train_credit_model.py's call to prepare_features().
    return prepare_features(pd.DataFrame([row]))


def score_to_band(score: int) -> tuple[str, str]:
    if score >= 750:
        return "Low Risk", "High"
    if score >= 650:
        return "Moderate Risk", "Medium"
    if score >= 550:
        return "Elevated Risk", "Moderate"
    return "High Risk", "Low"


def _shap_factors(preprocessor, model, X_processed, row: pd.DataFrame) -> list[dict[str, str]]:
    """Return the strongest default-risk drivers, grouped by input feature."""
    explainer = shap.TreeExplainer(model)
    shap_values = explainer.shap_values(X_processed)
    if isinstance(shap_values, list):
        shap_values = shap_values[1]

    values = shap_values[0]
    transformed_names = preprocessor.get_feature_names_out()
    source_columns = list(row.columns)
    grouped: dict[str, float] = {column: 0.0 for column in source_columns}

    for transformed_name, value in zip(transformed_names, values):
        name = transformed_name.split("__", 1)[-1]
        source = next(
            (column for column in source_columns if name == column or name.startswith(f"{column}_")),
            name,
        )
        grouped[source] = grouped.get(source, 0.0) + float(value)

    factors = sorted(grouped.items(), key=lambda item: abs(item[1]), reverse=True)[:5]
    return [
        {
            "name": name,
            "impact": (
                f"increases default risk ({value:+.3f})"
                if value > 0
                else f"decreases default risk ({value:+.3f})"
            ),
        }
        for name, value in factors
        if value != 0
    ]


def predict(payload: dict) -> dict:
    preprocessor, model = load_artifacts()
    row = feature_row(payload)

    X_processed = preprocessor.transform(row)
    prob_default = float(model.predict_proba(X_processed)[0, 1])
    top_factors = _shap_factors(preprocessor, model, X_processed, row)
    score = int(round(850 - (prob_default * 550)))
    score = max(300, min(850, score))

    risk_band, approval_chance = score_to_band(score)

    return {
        "score": score,
        "risk_band": risk_band,
        "approval_chance": approval_chance,
        "probability_default": round(prob_default, 4),
        "model_used": model_name(),
        "top_factors": top_factors,
    }