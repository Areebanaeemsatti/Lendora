"""
Feature Processing & Engineering Service for Lendora.

Handles:
1. Raw borrower input ingestion and sanitization.
2. Edge-case validation and domain constraint checking (raising custom exceptions).
3. Computation of derived financial, velocity, and alternative behavioral metrics.
4. Formatting inputs into the exact 26 features required by Member 1's ML preprocessor and model.
"""
from typing import Dict, Any, Union, Tuple
import math
import numpy as np
import pandas as pd

from exceptions import InvalidFinancialRangeException, MissingCrucialSignalException
from schemas.borrower import BorrowerInput


class FeatureEngineeringService:

    @staticmethod
    def _to_float(value: Any, default: float = 0.0) -> float:
        """Helper to convert value to float, handling None and empty strings."""
        if value is None or value == "":
            return default
        try:
            return float(value)
        except (ValueError, TypeError):
            return default

    @staticmethod
    def _to_int(value: Any, default: int = 0) -> int:
        """Helper to convert value to int, handling None and empty strings."""
        if value is None or value == "":
            return default
        try:
            return int(float(value))
        except (ValueError, TypeError):
            return default

    @classmethod
    def validate_and_clean_input(cls, borrower: Union[BorrowerInput, Dict[str, Any]]) -> Dict[str, Any]:
        """
        Validates edge cases, checks domain ranges, cleans strings, and returns
        a normalized input dictionary.
        """
        raw = borrower.model_dump() if isinstance(borrower, BorrowerInput) else dict(borrower)

        # 1. Validate Crucial Signals
        monthly_income_raw = raw.get("monthlyIncomePKR")
        if monthly_income_raw is None or monthly_income_raw == "":
            raise MissingCrucialSignalException(
                "monthlyIncomePKR",
                "Monthly income is a mandatory signal for alternative credit assessment."
            )
        monthly_income = cls._to_float(monthly_income_raw)
        if monthly_income <= 0:
            raise InvalidFinancialRangeException(
                "monthlyIncomePKR",
                monthly_income,
                "must be strictly greater than 0 PKR"
            )

        requested_loan_raw = raw.get("requestedLoanAmountPKR")
        if requested_loan_raw is None or requested_loan_raw == "":
            raise MissingCrucialSignalException(
                "requestedLoanAmountPKR",
                "Requested loan amount is required."
            )
        requested_loan = cls._to_float(requested_loan_raw)
        if requested_loan <= 0:
            raise InvalidFinancialRangeException(
                "requestedLoanAmountPKR",
                requested_loan,
                "must be strictly greater than 0 PKR"
            )

        loan_term_raw = raw.get("loanTermMonths")
        if loan_term_raw is None or loan_term_raw == "":
            raise MissingCrucialSignalException(
                "loanTermMonths",
                "Loan term in months is required."
            )
        loan_term = cls._to_int(loan_term_raw)
        if loan_term <= 0 or loan_term > 120:
            raise InvalidFinancialRangeException(
                "loanTermMonths",
                loan_term,
                "loan term must be between 1 and 120 months"
            )

        # Validate Age
        age_raw = raw.get("age")
        if age_raw is not None and age_raw != "":
            age = cls._to_int(age_raw)
            if age < 18 or age > 100:
                raise InvalidFinancialRangeException(
                    "age", age, "borrower age must be between 18 and 100 years"
                )
        else:
            age = 30  # Sensible default if missing

        # Validate Expenses & Existing Debt
        monthly_expenses = cls._to_float(raw.get("monthlyExpensesPKR"), 0.0)
        if monthly_expenses < 0:
            raise InvalidFinancialRangeException(
                "monthlyExpensesPKR", monthly_expenses, "monthly expenses cannot be negative"
            )

        existing_debt = cls._to_float(raw.get("existingDebtPKR"), 0.0)
        if existing_debt < 0:
            raise InvalidFinancialRangeException(
                "existingDebtPKR", existing_debt, "existing debt cannot be negative"
            )

        # Validate Alternative Signals
        easypaisa_tx = cls._to_int(raw.get("monthlyEasypaisaTxCount"), 0)
        if easypaisa_tx < 0:
            raise InvalidFinancialRangeException(
                "monthlyEasypaisaTxCount", easypaisa_tx, "transaction count cannot be negative"
            )

        jazzcash_tx = cls._to_int(raw.get("monthlyJazzCashTxCount"), 0)
        if jazzcash_tx < 0:
            raise InvalidFinancialRangeException(
                "monthlyJazzCashTxCount", jazzcash_tx, "transaction count cannot be negative"
            )

        mobile_recharge = cls._to_float(raw.get("monthlyMobileRechargePKR"), 0.0)
        if mobile_recharge < 0:
            raise InvalidFinancialRangeException(
                "monthlyMobileRechargePKR", mobile_recharge, "mobile recharge cannot be negative"
            )

        utility_on_time_raw = raw.get("utilityBillOnTimeRate")
        utility_on_time = cls._to_float(utility_on_time_raw, 80.0)
        if utility_on_time < 0 or utility_on_time > 100:
            raise InvalidFinancialRangeException(
                "utilityBillOnTimeRate", utility_on_time, "utility on-time rate must be between 0 and 100"
            )

        monthly_utility_bill = cls._to_float(raw.get("monthlyUtilityBillPKR"), 0.0)
        if monthly_utility_bill < 0:
            raise InvalidFinancialRangeException(
                "monthlyUtilityBillPKR", monthly_utility_bill, "monthly utility bill cannot be negative"
            )

        # Validate Repayment & Defaults Logic
        previous_loans = cls._to_int(raw.get("previousLoansCount"), 0)
        if previous_loans < 0:
            raise InvalidFinancialRangeException(
                "previousLoansCount", previous_loans, "previous loans count cannot be negative"
            )

        previous_defaults = cls._to_int(raw.get("previousDefaultsCount"), 0)
        if previous_defaults < 0:
            raise InvalidFinancialRangeException(
                "previousDefaultsCount", previous_defaults, "previous defaults count cannot be negative"
            )

        # Critical cross-field constraint
        if previous_defaults > previous_loans:
            raise InvalidFinancialRangeException(
                "previousDefaultsCount",
                previous_defaults,
                f"previous defaults count ({previous_defaults}) cannot exceed total previous loans ({previous_loans})"
            )

        on_time_repayment_rate = cls._to_float(raw.get("onTimeRepaymentRate"), 80.0)
        if on_time_repayment_rate < 0 or on_time_repayment_rate > 100:
            raise InvalidFinancialRangeException(
                "onTimeRepaymentRate", on_time_repayment_rate, "on-time repayment rate must be between 0 and 100"
            )

        avg_previous_loan = cls._to_float(raw.get("avgPreviousLoanAmountPKR"), 0.0)
        if avg_previous_loan < 0:
            raise InvalidFinancialRangeException(
                "avgPreviousLoanAmountPKR", avg_previous_loan, "average previous loan amount cannot be negative"
            )

        credit_history_years = cls._to_int(raw.get("creditHistoryYears"), 0)
        if credit_history_years < 0:
            raise InvalidFinancialRangeException(
                "creditHistoryYears", credit_history_years, "credit history years cannot be negative"
            )

        # Normalize Text Fields
        city = (raw.get("city") or "Lahore").strip()
        province = (raw.get("province") or "Punjab").strip()
        raw_occ = (raw.get("occupation") or "small_shopkeeper").strip()
        employment_type = (raw.get("employmentType") or "Self-employed").strip()

        has_bank_account = str(raw.get("hasBankAccount") or "No").strip().capitalize()
        if has_bank_account.lower() in ["yes", "y", "true", "1"]:
            has_bank_account = "Yes"
        else:
            has_bank_account = "No"

        has_formal_credit = str(raw.get("hasFormalCreditHistory") or "No").strip().capitalize()
        if has_formal_credit.lower() in ["yes", "y", "true"]:
            has_formal_credit = "Yes"
        elif has_formal_credit.lower() in ["limited"]:
            has_formal_credit = "Limited"
        else:
            has_formal_credit = "No"

        repayment_grade = (raw.get("repaymentHistoryGrade") or "No previous borrowing history").strip()

        # Cleaned record
        return {
            "borrowerId": raw.get("borrowerId") or "LND-UNASSIGNED",
            "fullName": (raw.get("fullName") or "Anonymous Borrower").strip(),
            "age": age,
            "city": city,
            "province": province,
            "occupation": raw_occ,
            "employmentType": employment_type,
            "monthlyIncomePKR": monthly_income,
            "monthlyExpensesPKR": monthly_expenses,
            "existingDebtPKR": existing_debt,
            "requestedLoanAmountPKR": requested_loan,
            "loanTermMonths": loan_term,
            "monthlyEasypaisaTxCount": easypaisa_tx,
            "monthlyJazzCashTxCount": jazzcash_tx,
            "monthlyMobileRechargePKR": mobile_recharge,
            "utilityBillOnTimeRate": utility_on_time,
            "monthlyUtilityBillPKR": monthly_utility_bill,
            "previousLoansCount": previous_loans,
            "previousDefaultsCount": previous_defaults,
            "onTimeRepaymentRate": on_time_repayment_rate,
            "avgPreviousLoanAmountPKR": avg_previous_loan,
            "repaymentHistoryGrade": repayment_grade,
            "creditHistoryYears": credit_history_years,
            "hasBankAccount": has_bank_account,
            "hasFormalCreditHistory": has_formal_credit,
            "traditionalCreditNotes": raw.get("traditionalCreditNotes") or "",
            "supportingDocuments": raw.get("supportingDocuments") or [],
            # Direct alternative features if provided in raw payload
            "provider": raw.get("provider"),
            "wallet_active_days_ratio_90d": raw.get("wallet_active_days_ratio_90d"),
            "wallet_txn_count_90d": raw.get("wallet_txn_count_90d"),
            "wallet_txn_count_30d": raw.get("wallet_txn_count_30d"),
            "wallet_days_since_last_txn": raw.get("wallet_days_since_last_txn"),
            "wallet_topup_count_90d": raw.get("wallet_topup_count_90d"),
            "wallet_topup_avg_amount": raw.get("wallet_topup_avg_amount"),
            "wallet_topup_frequency_per_month": raw.get("wallet_topup_frequency_per_month"),
            "wallet_bill_payment_count_90d": raw.get("wallet_bill_payment_count_90d"),
            "wallet_bill_payment_share": raw.get("wallet_bill_payment_share"),
            "wallet_distinct_billers_90d": raw.get("wallet_distinct_billers_90d"),
            "wallet_avg_balance": raw.get("wallet_avg_balance"),
            "wallet_inflow_outflow_ratio": raw.get("wallet_inflow_outflow_ratio"),
            "wallet_txn_amount_volatility": raw.get("wallet_txn_amount_volatility"),
        }

    @classmethod
    def compute_derived_features(cls, cleaned: Dict[str, Any]) -> Dict[str, Any]:
        """
        Computes advanced derived metrics required by the scoring models.
        """
        income = cleaned["monthlyIncomePKR"]
        expenses = cleaned["monthlyExpensesPKR"]
        debt = cleaned["existingDebtPKR"]
        requested_loan = cleaned["requestedLoanAmountPKR"]
        term_months = max(1, cleaned["loanTermMonths"])
        
        easypaisa_tx = cleaned["monthlyEasypaisaTxCount"]
        jazzcash_tx = cleaned["monthlyJazzCashTxCount"]
        total_wallet_tx = easypaisa_tx + jazzcash_tx
        recharge = cleaned["monthlyMobileRechargePKR"]
        
        utility_on_time = cleaned["utilityBillOnTimeRate"]
        utility_bill = cleaned["monthlyUtilityBillPKR"]
        
        loans_count = cleaned["previousLoansCount"]
        defaults_count = cleaned["previousDefaultsCount"]
        repayment_rate = cleaned["onTimeRepaymentRate"]

        # 1. Transaction Velocity
        transaction_velocity_daily = round(total_wallet_tx / 30.0, 3)
        transaction_velocity_weekly = round(total_wallet_tx / 4.33, 2)

        # 2. Utility Delay Ratio
        utility_delay_ratio = round(max(0.0, 100.0 - utility_on_time) / 100.0, 3)

        # 3. Disposable Income & Debt Capacity
        monthly_debt_service = debt * 0.10
        disposable_income = max(0.0, income - expenses - monthly_debt_service)
        dti_ratio = round(((expenses + monthly_debt_service) / income * 100.0) if income > 0 else 100.0, 2)
        
        estimated_monthly_installment = round((requested_loan / term_months) * 1.15, 2)
        dscr = round(disposable_income / max(1.0, estimated_monthly_installment), 2)
        loan_to_income_ratio = round(requested_loan / max(1.0, income * 12.0), 3)
        installment_to_income_ratio = round((estimated_monthly_installment / max(1.0, income)) * 100.0, 2)

        # 4. Wallet Cash Balance Proxy
        net_liquid_surplus = disposable_income
        outflow_burden = max(1.0, recharge + utility_bill + (monthly_debt_service * 0.5))
        balance_ratio = round(net_liquid_surplus / outflow_burden, 2)
        
        wallet_velocity_factor = min(1.0, total_wallet_tx / 40.0)
        wallet_surplus_factor = min(1.0, net_liquid_surplus / max(1.0, income * 0.4))
        wallet_cash_balance_proxy = round(0.5 * wallet_surplus_factor + 0.5 * wallet_velocity_factor, 3)

        has_dual_wallet = 1 if (easypaisa_tx > 0 and jazzcash_tx > 0) else 0

        if loans_count > 0:
            repayment_discipline = (repayment_rate / 100.0) - (defaults_count * 0.35)
            repayment_discipline = max(0.0, min(1.0, repayment_discipline))
        else:
            repayment_discipline = 0.65 if cleaned["hasBankAccount"] == "Yes" else 0.50

        recharge_ratio = min(1.0, recharge / max(500.0, income * 0.05))
        digital_footprint_index = round(
            (0.5 * wallet_velocity_factor) + (0.3 * recharge_ratio) + (0.2 * has_dual_wallet),
            3
        )

        return {
            "transaction_velocity_daily": transaction_velocity_daily,
            "transaction_velocity_weekly": transaction_velocity_weekly,
            "utility_delay_ratio": utility_delay_ratio,
            "disposable_income_pkr": round(disposable_income, 2),
            "debt_to_income_ratio": dti_ratio,
            "debt_service_coverage_ratio": dscr,
            "loan_to_income_ratio": loan_to_income_ratio,
            "installment_to_income_ratio": installment_to_income_ratio,
            "estimated_monthly_installment_pkr": estimated_monthly_installment,
            "wallet_cash_balance_proxy": wallet_cash_balance_proxy,
            "wallet_inflow_outflow_ratio": round(income / max(1.0, expenses + monthly_debt_service), 2),
            "has_dual_wallet": has_dual_wallet,
            "total_monthly_wallet_tx": total_wallet_tx,
            "repayment_discipline_index": round(repayment_discipline, 3),
            "digital_footprint_index": digital_footprint_index,
        }

    @classmethod
    def to_ml_feature_row(cls, features: Dict[str, Any]) -> pd.DataFrame:
        """
        Maps cleaned and derived borrower features into the exact 26 features
        expected by Member 1's ML preprocessor and trained models.
        """
        # 1. Provider mapping (Must be one of "Easypaisa", "JazzCash", "SadaPay", "NayaPay")
        direct_provider = features.get("provider")
        if direct_provider in ["Easypaisa", "JazzCash", "SadaPay", "NayaPay"]:
            provider = direct_provider
        else:
            ep_tx = features.get("monthlyEasypaisaTxCount", 0)
            jc_tx = features.get("monthlyJazzCashTxCount", 0)
            provider = "Easypaisa" if ep_tx > jc_tx else "JazzCash"

        # 2. Occupation mapping (Verbatim categories trained in ML pipeline)
        raw_occ = str(features.get("occupation", "")).lower().replace("-", "_").replace(" ", "_")
        valid_ml_occupations = [
            "small_shopkeeper",
            "rickshaw_driver",
            "delivery_rider",
            "daily_wage_laborer",
            "street_vendor",
            "domestic_worker"
        ]
        if raw_occ in valid_ml_occupations:
            occupation = raw_occ
        elif any(k in raw_occ for k in ["shop", "retail", "merchant", "store", "business"]):
            occupation = "small_shopkeeper"
        elif any(k in raw_occ for k in ["rickshaw", "taxi", "driver", "cab", "ride"]):
            occupation = "rickshaw_driver"
        elif any(k in raw_occ for k in ["rider", "delivery", "courier"]):
            occupation = "delivery_rider"
        elif any(k in raw_occ for k in ["labor", "worker", "construction", "mechanic", "electrician"]):
            occupation = "daily_wage_laborer"
        elif any(k in raw_occ for k in ["vendor", "accessories", "seller", "hawker"]):
            occupation = "street_vendor"
        elif any(k in raw_occ for k in ["tailor", "domestic", "home", "maid"]):
            occupation = "domestic_worker"
        else:
            occupation = "small_shopkeeper"

        # 3. Base numeric features
        ep_tx = float(features.get("monthlyEasypaisaTxCount", 0))
        jc_tx = float(features.get("monthlyJazzCashTxCount", 0))
        monthly_tx = ep_tx + jc_tx

        wallet_txn_count_30d = float(features.get("wallet_txn_count_30d") or monthly_tx)
        wallet_txn_count_90d = float(features.get("wallet_txn_count_90d") or (wallet_txn_count_30d * 3.0))
        
        wallet_active_days_ratio_90d = float(
            features.get("wallet_active_days_ratio_90d") or 
            min(1.0, max(0.15, wallet_txn_count_90d / 90.0))
        )

        wallet_days_since_last_txn = float(
            features.get("wallet_days_since_last_txn") or 
            max(1.0, min(30.0, round(30.0 / max(1.0, wallet_txn_count_30d), 1)))
        )

        wallet_topup_count_90d = float(
            features.get("wallet_topup_count_90d") or 
            max(1.0, round(wallet_txn_count_90d * 0.25, 1))
        )

        wallet_topup_avg_amount = float(
            features.get("wallet_topup_avg_amount") or 
            max(500.0, float(features.get("monthlyMobileRechargePKR") or 2500.0))
        )

        wallet_topup_frequency_per_month = float(
            features.get("wallet_topup_frequency_per_month") or 
            round(wallet_topup_count_90d / 3.0, 1)
        )

        wallet_bill_payment_count_90d = float(
            features.get("wallet_bill_payment_count_90d") or 
            (3.0 if features.get("monthlyUtilityBillPKR", 0) > 0 else 0.0)
        )

        wallet_bill_payment_share = float(
            features.get("wallet_bill_payment_share") or 
            round(wallet_bill_payment_count_90d / max(1.0, wallet_txn_count_90d), 3)
        )

        wallet_distinct_billers_90d = float(
            features.get("wallet_distinct_billers_90d") or 
            (2.0 if features.get("monthlyUtilityBillPKR", 0) > 0 else 0.0)
        )

        wallet_avg_balance = float(
            features.get("wallet_avg_balance") or 
            max(500.0, float(features.get("disposable_income_pkr", 15000.0) * 0.35))
        )

        wallet_inflow_outflow_ratio = float(
            features.get("wallet_inflow_outflow_ratio") or 1.05
        )

        wallet_txn_amount_volatility = float(
            features.get("wallet_txn_amount_volatility") or 0.40
        )

        # 4. Compute the 11 engineered features exactly matching ML training pipeline
        recent_txn_activity_ratio = float(
            features.get("recent_txn_activity_ratio") or 
            min(1.0, max(0.0, wallet_txn_count_30d / max(1.0, wallet_txn_count_90d)))
        )
        recent_transaction_flag = int(wallet_days_since_last_txn <= 7)
        txn_recency_score = float(1.0 / (1.0 + max(0.0, wallet_days_since_last_txn)))
        topup_to_transaction_ratio = float(wallet_topup_count_90d / max(1.0, wallet_txn_count_90d))
        
        estimated_volume = wallet_topup_count_90d * wallet_topup_avg_amount
        estimated_topup_volume_log = float(np.log1p(max(0.0, estimated_volume)))
        
        bill_payment_txn_ratio = float(wallet_bill_payment_count_90d / max(1.0, wallet_txn_count_90d))
        biller_norm = min(1.0, max(0.0, wallet_distinct_billers_90d) / 5.0)
        bill_payment_consistency = float(wallet_bill_payment_share * biller_norm)
        
        avg_balance_log = float(np.sign(wallet_avg_balance) * np.log1p(abs(wallet_avg_balance)))
        cashflow_stress_flag = int(wallet_inflow_outflow_ratio < 0.8)
        txn_volatility_log = float(np.log1p(max(0.0, wallet_txn_amount_volatility)))
        
        active_days = max(1.0, wallet_active_days_ratio_90d * 90.0)
        transactions_per_active_day = float(wallet_txn_count_90d / active_days)

        row_dict = {
            "provider": provider,
            "occupation": occupation,
            "wallet_active_days_ratio_90d": wallet_active_days_ratio_90d,
            "wallet_txn_count_90d": wallet_txn_count_90d,
            "wallet_txn_count_30d": wallet_txn_count_30d,
            "wallet_days_since_last_txn": wallet_days_since_last_txn,
            "wallet_topup_count_90d": wallet_topup_count_90d,
            "wallet_topup_avg_amount": wallet_topup_avg_amount,
            "wallet_topup_frequency_per_month": wallet_topup_frequency_per_month,
            "wallet_bill_payment_count_90d": wallet_bill_payment_count_90d,
            "wallet_bill_payment_share": wallet_bill_payment_share,
            "wallet_distinct_billers_90d": wallet_distinct_billers_90d,
            "wallet_avg_balance": wallet_avg_balance,
            "wallet_inflow_outflow_ratio": wallet_inflow_outflow_ratio,
            "wallet_txn_amount_volatility": wallet_txn_amount_volatility,
            "recent_txn_activity_ratio": recent_txn_activity_ratio,
            "recent_transaction_flag": recent_transaction_flag,
            "txn_recency_score": txn_recency_score,
            "topup_to_transaction_ratio": topup_to_transaction_ratio,
            "estimated_topup_volume_log": estimated_topup_volume_log,
            "bill_payment_txn_ratio": bill_payment_txn_ratio,
            "bill_payment_consistency": bill_payment_consistency,
            "avg_balance_log": avg_balance_log,
            "cashflow_stress_flag": cashflow_stress_flag,
            "txn_volatility_log": txn_volatility_log,
            "transactions_per_active_day": transactions_per_active_day,
        }

        return pd.DataFrame([row_dict])

    @classmethod
    def calculate_confidence_score(cls, raw: Dict[str, Any]) -> float:
        """
        Computes confidence score based on input completeness and verified proof documents.
        """
        score = 0.60  # Baseline confidence for valid core application
        
        # Financial profile completeness
        if raw.get("monthlyIncomePKR", 0) > 0 and raw.get("monthlyExpensesPKR", 0) > 0:
            score += 0.08
        
        # Mobile wallet signal depth
        ep = raw.get("monthlyEasypaisaTxCount", 0)
        jc = raw.get("monthlyJazzCashTxCount", 0)
        if (ep + jc) >= 20:
            score += 0.08
        elif (ep + jc) > 0:
            score += 0.04
            
        # Utility payment record presence
        if raw.get("utilityBillOnTimeRate") is not None and raw.get("monthlyUtilityBillPKR", 0) > 0:
            score += 0.08
            
        # Verified document uploads attached
        docs = raw.get("supportingDocuments") or []
        if len(docs) >= 2:
            score += 0.10
        elif len(docs) >= 1:
            score += 0.05
            
        # Credit history & bank account presence
        if raw.get("hasBankAccount") == "Yes" or raw.get("hasFormalCreditHistory") in ["Yes", "Limited"]:
            score += 0.05

        return round(min(0.98, score), 2)

    @classmethod
    def process_features(cls, borrower: Union[BorrowerInput, Dict[str, Any]]) -> Dict[str, Any]:
        """
        Complete pipeline: Ingests, validates, cleans, computes derived metrics,
        and attaches confidence metrics.
        """
        cleaned = cls.validate_and_clean_input(borrower)
        derived = cls.compute_derived_features(cleaned)
        confidence = cls.calculate_confidence_score(cleaned)

        processed = {**cleaned, **derived, "confidence_score": confidence}
        return processed
