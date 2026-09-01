from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers.health import router as health_router
from routers.credit import router as credit_router

app = FastAPI(
    title="Lendora Alternative Credit Scoring API",
    description="""
### Lendora Backend Services - Step 1 Setup
Alternative credit scoring engine for informal workers and micro-entrepreneurs in Pakistan.

#### Endpoints Included:
* **GET `/health`**: Service status check
* **POST `/api/v1/score`**: Evaluates borrower financial signals and generates detailed risk scorecard
* **GET `/api/v1/samples`**: Fetches sample borrower records directly from demo dataset
    """,
    version="1.0.0",
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

# Register Routers
app.include_router(health_router)
app.include_router(credit_router)


@app.get("/", include_in_schema=False)
async def root():
    return {
        "message": "Welcome to Lendora Credit Scoring API. Visit /docs for OpenAPI documentation.",
        "health_endpoint": "/health",
        "docs_url": "/docs"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
