"""
Exploratory Data Analysis for the credit-risk training data.

Run standalone (uses the local synthetic alternative-data CSV configured in train_credit_model.py):

    python eda.py

Or import `run_eda(df, target_col, output_dir)` from train_credit_model.py
to generate a report as part of the training run.

Produces, under `artifacts/eda/`:
  - eda_report.json   machine-readable summary
  - eda_report.md      human-readable summary
  - plots/*.png         distribution / correlation plots (skipped if
                         matplotlib is unavailable, e.g. headless CI)

This module only *reports* on data quality issues (missing values,
outliers, imbalance). It does not mutate the dataframe — that is
feature_engineering.py's job, kept separate on purpose so EDA output
always reflects the raw data as delivered.
"""
from __future__ import annotations

import json
from pathlib import Path
from typing import Any

import numpy as np
import pandas as pd

# Known real-world data-quality issues in laotse/credit-risk-dataset that
# EDA should surface explicitly rather than silently averaging away:
#   - person_age has a handful of impossible values (123, 144)
#   - person_emp_length has a handful of impossible values (>60 years)
#   - loan_int_rate has real missingness (~9-10% of rows)
#   - loan_status is imbalanced (~78% non-default / 22% default)


def _numeric_and_categorical_cols(df: pd.DataFrame, target_col: str | None) -> tuple[list[str], list[str]]:
    cols = [c for c in df.columns if c != target_col]
    numeric_cols = [c for c in cols if pd.api.types.is_numeric_dtype(df[c])]
    categorical_cols = [c for c in cols if c not in numeric_cols]
    return numeric_cols, categorical_cols


def missing_value_report(df: pd.DataFrame) -> dict[str, Any]:
    missing = df.isna().sum()
    pct = (missing / len(df) * 100).round(2)
    return {
        col: {"missing_count": int(missing[col]), "missing_pct": float(pct[col])}
        for col in df.columns
        if missing[col] > 0
    }


def target_balance_report(df: pd.DataFrame, target_col: str) -> dict[str, Any]:
    counts = df[target_col].value_counts().sort_index()
    pct = (counts / len(df) * 100).round(2)
    return {
        "counts": {str(k): int(v) for k, v in counts.items()},
        "pct": {str(k): float(v) for k, v in pct.items()},
        "imbalance_ratio": round(float(counts.max() / counts.min()), 2) if counts.min() > 0 else None,
    }


def numeric_summary(df: pd.DataFrame, numeric_cols: list[str]) -> dict[str, Any]:
    summary = {}
    for col in numeric_cols:
        s = df[col].dropna()
        if s.empty:
            continue
        q1, q3 = s.quantile(0.25), s.quantile(0.75)
        iqr = q3 - q1
        lower, upper = q1 - 1.5 * iqr, q3 + 1.5 * iqr
        outliers = s[(s < lower) | (s > upper)]
        summary[col] = {
            "mean": round(float(s.mean()), 3),
            "std": round(float(s.std()), 3),
            "min": float(s.min()),
            "25%": float(q1),
            "50%": float(s.median()),
            "75%": float(q3),
            "max": float(s.max()),
            "skew": round(float(s.skew()), 3),
            "iqr_outlier_count": int(len(outliers)),
            "iqr_outlier_pct": round(float(len(outliers) / len(s) * 100), 2),
            "iqr_bounds": [round(float(lower), 2), round(float(upper), 2)],
        }
    return summary


def categorical_summary(df: pd.DataFrame, categorical_cols: list[str], top_n: int = 10) -> dict[str, Any]:
    summary = {}
    for col in categorical_cols:
        vc = df[col].value_counts(dropna=False).head(top_n)
        summary[col] = {str(k): int(v) for k, v in vc.items()}
    return summary


def correlation_with_target(df: pd.DataFrame, numeric_cols: list[str], target_col: str) -> dict[str, float]:
    if target_col not in df.columns:
        return {}
    corr = df[numeric_cols + [target_col]].corr(numeric_only=True)[target_col].drop(target_col, errors="ignore")
    return {k: round(float(v), 3) for k, v in corr.sort_values(key=abs, ascending=False).items()}


def _make_plots(df: pd.DataFrame, numeric_cols: list[str], target_col: str | None, plots_dir: Path) -> list[str]:
    try:
        import matplotlib
        matplotlib.use("Agg")
        import matplotlib.pyplot as plt
    except ImportError:
        return []

    plots_dir.mkdir(parents=True, exist_ok=True)
    saved = []

    # Numeric distributions
    n = len(numeric_cols)
    if n:
        ncols = 3
        nrows = int(np.ceil(n / ncols))
        fig, axes = plt.subplots(nrows, ncols, figsize=(5 * ncols, 3.5 * nrows))
        axes = np.array(axes).reshape(-1)
        for ax, col in zip(axes, numeric_cols):
            df[col].dropna().hist(ax=ax, bins=40, color="#4C72B0")
            ax.set_title(col)
        for ax in axes[n:]:
            ax.axis("off")
        fig.tight_layout()
        path = plots_dir / "numeric_distributions.png"
        fig.savefig(path, dpi=110)
        plt.close(fig)
        saved.append(str(path))

    # Target balance
    if target_col and target_col in df.columns:
        fig, ax = plt.subplots(figsize=(4, 4))
        df[target_col].value_counts().sort_index().plot(kind="bar", ax=ax, color=["#4C72B0", "#DD8452"])
        ax.set_title(f"{target_col} class balance")
        ax.set_xlabel(target_col)
        ax.set_ylabel("count")
        fig.tight_layout()
        path = plots_dir / "target_balance.png"
        fig.savefig(path, dpi=110)
        plt.close(fig)
        saved.append(str(path))

    # Correlation heatmap
    corr_cols = numeric_cols + ([target_col] if target_col in df.columns else [])
    if len(corr_cols) > 1:
        corr = df[corr_cols].corr(numeric_only=True)
        fig, ax = plt.subplots(figsize=(0.6 * len(corr_cols) + 2, 0.6 * len(corr_cols) + 2))
        im = ax.imshow(corr, cmap="coolwarm", vmin=-1, vmax=1)
        ax.set_xticks(range(len(corr_cols)))
        ax.set_yticks(range(len(corr_cols)))
        ax.set_xticklabels(corr_cols, rotation=90, fontsize=8)
        ax.set_yticklabels(corr_cols, fontsize=8)
        fig.colorbar(im, ax=ax, shrink=0.8)
        ax.set_title("Correlation matrix")
        fig.tight_layout()
        path = plots_dir / "correlation_heatmap.png"
        fig.savefig(path, dpi=110)
        plt.close(fig)
        saved.append(str(path))

    return saved


def run_eda(df: pd.DataFrame, target_col: str, output_dir: Path) -> dict[str, Any]:
    """Run the full EDA pass and write report + plots to output_dir. Returns the report dict."""
    numeric_cols, categorical_cols = _numeric_and_categorical_cols(df, target_col)

    report = {
        "shape": {"rows": int(df.shape[0]), "cols": int(df.shape[1])},
        "dtypes": {c: str(t) for c, t in df.dtypes.items()},
        "missing_values": missing_value_report(df),
        "target_balance": target_balance_report(df, target_col) if target_col in df.columns else {},
        "numeric_summary": numeric_summary(df, numeric_cols),
        "categorical_summary": categorical_summary(df, categorical_cols),
        "correlation_with_target": correlation_with_target(df, numeric_cols, target_col),
        "duplicate_rows": int(df.duplicated().sum()),
    }

    output_dir.mkdir(parents=True, exist_ok=True)
    (output_dir / "eda_report.json").write_text(json.dumps(report, indent=2), encoding="utf-8")

    plots = _make_plots(df, numeric_cols, target_col, output_dir / "plots")
    report["plots"] = plots

    (output_dir / "eda_report.md").write_text(_render_markdown(report), encoding="utf-8")
    return report


def _render_markdown(report: dict[str, Any]) -> str:
    lines = ["# EDA Report", ""]
    lines.append(f"Rows: {report['shape']['rows']}, Columns: {report['shape']['cols']}")
    lines.append(f"Duplicate rows: {report['duplicate_rows']}")
    lines.append("")

    lines.append("## Missing values")
    if report["missing_values"]:
        for col, stats in report["missing_values"].items():
            lines.append(f"- `{col}`: {stats['missing_count']} missing ({stats['missing_pct']}%)")
    else:
        lines.append("- None")
    lines.append("")

    if report["target_balance"]:
        lines.append("## Target class balance")
        for k, v in report["target_balance"]["pct"].items():
            lines.append(f"- class `{k}`: {v}%")
        lines.append(f"- imbalance ratio (majority:minority): {report['target_balance']['imbalance_ratio']}")
        lines.append("")

    lines.append("## Numeric feature summary (with IQR outliers)")
    for col, stats in report["numeric_summary"].items():
        lines.append(
            f"- `{col}`: mean={stats['mean']}, median={stats['50%']}, skew={stats['skew']}, "
            f"IQR outliers={stats['iqr_outlier_count']} ({stats['iqr_outlier_pct']}%)"
        )
        if "domain_impossible_count" in stats and stats["domain_impossible_count"] > 0:
            lines.append(
                f"  - ⚠ {stats['domain_impossible_count']} value(s) outside plausible domain range "
                f"{stats['domain_sanity_bounds']} — likely data entry errors, not real outliers"
            )
    lines.append("")

    lines.append("## Correlation with target")
    for col, corr in report["correlation_with_target"].items():
        lines.append(f"- `{col}`: {corr}")
    lines.append("")

    return "\n".join(lines)


if __name__ == "__main__":
    from train_credit_model import DATA_PATH, TARGET_COLUMN, ARTIFACT_DIR, load_dataset

    df = load_dataset()
    report = run_eda(df, TARGET_COLUMN, ARTIFACT_DIR / "eda")
    print(f"EDA report written to {ARTIFACT_DIR / 'eda'}")
    print(json.dumps({k: report[k] for k in ("shape", "target_balance", "duplicate_rows")}, indent=2))
