from typing import List, Dict, Any
from fastapi import APIRouter, HTTPException, Query, status
from schemas.borrower import BorrowerInput, RiskAssessmentResponse
from services.scoring_service import ScoringService
from exceptions import InvalidFinancialRangeException, MissingCrucialSignalException

router = APIRouter(prefix="/api/v1", tags=["Credit Assessment & Scoring"])


@router.post(
    "/score",
    response_model=RiskAssessmentResponse,
    status_code=status.HTTP_200_OK,
    summary="Assess Borrower Credit Risk & Generate Scorecard",
    description="""
Processes borrower financial signals through the feature engineering pipeline
(validating domain constraints and computing transaction velocity, utility delay ratio, and wallet liquidity balance),
runs inference via plug-and-play ML model or calibrated heuristic fallback, and returns a comprehensive scorecard
with 300-850 credit scores and SHAP explainability factors.
"""
)
async def assess_credit_score(borrower: BorrowerInput) -> RiskAssessmentResponse:
    # Any InvalidFinancialRangeException or MissingCrucialSignalException
    # will bubble to FastAPI custom exception handlers for structured 422/400 responses.
    assessment = ScoringService.calculate_score(borrower)
    return assessment


@router.get(
    "/samples",
    response_model=List[Dict[str, Any]],
    status_code=status.HTTP_200_OK,
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
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch sample borrower data: {str(e)}"
        )
