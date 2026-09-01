from typing import List, Dict, Any
from fastapi import APIRouter, HTTPException, Query
from schemas.borrower import BorrowerInput, RiskAssessmentResponse
from services.scoring_service import ScoringService

router = APIRouter(prefix="/api/v1", tags=["Credit Assessment & Scoring"])


@router.post(
    "/score",
    response_model=RiskAssessmentResponse,
    summary="Assess Borrower Credit Risk & Score",
    description="""
Accepts borrower financial signals (cash flow, mobile wallet activity, utility reliability, credit history),
runs Pydantic validation, and returns a detailed risk assessment scorecard including normalized score,
risk tier, estimated default probability, financial ratios, and feature importance drivers.
"""
)
async def assess_credit_score(borrower: BorrowerInput) -> RiskAssessmentResponse:
    try:
        assessment = ScoringService.calculate_score(borrower)
        return assessment
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred while evaluating credit score: {str(e)}"
        )


@router.get(
    "/samples",
    response_model=List[Dict[str, Any]],
    summary="Get Sample Borrower Profiles for Testing",
    description="""
Reads 3 to 5 realistic borrower profiles directly from the mock CSV dataset (lendora_demo_borrowers_50.csv)
so the frontend can immediately fetch and display test data.
"""
)
async def get_sample_borrowers(
    limit: int = Query(5, ge=1, le=10, description="Number of sample borrower profiles to retrieve (default: 5)")
) -> List[Dict[str, Any]]:
    try:
        samples = ScoringService.get_sample_borrowers(limit=limit)
        return samples
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch sample borrower data: {str(e)}"
        )
