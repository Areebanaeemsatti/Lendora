"""
Request/response contract for the Lendora ML service.

Backend and frontend teammates should treat this file as the source of
truth for what the /predict endpoint expects and returns. If the model's
input features change, update this file first.
"""
from __future__ import annotations

from typing import Literal, Optional

from pydantic import BaseModel, Field


class PredictRequest(BaseModel):
    """Applicant features the model was trained on (current baseline model)."""

    person_age: float = Field(..., ge=18, le=100, example=28)
    person_income: float = Field(..., ge=0, example=45000)
    person_home_ownership: Literal["RENT", "OWN", "MORTGAGE", "OTHER"] = "RENT"
    person_emp_length: float = Field(..., ge=0, example=3)
    loan_intent: Literal[
        "PERSONAL", "EDUCATION", "MEDICAL", "VENTURE", "HOMEIMPROVEMENT", "DEBTCONSOLIDATION"
    ] = "PERSONAL"
    loan_grade: Literal["A", "B", "C", "D", "E", "F", "G"] = "C"
    loan_amnt: float = Field(..., ge=0, example=15000)
    loan_int_rate: float = Field(..., ge=0, example=12.5)
    loan_percent_income: float = Field(..., ge=0, le=1, example=0.2)
    cb_person_default_on_file: Literal["Y", "N"] = "N"
    cb_person_cred_hist_length: float = Field(..., ge=0, example=3)


class TopFactor(BaseModel):
    name: str
    impact: str


class PredictResponse(BaseModel):
    score: int = Field(..., ge=300, le=850)
    risk_band: Literal["Low Risk", "Moderate Risk", "Elevated Risk", "High Risk"]
    approval_chance: Literal["High", "Medium", "Moderate", "Low"]
    probability_default: float
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
