from fastapi import APIRouter
from schemas.borrower import HealthResponse
from services.inference_service import InferenceService

router = APIRouter(tags=["Health Check"])


@router.get(
    "/health",
    response_model=HealthResponse,
    summary="Check API Service Health",
    description="Returns current operational status, service name, API version, and ML model status."
)
async def health_check():
    model_loaded = InferenceService._model is not None or InferenceService._tree_model is not None
    explainer_ready = InferenceService._explainer is not None
    model_used = InferenceService._model_name

    return HealthResponse(
        status="healthy",
        service="Lendora Credit Scoring API",
        version="3.0.0",
        environment="development",
        model_loaded=model_loaded,
        model_used=model_used,
        explainer_ready=explainer_ready
    )
