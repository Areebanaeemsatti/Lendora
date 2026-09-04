"""
Lendora Alternative-Data Credit Risk Model Training

Pipeline:
    1. Load dataset
    2. Run EDA
    3. Feature engineering
    4. Train/validation split
    5. Leakage-safe preprocessing
    6. 5-fold CV
    7. Train Logistic Regression, Random Forest,
       XGBoost and LightGBM
    8. Select threshold using OOF predictions
    9. Evaluate on validation set
    10. Select best model
    11. Save model + preprocessing + threshold + metadata
"""

from __future__ import annotations

import json
from pathlib import Path

import joblib
import numpy as np
import pandas as pd

from lightgbm import LGBMClassifier
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestClassifier
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression

from sklearn.metrics import (
    average_precision_score,
    f1_score,
    precision_score,
    recall_score,
    roc_auc_score,
)

from sklearn.model_selection import (
    StratifiedKFold,
    cross_val_predict,
    train_test_split,
)

from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler

from xgboost import XGBClassifier

from eda import run_eda
from feature_engineering import prepare_features


# ============================================================
# PATHS
# ============================================================

BASE_DIR = Path(__file__).resolve().parent

DATA_PATH = (
    BASE_DIR
    / "data"
    / "pk_alt_data_synthetic3.csv"
)

ARTIFACT_DIR = BASE_DIR / "artifacts"

TARGET_COLUMN = "default_label"
ID_COLUMN = "borrower_id"


# ============================================================
# LOAD DATASET
# ============================================================

def load_dataset() -> pd.DataFrame:

    if not DATA_PATH.exists():
        raise FileNotFoundError(
            f"Dataset not found at:\n{DATA_PATH}"
        )

    df = pd.read_csv(DATA_PATH)

    if TARGET_COLUMN not in df.columns:
        raise ValueError(
            f"Target column '{TARGET_COLUMN}' not found."
        )

    print("\nDataset loaded successfully.")
    print(f"Rows: {len(df)}")
    print(f"Columns: {len(df.columns)}")

    print("\nTarget distribution:")
    print(df[TARGET_COLUMN].value_counts())

    print("\nTarget percentage:")
    print(
        (
            df[TARGET_COLUMN]
            .value_counts(normalize=True)
            * 100
        ).round(2)
    )

    return df


# ============================================================
# PREPROCESSOR
# ============================================================

def build_preprocessor(X: pd.DataFrame):

    categorical_cols = X.select_dtypes(
        include=["object", "category"]
    ).columns.tolist()

    numeric_cols = [
        col
        for col in X.columns
        if col not in categorical_cols
    ]

    transformers = []

    # Numeric
    if numeric_cols:

        numeric_pipeline = Pipeline(
            steps=[
                (
                    "imputer",
                    SimpleImputer(strategy="median"),
                ),
                (
                    "scaler",
                    StandardScaler(),
                ),
            ]
        )

        transformers.append(
            (
                "numeric",
                numeric_pipeline,
                numeric_cols,
            )
        )

    # Categorical
    if categorical_cols:

        categorical_pipeline = Pipeline(
            steps=[
                (
                    "imputer",
                    SimpleImputer(
                        strategy="most_frequent"
                    ),
                ),
                (
                    "onehot",
                    OneHotEncoder(
                        handle_unknown="ignore"
                    ),
                ),
            ]
        )

        transformers.append(
            (
                "categorical",
                categorical_pipeline,
                categorical_cols,
            )
        )

    return ColumnTransformer(
        transformers=transformers,
        remainder="drop",
    )


# ============================================================
# BUILD MODEL PIPELINE
# ============================================================

def build_pipeline(model, X_train):

    preprocessor = build_preprocessor(X_train)

    return Pipeline(
        steps=[
            (
                "preprocessor",
                preprocessor,
            ),
            (
                "model",
                model,
            ),
        ]
    )


# ============================================================
# FIND BEST THRESHOLD
# ============================================================

def find_best_threshold(
    y_true,
    probabilities,
):

    thresholds = np.arange(
        0.10,
        0.91,
        0.01,
    )

    best_threshold = 0.50
    best_f1 = -1

    threshold_results = []

    for threshold in thresholds:

        predictions = (
            probabilities >= threshold
        ).astype(int)

        precision = precision_score(
            y_true,
            predictions,
            zero_division=0,
        )

        recall = recall_score(
            y_true,
            predictions,
            zero_division=0,
        )

        f1 = f1_score(
            y_true,
            predictions,
            zero_division=0,
        )

        threshold_results.append(
            {
                "threshold": float(threshold),
                "precision": float(precision),
                "recall": float(recall),
                "f1": float(f1),
            }
        )

        if f1 > best_f1:

            best_f1 = f1
            best_threshold = threshold

    return (
        float(best_threshold),
        threshold_results,
    )


# ============================================================
# EVALUATE
# ============================================================

def evaluate_model(
    y_true,
    probabilities,
    threshold,
):

    predictions = (
        probabilities >= threshold
    ).astype(int)

    return {
        "roc_auc": float(
            roc_auc_score(
                y_true,
                probabilities,
            )
        ),

        "pr_auc": float(
            average_precision_score(
                y_true,
                probabilities,
            )
        ),

        "precision": float(
            precision_score(
                y_true,
                predictions,
                zero_division=0,
            )
        ),

        "recall": float(
            recall_score(
                y_true,
                predictions,
                zero_division=0,
            )
        ),

        "f1": float(
            f1_score(
                y_true,
                predictions,
                zero_division=0,
            )
        ),

        "threshold": float(threshold),
    }


# ============================================================
# TRAIN
# ============================================================

def train_and_evaluate() -> dict:

    # --------------------------------------------------------
    # 1. LOAD
    # --------------------------------------------------------

    df = load_dataset()

    # --------------------------------------------------------
    # 2. EDA
    # --------------------------------------------------------

    print("\nRunning EDA...")

    ARTIFACT_DIR.mkdir(
        parents=True,
        exist_ok=True,
    )

    eda_report = run_eda(
        df,
        TARGET_COLUMN,
        ARTIFACT_DIR / "eda",
    )

    # --------------------------------------------------------
    # 3. TARGET
    # --------------------------------------------------------

    y = df[TARGET_COLUMN].astype(int)

    # --------------------------------------------------------
    # 4. FEATURES
    # --------------------------------------------------------

    feature_df = df.drop(
        columns=[TARGET_COLUMN],
        errors="ignore",
    )

    feature_df = feature_df.drop(
        columns=[ID_COLUMN],
        errors="ignore",
    )

    X = prepare_features(feature_df)

    print("\nFeatures used for training:")
    print(f"Total features: {len(X.columns)}")

    for feature in X.columns:
        print(f"  - {feature}")

    # --------------------------------------------------------
    # 5. TRAIN / VALIDATION SPLIT
    # --------------------------------------------------------

    X_train, X_valid, y_train, y_valid = train_test_split(
        X,
        y,
        test_size=0.20,
        random_state=42,
        stratify=y,
    )

    print("\nData split:")
    print(f"Training rows:   {len(X_train)}")
    print(f"Validation rows: {len(X_valid)}")

    # --------------------------------------------------------
    # 6. CLASS BALANCE
    # --------------------------------------------------------

    negative_count = int(
        (y_train == 0).sum()
    )

    positive_count = int(
        (y_train == 1).sum()
    )

    scale_pos_weight = (
        negative_count / positive_count
    )

    print("\nClass distribution:")
    print(
        f"Non-default: {negative_count}"
    )
    print(
        f"Default:     {positive_count}"
    )
    print(
        f"Scale pos weight: "
        f"{scale_pos_weight:.2f}"
    )

    # --------------------------------------------------------
    # 7. MODELS
    # --------------------------------------------------------

    models = {

        "logistic_regression":
            LogisticRegression(
                max_iter=2000,
                class_weight="balanced",
                random_state=42,
            ),

        "random_forest":
            RandomForestClassifier(
                n_estimators=400,
                max_depth=None,
                min_samples_leaf=2,
                class_weight="balanced",
                random_state=42,
                n_jobs=-1,
            ),

        "xgboost":
            XGBClassifier(
                n_estimators=400,
                max_depth=6,
                learning_rate=0.05,
                subsample=0.9,
                colsample_bytree=0.9,
                objective="binary:logistic",
                scale_pos_weight=scale_pos_weight,
                random_state=42,
                eval_metric="auc",
                n_jobs=-1,
            ),

        "lightgbm":
            LGBMClassifier(
                n_estimators=400,
                learning_rate=0.05,
                num_leaves=31,
                subsample=0.9,
                colsample_bytree=0.9,
                objective="binary",
                scale_pos_weight=scale_pos_weight,
                random_state=42,
                verbosity=-1,
                n_jobs=-1,
            ),
    }

    # --------------------------------------------------------
    # 8. CROSS VALIDATION
    # --------------------------------------------------------

    cv = StratifiedKFold(
        n_splits=5,
        shuffle=True,
        random_state=42,
    )

    results = {}
    trained_pipelines = {}

    # --------------------------------------------------------
    # 9. TRAIN + EVALUATE EACH MODEL
    # --------------------------------------------------------

    for name, model in models.items():

        print("\n" + "=" * 60)
        print(
            f"Training {name.upper()}"
        )
        print("=" * 60)

        pipeline = build_pipeline(
            model,
            X_train,
        )

        # ----------------------------------------------------
        # OOF probabilities
        #
        # IMPORTANT:
        # preprocessing is fitted separately inside each fold.
        # ----------------------------------------------------

        oof_proba = cross_val_predict(
            pipeline,
            X_train,
            y_train,
            cv=cv,
            method="predict_proba",
            n_jobs=-1,
        )[:, 1]

        oof_roc_auc = roc_auc_score(
            y_train,
            oof_proba,
        )

        oof_pr_auc = average_precision_score(
            y_train,
            oof_proba,
        )

        print(
            f"OOF ROC-AUC: {oof_roc_auc:.4f}"
        )

        print(
            f"OOF PR-AUC:  {oof_pr_auc:.4f}"
        )

        # ----------------------------------------------------
        # Find threshold using ONLY OOF predictions
        # ----------------------------------------------------

        best_threshold, threshold_results = (
            find_best_threshold(
                y_train,
                oof_proba,
            )
        )

        print(
            f"Selected threshold: "
            f"{best_threshold:.2f}"
        )

        # ----------------------------------------------------
        # Fit complete training pipeline
        # ----------------------------------------------------

        pipeline.fit(
            X_train,
            y_train,
        )

        # ----------------------------------------------------
        # Validation probabilities
        # ----------------------------------------------------

        valid_proba = pipeline.predict_proba(
            X_valid
        )[:, 1]

        # ----------------------------------------------------
        # Validation metrics
        # ----------------------------------------------------

        metrics = evaluate_model(
            y_valid,
            valid_proba,
            best_threshold,
        )

        metrics["oof_roc_auc"] = float(
            oof_roc_auc
        )

        metrics["oof_pr_auc"] = float(
            oof_pr_auc
        )

        results[name] = metrics

        trained_pipelines[name] = pipeline

        print(
            f"Validation ROC-AUC: "
            f"{metrics['roc_auc']:.4f}"
        )

        print(
            f"Validation PR-AUC:  "
            f"{metrics['pr_auc']:.4f}"
        )

        print(
            f"Precision: "
            f"{metrics['precision']:.4f}"
        )

        print(
            f"Recall:    "
            f"{metrics['recall']:.4f}"
        )

        print(
            f"F1:        "
            f"{metrics['f1']:.4f}"
        )

    # --------------------------------------------------------
    # 10. MODEL COMPARISON
    # --------------------------------------------------------

    print("\n" + "=" * 85)
    print("MODEL COMPARISON")
    print("=" * 85)

    header = (
        f"{'Model':<22}"
        f"{'OOF AUC':<12}"
        f"{'Val AUC':<12}"
        f"{'PR-AUC':<12}"
        f"{'Precision':<12}"
        f"{'Recall':<10}"
        f"{'F1':<10}"
        f"{'Threshold':<10}"
    )

    print(header)
    print("-" * 85)

    for name, metrics in results.items():

        print(
            f"{name:<22}"
            f"{metrics['oof_roc_auc']:<12.4f}"
            f"{metrics['roc_auc']:<12.4f}"
            f"{metrics['pr_auc']:<12.4f}"
            f"{metrics['precision']:<12.4f}"
            f"{metrics['recall']:<10.4f}"
            f"{metrics['f1']:<10.4f}"
            f"{metrics['threshold']:<10.2f}"
        )

    print("=" * 85)

    # --------------------------------------------------------
    # 11. SELECT BEST MODEL
    # --------------------------------------------------------
    #
    # Primary criterion:
    # validation ROC-AUC
    #
    # Secondary:
    # F1
    # --------------------------------------------------------

    best_model_name = max(
        results,
        key=lambda name: (
            results[name]["roc_auc"],
            results[name]["f1"],
        ),
    )

    best_pipeline = trained_pipelines[
        best_model_name
    ]

    best_threshold = results[
        best_model_name
    ]["threshold"]

    print("\n" + "=" * 60)
    print(
        f"BEST MODEL: "
        f"{best_model_name.upper()}"
    )
    print(
        f"BEST THRESHOLD: "
        f"{best_threshold:.2f}"
    )
    print("=" * 60)

    # --------------------------------------------------------
    # 12. SAVE COMPLETE PIPELINE
    # --------------------------------------------------------

    pipeline_path = (
        ARTIFACT_DIR
        / "best_model_pipeline.joblib"
    )

    joblib.dump(
        best_pipeline,
        pipeline_path,
    )

    # --------------------------------------------------------
    # 13. SAVE PREPROCESSOR + MODEL SEPARATELY
    # --------------------------------------------------------

    preprocessor = best_pipeline.named_steps[
        "preprocessor"
    ]

    final_model = best_pipeline.named_steps[
        "model"
    ]

    joblib.dump(
        preprocessor,
        ARTIFACT_DIR
        / "preprocessor.joblib",
    )

    joblib.dump(
        final_model,
        ARTIFACT_DIR
        / "best_model.joblib",
    )

    # --------------------------------------------------------
    # 14. SAVE THRESHOLD
    # --------------------------------------------------------

    threshold_path = (
        ARTIFACT_DIR
        / "decision_threshold.json"
    )

    threshold_path.write_text(
        json.dumps(
            {
                "threshold": best_threshold,
                "model": best_model_name,
            },
            indent=2,
        ),
        encoding="utf-8",
    )

    # --------------------------------------------------------
    # 15. SAVE METADATA
    # --------------------------------------------------------

    metadata = {

        "dataset": DATA_PATH.name,

        "target": TARGET_COLUMN,

        "dataset_type":
            "synthetic_alternative_financial_data",

        "train_rows": len(X_train),

        "validation_rows": len(X_valid),

        "best_model": best_model_name,

        "decision_threshold":
            best_threshold,

        "features_used":
            list(X.columns),

        "feature_count":
            len(X.columns),

        "scale_pos_weight":
            float(scale_pos_weight),

        "results":
            results,

        "eda_report_path":
            str(
                (
                    ARTIFACT_DIR
                    / "eda"
                    / "eda_report.md"
                ).relative_to(BASE_DIR)
            ),
    }

    summary_path = (
        ARTIFACT_DIR
        / "training_summary.json"
    )

    summary_path.write_text(
        json.dumps(
            metadata,
            indent=2,
        ),
        encoding="utf-8",
    )

    # --------------------------------------------------------
    # 16. ARTIFACT SUMMARY
    # --------------------------------------------------------

    print("\nArtifacts saved:")

    print(
        pipeline_path
    )

    print(
        ARTIFACT_DIR
        / "preprocessor.joblib"
    )

    print(
        ARTIFACT_DIR
        / "best_model.joblib"
    )

    print(
        threshold_path
    )

    print(
        summary_path
    )

    return metadata


# ============================================================
# MAIN
# ============================================================

if __name__ == "__main__":

    summary = train_and_evaluate()

    print("\nFinal Training Summary:")

    print(
        json.dumps(
            summary,
            indent=2,
        )
    )