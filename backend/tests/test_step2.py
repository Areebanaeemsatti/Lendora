import main
from fastapi.testclient import TestClient
from services.feature_engineering import FeatureEngineeringService
from services.inference_service import InferenceService

print("--- TEST 1: Feature Engineering ---")
sample_input = {
    "borrowerId": "LND-2026-001",
    "fullName": "Ayesha Khan",
    "age": 28,
    "city": "Lahore",
    "province": "Punjab",
    "occupation": "Textile Retailer",
    "employmentType": "Small business owner",
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
    "hasBankAccount": "yes",
    "hasFormalCreditHistory": "limited"
}
features = FeatureEngineeringService.process_features(sample_input)
print("Transaction Velocity Daily:", features["transaction_velocity_daily"])
print("Utility Delay Ratio:", features["utility_delay_ratio"])
print("Wallet Cash Balance Proxy:", features["wallet_cash_balance_proxy"])
print("Disposable Income PKR:", features["disposable_income_pkr"])

print("\n--- TEST 2: Inference Service (Heuristic Fallback) ---")
pred = InferenceService.predict_score(features)
print("Final Score (300-850):", pred["final_score"])
print("Normalized Score (0-100):", pred["normalized_score"])
print("Risk Tier:", pred["risk_tier"])
print("Default Probability:", pred["default_probability"], f"({pred['default_probability_pct']}%)")
print("SHAP Factors Count:", len(pred["top_contributing_factors"]))
print("Top Factor:", pred["top_contributing_factors"][0]["displayName"], "->", pred["top_contributing_factors"][0]["shapValue"], "pts")

print("\n--- TEST 3: FastAPI Endpoints via TestClient ---")
client = TestClient(main.app)

# 3a: Success Score
r = client.post("/api/v1/score", json=sample_input)
print("POST /api/v1/score status:", r.status_code)
assert r.status_code == 200, f"Expected 200, got {r.status_code}: {r.text}"
data = r.json()
print("Returned Score (300-850):", data["scaledCreditScore"], "Risk Tier:", data["riskTier"])
print("Derived Features in response:", list(data["derivedFeatures"].keys()))
print("SHAP Feature Importance Count:", len(data["featureImportance"]))

# 3b: Invalid Financial Range (defaults > loans)
bad_input = dict(sample_input)
bad_input["previousDefaultsCount"] = 5
bad_input["previousLoansCount"] = 2
r_err1 = client.post("/api/v1/score", json=bad_input)
print("Invalid Defaults Test status:", r_err1.status_code, r_err1.json())
assert r_err1.status_code == 422
assert r_err1.json()["error"] == "InvalidFinancialRange"

# 3c: Missing Crucial Signal (negative/missing income)
bad_input2 = dict(sample_input)
bad_input2["monthlyIncomePKR"] = None
r_err2 = client.post("/api/v1/score", json=bad_input2)
print("Missing Signal Test status:", r_err2.status_code, r_err2.json())
assert r_err2.status_code == 400
assert r_err2.json()["error"] == "MissingCrucialSignal"

# 3d: Samples Endpoint
r_samples = client.get("/api/v1/samples?limit=3")
print("GET /api/v1/samples status:", r_samples.status_code, "Count:", len(r_samples.json()))
assert r_samples.status_code == 200

print("\nALL VERIFICATIONS PASSED SUCCESSFULLY!")
