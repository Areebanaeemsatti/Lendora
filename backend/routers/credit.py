import logging
from typing import List, Dict, Any
from fastapi import APIRouter, HTTPException, Query, status
from schemas.borrower import BorrowerInput, RiskAssessmentResponse
from services.scoring_service import ScoringService
from exceptions import InvalidFinancialRangeException, MissingCrucialSignalException

logger = logging.getLogger("lendora.routers.credit")

router = APIRouter(prefix="/api/v1", tags=["Credit Assessment & Scoring"])


@router.post(
    "/score",
    response_model=RiskAssessmentResponse,
    status_code=status.HTTP_200_OK,
    summary="Assess Borrower Credit Risk with Trained ML Model & SHAP",
    description="""
Evaluates borrower alternative financial signals through Member 1's trained ML models,
runs real-time SHAP explainability to compute local feature contributions, and returns:
* **credit_score**: Scaled standard score (300 to 850)
* **risk_tier**: Low, Medium, or High Risk
* **default_probability**: Predicted default probability (0.0 to 1.0)
* **confidence_score**: Completeness and telemetry quality metric (0.0 to 1.0)
* **shap_explanations**: Structured feature contributions with directional impacts (+/- impact on score)
* **recommendation**: Underwriting action (e.g. Approve Micro-Loan, Manual Review, Decline)
* **top_positive_drivers**: Top 3 positive factors
* **top_negative_drivers**: Top 3 negative risk flags
"""
)
@router.post(
    "/credit/score",
    response_model=RiskAssessmentResponse,
    status_code=status.HTTP_200_OK,
    summary="Assess Borrower Credit Risk with Trained ML Model & SHAP (Portal Endpoint)",
    include_in_schema=True
)
async def assess_credit_score(borrower: BorrowerInput) -> RiskAssessmentResponse:
    try:
        assessment = ScoringService.calculate_score(borrower)
        return assessment
    except (InvalidFinancialRangeException, MissingCrucialSignalException):
        # Allow domain exceptions to bubble to registered FastAPI exception handlers
        raise
    except ValueError as ve:
        logger.warning(f"Validation anomaly during credit score evaluation: {ve}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid borrower input signal: {str(ve)}"
        )
    except Exception as e:
        logger.exception(f"Inference anomaly during credit score evaluation: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Inference engine anomaly: {str(e)}"
        )


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
        logger.exception(f"Failed to fetch sample borrower data: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch sample borrower data: {str(e)}"
        )
