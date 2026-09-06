"""
CLI entry point, kept for local testing / debugging only.

For real integration, teammates should call the FastAPI service (api.py)
over HTTP instead of spawning this script as a subprocess.

Usage:
    python ml/predict_credit_model.py '{"wallet_avg_balance": 4200, "wallet_txn_count_90d": 45, ...}'
    python ml/predict_credit_model.py payload.json
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

from model import predict  # run from inside ml/, so this is a plain module import


def load_input_payload(raw: str) -> dict:
    cleaned = raw.strip()

    # Remove surrounding quotes if the shell passed them through
    if (
        len(cleaned) >= 2
        and cleaned[0] == cleaned[-1]
        and cleaned[0] in {'"', "'"}
    ):
        cleaned = cleaned[1:-1]

    cleaned = (
        cleaned
        .replace('\\"', '"')
        .replace("\\'", "'")
    )

    # First try proper JSON
    try:
        payload = json.loads(cleaned)

    except json.JSONDecodeError:
        # Fallback for Python-dict style input:
        # {'provider': 'JazzCash', ...}
        import ast

        try:
            payload = ast.literal_eval(cleaned)
        except (ValueError, SyntaxError) as exc:
            raise ValueError(
                f"Invalid JSON payload: {exc}"
            ) from exc

    if not isinstance(payload, dict):
        raise ValueError("Payload must be a JSON object.")

    return payload


def main() -> None:
    if len(sys.argv) < 2:
        raise SystemExit(
            "Usage: python predict_credit_model.py '<json payload>' | payload.json"
        )
    input_value = sys.argv[1]
    input_path = Path(input_value)
    raw_payload = (
        input_path.read_text(encoding="utf-8")
        if input_path.is_file()
        else input_value
    )
    payload = load_input_payload(raw_payload)
    result = predict(payload)
    print(json.dumps(result))


if __name__ == "__main__":
    main()