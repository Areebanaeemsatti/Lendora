"""
Mock wallet-provider adapters.

Purpose: let the rest of the app (scoring + verification) develop and demo
against realistic Easypaisa/JazzCash-shaped data WITHOUT waiting for a real
data-sharing partnership with those providers (that's a separate, slow,
compliance-heavy process — see ml/README.md "Data source roadmap").

Design: every adapter implements the same `WalletProvider` interface. When a
real partnership/API is available, add a new adapter class implementing the
same interface (e.g. `EasypaisaLiveProvider`) and swap it in api.py — nothing
else in the codebase needs to change.
"""
from __future__ import annotations

import hashlib
import random
from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from datetime import datetime, timedelta


@dataclass
class WalletTransaction:
    reference: str
    amount: float
    timestamp: datetime
    type: str  # "topup" | "bill_payment" | "transfer_in" | "transfer_out"
    counterparty: str


@dataclass
class WalletProfile:
    msisdn: str  # phone number acting as wallet ID
    provider: str
    avg_balance: float
    active_days_last_90: int
    transactions: list[WalletTransaction] = field(default_factory=list)


class WalletProvider(ABC):
    """Common interface every real or mock provider adapter must implement."""

    name: str

    @abstractmethod
    def get_profile(self, msisdn: str) -> WalletProfile:
        ...

    @abstractmethod
    def verify_reference(self, reference: str) -> bool:
        ...


class _BaseMockProvider(WalletProvider):
    """Deterministic per-phone-number fake data — same msisdn always returns
    the same profile, so demos are reproducible."""

    reference_prefix: str

    def _seed(self, msisdn: str) -> random.Random:
        digest = hashlib.sha256(f"{self.name}:{msisdn}".encode()).hexdigest()
        return random.Random(int(digest[:16], 16))

    def get_profile(self, msisdn: str) -> WalletProfile:
        rng = self._seed(msisdn)
        now = datetime.now()

        n_txns = rng.randint(15, 60)
        transactions = []
        for i in range(n_txns):
            txn_type = rng.choice(["topup", "bill_payment", "transfer_in", "transfer_out"])
            transactions.append(
                WalletTransaction(
                    reference=f"{self.reference_prefix}{rng.randint(10**9, 10**10 - 1)}",
                    amount=round(rng.uniform(100, 8000), 2),
                    timestamp=now - timedelta(days=rng.randint(0, 90), hours=rng.randint(0, 23)),
                    type=txn_type,
                    counterparty=rng.choice(["LESCO", "K-Electric", "SSGC", "PTCL", "Friend", "Vendor"]),
                )
            )

        return WalletProfile(
            msisdn=msisdn,
            provider=self.name,
            avg_balance=round(rng.uniform(500, 25000), 2),
            active_days_last_90=rng.randint(10, 90),
            transactions=sorted(transactions, key=lambda t: t.timestamp, reverse=True),
        )

    def verify_reference(self, reference: str) -> bool:
        # Mimics a real provider's reference-lookup endpoint: valid format +
        # correct prefix for THIS provider. A forged/mismatched reference
        # simply won't verify — same behavior a real API check would have.
        return reference.startswith(self.reference_prefix) and reference[len(self.reference_prefix):].isdigit()


class EasypaisaMockProvider(_BaseMockProvider):
    # NOTE: `name` is used as the display/canonical provider string.
    # It must match the training CSV's category value exactly
    # ("Easypaisa", not "easypaisa") so it round-trips correctly
    # through schemas.py -> model.py -> the fitted OneHotEncoder.
    name = "Easypaisa"
    reference_prefix = "EP"


class JazzCashMockProvider(_BaseMockProvider):
    name = "JazzCash"
    reference_prefix = "JC"


class SadaPayMockProvider(_BaseMockProvider):
    name = "SadaPay"
    reference_prefix = "SP"


class NayaPayMockProvider(_BaseMockProvider):
    name = "NayaPay"
    reference_prefix = "NP"


_PROVIDERS: dict[str, WalletProvider] = {
    "easypaisa": EasypaisaMockProvider(),
    "jazzcash": JazzCashMockProvider(),
    "sadapay": SadaPayMockProvider(),
    "nayapay": NayaPayMockProvider(),
}


def get_provider(name: str) -> WalletProvider:
    provider = _PROVIDERS.get(name.lower())
    if provider is None:
        raise ValueError(f"Unknown wallet provider: {name}")
    return provider