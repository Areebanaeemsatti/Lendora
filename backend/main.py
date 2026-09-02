from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from routers.health import router as health_router
from routers.credit import router as credit_router
from exceptions import InvalidFinancialRangeException, MissingCrucialSignalException

app = FastAPI(
    title="Lendora Alternative Credit Scoring API",
    description="""
### Lendora Backend Services - Step 2 Ingestion, Feature Processing & Inference Wrapper
Alternative credit scoring engine for informal workers and micro-entrepreneurs in Pakistan.

#### Key Features:
* **Feature Processing & Cleaning**: Advanced domain validation and engineered metrics (daily velocity, utility delay ratio, wallet liquidity proxy).
* **Plug-and-Play Inference Interface**: Loads ML artifacts (`model.pkl`) if available with smooth fallback to calibrated heuristic.
* **SHAP Explainability**: Returns directional additive factor impacts and driver explanations.
* **GET `/health`**: Service operational status check.
* **POST `/api/v1/score`**: Ingests borrower signals, computes derived features, and generates scorecard.
* **GET `/api/v1/samples`**: Fetches sample profiles from demo CSV dataset.
    """,
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
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
