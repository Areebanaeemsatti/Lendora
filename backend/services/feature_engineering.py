"""
Feature Processing & Engineering Service for Lendora.

Handles:
1. Raw borrower input ingestion and sanitization.
2. Edge-case validation and domain constraint checking (raising custom exceptions).
3. Computation of derived financial, velocity, and alternative behavioral metrics.
"""
from typing import Dict, Any, Union
import math

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
        occupation = (raw.get("occupation") or "Informal Merchant").strip()
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

        return {
            "borrowerId": raw.get("borrowerId") or "LND-UNASSIGNED",
            "fullName": (raw.get("fullName") or "Anonymous Borrower").strip(),
            "age": age,
            "city": city,
            "province": province,
            "occupation": occupation,
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
            "supportingDocuments": raw.get("supportingDocuments") or []
        }

    @classmethod
    def compute_derived_features(cls, cleaned: Dict[str, Any]) -> Dict[str, Any]:
        """
        Computes advanced derived metrics required by the scoring models:
        - Transaction velocity (daily and weekly)
        - Utility delay ratio
        - Wallet cash-in vs cash-out balance proxy
        - Financial leverage & capacity metrics
        - Behavioral alternative indices
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

        # 1. Transaction Velocity (Daily & Weekly)
        transaction_velocity_daily = round(total_wallet_tx / 30.0, 3)
        transaction_velocity_weekly = round(total_wallet_tx / 4.33, 2)

        # 2. Utility Delay Ratio (0.0 = perfect on-time, 1.0 = completely delinquent)
        utility_delay_ratio = round(max(0.0, 100.0 - utility_on_time) / 100.0, 3)

        # 3. Disposable Income & Debt Capacity
        monthly_debt_service = debt * 0.10  # 10% monthly service proxy
        disposable_income = max(0.0, income - expenses - monthly_debt_service)
        dti_ratio = round(((expenses + monthly_debt_service) / income * 100.0) if income > 0 else 100.0, 2)
        
        # Estimated monthly installment for requested loan (with 15% annual markup proxy)
        estimated_monthly_installment = round((requested_loan / term_months) * 1.15, 2)
        dscr = round(disposable_income / max(1.0, estimated_monthly_installment), 2)
        loan_to_income_ratio = round(requested_loan / max(1.0, income * 12.0), 3)
        installment_to_income_ratio = round((estimated_monthly_installment / max(1.0, income)) * 100.0, 2)

        # 4. Wallet Cash-In vs Cash-Out Balance Proxy
        # In informal Pakistani commerce, cash-in is income flowing via merchants/agents,
        # cash-out is expenses, bills, mobile recharge, and vendor remittances.
        # This proxy assesses whether the borrower maintains a positive liquid buffer.
        net_liquid_surplus = disposable_income
        outflow_burden = max(1.0, recharge + utility_bill + (monthly_debt_service * 0.5))
        balance_ratio = round(net_liquid_surplus / outflow_burden, 2)
        
        # Normalized wallet balance index [0.0 - 1.0]
        # Higher score implies high buffer + frequent wallet velocity
        wallet_velocity_factor = min(1.0, total_wallet_tx / 40.0)
        wallet_surplus_factor = min(1.0, net_liquid_surplus / max(1.0, income * 0.4))
        wallet_cash_balance_proxy = round(0.5 * wallet_surplus_factor + 0.5 * wallet_velocity_factor, 3)

        # 5. Dual Wallet Diversification (Both Easypaisa and JazzCash used)
        has_dual_wallet = 1 if (easypaisa_tx > 0 and jazzcash_tx > 0) else 0

        # 6. Repayment Discipline Index [0.0 - 1.0]
        if loans_count > 0:
            repayment_discipline = (repayment_rate / 100.0) - (defaults_count * 0.35)
            repayment_discipline = max(0.0, min(1.0, repayment_discipline))
        else:
            # Thin-file baseline
            repayment_discipline = 0.65 if cleaned["hasBankAccount"] == "Yes" else 0.50

        # 7. Digital Footprint Score Index [0.0 - 1.0]
        recharge_ratio = min(1.0, recharge / max(500.0, income * 0.05))
        digital_footprint_index = round(
            (0.5 * wallet_velocity_factor) + (0.3 * recharge_ratio) + (0.2 * has_dual_wallet),
            3
        )

        derived = {
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
            "wallet_in_out_balance_ratio": balance_ratio,
            "has_dual_wallet": has_dual_wallet,
            "total_monthly_wallet_tx": total_wallet_tx,
            "repayment_discipline_index": round(repayment_discipline, 3),
            "digital_footprint_index": digital_footprint_index,
        }

        return derived

    @classmethod
    def process_features(cls, borrower: Union[BorrowerInput, Dict[str, Any]]) -> Dict[str, Any]:
        """
        Complete pipeline: Ingests, validates, cleans, and computes derived metrics.
        Returns a unified feature dictionary ready for the inference service.
        """
        cleaned = cls.validate_and_clean_input(borrower)
        derived = cls.compute_derived_features(cleaned)

        # Merge cleaned input and derived features into one dictionary
        processed = {**cleaned, **derived}
        return processed
