# EDA Report

Rows: 20000, Columns: 17
Duplicate rows: 0

## Missing values
- None

## Target class balance
- class `0`: 83.1%
- class `1`: 16.9%
- imbalance ratio (majority:minority): 4.92

## Numeric feature summary (with IQR outliers)
- `wallet_active_days_ratio_90d`: mean=0.292, median=0.2889, skew=0.104, IQR outliers=23 (0.11%)
- `wallet_txn_count_90d`: mean=31.483, median=31.0, skew=0.315, IQR outliers=71 (0.36%)
- `wallet_txn_count_30d`: mean=10.498, median=10.0, skew=0.477, IQR outliers=157 (0.78%)
- `wallet_days_since_last_txn`: mean=2.574, median=2.0, skew=2.796, IQR outliers=680 (3.4%)
- `wallet_topup_count_90d`: mean=16.473, median=16.0, skew=0.556, IQR outliers=174 (0.87%)
- `wallet_topup_avg_amount`: mean=127.556, median=127.39500000000001, skew=-0.032, IQR outliers=1 (0.01%)
- `wallet_topup_frequency_per_month`: mean=5.491, median=5.33, skew=0.556, IQR outliers=225 (1.12%)
- `wallet_bill_payment_count_90d`: mean=3.897, median=4.0, skew=0.382, IQR outliers=0 (0.0%)
- `wallet_bill_payment_share`: mean=0.136, median=0.1212, skew=1.169, IQR outliers=607 (3.03%)
- `wallet_distinct_billers_90d`: mean=1.872, median=2.0, skew=-0.055, IQR outliers=0 (0.0%)
- `wallet_avg_balance`: mean=-212.661, median=-189.425, skew=-0.308, IQR outliers=494 (2.47%)
- `wallet_inflow_outflow_ratio`: mean=0.914, median=0.737, skew=9.75, IQR outliers=994 (4.97%)
- `wallet_txn_amount_volatility`: mean=1255.446, median=1221.74, skew=0.452, IQR outliers=187 (0.94%)

## Correlation with target
- `wallet_active_days_ratio_90d`: -0.172
- `wallet_txn_count_90d`: -0.169
- `wallet_avg_balance`: -0.167
- `wallet_txn_count_30d`: -0.14
- `wallet_topup_frequency_per_month`: -0.138
- `wallet_topup_count_90d`: -0.138
- `wallet_topup_avg_amount`: -0.121
- `wallet_days_since_last_txn`: 0.115
- `wallet_inflow_outflow_ratio`: -0.112
- `wallet_bill_payment_share`: 0.07
- `wallet_distinct_billers_90d`: -0.057
- `wallet_bill_payment_count_90d`: -0.051
- `wallet_txn_amount_volatility`: 0.008
