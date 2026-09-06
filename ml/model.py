"""
Shared model-loading and inference logic.

Used by:
- api.py
- predict_credit_model.py
"""

from __future__ import annotations

import json
from functools import lru_cache
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
import shap

from feature_engineering import prepare_features


# ============================================================
# PATHS
# ============================================================

ARTIFACT_DIR = Path(__file__).resolve().parent / "artifacts"

PREPROCESSOR_PATH = ARTIFACT_DIR / "preprocessor.joblib"
MODEL_PATH = ARTIFACT_DIR / "best_model.joblib"
SUMMARY_PATH = ARTIFACT_DIR / "training_summary.json"
THRESHOLD_PATH = ARTIFACT_DIR / "decision_threshold.json"
SHAP_BACKGROUND_PATH = ARTIFACT_DIR / "shap_background.joblib"


# ============================================================
# ERRORS
# ============================================================

class ModelNotTrainedError(RuntimeError):
    pass


# ============================================================
# LOAD TRAINING SUMMARY
# ============================================================

@lru_cache(maxsize=1)
def _load_summary() -> dict:

    if SUMMARY_PATH.exists():
        return json.loads(
            SUMMARY_PATH.read_text(
                encoding="utf-8"
            )
        )

    return {}


# ============================================================
# LOAD DECISION THRESHOLD
# ============================================================

@lru_cache(maxsize=1)
def _load_threshold() -> float:

    if THRESHOLD_PATH.exists():

        data = json.loads(
            THRESHOLD_PATH.read_text(
                encoding="utf-8"
            )
        )

        return float(
            data.get("threshold", 0.50)
        )

    # Fallback
    return 0.50


# ============================================================
# LOAD SHAP BACKGROUND SAMPLE
# ============================================================
#
# SHAP explains a prediction relative to a background
# distribution ("what does a typical borrower look like"), not
# relative to the row being predicted. This sample is a small,
# already-preprocessed slice of the TRAINING data saved by
# train_credit_model.py.

@lru_cache(maxsize=1)
def _load_shap_background():

    if SHAP_BACKGROUND_PATH.exists():
        return joblib.load(SHAP_BACKGROUND_PATH)

    return None


# ============================================================
# LOAD MODEL + PREPROCESSOR
# ============================================================

@lru_cache(maxsize=1)
def load_artifacts():

    if (
        not PREPROCESSOR_PATH.exists()
        or not MODEL_PATH.exists()
    ):

        raise ModelNotTrainedError(
            "Model artifacts not found. "
            "Run `python train_credit_model.py` first."
        )

    preprocessor = joblib.load(
        PREPROCESSOR_PATH
    )

    model = joblib.load(
        MODEL_PATH
    )

    return preprocessor, model


# ============================================================
# MODEL NAME
# ============================================================

def model_name() -> str:

    return _load_summary().get(
        "best_model",
        "unknown"
    )


# ============================================================
# CREATE INPUT ROW
# ============================================================

def feature_row(payload: dict) -> pd.DataFrame:

    row = {

        "provider":
            payload.get(
                "provider",
                "unknown"
            ),

        "occupation":
            payload.get(
                "occupation",
                "unknown"
            ),

        "wallet_active_days_ratio_90d":
            float(
                payload.get(
                    "wallet_active_days_ratio_90d",
                    0.5
                )
            ),

        "wallet_txn_count_90d":
            float(
                payload.get(
                    "wallet_txn_count_90d",
                    30
                )
            ),

        "wallet_txn_count_30d":
            float(
                payload.get(
                    "wallet_txn_count_30d",
                    10
                )
            ),

        "wallet_days_since_last_txn":
            float(
                payload.get(
                    "wallet_days_since_last_txn",
                    5
                )
            ),

        "wallet_topup_count_90d":
            float(
                payload.get(
                    "wallet_topup_count_90d",
                    5
                )
            ),

        "wallet_topup_avg_amount":
            float(
                payload.get(
                    "wallet_topup_avg_amount",
                    2000
                )
            ),

        "wallet_topup_frequency_per_month":
            float(
                payload.get(
                    "wallet_topup_frequency_per_month",
                    1.5
                )
            ),

        "wallet_bill_payment_count_90d":
            float(
                payload.get(
                    "wallet_bill_payment_count_90d",
                    3
                )
            ),

        "wallet_bill_payment_share":
            float(
                payload.get(
                    "wallet_bill_payment_share",
                    0.2
                )
            ),

        "wallet_distinct_billers_90d":
            float(
                payload.get(
                    "wallet_distinct_billers_90d",
                    2
                )
            ),

        "wallet_avg_balance":
            float(
                payload.get(
                    "wallet_avg_balance",
                    3000
                )
            ),

        "wallet_inflow_outflow_ratio":
            float(
                payload.get(
                    "wallet_inflow_outflow_ratio",
                    1.0
                )
            ),

        "wallet_txn_amount_volatility":
            float(
                payload.get(
                    "wallet_txn_amount_volatility",
                    0.5
                )
            ),
    }

    df = pd.DataFrame([row])

    # EXACT SAME feature engineering
    # used during training.
    return prepare_features(df)


# ============================================================
# CREDIT SCORE
# ============================================================

def calculate_score(prob_default: float) -> int:

    score = int(
        round(
            850 - (prob_default * 550)
        )
    )

    return max(
        300,
        min(
            850,
            score
        )
    )


# ============================================================
# RISK BAND
# ============================================================

def score_to_band(score: int):

    if score >= 750:
        return "Low Risk", "High"

    if score >= 650:
        return "Moderate Risk", "Medium"

    if score >= 550:
        return "Elevated Risk", "Moderate"

    return "High Risk", "Low"


# ============================================================
# SHAP EXPLAINER (built once, cached)
# ============================================================
#
# IMPORTANT: LinearExplainer's second argument is the BACKGROUND
# distribution ("what's a typical borrower"), not the row being
# explained. Passing the single row being predicted as its own
# background makes every SHAP value trivially zero. We use a
# background sample of real training rows saved by
# train_credit_model.py instead.

@lru_cache(maxsize=1)
def _get_explainer():

    preprocessor, model = load_artifacts()

    if model.__class__.__name__ == "LogisticRegression":

        background = _load_shap_background()

        if background is None:
            # Artifacts were trained before shap_background.joblib
            # existed. Explanations are disabled (not silently wrong)
            # until the model is retrained.
            return None

        return shap.LinearExplainer(
            model,
            background,
        )

    # Tree-based models don't need an external background sample.
    return shap.TreeExplainer(model)


# ============================================================
# SHAP EXPLANATION
# ============================================================

def _shap_factors(
    preprocessor,
    model,
    X_processed,
    row: pd.DataFrame,
) -> list[dict[str, str]]:

    try:

        explainer = _get_explainer()

        if explainer is None:

            return [
                {
                    "name": "explanation",
                    "impact": (
                        "SHAP explanation unavailable: retrain the "
                        "model to generate shap_background.joblib"
                    ),
                }
            ]

        shap_values = explainer.shap_values(
            X_processed
        )

        # SHAP's return shape for binary classifiers has changed
        # across versions:
        #   - older API: list of 2 arrays, one per class,
        #     each shaped (n_samples, n_features)
        #   - newer API (e.g. shap>=0.45 TreeExplainer): single
        #     ndarray shaped (n_samples, n_features, n_classes)
        # Both are normalized here to a single 1-D array of
        # per-feature contributions toward the POSITIVE class,
        # for the one row being explained.

        shap_values = np.asarray(
            shap_values[1]
            if isinstance(shap_values, list)
            else shap_values
        )

        if shap_values.ndim == 3:
            # (n_samples, n_features, n_classes) -> positive class
            values = shap_values[0, :, 1]
        else:
            # (n_samples, n_features)
            values = shap_values[0]

        transformed_names = (
            preprocessor
            .get_feature_names_out()
        )

        source_columns = list(
            row.columns
        )

        grouped = {
            column: 0.0
            for column in source_columns
        }

        for transformed_name, value in zip(
            transformed_names,
            values
        ):

            name = transformed_name.split(
                "__",
                1
            )[-1]

            source = next(
                (
                    column
                    for column in source_columns
                    if (
                        name == column
                        or name.startswith(
                            f"{column}_"
                        )
                    )
                ),
                name,
            )

            grouped[source] = (
                grouped.get(source, 0.0)
                + float(value)
            )

        factors = sorted(
            grouped.items(),
            key=lambda item: abs(item[1]),
            reverse=True,
        )[:5]

        return [

            {
                "name": name,

                "impact": (
                    f"increases default risk ({value:+.3f})"
                    if value > 0
                    else
                    f"decreases default risk ({value:+.3f})"
                ),
            }

            for name, value in factors

            if value != 0
        ]

    except Exception as exc:

        # Prediction should NOT fail just because
        # explanation generation failed.

        return [
            {
                "name": "explanation",
                "impact": (
                    f"SHAP explanation unavailable: "
                    f"{type(exc).__name__}"
                ),
            }
        ]


# ============================================================
# PREDICTION
# ============================================================

def predict(payload: dict) -> dict:

    preprocessor, model = load_artifacts()

    # Create exact training-compatible feature row
    row = feature_row(payload)

    # Preprocess
    X_processed = preprocessor.transform(
        row
    )

    # Default probability
    prob_default = float(
        model.predict_proba(
            X_processed
        )[0, 1]
    )

    # Load threshold selected during training
    threshold = _load_threshold()

    # Final classification
    prediction = int(
        prob_default >= threshold
    )

    # Credit score
    score = calculate_score(
        prob_default
    )

    # Risk band
    risk_band, approval_chance = score_to_band(
        score
    )

    # Explain prediction
    top_factors = _shap_factors(
        preprocessor,
        model,
        X_processed,
        row,
    )

    return {

        "score": score,

        "risk_band": risk_band,

        "approval_chance": approval_chance,

        "probability_default": round(
            prob_default,
            4
        ),

        "decision_threshold": round(
            threshold,
            2
        ),

        "predicted_default": prediction,

        "decision": (
            "High Risk"
            if prediction == 1
            else "Low Risk"
        ),

        "model_used": model_name(),

        "top_factors": top_factors,
    }