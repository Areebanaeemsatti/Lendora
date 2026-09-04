"""
Feature engineering for Lendora alternative-data credit risk model.

Shared by:
- train_credit_model.py
- model.py

All transformations are row-independent.
"""

from __future__ import annotations

import numpy as np
import pandas as pd


TARGET_COLUMN = "default_label"


# ============================================================
# CLEAN DATA
# ============================================================

def clean_data(df: pd.DataFrame) -> pd.DataFrame:
    """
    Clean raw Lendora alternative-data features.
    """

    df = df.copy()

    # Replace infinity with NaN
    df = df.replace([np.inf, -np.inf], np.nan)

    # Features that cannot logically be negative
    non_negative_columns = [
        "wallet_active_days_ratio_90d",
        "wallet_txn_count_90d",
        "wallet_txn_count_30d",
        "wallet_days_since_last_txn",
        "wallet_topup_count_90d",
        "wallet_topup_avg_amount",
        "wallet_topup_frequency_per_month",
        "wallet_bill_payment_count_90d",
        "wallet_bill_payment_share",
        "wallet_distinct_billers_90d",
        "wallet_avg_balance",
        "wallet_inflow_outflow_ratio",
        "wallet_txn_amount_volatility",
    ]

    for column in non_negative_columns:
        if column in df.columns:
            df.loc[df[column] < 0, column] = np.nan

    # Natural upper bounds
    if "wallet_active_days_ratio_90d" in df.columns:
        df.loc[
            df["wallet_active_days_ratio_90d"] > 1,
            "wallet_active_days_ratio_90d",
        ] = np.nan

    if "wallet_bill_payment_share" in df.columns:
        df.loc[
            df["wallet_bill_payment_share"] > 1,
            "wallet_bill_payment_share",
        ] = np.nan

    return df


# ============================================================
# FEATURE ENGINEERING
# ============================================================

def engineer_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Create a compact set of useful domain-informed features.

    We intentionally avoid creating many redundant mathematical
    transformations. This keeps the model simpler and reduces
    unnecessary feature correlation.
    """

    df = df.copy()

    # ---------------------------------------------------------
    # 1. Recent transaction activity
    # ---------------------------------------------------------

    if {
        "wallet_txn_count_30d",
        "wallet_txn_count_90d",
    }.issubset(df.columns):

        denominator = df["wallet_txn_count_90d"].clip(lower=1)

        df["recent_txn_activity_ratio"] = (
            df["wallet_txn_count_30d"] / denominator
        ).clip(lower=0, upper=1)

    # ---------------------------------------------------------
    # 2. Transaction recency
    # ---------------------------------------------------------

    if "wallet_days_since_last_txn" in df.columns:

        df["recent_transaction_flag"] = (
            df["wallet_days_since_last_txn"] <= 7
        ).astype(int)

        df["txn_recency_score"] = (
            1
            / (
                1
                + df["wallet_days_since_last_txn"].clip(lower=0)
            )
        )

    # ---------------------------------------------------------
    # 3. Top-up behaviour
    # ---------------------------------------------------------

    if {
        "wallet_topup_count_90d",
        "wallet_txn_count_90d",
    }.issubset(df.columns):

        denominator = df["wallet_txn_count_90d"].clip(lower=1)

        df["topup_to_transaction_ratio"] = (
            df["wallet_topup_count_90d"] / denominator
        )

    if {
        "wallet_topup_count_90d",
        "wallet_topup_avg_amount",
    }.issubset(df.columns):

        estimated_volume = (
            df["wallet_topup_count_90d"]
            * df["wallet_topup_avg_amount"]
        )

        df["estimated_topup_volume_log"] = np.log1p(
            estimated_volume.clip(lower=0)
        )

    # ---------------------------------------------------------
    # 4. Bill payment behaviour
    # ---------------------------------------------------------

    if {
        "wallet_bill_payment_count_90d",
        "wallet_txn_count_90d",
    }.issubset(df.columns):

        denominator = df["wallet_txn_count_90d"].clip(lower=1)

        df["bill_payment_txn_ratio"] = (
            df["wallet_bill_payment_count_90d"]
            / denominator
        )

    if {
        "wallet_bill_payment_share",
        "wallet_distinct_billers_90d",
    }.issubset(df.columns):

        biller_norm = (
            df["wallet_distinct_billers_90d"]
            .clip(lower=0)
            / 5
        ).clip(upper=1)

        df["bill_payment_consistency"] = (
            df["wallet_bill_payment_share"].fillna(0)
            * biller_norm
        )

    # ---------------------------------------------------------
    # 5. Balance behaviour
    # ---------------------------------------------------------

    if "wallet_avg_balance" in df.columns:

        df["avg_balance_log"] = np.log1p(
            df["wallet_avg_balance"].clip(lower=0)
        )

        df["low_balance_flag"] = (
            df["wallet_avg_balance"] <= 0
        ).astype(int)

    # ---------------------------------------------------------
    # 6. Cash-flow behaviour
    # ---------------------------------------------------------

    if "wallet_inflow_outflow_ratio" in df.columns:

        df["balanced_cashflow_flag"] = (
            df["wallet_inflow_outflow_ratio"]
            .between(0.8, 1.2)
        ).astype(int)

        df["cashflow_stress_flag"] = (
            df["wallet_inflow_outflow_ratio"] < 0.8
        ).astype(int)

    # ---------------------------------------------------------
    # 7. Transaction volatility
    # ---------------------------------------------------------

    if "wallet_txn_amount_volatility" in df.columns:

        # IMPORTANT:
        # volatility is raw standard deviation in the dataset.
        # We do NOT use volatility > 1 anymore.

        df["txn_volatility_log"] = np.log1p(
            df["wallet_txn_amount_volatility"].clip(lower=0)
        )

    # ---------------------------------------------------------
    # 8. Transaction intensity
    # ---------------------------------------------------------

    if {
        "wallet_txn_count_90d",
        "wallet_active_days_ratio_90d",
    }.issubset(df.columns):

        active_days = (
            df["wallet_active_days_ratio_90d"] * 90
        ).clip(lower=1)

        df["transactions_per_active_day"] = (
            df["wallet_txn_count_90d"] / active_days
        )

    return df


# ============================================================
# FINAL FEATURE SELECTION
# ============================================================

SELECTED_FEATURES = [
    # --------------------------------------------------------
    # Original 13 features
    # --------------------------------------------------------
    "provider",
    "occupation",
    "wallet_active_days_ratio_90d",
    "wallet_txn_count_90d",
    "wallet_txn_count_30d",
    "wallet_days_since_last_txn",
    "wallet_topup_count_90d",
    "wallet_topup_avg_amount",
    "wallet_topup_frequency_per_month",
    "wallet_bill_payment_count_90d",
    "wallet_bill_payment_share",
    "wallet_distinct_billers_90d",
    "wallet_avg_balance",
    "wallet_inflow_outflow_ratio",
    "wallet_txn_amount_volatility",

    # --------------------------------------------------------
    # Selected engineered features
    # --------------------------------------------------------
    "recent_txn_activity_ratio",
    "recent_transaction_flag",
    "txn_recency_score",
    "topup_to_transaction_ratio",
    "estimated_topup_volume_log",
    "bill_payment_txn_ratio",
    "bill_payment_consistency",
    "avg_balance_log",
    "cashflow_stress_flag",
    "txn_volatility_log",
    "transactions_per_active_day",
]


def prepare_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Full feature engineering pipeline.

    raw data
        ↓
    clean_data()
        ↓
    engineer_features()
        ↓
    selected features
    """

    df = clean_data(df)

    df = engineer_features(df)

    # Keep only features that actually exist
    available_features = [
        feature
        for feature in SELECTED_FEATURES
        if feature in df.columns
    ]

    return df[available_features].copy()