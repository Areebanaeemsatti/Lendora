# Lendora Backend Service

FastAPI alternative credit scoring engine for informal workers and micro-entrepreneurs in Pakistan.

## Project Structure
```
backend/
├── main.py                     # FastAPI app entry point & CORS configuration
├── requirements.txt            # Python package dependencies
├── README.md                   # Setup & command instructions
├── schemas/
│   ├── __init__.py
│   └── borrower.py             # Pydantic validation & response schemas
├── routers/
│   ├── __init__.py
│   ├── health.py               # GET /health router
│   └── credit.py               # POST /api/v1/score & GET /api/v1/samples router
└── services/
    ├── __init__.py
    └── scoring_service.py      # Core credit scoring logic & CSV loader
```

## Setup & Running Instructions

### 1. Terminal Commands to Setup Virtual Environment & Install Dependencies

#### On Windows (PowerShell / Command Prompt):
```powershell
# Navigate into backend directory
cd backend

# Create Python virtual environment
python -m venv venv

# Activate virtual environment (PowerShell)
.\venv\Scripts\Activate.ps1

# Or activate virtual environment (Command Prompt)
# .\venv\Scripts\activate.bat

# Upgrade pip & install dependencies
python -m pip install --upgrade pip
pip install -r requirements.txt
```

#### On Linux / macOS (Bash / Zsh):
```bash
# Navigate into backend directory
cd backend

# Create Python virtual environment
python -m venv venv

# Activate virtual environment
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

---

### 2. Start Development Server

```bash
# Run FastAPI server with auto-reload on port 8000
uvicorn main:app --reload --port 8000
```

The API will start running at:
- **Base API URL**: `http://localhost:8000`
- **Interactive Swagger Documentation**: `http://localhost:8000/docs`
- **ReDoc Documentation**: `http://localhost:8000/redoc`

---

### 3. Core API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | Returns service status, version, and health metrics |
| `POST` | `/api/v1/score` | Accepts borrower financial signals and returns credit scorecard |
| `GET` | `/api/v1/samples` | Reads 3-5 sample profiles directly from mock CSV dataset |

---

### 4. Sample Test Request (`POST /api/v1/score`)

```json
{
  "borrowerId": "LND-2026-001",
  "fullName": "Ayesha Khan",
  "age": 28,
  "city": "Lahore",
  "province": "Punjab",
  "occupation": "Textile Retailer",
  "employmentType": "Small Business Owner",
  "monthlyIncomePKR": 85000,
  "monthlyExpensesPKR": 42000,
  "existingDebtPKR": 15000,
  "requestedLoanAmountPKR": 250000,
  "loanTermMonths": 12,
  "monthlyEasypaisaTxCount": 24,
  "monthlyJazzCashTxCount": 35,
  "monthlyMobileRechargePKR": 2500,
  "utilityBillOnTimeRate": 95,
  "monthlyUtilityBillPKR": 6500,
  "previousLoansCount": 2,
  "previousDefaultsCount": 0,
  "onTimeRepaymentRate": 92,
  "avgPreviousLoanAmountPKR": 75000,
  "repaymentHistoryGrade": "Good",
  "creditHistoryYears": 2,
  "hasBankAccount": "Yes",
  "hasFormalCreditHistory": "Limited"
}
```
