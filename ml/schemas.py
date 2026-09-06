"""
Request/response contract for the Lendora ML service.

Backend and frontend teammates should treat this file as the source of
truth for what the /predict endpoint expects and returns. If the model's
input features change, update this file first.

IMPORTANT: `provider` and `occupation` values below are copied VERBATIM
from the training CSV's categorical values (pk_alt_data_synthetic3.csv).
The preprocessor's OneHotEncoder was fit on these exact strings with
handle_unknown="ignore" — any value that doesn't match exactly (wrong
casing, a synonym, etc.) is silently treated as "unknown" and zeroed
out, which quietly discards that feature's signal instead of raising
an error. If the dataset's category values change, update this list to
match and retrain.
"""
from __future__ import annotations

from typing import Literal, Optional

from pydantic import BaseModel, Field


class PredictRequest(BaseModel):
    """Applicant features the alternative-data model was trained on."""

    provider: Literal["Easypaisa", "JazzCash", "SadaPay", "NayaPay"] = Field(
        ..., example="JazzCash"
    )
    occupation: Literal[
        "small_shopkeeper",
        "rickshaw_driver",
        "delivery_rider",
        "daily_wage_laborer",
        "street_vendor",
        "domestic_worker",
    ] = Field(..., example="small_shopkeeper")

    wallet_active_days_ratio_90d: float = Field(
        ..., ge=0, le=1, example=0.8,
        description="Fraction of the last 90 days the wallet was active.",
    )
    wallet_txn_count_90d: float = Field(
        ..., ge=0, example=60,
        description="Total wallet transactions in the last 90 days.",
    )
    wallet_txn_count_30d: float = Field(
        ..., ge=0, example=25,
        description="Total wallet transactions in the last 30 days.",
    )
    wallet_days_since_last_txn: float = Field(
        ..., ge=0, example=2,
        description="Days since the wallet's most recent transaction.",
    )
    wallet_topup_count_90d: float = Field(
        ..., ge=0, example=10,
        description="Number of wallet top-ups in the last 90 days.",
    )
    wallet_topup_avg_amount: float = Field(
        ..., ge=0, example=3000,
        description="Average top-up amount (PKR) over the last 90 days.",
    )
    wallet_topup_frequency_per_month: float = Field(
        ..., ge=0, example=3,
        description="Average number of top-ups per month.",
    )
    wallet_bill_payment_count_90d: float = Field(
        ..., ge=0, example=12,
        description="Number of utility bill payments in the last 90 days.",
    )
    wallet_bill_payment_share: float = Field(
        ..., ge=0, le=1, example=0.3,
        description="Share of wallet transactions that are bill payments.",
    )
    wallet_distinct_billers_90d: float = Field(
        ..., ge=0, example=4,
        description="Distinct utility billers paid in the last 90 days.",
    )
    wallet_avg_balance: float = Field(
        ..., example=5000,
        description="Average wallet balance (PKR) over the observation window.",
    )
    wallet_inflow_outflow_ratio: float = Field(
        ..., ge=0, example=1.05,
        description="Ratio of money flowing in vs out of the wallet.",
    )
    wallet_txn_amount_volatility: float = Field(
        ..., ge=0, example=0.4,
        description="Normalized volatility of transaction amounts.",
    )


class TopFactor(BaseModel):
    name: str
    impact: str


class PredictResponse(BaseModel):
    score: int = Field(..., ge=300, le=850)
    risk_band: Literal["Low Risk", "Moderate Risk", "Elevated Risk", "High Risk"]
    approval_chance: Literal["High", "Medium", "Moderate", "Low"]
    probability_default: float
    decision_threshold: float
    predicted_default: Literal[0, 1]
    decision: Literal["Low Risk", "High Risk"]
    model_used: str
    top_factors: Optional[list[TopFactor]] = None


class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
    model_used: Optional[str] = None


class VerifyRequest(BaseModel):
    """Metadata about a submitted transaction receipt/screenshot, checked
    BEFORE the value is trusted as an input to scoring."""

    amount: float
    timestamp: str = Field(..., description="ISO 8601, e.g. 2026-08-20T14:30:00")
    reference: str
    provider: Literal["easypaisa", "jazzcash", "utility_bill"]
    exif_software_tag: Optional[str] = None
    ocr_amount: Optional[float] = None
    ocr_timestamp: Optional[str] = None


class VerifyResponse(BaseModel):
    verified: bool
    requires_manual_review: bool
    flags: list[str]