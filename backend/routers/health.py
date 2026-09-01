from fastapi import APIRouter
from schemas.borrower import HealthResponse

router = APIRouter(tags=["Health Check"])


@router.get(
    "/health",
    response_model=HealthResponse,
    summary="Check API Service Health",
    description="Returns current operational status, service name, and API version."
)
async def health_check():
    return HealthResponse(
        status="healthy",
        service="Lendora Credit Scoring API",
        version="1.0.0",
        environment="development"
    )
