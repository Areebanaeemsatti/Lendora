# Lendora ML Service

Standalone credit-risk scoring service. Anyone on the team (frontend, backend)
integrates with this by calling the HTTP API below — no Python setup, no
subprocess calls, no local file paths.

## Setup (ML devs only)

```bash
cd ml
python -m venv .venv
source .venv/bin/activate      # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

Train the baseline model (downloads dataset from Kaggle, needs `kagglehub`
auth configured):

```bash
python train_credit_model.py
```

This writes `artifacts/preprocessor.joblib`, `artifacts/best_model.joblib`,
and `artifacts/training_summary.json`. These artifacts are already committed
to the repo, so most people won't need to retrain to use the service.

> ⚠️ **The committed artifacts predate the feature-engineering step below.**
> They were fit on the raw columns only. `feature_row()` in `model.py` now
> always runs `prepare_features()` first, which adds extra columns the old
> `preprocessor.joblib` was never fit on — so `/predict` will error against
> the currently-committed artifacts. Run `python train_credit_model.py`
> once (needs `kagglehub` auth) to regenerate artifacts that match the new
> pipeline before using `/predict`.

Run the API:

```bash
uvicorn api:app --reload --port 8000
```

## API contract (for backend/frontend integration)

Base URL (local dev): `http://localhost:8000`

### `GET /health`

```json
{ "status": "ok", "model_loaded": true, "model_used": "lightgbm" }
```

### `POST /predict`

Request body:

```json
{
  "person_age": 28,
  "person_income": 45000,
  "person_home_ownership": "RENT",
  "person_emp_length": 3,
  "loan_intent": "PERSONAL",
  "loan_grade": "C",
  "loan_amnt": 15000,
  "loan_int_rate": 12.5,
  "loan_percent_income": 0.2,
  "cb_person_default_on_file": "N",
  "cb_person_cred_hist_length": 3
}
```

Response body:

```json
{
  "score": 712,
  "risk_band": "Moderate Risk",
  "approval_chance": "Medium",
  "probability_default": 0.251,
  "model_used": "lightgbm",
  "top_factors": null
}
```

Full field types/enums are defined in `schemas.py` — treat that file as the
single source of truth. If you add/remove a feature, update `schemas.py`,
`model.py::feature_row`, and this README together.

### `POST /verify` (call BEFORE `/predict` for receipt-backed data)

`multipart/form-data` — a file upload plus fields, not JSON, because it
carries the receipt image:

| field | type | required |
|---|---|---|
| `receipt` | file | yes |
| `amount` | float | yes |
| `timestamp` | ISO 8601 string | yes |
| `reference` | string | yes |
| `provider` | `easypaisa` \| `jazzcash` \| `utility_bill` | yes |
| `exif_software_tag` | string | no |
| `ocr_amount` | float | no |
| `ocr_timestamp` | ISO 8601 string | no |

Response:

```json
{
  "verified": false,
  "requires_manual_review": true,
  "flags": ["This receipt image has been submitted before (duplicate hash)."]
}
```

If `verified` is `false`, do **not** feed that data into `/predict` — route
the application to manual review instead. See `verification.py` for the
checks currently implemented (reference-format, duplicate-hash, EXIF
editing-software marker, amount/timestamp consistency) and its documented
limits — it catches cheap/lazy fraud, not sophisticated forgery. The
in-memory duplicate-hash store in `api.py` is a placeholder; swap it for
Redis/DB before this goes anywhere near production.

## Data source roadmap (mock now, real later)

Real Easypaisa/JazzCash access comes in two very different flavors:

1. **Payment-collection APIs** (self-service) — Easypaisa has an open API
   Developer Portal with a sandbox you can test against without contacting
   anyone; JazzCash requires merchant registration first, then issues
   sandbox credentials. Both are for *sending/receiving payments*, not for
   reading a borrower's transaction history.
2. **Reading a borrower's own transaction history with their consent** — this
   is what Lendora actually needs, and it is not self-service. It requires a
   formal data-sharing partnership/agreement with the provider (compliance
   review, NDA, likely SBP-related requirements). This takes real business
   development time and is out of scope for the current build stage.

So for now, `providers.py` ships **mock adapters** (`EasypaisaMockProvider`,
`JazzCashMockProvider`) that return deterministic, realistic-shaped wallet
data — same phone number always returns the same fake profile, so demos are
reproducible. Try it:

```
GET /wallet-profile/easypaisa/03001234567
GET /wallet-profile/jazzcash/03001234567
```

When a real partnership exists, add a new class implementing the same
`WalletProvider` interface (e.g. `EasypaisaLiveProvider` wrapping the real
API client) and swap it into `_PROVIDERS` in `providers.py` — nothing else
in the codebase (scoring, verification, frontend contract) needs to change.

## EDA and feature engineering

`train_credit_model.py` now runs two extra stages before fitting a model:

1. **EDA (`eda.py`)** — runs on the raw data as delivered, before any
   cleaning, and writes a report to `artifacts/eda/`:
   - `eda_report.md` / `eda_report.json` — missing values, target class
     balance, per-column outlier counts (IQR method), skew, correlation
     with the target, and duplicate-row count
   - `plots/*.png` — numeric distributions, target balance, correlation
     heatmap (skipped automatically if matplotlib isn't installed)

   Run it standalone with `python eda.py` (needs the same Kaggle auth as
   training). It flags two known data-quality issues in this dataset
   specifically: a handful of impossible `person_age` values (e.g. 144)
   and impossible `person_emp_length` values, plus ~9-10% missingness in
   `loan_int_rate`.

2. **Feature engineering (`feature_engineering.py`)** — `prepare_features()`
   is called on both the training dataframe and, via `model.py::feature_row`,
   on every single-row inference request, so train and serve never diverge:
   - `clean_data()`: nulls out the impossible age/employment-length values
     found by EDA (so the pipeline's median imputer handles them instead of
     the model training on garbage rows)
   - `engineer_features()`: adds `loan_to_income_ratio`,
     `income_per_emp_year`, `credit_history_ratio`, log-transformed
     `loan_amnt`/`income` (both are right-skewed), a `high_loan_burden`
     flag (>40% of income to one loan — a common underwriting red line),
     and bucketed `age_band` / `emp_length_band` columns. See the
     docstring in `feature_engineering.py` for the reasoning behind each
     one.

Every transform in `feature_engineering.py` is deliberately row-independent
(no dataset-wide means/quantiles computed on the fly) — anything that needs
dataset-wide statistics belongs in the sklearn `ColumnTransformer` instead,
otherwise a single inference row would get different treatment than the
same row seen during training.

If you add a new engineered feature, it flows through automatically (the
preprocessor picks up whatever columns `prepare_features()` returns) — you
do not need to touch `schemas.py` unless the feature requires a *new raw
input* from the caller.

## Known limitation

The current model is trained on a public bureau-style dataset (loan grade,
formal income, credit history length) as a working baseline. It does **not**
yet use the wallet/top-up/utility behavioral data described in the product
pitch — that requires a real or synthetic alternative-data dataset, which is
the next milestone. The API contract above is intentionally decoupled from
the model internals so swapping the model won't break integrations, as long
as `predict()` in `model.py` keeps returning the same response shape.

## Explainability (SHAP)

Each `/predict` response includes up to five `top_factors`, generated with
SHAP from the saved tree model. One-hot encoded categories are grouped back
to their source feature, and each factor is labeled as increasing or
decreasing default risk with its signed SHAP value.
