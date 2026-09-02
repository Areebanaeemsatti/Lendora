"""
Custom domain exceptions for Lendora credit assessment backend.
"""
from typing import Optional, Dict, Any


class LendoraException(Exception):
    """Base exception for Lendora backend errors."""
    def __init__(self, message: str, details: Optional[Dict[str, Any]] = None):
        super().__init__(message)
        self.message = message
        self.details = details or {}


class InvalidFinancialRangeException(LendoraException):
    """Raised when numerical financial signals are outside valid logical or physical bounds."""
    def __init__(self, field_name: str, value: Any, constraint: str, message: Optional[str] = None):
        custom_message = message or f"Field '{field_name}' with value '{value}' violates constraint: {constraint}"
        super().__init__(
            message=custom_message,
            details={"field": field_name, "value": value, "constraint": constraint, "error_type": "invalid_financial_range"}
        )
        self.field_name = field_name
        self.value = value
        self.constraint = constraint


class MissingCrucialSignalException(LendoraException):
    """Raised when critical alternative financial signals required for underwriting are omitted or empty."""
    def __init__(self, field_name: str, message: Optional[str] = None):
        custom_message = message or f"Crucial underwriting signal '{field_name}' is required but was missing or empty."
        super().__init__(
            message=custom_message,
            details={"field": field_name, "error_type": "missing_crucial_signal"}
        )
        self.field_name = field_name
