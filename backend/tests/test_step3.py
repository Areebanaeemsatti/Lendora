import sys
from pathlib import Path

# Add backend directory to sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from fastapi.testclient import TestClient
import main

def test_full_step3_pipeline():
    with TestClient(main.app) as client:
        # 1. Health Check
        r_health = client.get("/health")
        assert r_health.status_code == 200
        health_data = r_health.json()
        print("Health Status:", health_data)
        assert health_data["status"] == "healthy"
        assert health_data["model_loaded"] is True
        assert health_data["explainer_ready"] is True

        # 2. Score with complete borrower application
        sample_input = {
            "borrowerId": "LND-2026-001",
            "fullName": "Ayesha Khan",
            "age": 28,
            "city": "Lahore",
            "province": "Punjab",
            "occupation": "small_shopkeeper",
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
            "hasFormalCreditHistory": "Limited",
            "supportingDocuments": [
                {
                    "id": "doc-1",
                    "fileName": "electricity_bill.pdf",
                    "documentType": "Utility Bill"
                },
                {
                    "id": "doc-2",
                    "fileName": "jazzcash_statement.png",
                    "documentType": "JazzCash Evidence"
                }
            ]
        }

        r_score = client.post("/api/v1/score", json=sample_input)
        assert r_score.status_code == 200, f"Error: {r_score.text}"
        data = r_score.json()
        print("\n=== STEP 3 SCORE RESPONSE ===")
        print(f"Credit Score: {data['credit_score']} (Range 300-850)")
        print(f"Risk Tier: {data['risk_tier']}")
        print(f"Default Probability: {data['default_probability']}")
        print(f"Confidence Score: {data['confidence_score']}")
        print(f"Recommendation: {data['recommendation']}")
        print(f"Top 3 Positive Drivers: {data['top_positive_drivers']}")
        print(f"Top 3 Negative Risk Flags: {data['top_negative_drivers']}")
        print(f"Total SHAP Explanations Count: {len(data['shap_explanations'])}")
        
        # Verify required contract assertions
        assert 300 <= data["credit_score"] <= 850
        assert data["risk_tier"] in ["Low Risk", "Medium Risk", "High Risk"]
        assert 0.0 <= data["default_probability"] <= 1.0
        assert 0.0 <= data["confidence_score"] <= 1.0
        assert len(data["shap_explanations"]) > 0
        assert any(term in data["recommendation"] for term in ["Approve", "Review", "Decline"])

        # Check structure of SHAP explanation items
        first_shap = data["shap_explanations"][0]
        assert "feature_name" in first_shap
        assert "raw_value" in first_shap
        assert "impact" in first_shap
        assert "direction" in first_shap
        assert "explanation" in first_shap

        # 3. Test Invalid Financial Range (defaults > loans)
        bad_input = dict(sample_input)
        bad_input["previousDefaultsCount"] = 5
        bad_input["previousLoansCount"] = 2
        r_err1 = client.post("/api/v1/score", json=bad_input)
        assert r_err1.status_code == 422
        assert r_err1.json()["error"] == "InvalidFinancialRange"

        # 4. Test Missing Crucial Signal (missing income)
        bad_input2 = dict(sample_input)
        bad_input2["monthlyIncomePKR"] = None
        r_err2 = client.post("/api/v1/score", json=bad_input2)
        assert r_err2.status_code == 400
        assert r_err2.json()["error"] == "MissingCrucialSignal"

        # 5. Test Samples Endpoint
        r_samples = client.get("/api/v1/samples?limit=3")
        assert r_samples.status_code == 200
        samples = r_samples.json()
        assert len(samples) == 3

        print("\nALL STEP 3 AUTOMATED TESTS PASSED!")

if __name__ == "__main__":
    test_full_step3_pipeline()
