"""
Verification / fraud-flagging layer — deliberately SEPARATE from the credit
scoring model in model.py.

Why separate: the scoring model answers "how risky is this borrower",
assuming the input data is genuine. Verification answers "is this input
data genuine in the first place". Mixing the two means a convincing fake
document could still produce a trustworthy-looking score. Keep them apart
and gate the score behind verification passing (or route to manual review).

This module is intentionally rule-based and honest about its limits:
sophisticated image forgery (well-done Photoshop edits, AI-generated
receipts) will NOT reliably be caught by metadata/hash checks alone. Treat
this as a first line of defense that catches cheap/lazy fraud and routes
everything else to human review — not as a guarantee.

Extension points (not implemented here, need real infra):
  - OCR (pytesseract / cloud OCR) to cross-check amounts/dates in the image
    against the claimed transaction values
  - Direct verification against the wallet/telco provider's API using the
    transaction reference number (best long-term fix — makes screenshots
    unnecessary)
  - Learned image-forensics model (ELA, noise-pattern analysis) for
    screenshot tampering detection
"""
from __future__ import annotations

import hashlib
import re
from dataclasses import dataclass, field
from datetime import datetime, timedelta

# --- 1. Reference number format checks -------------------------------------

# Adjust these per real provider formats (Easypaisa/JazzCash/utility billers
# each have their own reference number conventions). Currently matches the
# format used by the mock providers in providers.py (EP/JC + 10 digits) —
# update both together if either changes.
REFERENCE_PATTERNS = {
    "easypaisa": re.compile(r"^EP\d{10}$"),
    "jazzcash": re.compile(r"^JC\d{10}$"),
    "utility_bill": re.compile(r"^\d{14}$"),  # e.g. LESCO/K-Electric ref length
}


def validate_reference_number(ref: str, provider: str) -> bool:
    pattern = REFERENCE_PATTERNS.get(provider.lower())
    if pattern is None:
        return False  # unknown provider -> can't validate, treat as unverified
    return bool(pattern.match(ref.strip()))


# --- 2. Duplicate receipt detection -----------------------------------------
# Same receipt image re-used across multiple applications (own or someone
# else's) is one of the most common cheap-fraud patterns.

def file_hash(file_bytes: bytes) -> str:
    return hashlib.sha256(file_bytes).hexdigest()


def is_duplicate_receipt(file_bytes: bytes, seen_hashes: set[str]) -> bool:
    """seen_hashes should be backed by a persistent store (DB/Redis) in
    production, not an in-memory set — this signature just shows the shape.
    """
    return file_hash(file_bytes) in seen_hashes


# --- 3. Basic image metadata red flags --------------------------------------

EDITING_SOFTWARE_MARKERS = ("photoshop", "gimp", "pixlr", "canva", "snapseed")


def check_image_metadata(exif_software_tag: str | None) -> list[str]:
    """Pass the EXIF 'Software' tag (e.g. via Pillow's `Image.getexif()`).
    A missing tag is normal for real phone screenshots; a known editor tag
    is a red flag worth surfacing, not an automatic rejection.
    """
    flags = []
    if exif_software_tag:
        lowered = exif_software_tag.lower()
        if any(marker in lowered for marker in EDITING_SOFTWARE_MARKERS):
            flags.append(f"Image metadata shows editing software: {exif_software_tag}")
    return flags


# --- 4. Transaction consistency checks --------------------------------------

@dataclass
class TransactionClaim:
    amount: float
    timestamp: datetime
    reference: str
    provider: str


def check_transaction_consistency(
    claim: TransactionClaim,
    ocr_amount: float | None = None,
    ocr_timestamp: datetime | None = None,
) -> list[str]:
    """Compares what the user claims against what OCR extracted from the
    receipt image itself. Requires an OCR step upstream (not included here).
    """
    flags: list[str] = []

    if ocr_amount is not None and abs(ocr_amount - claim.amount) > 1.0:
        flags.append(
            f"Claimed amount ({claim.amount}) does not match receipt text ({ocr_amount})."
        )

    if ocr_timestamp is not None and abs((ocr_timestamp - claim.timestamp).total_seconds()) > 3600:
        flags.append("Claimed transaction time does not match receipt timestamp.")

    if claim.timestamp > datetime.now():
        flags.append("Transaction timestamp is in the future.")

    if claim.timestamp < datetime.now() - timedelta(days=365 * 2):
        flags.append("Transaction is older than 2 years — unusually stale evidence.")

    return flags


# --- 5. Aggregate verification result ---------------------------------------

@dataclass
class VerificationResult:
    verified: bool
    flags: list[str] = field(default_factory=list)
    requires_manual_review: bool = False

    def add(self, new_flags: list[str]) -> None:
        self.flags.extend(new_flags)


def run_verification(
    claim: TransactionClaim,
    file_bytes: bytes,
    seen_hashes: set[str],
    exif_software_tag: str | None = None,
    ocr_amount: float | None = None,
    ocr_timestamp: datetime | None = None,
) -> VerificationResult:
    result = VerificationResult(verified=True)

    if not validate_reference_number(claim.reference, claim.provider):
        result.add([f"Reference number format invalid for provider '{claim.provider}'."])

    if is_duplicate_receipt(file_bytes, seen_hashes):
        result.add(["This receipt image has been submitted before (duplicate hash)."])

    result.add(check_image_metadata(exif_software_tag))
    result.add(check_transaction_consistency(claim, ocr_amount, ocr_timestamp))

    if result.flags:
        result.verified = False
        result.requires_manual_review = True

    return result
