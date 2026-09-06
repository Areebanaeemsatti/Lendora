import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from routers.health import router as health_router
from routers.credit import router as credit_router
from exceptions import InvalidFinancialRangeException, MissingCrucialSignalException
from services.inference_service import InferenceService

# Configure Logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("lendora.main")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    FastAPI lifespan handler:
    Loads trained ML model artifacts, preprocessing pipeline, and SHAP explainer
    into memory during server startup.
    """
    logger.info("Initializing Lendora backend service...")
    try:
        InferenceService.initialize_engine()
        logger.info("Machine Learning inference engine and SHAP explainers loaded successfully.")
    except Exception as e:
        logger.warning(f"Engine initialization notice: {e}. Will lazily initialize on request.")
    yield
    logger.info("Shutting down Lendora backend service...")


app = FastAPI(
    title="Lendora Alternative Credit Scoring API",
    description="""
### Lendora Backend Services - Step 3 Full ML Model Integration & Real SHAP Inference
Alternative credit scoring engine for informal workers and micro-entrepreneurs in Pakistan.

#### Key Features:
* **Lifespan Startup ML Loader**: Pre-loads trained model and ColumnTransformer pipeline into memory.
* **Full ML Inference**: Predicts probability of default using Member 1's trained alternative financial models.
* **Standard Credit Score Scaling**: 300 to 850 score calibration where higher score = lower default risk.
* **Real SHAP Explainability**: Computes local feature contributions, top 3 positive drivers, and top 3 negative risk flags.
* **Underwriting Decision Support**: Computes confidence scores and recommendations (Approve Micro-Loan, Manual Review, Decline).
* **Defensive Error Handling**: Domain validation exception handlers returning clean 422 and 400 responses.
    """,
    version="3.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan
)

# Configure CORS middleware
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "*"  # Allow external origins during dev integration
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Custom Exception Handlers
@app.exception_handler(InvalidFinancialRangeException)
async def invalid_financial_range_exception_handler(request: Request, exc: InvalidFinancialRangeException):
    """
    Handles financial values that fall outside logical/physical constraints.
    Returns HTTP 422 Unprocessable Entity with error structure.
    """
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "error": "InvalidFinancialRange",
            "message": exc.message,
            "details": exc.details
        }
    )


@app.exception_handler(MissingCrucialSignalException)
async def missing_crucial_signal_exception_handler(request: Request, exc: MissingCrucialSignalException):
    """
    Handles omitted mandatory underwriting signals.
    Returns HTTP 400 Bad Request with field-level guidance.
    """
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={
            "error": "MissingCrucialSignal",
            "message": exc.message,
            "details": exc.details
        }
    )


# Register Routers
app.include_router(health_router)
app.include_router(credit_router)


@app.get("/", include_in_schema=False)
async def root():
    return {
        "message": "Welcome to Lendora Credit Scoring API. Visit /docs for OpenAPI documentation.",
        "health_endpoint": "/health",
        "score_endpoint": "/api/v1/score",
        "samples_endpoint": "/api/v1/samples",
        "docs_url": "/docs"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
