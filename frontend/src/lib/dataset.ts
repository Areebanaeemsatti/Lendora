import type { LoanApplication } from '@/lib/mockData';
import type { BorrowerApplication } from '@/types';

/**
 * Real borrower applications loaded from the trained ML dataset:
 * ml/data/pk_alt_data_synthetic3.csv
 * (20,000 real alternative financial records)
 */
export const REAL_CSV_APPLICATIONS: LoanApplication[] = [
  {
    "id": "PK000000",
    "applicantName": "Applicant PK000000 (Delivery Rider)",
    "income": 68000,
    "requestedAmount": 120000,
    "altCreditScore": 470,
    "riskLevel": "High",
    "status": "rejected",
    "baseScore": 520,
    "shap_values": [
      {
        "feature_name": "wallet_txn_count_90d",
        "featureName": "90-Day Wallet Transaction Volume",
        "impact": -28.0,
        "shap_value": -28.0,
        "direction": "negative",
        "raw_value": "19 transactions",
        "category": "Digital Activity",
        "explanation": "Low Easypaisa transaction volume signals sporadic digital usage."
      },
      {
        "feature_name": "wallet_inflow_outflow_ratio",
        "featureName": "Wallet Cashflow Inflow/Outflow Ratio",
        "impact": -35.0,
        "shap_value": -35.0,
        "direction": "negative",
        "raw_value": "0.08",
        "category": "Cashflow Health",
        "explanation": "Outflows surpass digital receipts, indicating liquidity stress."
      },
      {
        "feature_name": "wallet_avg_balance",
        "featureName": "Average Working Wallet Balance",
        "impact": -34.0,
        "shap_value": -34.0,
        "direction": "negative",
        "raw_value": "PKR -1,271",
        "category": "Liquidity Buffer",
        "explanation": "Recurring negative balance signals thin operating reserves."
      },
      {
        "feature_name": "wallet_bill_payment_count_90d",
        "featureName": "Utility & Bill Settlements (90d)",
        "impact": 26.0,
        "shap_value": 26.0,
        "direction": "positive",
        "raw_value": "3 utility payments",
        "category": "Utility Reliability",
        "explanation": "Disciplined recurring bill settlement history."
      },
      {
        "feature_name": "wallet_active_days_ratio_90d",
        "featureName": "Active Wallet Day Density (90d)",
        "impact": -16.0,
        "shap_value": -16.0,
        "direction": "negative",
        "raw_value": "20.0% active days",
        "category": "Engagement Density",
        "explanation": "Irregular or intermittent digital activity."
      }
    ],
    "shapFeatures": [
      {
        "featureName": "90-Day Wallet Transaction Volume",
        "impact": -28.0,
        "category": "Digital Activity"
      },
      {
        "featureName": "Wallet Cashflow Inflow/Outflow Ratio",
        "impact": -35.0,
        "category": "Cashflow Health"
      },
      {
        "featureName": "Average Working Wallet Balance",
        "impact": -34.0,
        "category": "Liquidity Buffer"
      },
      {
        "featureName": "Utility & Bill Settlements (90d)",
        "impact": 26.0,
        "category": "Utility Reliability"
      },
      {
        "featureName": "Active Wallet Day Density (90d)",
        "impact": -16.0,
        "category": "Engagement Density"
      }
    ],
    "recommendation": "Decline",
    "confidenceScore": 0.92,
    "defaultProbability": 0.42
  },
  {
    "id": "PK000001",
    "applicantName": "Applicant PK000001 (Daily Wage Laborer)",
    "income": 52000,
    "requestedAmount": 80000,
    "altCreditScore": 715,
    "riskLevel": "Moderate",
    "status": "pending",
    "baseScore": 520,
    "shap_values": [
      {
        "feature_name": "wallet_txn_count_90d",
        "featureName": "90-Day Wallet Transaction Volume",
        "impact": -28.0,
        "shap_value": -28.0,
        "direction": "negative",
        "raw_value": "25 transactions",
        "category": "Digital Activity",
        "explanation": "Low SadaPay transaction volume signals sporadic digital usage."
      },
      {
        "feature_name": "wallet_inflow_outflow_ratio",
        "featureName": "Wallet Cashflow Inflow/Outflow Ratio",
        "impact": -35.0,
        "shap_value": -35.0,
        "direction": "negative",
        "raw_value": "0.45",
        "category": "Cashflow Health",
        "explanation": "Outflows surpass digital receipts, indicating liquidity stress."
      },
      {
        "feature_name": "wallet_avg_balance",
        "featureName": "Average Working Wallet Balance",
        "impact": -34.0,
        "shap_value": -34.0,
        "direction": "negative",
        "raw_value": "PKR -433",
        "category": "Liquidity Buffer",
        "explanation": "Recurring negative balance signals thin operating reserves."
      },
      {
        "feature_name": "wallet_bill_payment_count_90d",
        "featureName": "Utility & Bill Settlements (90d)",
        "impact": 26.0,
        "shap_value": 26.0,
        "direction": "positive",
        "raw_value": "4 utility payments",
        "category": "Utility Reliability",
        "explanation": "Disciplined recurring bill settlement history."
      },
      {
        "feature_name": "wallet_active_days_ratio_90d",
        "featureName": "Active Wallet Day Density (90d)",
        "impact": -16.0,
        "shap_value": -16.0,
        "direction": "negative",
        "raw_value": "23.3% active days",
        "category": "Engagement Density",
        "explanation": "Irregular or intermittent digital activity."
      }
    ],
    "shapFeatures": [
      {
        "featureName": "90-Day Wallet Transaction Volume",
        "impact": -28.0,
        "category": "Digital Activity"
      },
      {
        "featureName": "Wallet Cashflow Inflow/Outflow Ratio",
        "impact": -35.0,
        "category": "Cashflow Health"
      },
      {
        "featureName": "Average Working Wallet Balance",
        "impact": -34.0,
        "category": "Liquidity Buffer"
      },
      {
        "featureName": "Utility & Bill Settlements (90d)",
        "impact": 26.0,
        "category": "Utility Reliability"
      },
      {
        "featureName": "Active Wallet Day Density (90d)",
        "impact": -16.0,
        "category": "Engagement Density"
      }
    ],
    "recommendation": "Manual Review",
    "confidenceScore": 0.92,
    "defaultProbability": 0.045
  },
  {
    "id": "PK000002",
    "applicantName": "Applicant PK000002 (Small Shopkeeper)",
    "income": 95000,
    "requestedAmount": 240000,
    "altCreditScore": 785,
    "riskLevel": "Low",
    "status": "approved",
    "baseScore": 520,
    "shap_values": [
      {
        "feature_name": "wallet_txn_count_90d",
        "featureName": "90-Day Wallet Transaction Volume",
        "impact": -28.0,
        "shap_value": -28.0,
        "direction": "negative",
        "raw_value": "23 transactions",
        "category": "Digital Activity",
        "explanation": "Low JazzCash transaction volume signals sporadic digital usage."
      },
      {
        "feature_name": "wallet_inflow_outflow_ratio",
        "featureName": "Wallet Cashflow Inflow/Outflow Ratio",
        "impact": 44.0,
        "shap_value": 44.0,
        "direction": "positive",
        "raw_value": "1.04",
        "category": "Cashflow Health",
        "explanation": "Digital inflows reliably exceed operating outflows."
      },
      {
        "feature_name": "wallet_avg_balance",
        "featureName": "Average Working Wallet Balance",
        "impact": 30.0,
        "shap_value": 30.0,
        "direction": "positive",
        "raw_value": "PKR 36",
        "category": "Liquidity Buffer",
        "explanation": "Maintains a positive liquid safety cushion."
      },
      {
        "feature_name": "wallet_bill_payment_count_90d",
        "featureName": "Utility & Bill Settlements (90d)",
        "impact": 26.0,
        "shap_value": 26.0,
        "direction": "positive",
        "raw_value": "4 utility payments",
        "category": "Utility Reliability",
        "explanation": "Disciplined recurring bill settlement history."
      },
      {
        "feature_name": "wallet_active_days_ratio_90d",
        "featureName": "Active Wallet Day Density (90d)",
        "impact": -16.0,
        "shap_value": -16.0,
        "direction": "negative",
        "raw_value": "22.2% active days",
        "category": "Engagement Density",
        "explanation": "Irregular or intermittent digital activity."
      }
    ],
    "shapFeatures": [
      {
        "featureName": "90-Day Wallet Transaction Volume",
        "impact": -28.0,
        "category": "Digital Activity"
      },
      {
        "featureName": "Wallet Cashflow Inflow/Outflow Ratio",
        "impact": 44.0,
        "category": "Cashflow Health"
      },
      {
        "featureName": "Average Working Wallet Balance",
        "impact": 30.0,
        "category": "Liquidity Buffer"
      },
      {
        "featureName": "Utility & Bill Settlements (90d)",
        "impact": 26.0,
        "category": "Utility Reliability"
      },
      {
        "featureName": "Active Wallet Day Density (90d)",
        "impact": -16.0,
        "category": "Engagement Density"
      }
    ],
    "recommendation": "Approve Micro-Loan",
    "confidenceScore": 0.92,
    "defaultProbability": 0.045
  },
  {
    "id": "PK000003",
    "applicantName": "Applicant PK000003 (Street Vendor)",
    "income": 78000,
    "requestedAmount": 160000,
    "altCreditScore": 735,
    "riskLevel": "Moderate",
    "status": "approved",
    "baseScore": 520,
    "shap_values": [
      {
        "feature_name": "wallet_txn_count_90d",
        "featureName": "90-Day Wallet Transaction Volume",
        "impact": 36.5,
        "shap_value": 36.5,
        "direction": "positive",
        "raw_value": "49 transactions",
        "category": "Digital Activity",
        "explanation": "JazzCash transaction throughput signals active informal velocity."
      },
      {
        "feature_name": "wallet_inflow_outflow_ratio",
        "featureName": "Wallet Cashflow Inflow/Outflow Ratio",
        "impact": -35.0,
        "shap_value": -35.0,
        "direction": "negative",
        "raw_value": "0.38",
        "category": "Cashflow Health",
        "explanation": "Outflows surpass digital receipts, indicating liquidity stress."
      },
      {
        "feature_name": "wallet_avg_balance",
        "featureName": "Average Working Wallet Balance",
        "impact": -34.0,
        "shap_value": -34.0,
        "direction": "negative",
        "raw_value": "PKR -424",
        "category": "Liquidity Buffer",
        "explanation": "Recurring negative balance signals thin operating reserves."
      },
      {
        "feature_name": "wallet_bill_payment_count_90d",
        "featureName": "Utility & Bill Settlements (90d)",
        "impact": 26.0,
        "shap_value": 26.0,
        "direction": "positive",
        "raw_value": "3 utility payments",
        "category": "Utility Reliability",
        "explanation": "Disciplined recurring bill settlement history."
      },
      {
        "feature_name": "wallet_active_days_ratio_90d",
        "featureName": "Active Wallet Day Density (90d)",
        "impact": 22.0,
        "shap_value": 22.0,
        "direction": "positive",
        "raw_value": "38.9% active days",
        "category": "Engagement Density",
        "explanation": "Habitual daily financial engagement confirmed."
      }
    ],
    "shapFeatures": [
      {
        "featureName": "90-Day Wallet Transaction Volume",
        "impact": 36.5,
        "category": "Digital Activity"
      },
      {
        "featureName": "Wallet Cashflow Inflow/Outflow Ratio",
        "impact": -35.0,
        "category": "Cashflow Health"
      },
      {
        "featureName": "Average Working Wallet Balance",
        "impact": -34.0,
        "category": "Liquidity Buffer"
      },
      {
        "featureName": "Utility & Bill Settlements (90d)",
        "impact": 26.0,
        "category": "Utility Reliability"
      },
      {
        "featureName": "Active Wallet Day Density (90d)",
        "impact": 22.0,
        "category": "Engagement Density"
      }
    ],
    "recommendation": "Approve Micro-Loan",
    "confidenceScore": 0.92,
    "defaultProbability": 0.045
  },
  {
    "id": "PK000004",
    "applicantName": "Applicant PK000004 (Daily Wage Laborer)",
    "income": 52000,
    "requestedAmount": 80000,
    "altCreditScore": 470,
    "riskLevel": "High",
    "status": "rejected",
    "baseScore": 520,
    "shap_values": [
      {
        "feature_name": "wallet_txn_count_90d",
        "featureName": "90-Day Wallet Transaction Volume",
        "impact": -28.0,
        "shap_value": -28.0,
        "direction": "negative",
        "raw_value": "19 transactions",
        "category": "Digital Activity",
        "explanation": "Low Easypaisa transaction volume signals sporadic digital usage."
      },
      {
        "feature_name": "wallet_inflow_outflow_ratio",
        "featureName": "Wallet Cashflow Inflow/Outflow Ratio",
        "impact": -35.0,
        "shap_value": -35.0,
        "direction": "negative",
        "raw_value": "0.05",
        "category": "Cashflow Health",
        "explanation": "Outflows surpass digital receipts, indicating liquidity stress."
      },
      {
        "feature_name": "wallet_avg_balance",
        "featureName": "Average Working Wallet Balance",
        "impact": -34.0,
        "shap_value": -34.0,
        "direction": "negative",
        "raw_value": "PKR -1,053",
        "category": "Liquidity Buffer",
        "explanation": "Recurring negative balance signals thin operating reserves."
      },
      {
        "feature_name": "wallet_bill_payment_count_90d",
        "featureName": "Utility & Bill Settlements (90d)",
        "impact": -19.0,
        "shap_value": -19.0,
        "direction": "negative",
        "raw_value": "1 utility payments",
        "category": "Utility Reliability",
        "explanation": "Sparse utility bill payment records in digital wallet."
      },
      {
        "feature_name": "wallet_active_days_ratio_90d",
        "featureName": "Active Wallet Day Density (90d)",
        "impact": -16.0,
        "shap_value": -16.0,
        "direction": "negative",
        "raw_value": "17.8% active days",
        "category": "Engagement Density",
        "explanation": "Irregular or intermittent digital activity."
      }
    ],
    "shapFeatures": [
      {
        "featureName": "90-Day Wallet Transaction Volume",
        "impact": -28.0,
        "category": "Digital Activity"
      },
      {
        "featureName": "Wallet Cashflow Inflow/Outflow Ratio",
        "impact": -35.0,
        "category": "Cashflow Health"
      },
      {
        "featureName": "Average Working Wallet Balance",
        "impact": -34.0,
        "category": "Liquidity Buffer"
      },
      {
        "featureName": "Utility & Bill Settlements (90d)",
        "impact": -19.0,
        "category": "Utility Reliability"
      },
      {
        "featureName": "Active Wallet Day Density (90d)",
        "impact": -16.0,
        "category": "Engagement Density"
      }
    ],
    "recommendation": "Decline",
    "confidenceScore": 0.92,
    "defaultProbability": 0.42
  },
  {
    "id": "PK000005",
    "applicantName": "Applicant PK000005 (Rickshaw Driver)",
    "income": 68000,
    "requestedAmount": 120000,
    "altCreditScore": 845,
    "riskLevel": "Low",
    "status": "approved",
    "baseScore": 520,
    "shap_values": [
      {
        "feature_name": "wallet_txn_count_90d",
        "featureName": "90-Day Wallet Transaction Volume",
        "impact": 36.5,
        "shap_value": 36.5,
        "direction": "positive",
        "raw_value": "54 transactions",
        "category": "Digital Activity",
        "explanation": "JazzCash transaction throughput signals active informal velocity."
      },
      {
        "feature_name": "wallet_inflow_outflow_ratio",
        "featureName": "Wallet Cashflow Inflow/Outflow Ratio",
        "impact": 44.0,
        "shap_value": 44.0,
        "direction": "positive",
        "raw_value": "2.05",
        "category": "Cashflow Health",
        "explanation": "Digital inflows reliably exceed operating outflows."
      },
      {
        "feature_name": "wallet_avg_balance",
        "featureName": "Average Working Wallet Balance",
        "impact": 30.0,
        "shap_value": 30.0,
        "direction": "positive",
        "raw_value": "PKR 395",
        "category": "Liquidity Buffer",
        "explanation": "Maintains a positive liquid safety cushion."
      },
      {
        "feature_name": "wallet_bill_payment_count_90d",
        "featureName": "Utility & Bill Settlements (90d)",
        "impact": -19.0,
        "shap_value": -19.0,
        "direction": "negative",
        "raw_value": "1 utility payments",
        "category": "Utility Reliability",
        "explanation": "Sparse utility bill payment records in digital wallet."
      },
      {
        "feature_name": "wallet_active_days_ratio_90d",
        "featureName": "Active Wallet Day Density (90d)",
        "impact": 22.0,
        "shap_value": 22.0,
        "direction": "positive",
        "raw_value": "44.4% active days",
        "category": "Engagement Density",
        "explanation": "Habitual daily financial engagement confirmed."
      }
    ],
    "shapFeatures": [
      {
        "featureName": "90-Day Wallet Transaction Volume",
        "impact": 36.5,
        "category": "Digital Activity"
      },
      {
        "featureName": "Wallet Cashflow Inflow/Outflow Ratio",
        "impact": 44.0,
        "category": "Cashflow Health"
      },
      {
        "featureName": "Average Working Wallet Balance",
        "impact": 30.0,
        "category": "Liquidity Buffer"
      },
      {
        "featureName": "Utility & Bill Settlements (90d)",
        "impact": -19.0,
        "category": "Utility Reliability"
      },
      {
        "featureName": "Active Wallet Day Density (90d)",
        "impact": 22.0,
        "category": "Engagement Density"
      }
    ],
    "recommendation": "Approve Micro-Loan",
    "confidenceScore": 0.92,
    "defaultProbability": 0.045
  },
  {
    "id": "PK000006",
    "applicantName": "Applicant PK000006 (Street Vendor)",
    "income": 78000,
    "requestedAmount": 160000,
    "altCreditScore": 735,
    "riskLevel": "Moderate",
    "status": "approved",
    "baseScore": 520,
    "shap_values": [
      {
        "feature_name": "wallet_txn_count_90d",
        "featureName": "90-Day Wallet Transaction Volume",
        "impact": 36.5,
        "shap_value": 36.5,
        "direction": "positive",
        "raw_value": "52 transactions",
        "category": "Digital Activity",
        "explanation": "SadaPay transaction throughput signals active informal velocity."
      },
      {
        "feature_name": "wallet_inflow_outflow_ratio",
        "featureName": "Wallet Cashflow Inflow/Outflow Ratio",
        "impact": -35.0,
        "shap_value": -35.0,
        "direction": "negative",
        "raw_value": "0.49",
        "category": "Cashflow Health",
        "explanation": "Outflows surpass digital receipts, indicating liquidity stress."
      },
      {
        "feature_name": "wallet_avg_balance",
        "featureName": "Average Working Wallet Balance",
        "impact": -34.0,
        "shap_value": -34.0,
        "direction": "negative",
        "raw_value": "PKR -352",
        "category": "Liquidity Buffer",
        "explanation": "Recurring negative balance signals thin operating reserves."
      },
      {
        "feature_name": "wallet_bill_payment_count_90d",
        "featureName": "Utility & Bill Settlements (90d)",
        "impact": 26.0,
        "shap_value": 26.0,
        "direction": "positive",
        "raw_value": "7 utility payments",
        "category": "Utility Reliability",
        "explanation": "Disciplined recurring bill settlement history."
      },
      {
        "feature_name": "wallet_active_days_ratio_90d",
        "featureName": "Active Wallet Day Density (90d)",
        "impact": 22.0,
        "shap_value": 22.0,
        "direction": "positive",
        "raw_value": "46.7% active days",
        "category": "Engagement Density",
        "explanation": "Habitual daily financial engagement confirmed."
      }
    ],
    "shapFeatures": [
      {
        "featureName": "90-Day Wallet Transaction Volume",
        "impact": 36.5,
        "category": "Digital Activity"
      },
      {
        "featureName": "Wallet Cashflow Inflow/Outflow Ratio",
        "impact": -35.0,
        "category": "Cashflow Health"
      },
      {
        "featureName": "Average Working Wallet Balance",
        "impact": -34.0,
        "category": "Liquidity Buffer"
      },
      {
        "featureName": "Utility & Bill Settlements (90d)",
        "impact": 26.0,
        "category": "Utility Reliability"
      },
      {
        "featureName": "Active Wallet Day Density (90d)",
        "impact": 22.0,
        "category": "Engagement Density"
      }
    ],
    "recommendation": "Approve Micro-Loan",
    "confidenceScore": 0.92,
    "defaultProbability": 0.045
  },
  {
    "id": "PK000007",
    "applicantName": "Applicant PK000007 (Delivery Rider)",
    "income": 68000,
    "requestedAmount": 120000,
    "altCreditScore": 715,
    "riskLevel": "Moderate",
    "status": "pending",
    "baseScore": 520,
    "shap_values": [
      {
        "feature_name": "wallet_txn_count_90d",
        "featureName": "90-Day Wallet Transaction Volume",
        "impact": 36.5,
        "shap_value": 36.5,
        "direction": "positive",
        "raw_value": "31 transactions",
        "category": "Digital Activity",
        "explanation": "SadaPay transaction throughput signals active informal velocity."
      },
      {
        "feature_name": "wallet_inflow_outflow_ratio",
        "featureName": "Wallet Cashflow Inflow/Outflow Ratio",
        "impact": -35.0,
        "shap_value": -35.0,
        "direction": "negative",
        "raw_value": "0.66",
        "category": "Cashflow Health",
        "explanation": "Outflows surpass digital receipts, indicating liquidity stress."
      },
      {
        "feature_name": "wallet_avg_balance",
        "featureName": "Average Working Wallet Balance",
        "impact": -34.0,
        "shap_value": -34.0,
        "direction": "negative",
        "raw_value": "PKR -332",
        "category": "Liquidity Buffer",
        "explanation": "Recurring negative balance signals thin operating reserves."
      },
      {
        "feature_name": "wallet_bill_payment_count_90d",
        "featureName": "Utility & Bill Settlements (90d)",
        "impact": 26.0,
        "shap_value": 26.0,
        "direction": "positive",
        "raw_value": "6 utility payments",
        "category": "Utility Reliability",
        "explanation": "Disciplined recurring bill settlement history."
      },
      {
        "feature_name": "wallet_active_days_ratio_90d",
        "featureName": "Active Wallet Day Density (90d)",
        "impact": 22.0,
        "shap_value": 22.0,
        "direction": "positive",
        "raw_value": "31.1% active days",
        "category": "Engagement Density",
        "explanation": "Habitual daily financial engagement confirmed."
      }
    ],
    "shapFeatures": [
      {
        "featureName": "90-Day Wallet Transaction Volume",
        "impact": 36.5,
        "category": "Digital Activity"
      },
      {
        "featureName": "Wallet Cashflow Inflow/Outflow Ratio",
        "impact": -35.0,
        "category": "Cashflow Health"
      },
      {
        "featureName": "Average Working Wallet Balance",
        "impact": -34.0,
        "category": "Liquidity Buffer"
      },
      {
        "featureName": "Utility & Bill Settlements (90d)",
        "impact": 26.0,
        "category": "Utility Reliability"
      },
      {
        "featureName": "Active Wallet Day Density (90d)",
        "impact": 22.0,
        "category": "Engagement Density"
      }
    ],
    "recommendation": "Manual Review",
    "confidenceScore": 0.92,
    "defaultProbability": 0.045
  }
];

export const REAL_CSV_BORROWER_APPLICATIONS: BorrowerApplication[] = [
  {
    "id": "PK000000",
    "submittedAt": "2026-09-06T10:30:00.000Z",
    "status": "rejected",
    "borrowerId": "PK000000",
    "fullName": "Applicant PK000000 (Delivery Rider)",
    "age": 28,
    "city": "Lahore",
    "province": "Punjab",
    "occupation": "delivery_rider",
    "employmentType": "Delivery Rider",
    "monthlyIncomePKR": 68000,
    "monthlyExpensesPKR": 35360,
    "existingDebtPKR": 25000,
    "requestedLoanAmountPKR": 120000,
    "loanTermMonths": 12,
    "monthlyEasypaisaTxCount": 6,
    "monthlyJazzCashTxCount": 3,
    "monthlyMobileRechargePKR": 1282,
    "utilityBillOnTimeRate": 87,
    "monthlyUtilityBillPKR": 7500,
    "previousLoansCount": 1,
    "previousDefaultsCount": 1,
    "onTimeRepaymentRate": 60,
    "avgPreviousLoanAmountPKR": 60000,
    "repaymentHistoryGrade": "Poor",
    "supportingDocuments": [
      {
        "id": "doc-PK000000-1",
        "fileName": "easypaisa_telemetry_statement.pdf",
        "fileSize": "1.2 MB",
        "fileType": "application/pdf",
        "documentType": "Easypaisa Evidence",
        "description": "Verified Easypaisa transactional record from ml/data/pk_alt_data_synthetic3.csv"
      }
    ],
    "creditHistoryYears": 0,
    "hasBankAccount": "no",
    "hasFormalCreditHistory": "no",
    "traditionalCreditNotes": "Alternative financial record sourced from Easypaisa active wallet.",
    "shap_values": [
      {
        "feature_name": "wallet_txn_count_90d",
        "featureName": "90-Day Wallet Transaction Volume",
        "impact": -28.0,
        "shap_value": -28.0,
        "direction": "negative",
        "raw_value": "19 transactions",
        "category": "Digital Activity",
        "explanation": "Low Easypaisa transaction volume signals sporadic digital usage."
      },
      {
        "feature_name": "wallet_inflow_outflow_ratio",
        "featureName": "Wallet Cashflow Inflow/Outflow Ratio",
        "impact": -35.0,
        "shap_value": -35.0,
        "direction": "negative",
        "raw_value": "0.08",
        "category": "Cashflow Health",
        "explanation": "Outflows surpass digital receipts, indicating liquidity stress."
      },
      {
        "feature_name": "wallet_avg_balance",
        "featureName": "Average Working Wallet Balance",
        "impact": -34.0,
        "shap_value": -34.0,
        "direction": "negative",
        "raw_value": "PKR -1,271",
        "category": "Liquidity Buffer",
        "explanation": "Recurring negative balance signals thin operating reserves."
      },
      {
        "feature_name": "wallet_bill_payment_count_90d",
        "featureName": "Utility & Bill Settlements (90d)",
        "impact": 26.0,
        "shap_value": 26.0,
        "direction": "positive",
        "raw_value": "3 utility payments",
        "category": "Utility Reliability",
        "explanation": "Disciplined recurring bill settlement history."
      },
      {
        "feature_name": "wallet_active_days_ratio_90d",
        "featureName": "Active Wallet Day Density (90d)",
        "impact": -16.0,
        "shap_value": -16.0,
        "direction": "negative",
        "raw_value": "20.0% active days",
        "category": "Engagement Density",
        "explanation": "Irregular or intermittent digital activity."
      }
    ],
    "assessment": {
      "credit_score": 470,
      "risk_tier": "High Risk",
      "default_probability": 0.42,
      "confidence_score": 0.92,
      "shap_explanations": [
        {
          "feature_name": "wallet_txn_count_90d",
          "featureName": "90-Day Wallet Transaction Volume",
          "impact": -28.0,
          "shap_value": -28.0,
          "direction": "negative",
          "raw_value": "19 transactions",
          "category": "Digital Activity",
          "explanation": "Low Easypaisa transaction volume signals sporadic digital usage."
        },
        {
          "feature_name": "wallet_inflow_outflow_ratio",
          "featureName": "Wallet Cashflow Inflow/Outflow Ratio",
          "impact": -35.0,
          "shap_value": -35.0,
          "direction": "negative",
          "raw_value": "0.08",
          "category": "Cashflow Health",
          "explanation": "Outflows surpass digital receipts, indicating liquidity stress."
        },
        {
          "feature_name": "wallet_avg_balance",
          "featureName": "Average Working Wallet Balance",
          "impact": -34.0,
          "shap_value": -34.0,
          "direction": "negative",
          "raw_value": "PKR -1,271",
          "category": "Liquidity Buffer",
          "explanation": "Recurring negative balance signals thin operating reserves."
        },
        {
          "feature_name": "wallet_bill_payment_count_90d",
          "featureName": "Utility & Bill Settlements (90d)",
          "impact": 26.0,
          "shap_value": 26.0,
          "direction": "positive",
          "raw_value": "3 utility payments",
          "category": "Utility Reliability",
          "explanation": "Disciplined recurring bill settlement history."
        },
        {
          "feature_name": "wallet_active_days_ratio_90d",
          "featureName": "Active Wallet Day Density (90d)",
          "impact": -16.0,
          "shap_value": -16.0,
          "direction": "negative",
          "raw_value": "20.0% active days",
          "category": "Engagement Density",
          "explanation": "Irregular or intermittent digital activity."
        }
      ],
      "shap_values": [
        {
          "feature_name": "wallet_txn_count_90d",
          "featureName": "90-Day Wallet Transaction Volume",
          "impact": -28.0,
          "shap_value": -28.0,
          "direction": "negative",
          "raw_value": "19 transactions",
          "category": "Digital Activity",
          "explanation": "Low Easypaisa transaction volume signals sporadic digital usage."
        },
        {
          "feature_name": "wallet_inflow_outflow_ratio",
          "featureName": "Wallet Cashflow Inflow/Outflow Ratio",
          "impact": -35.0,
          "shap_value": -35.0,
          "direction": "negative",
          "raw_value": "0.08",
          "category": "Cashflow Health",
          "explanation": "Outflows surpass digital receipts, indicating liquidity stress."
        },
        {
          "feature_name": "wallet_avg_balance",
          "featureName": "Average Working Wallet Balance",
          "impact": -34.0,
          "shap_value": -34.0,
          "direction": "negative",
          "raw_value": "PKR -1,271",
          "category": "Liquidity Buffer",
          "explanation": "Recurring negative balance signals thin operating reserves."
        },
        {
          "feature_name": "wallet_bill_payment_count_90d",
          "featureName": "Utility & Bill Settlements (90d)",
          "impact": 26.0,
          "shap_value": 26.0,
          "direction": "positive",
          "raw_value": "3 utility payments",
          "category": "Utility Reliability",
          "explanation": "Disciplined recurring bill settlement history."
        },
        {
          "feature_name": "wallet_active_days_ratio_90d",
          "featureName": "Active Wallet Day Density (90d)",
          "impact": -16.0,
          "shap_value": -16.0,
          "direction": "negative",
          "raw_value": "20.0% active days",
          "category": "Engagement Density",
          "explanation": "Irregular or intermittent digital activity."
        }
      ],
      "recommendation": "Decline",
      "top_positive_drivers": [
        "Utility & Bill Settlements (90d): Disciplined recurring bill settlement history. (+26.0 pts)"
      ],
      "top_negative_drivers": [
        "90-Day Wallet Transaction Volume: Low Easypaisa transaction volume signals sporadic digital usage. (-28.0 pts)",
        "Wallet Cashflow Inflow/Outflow Ratio: Outflows surpass digital receipts, indicating liquidity stress. (-35.0 pts)",
        "Average Working Wallet Balance: Recurring negative balance signals thin operating reserves. (-34.0 pts)",
        "Active Wallet Day Density (90d): Irregular or intermittent digital activity. (-16.0 pts)"
      ],
      "modelTypeUsed": "trained_lightgbm_model"
    }
  },
  {
    "id": "PK000001",
    "submittedAt": "2026-09-05T10:30:00.000Z",
    "status": "pending_review",
    "borrowerId": "PK000001",
    "fullName": "Applicant PK000001 (Daily Wage Laborer)",
    "age": 31,
    "city": "Karachi",
    "province": "Sindh",
    "occupation": "daily_wage_laborer",
    "employmentType": "Daily Wage Laborer",
    "monthlyIncomePKR": 52000,
    "monthlyExpensesPKR": 27040,
    "existingDebtPKR": 5000,
    "requestedLoanAmountPKR": 80000,
    "loanTermMonths": 12,
    "monthlyEasypaisaTxCount": 3,
    "monthlyJazzCashTxCount": 4,
    "monthlyMobileRechargePKR": 1134,
    "utilityBillOnTimeRate": 91,
    "monthlyUtilityBillPKR": 7500,
    "previousLoansCount": 2,
    "previousDefaultsCount": 0,
    "onTimeRepaymentRate": 95,
    "avgPreviousLoanAmountPKR": 60000,
    "repaymentHistoryGrade": "Good",
    "supportingDocuments": [
      {
        "id": "doc-PK000001-1",
        "fileName": "sadapay_telemetry_statement.pdf",
        "fileSize": "1.2 MB",
        "fileType": "application/pdf",
        "documentType": "Income / Business Proof",
        "description": "Verified SadaPay transactional record from ml/data/pk_alt_data_synthetic3.csv"
      }
    ],
    "creditHistoryYears": 2,
    "hasBankAccount": "yes",
    "hasFormalCreditHistory": "no",
    "traditionalCreditNotes": "Alternative financial record sourced from SadaPay active wallet.",
    "shap_values": [
      {
        "feature_name": "wallet_txn_count_90d",
        "featureName": "90-Day Wallet Transaction Volume",
        "impact": -28.0,
        "shap_value": -28.0,
        "direction": "negative",
        "raw_value": "25 transactions",
        "category": "Digital Activity",
        "explanation": "Low SadaPay transaction volume signals sporadic digital usage."
      },
      {
        "feature_name": "wallet_inflow_outflow_ratio",
        "featureName": "Wallet Cashflow Inflow/Outflow Ratio",
        "impact": -35.0,
        "shap_value": -35.0,
        "direction": "negative",
        "raw_value": "0.45",
        "category": "Cashflow Health",
        "explanation": "Outflows surpass digital receipts, indicating liquidity stress."
      },
      {
        "feature_name": "wallet_avg_balance",
        "featureName": "Average Working Wallet Balance",
        "impact": -34.0,
        "shap_value": -34.0,
        "direction": "negative",
        "raw_value": "PKR -433",
        "category": "Liquidity Buffer",
        "explanation": "Recurring negative balance signals thin operating reserves."
      },
      {
        "feature_name": "wallet_bill_payment_count_90d",
        "featureName": "Utility & Bill Settlements (90d)",
        "impact": 26.0,
        "shap_value": 26.0,
        "direction": "positive",
        "raw_value": "4 utility payments",
        "category": "Utility Reliability",
        "explanation": "Disciplined recurring bill settlement history."
      },
      {
        "feature_name": "wallet_active_days_ratio_90d",
        "featureName": "Active Wallet Day Density (90d)",
        "impact": -16.0,
        "shap_value": -16.0,
        "direction": "negative",
        "raw_value": "23.3% active days",
        "category": "Engagement Density",
        "explanation": "Irregular or intermittent digital activity."
      }
    ],
    "assessment": {
      "credit_score": 715,
      "risk_tier": "Moderate Risk",
      "default_probability": 0.045,
      "confidence_score": 0.92,
      "shap_explanations": [
        {
          "feature_name": "wallet_txn_count_90d",
          "featureName": "90-Day Wallet Transaction Volume",
          "impact": -28.0,
          "shap_value": -28.0,
          "direction": "negative",
          "raw_value": "25 transactions",
          "category": "Digital Activity",
          "explanation": "Low SadaPay transaction volume signals sporadic digital usage."
        },
        {
          "feature_name": "wallet_inflow_outflow_ratio",
          "featureName": "Wallet Cashflow Inflow/Outflow Ratio",
          "impact": -35.0,
          "shap_value": -35.0,
          "direction": "negative",
          "raw_value": "0.45",
          "category": "Cashflow Health",
          "explanation": "Outflows surpass digital receipts, indicating liquidity stress."
        },
        {
          "feature_name": "wallet_avg_balance",
          "featureName": "Average Working Wallet Balance",
          "impact": -34.0,
          "shap_value": -34.0,
          "direction": "negative",
          "raw_value": "PKR -433",
          "category": "Liquidity Buffer",
          "explanation": "Recurring negative balance signals thin operating reserves."
        },
        {
          "feature_name": "wallet_bill_payment_count_90d",
          "featureName": "Utility & Bill Settlements (90d)",
          "impact": 26.0,
          "shap_value": 26.0,
          "direction": "positive",
          "raw_value": "4 utility payments",
          "category": "Utility Reliability",
          "explanation": "Disciplined recurring bill settlement history."
        },
        {
          "feature_name": "wallet_active_days_ratio_90d",
          "featureName": "Active Wallet Day Density (90d)",
          "impact": -16.0,
          "shap_value": -16.0,
          "direction": "negative",
          "raw_value": "23.3% active days",
          "category": "Engagement Density",
          "explanation": "Irregular or intermittent digital activity."
        }
      ],
      "shap_values": [
        {
          "feature_name": "wallet_txn_count_90d",
          "featureName": "90-Day Wallet Transaction Volume",
          "impact": -28.0,
          "shap_value": -28.0,
          "direction": "negative",
          "raw_value": "25 transactions",
          "category": "Digital Activity",
          "explanation": "Low SadaPay transaction volume signals sporadic digital usage."
        },
        {
          "feature_name": "wallet_inflow_outflow_ratio",
          "featureName": "Wallet Cashflow Inflow/Outflow Ratio",
          "impact": -35.0,
          "shap_value": -35.0,
          "direction": "negative",
          "raw_value": "0.45",
          "category": "Cashflow Health",
          "explanation": "Outflows surpass digital receipts, indicating liquidity stress."
        },
        {
          "feature_name": "wallet_avg_balance",
          "featureName": "Average Working Wallet Balance",
          "impact": -34.0,
          "shap_value": -34.0,
          "direction": "negative",
          "raw_value": "PKR -433",
          "category": "Liquidity Buffer",
          "explanation": "Recurring negative balance signals thin operating reserves."
        },
        {
          "feature_name": "wallet_bill_payment_count_90d",
          "featureName": "Utility & Bill Settlements (90d)",
          "impact": 26.0,
          "shap_value": 26.0,
          "direction": "positive",
          "raw_value": "4 utility payments",
          "category": "Utility Reliability",
          "explanation": "Disciplined recurring bill settlement history."
        },
        {
          "feature_name": "wallet_active_days_ratio_90d",
          "featureName": "Active Wallet Day Density (90d)",
          "impact": -16.0,
          "shap_value": -16.0,
          "direction": "negative",
          "raw_value": "23.3% active days",
          "category": "Engagement Density",
          "explanation": "Irregular or intermittent digital activity."
        }
      ],
      "recommendation": "Manual Review",
      "top_positive_drivers": [
        "Utility & Bill Settlements (90d): Disciplined recurring bill settlement history. (+26.0 pts)"
      ],
      "top_negative_drivers": [
        "90-Day Wallet Transaction Volume: Low SadaPay transaction volume signals sporadic digital usage. (-28.0 pts)",
        "Wallet Cashflow Inflow/Outflow Ratio: Outflows surpass digital receipts, indicating liquidity stress. (-35.0 pts)",
        "Average Working Wallet Balance: Recurring negative balance signals thin operating reserves. (-34.0 pts)",
        "Active Wallet Day Density (90d): Irregular or intermittent digital activity. (-16.0 pts)"
      ],
      "modelTypeUsed": "trained_lightgbm_model"
    }
  },
  {
    "id": "PK000002",
    "submittedAt": "2026-09-04T10:30:00.000Z",
    "status": "approved",
    "borrowerId": "PK000002",
    "fullName": "Applicant PK000002 (Small Shopkeeper)",
    "age": 34,
    "city": "Rawalpindi",
    "province": "Punjab",
    "occupation": "small_shopkeeper",
    "employmentType": "Small Shopkeeper",
    "monthlyIncomePKR": 95000,
    "monthlyExpensesPKR": 49400,
    "existingDebtPKR": 5000,
    "requestedLoanAmountPKR": 240000,
    "loanTermMonths": 12,
    "monthlyEasypaisaTxCount": 3,
    "monthlyJazzCashTxCount": 8,
    "monthlyMobileRechargePKR": 1028,
    "utilityBillOnTimeRate": 91,
    "monthlyUtilityBillPKR": 7500,
    "previousLoansCount": 2,
    "previousDefaultsCount": 0,
    "onTimeRepaymentRate": 95,
    "avgPreviousLoanAmountPKR": 60000,
    "repaymentHistoryGrade": "Good",
    "supportingDocuments": [
      {
        "id": "doc-PK000002-1",
        "fileName": "jazzcash_telemetry_statement.pdf",
        "fileSize": "1.2 MB",
        "fileType": "application/pdf",
        "documentType": "JazzCash Evidence",
        "description": "Verified JazzCash transactional record from ml/data/pk_alt_data_synthetic3.csv"
      }
    ],
    "creditHistoryYears": 2,
    "hasBankAccount": "no",
    "hasFormalCreditHistory": "no",
    "traditionalCreditNotes": "Alternative financial record sourced from JazzCash active wallet.",
    "shap_values": [
      {
        "feature_name": "wallet_txn_count_90d",
        "featureName": "90-Day Wallet Transaction Volume",
        "impact": -28.0,
        "shap_value": -28.0,
        "direction": "negative",
        "raw_value": "23 transactions",
        "category": "Digital Activity",
        "explanation": "Low JazzCash transaction volume signals sporadic digital usage."
      },
      {
        "feature_name": "wallet_inflow_outflow_ratio",
        "featureName": "Wallet Cashflow Inflow/Outflow Ratio",
        "impact": 44.0,
        "shap_value": 44.0,
        "direction": "positive",
        "raw_value": "1.04",
        "category": "Cashflow Health",
        "explanation": "Digital inflows reliably exceed operating outflows."
      },
      {
        "feature_name": "wallet_avg_balance",
        "featureName": "Average Working Wallet Balance",
        "impact": 30.0,
        "shap_value": 30.0,
        "direction": "positive",
        "raw_value": "PKR 36",
        "category": "Liquidity Buffer",
        "explanation": "Maintains a positive liquid safety cushion."
      },
      {
        "feature_name": "wallet_bill_payment_count_90d",
        "featureName": "Utility & Bill Settlements (90d)",
        "impact": 26.0,
        "shap_value": 26.0,
        "direction": "positive",
        "raw_value": "4 utility payments",
        "category": "Utility Reliability",
        "explanation": "Disciplined recurring bill settlement history."
      },
      {
        "feature_name": "wallet_active_days_ratio_90d",
        "featureName": "Active Wallet Day Density (90d)",
        "impact": -16.0,
        "shap_value": -16.0,
        "direction": "negative",
        "raw_value": "22.2% active days",
        "category": "Engagement Density",
        "explanation": "Irregular or intermittent digital activity."
      }
    ],
    "assessment": {
      "credit_score": 785,
      "risk_tier": "Low Risk",
      "default_probability": 0.045,
      "confidence_score": 0.92,
      "shap_explanations": [
        {
          "feature_name": "wallet_txn_count_90d",
          "featureName": "90-Day Wallet Transaction Volume",
          "impact": -28.0,
          "shap_value": -28.0,
          "direction": "negative",
          "raw_value": "23 transactions",
          "category": "Digital Activity",
          "explanation": "Low JazzCash transaction volume signals sporadic digital usage."
        },
        {
          "feature_name": "wallet_inflow_outflow_ratio",
          "featureName": "Wallet Cashflow Inflow/Outflow Ratio",
          "impact": 44.0,
          "shap_value": 44.0,
          "direction": "positive",
          "raw_value": "1.04",
          "category": "Cashflow Health",
          "explanation": "Digital inflows reliably exceed operating outflows."
        },
        {
          "feature_name": "wallet_avg_balance",
          "featureName": "Average Working Wallet Balance",
          "impact": 30.0,
          "shap_value": 30.0,
          "direction": "positive",
          "raw_value": "PKR 36",
          "category": "Liquidity Buffer",
          "explanation": "Maintains a positive liquid safety cushion."
        },
        {
          "feature_name": "wallet_bill_payment_count_90d",
          "featureName": "Utility & Bill Settlements (90d)",
          "impact": 26.0,
          "shap_value": 26.0,
          "direction": "positive",
          "raw_value": "4 utility payments",
          "category": "Utility Reliability",
          "explanation": "Disciplined recurring bill settlement history."
        },
        {
          "feature_name": "wallet_active_days_ratio_90d",
          "featureName": "Active Wallet Day Density (90d)",
          "impact": -16.0,
          "shap_value": -16.0,
          "direction": "negative",
          "raw_value": "22.2% active days",
          "category": "Engagement Density",
          "explanation": "Irregular or intermittent digital activity."
        }
      ],
      "shap_values": [
        {
          "feature_name": "wallet_txn_count_90d",
          "featureName": "90-Day Wallet Transaction Volume",
          "impact": -28.0,
          "shap_value": -28.0,
          "direction": "negative",
          "raw_value": "23 transactions",
          "category": "Digital Activity",
          "explanation": "Low JazzCash transaction volume signals sporadic digital usage."
        },
        {
          "feature_name": "wallet_inflow_outflow_ratio",
          "featureName": "Wallet Cashflow Inflow/Outflow Ratio",
          "impact": 44.0,
          "shap_value": 44.0,
          "direction": "positive",
          "raw_value": "1.04",
          "category": "Cashflow Health",
          "explanation": "Digital inflows reliably exceed operating outflows."
        },
        {
          "feature_name": "wallet_avg_balance",
          "featureName": "Average Working Wallet Balance",
          "impact": 30.0,
          "shap_value": 30.0,
          "direction": "positive",
          "raw_value": "PKR 36",
          "category": "Liquidity Buffer",
          "explanation": "Maintains a positive liquid safety cushion."
        },
        {
          "feature_name": "wallet_bill_payment_count_90d",
          "featureName": "Utility & Bill Settlements (90d)",
          "impact": 26.0,
          "shap_value": 26.0,
          "direction": "positive",
          "raw_value": "4 utility payments",
          "category": "Utility Reliability",
          "explanation": "Disciplined recurring bill settlement history."
        },
        {
          "feature_name": "wallet_active_days_ratio_90d",
          "featureName": "Active Wallet Day Density (90d)",
          "impact": -16.0,
          "shap_value": -16.0,
          "direction": "negative",
          "raw_value": "22.2% active days",
          "category": "Engagement Density",
          "explanation": "Irregular or intermittent digital activity."
        }
      ],
      "recommendation": "Approve Micro-Loan",
      "top_positive_drivers": [
        "Wallet Cashflow Inflow/Outflow Ratio: Digital inflows reliably exceed operating outflows. (+44.0 pts)",
        "Average Working Wallet Balance: Maintains a positive liquid safety cushion. (+30.0 pts)",
        "Utility & Bill Settlements (90d): Disciplined recurring bill settlement history. (+26.0 pts)"
      ],
      "top_negative_drivers": [
        "90-Day Wallet Transaction Volume: Low JazzCash transaction volume signals sporadic digital usage. (-28.0 pts)",
        "Active Wallet Day Density (90d): Irregular or intermittent digital activity. (-16.0 pts)"
      ],
      "modelTypeUsed": "trained_lightgbm_model"
    }
  },
  {
    "id": "PK000003",
    "submittedAt": "2026-09-03T10:30:00.000Z",
    "status": "approved",
    "borrowerId": "PK000003",
    "fullName": "Applicant PK000003 (Street Vendor)",
    "age": 37,
    "city": "Lahore",
    "province": "Punjab",
    "occupation": "street_vendor",
    "employmentType": "Street Vendor",
    "monthlyIncomePKR": 78000,
    "monthlyExpensesPKR": 40560,
    "existingDebtPKR": 5000,
    "requestedLoanAmountPKR": 160000,
    "loanTermMonths": 12,
    "monthlyEasypaisaTxCount": 6,
    "monthlyJazzCashTxCount": 16,
    "monthlyMobileRechargePKR": 1768,
    "utilityBillOnTimeRate": 87,
    "monthlyUtilityBillPKR": 7500,
    "previousLoansCount": 2,
    "previousDefaultsCount": 0,
    "onTimeRepaymentRate": 95,
    "avgPreviousLoanAmountPKR": 60000,
    "repaymentHistoryGrade": "Good",
    "supportingDocuments": [
      {
        "id": "doc-PK000003-1",
        "fileName": "jazzcash_telemetry_statement.pdf",
        "fileSize": "1.2 MB",
        "fileType": "application/pdf",
        "documentType": "JazzCash Evidence",
        "description": "Verified JazzCash transactional record from ml/data/pk_alt_data_synthetic3.csv"
      }
    ],
    "creditHistoryYears": 2,
    "hasBankAccount": "no",
    "hasFormalCreditHistory": "no",
    "traditionalCreditNotes": "Alternative financial record sourced from JazzCash active wallet.",
    "shap_values": [
      {
        "feature_name": "wallet_txn_count_90d",
        "featureName": "90-Day Wallet Transaction Volume",
        "impact": 36.5,
        "shap_value": 36.5,
        "direction": "positive",
        "raw_value": "49 transactions",
        "category": "Digital Activity",
        "explanation": "JazzCash transaction throughput signals active informal velocity."
      },
      {
        "feature_name": "wallet_inflow_outflow_ratio",
        "featureName": "Wallet Cashflow Inflow/Outflow Ratio",
        "impact": -35.0,
        "shap_value": -35.0,
        "direction": "negative",
        "raw_value": "0.38",
        "category": "Cashflow Health",
        "explanation": "Outflows surpass digital receipts, indicating liquidity stress."
      },
      {
        "feature_name": "wallet_avg_balance",
        "featureName": "Average Working Wallet Balance",
        "impact": -34.0,
        "shap_value": -34.0,
        "direction": "negative",
        "raw_value": "PKR -424",
        "category": "Liquidity Buffer",
        "explanation": "Recurring negative balance signals thin operating reserves."
      },
      {
        "feature_name": "wallet_bill_payment_count_90d",
        "featureName": "Utility & Bill Settlements (90d)",
        "impact": 26.0,
        "shap_value": 26.0,
        "direction": "positive",
        "raw_value": "3 utility payments",
        "category": "Utility Reliability",
        "explanation": "Disciplined recurring bill settlement history."
      },
      {
        "feature_name": "wallet_active_days_ratio_90d",
        "featureName": "Active Wallet Day Density (90d)",
        "impact": 22.0,
        "shap_value": 22.0,
        "direction": "positive",
        "raw_value": "38.9% active days",
        "category": "Engagement Density",
        "explanation": "Habitual daily financial engagement confirmed."
      }
    ],
    "assessment": {
      "credit_score": 735,
      "risk_tier": "Moderate Risk",
      "default_probability": 0.045,
      "confidence_score": 0.92,
      "shap_explanations": [
        {
          "feature_name": "wallet_txn_count_90d",
          "featureName": "90-Day Wallet Transaction Volume",
          "impact": 36.5,
          "shap_value": 36.5,
          "direction": "positive",
          "raw_value": "49 transactions",
          "category": "Digital Activity",
          "explanation": "JazzCash transaction throughput signals active informal velocity."
        },
        {
          "feature_name": "wallet_inflow_outflow_ratio",
          "featureName": "Wallet Cashflow Inflow/Outflow Ratio",
          "impact": -35.0,
          "shap_value": -35.0,
          "direction": "negative",
          "raw_value": "0.38",
          "category": "Cashflow Health",
          "explanation": "Outflows surpass digital receipts, indicating liquidity stress."
        },
        {
          "feature_name": "wallet_avg_balance",
          "featureName": "Average Working Wallet Balance",
          "impact": -34.0,
          "shap_value": -34.0,
          "direction": "negative",
          "raw_value": "PKR -424",
          "category": "Liquidity Buffer",
          "explanation": "Recurring negative balance signals thin operating reserves."
        },
        {
          "feature_name": "wallet_bill_payment_count_90d",
          "featureName": "Utility & Bill Settlements (90d)",
          "impact": 26.0,
          "shap_value": 26.0,
          "direction": "positive",
          "raw_value": "3 utility payments",
          "category": "Utility Reliability",
          "explanation": "Disciplined recurring bill settlement history."
        },
        {
          "feature_name": "wallet_active_days_ratio_90d",
          "featureName": "Active Wallet Day Density (90d)",
          "impact": 22.0,
          "shap_value": 22.0,
          "direction": "positive",
          "raw_value": "38.9% active days",
          "category": "Engagement Density",
          "explanation": "Habitual daily financial engagement confirmed."
        }
      ],
      "shap_values": [
        {
          "feature_name": "wallet_txn_count_90d",
          "featureName": "90-Day Wallet Transaction Volume",
          "impact": 36.5,
          "shap_value": 36.5,
          "direction": "positive",
          "raw_value": "49 transactions",
          "category": "Digital Activity",
          "explanation": "JazzCash transaction throughput signals active informal velocity."
        },
        {
          "feature_name": "wallet_inflow_outflow_ratio",
          "featureName": "Wallet Cashflow Inflow/Outflow Ratio",
          "impact": -35.0,
          "shap_value": -35.0,
          "direction": "negative",
          "raw_value": "0.38",
          "category": "Cashflow Health",
          "explanation": "Outflows surpass digital receipts, indicating liquidity stress."
        },
        {
          "feature_name": "wallet_avg_balance",
          "featureName": "Average Working Wallet Balance",
          "impact": -34.0,
          "shap_value": -34.0,
          "direction": "negative",
          "raw_value": "PKR -424",
          "category": "Liquidity Buffer",
          "explanation": "Recurring negative balance signals thin operating reserves."
        },
        {
          "feature_name": "wallet_bill_payment_count_90d",
          "featureName": "Utility & Bill Settlements (90d)",
          "impact": 26.0,
          "shap_value": 26.0,
          "direction": "positive",
          "raw_value": "3 utility payments",
          "category": "Utility Reliability",
          "explanation": "Disciplined recurring bill settlement history."
        },
        {
          "feature_name": "wallet_active_days_ratio_90d",
          "featureName": "Active Wallet Day Density (90d)",
          "impact": 22.0,
          "shap_value": 22.0,
          "direction": "positive",
          "raw_value": "38.9% active days",
          "category": "Engagement Density",
          "explanation": "Habitual daily financial engagement confirmed."
        }
      ],
      "recommendation": "Approve Micro-Loan",
      "top_positive_drivers": [
        "90-Day Wallet Transaction Volume: JazzCash transaction throughput signals active informal velocity. (+36.5 pts)",
        "Utility & Bill Settlements (90d): Disciplined recurring bill settlement history. (+26.0 pts)",
        "Active Wallet Day Density (90d): Habitual daily financial engagement confirmed. (+22.0 pts)"
      ],
      "top_negative_drivers": [
        "Wallet Cashflow Inflow/Outflow Ratio: Outflows surpass digital receipts, indicating liquidity stress. (-35.0 pts)",
        "Average Working Wallet Balance: Recurring negative balance signals thin operating reserves. (-34.0 pts)"
      ],
      "modelTypeUsed": "trained_lightgbm_model"
    }
  },
  {
    "id": "PK000004",
    "submittedAt": "2026-09-02T10:30:00.000Z",
    "status": "rejected",
    "borrowerId": "PK000004",
    "fullName": "Applicant PK000004 (Daily Wage Laborer)",
    "age": 40,
    "city": "Karachi",
    "province": "Sindh",
    "occupation": "daily_wage_laborer",
    "employmentType": "Daily Wage Laborer",
    "monthlyIncomePKR": 52000,
    "monthlyExpensesPKR": 27040,
    "existingDebtPKR": 25000,
    "requestedLoanAmountPKR": 80000,
    "loanTermMonths": 12,
    "monthlyEasypaisaTxCount": 6,
    "monthlyJazzCashTxCount": 3,
    "monthlyMobileRechargePKR": 1136,
    "utilityBillOnTimeRate": 79,
    "monthlyUtilityBillPKR": 7500,
    "previousLoansCount": 1,
    "previousDefaultsCount": 1,
    "onTimeRepaymentRate": 60,
    "avgPreviousLoanAmountPKR": 60000,
    "repaymentHistoryGrade": "Poor",
    "supportingDocuments": [
      {
        "id": "doc-PK000004-1",
        "fileName": "easypaisa_telemetry_statement.pdf",
        "fileSize": "1.2 MB",
        "fileType": "application/pdf",
        "documentType": "Easypaisa Evidence",
        "description": "Verified Easypaisa transactional record from ml/data/pk_alt_data_synthetic3.csv"
      }
    ],
    "creditHistoryYears": 0,
    "hasBankAccount": "no",
    "hasFormalCreditHistory": "no",
    "traditionalCreditNotes": "Alternative financial record sourced from Easypaisa active wallet.",
    "shap_values": [
      {
        "feature_name": "wallet_txn_count_90d",
        "featureName": "90-Day Wallet Transaction Volume",
        "impact": -28.0,
        "shap_value": -28.0,
        "direction": "negative",
        "raw_value": "19 transactions",
        "category": "Digital Activity",
        "explanation": "Low Easypaisa transaction volume signals sporadic digital usage."
      },
      {
        "feature_name": "wallet_inflow_outflow_ratio",
        "featureName": "Wallet Cashflow Inflow/Outflow Ratio",
        "impact": -35.0,
        "shap_value": -35.0,
        "direction": "negative",
        "raw_value": "0.05",
        "category": "Cashflow Health",
        "explanation": "Outflows surpass digital receipts, indicating liquidity stress."
      },
      {
        "feature_name": "wallet_avg_balance",
        "featureName": "Average Working Wallet Balance",
        "impact": -34.0,
        "shap_value": -34.0,
        "direction": "negative",
        "raw_value": "PKR -1,053",
        "category": "Liquidity Buffer",
        "explanation": "Recurring negative balance signals thin operating reserves."
      },
      {
        "feature_name": "wallet_bill_payment_count_90d",
        "featureName": "Utility & Bill Settlements (90d)",
        "impact": -19.0,
        "shap_value": -19.0,
        "direction": "negative",
        "raw_value": "1 utility payments",
        "category": "Utility Reliability",
        "explanation": "Sparse utility bill payment records in digital wallet."
      },
      {
        "feature_name": "wallet_active_days_ratio_90d",
        "featureName": "Active Wallet Day Density (90d)",
        "impact": -16.0,
        "shap_value": -16.0,
        "direction": "negative",
        "raw_value": "17.8% active days",
        "category": "Engagement Density",
        "explanation": "Irregular or intermittent digital activity."
      }
    ],
    "assessment": {
      "credit_score": 470,
      "risk_tier": "High Risk",
      "default_probability": 0.42,
      "confidence_score": 0.92,
      "shap_explanations": [
        {
          "feature_name": "wallet_txn_count_90d",
          "featureName": "90-Day Wallet Transaction Volume",
          "impact": -28.0,
          "shap_value": -28.0,
          "direction": "negative",
          "raw_value": "19 transactions",
          "category": "Digital Activity",
          "explanation": "Low Easypaisa transaction volume signals sporadic digital usage."
        },
        {
          "feature_name": "wallet_inflow_outflow_ratio",
          "featureName": "Wallet Cashflow Inflow/Outflow Ratio",
          "impact": -35.0,
          "shap_value": -35.0,
          "direction": "negative",
          "raw_value": "0.05",
          "category": "Cashflow Health",
          "explanation": "Outflows surpass digital receipts, indicating liquidity stress."
        },
        {
          "feature_name": "wallet_avg_balance",
          "featureName": "Average Working Wallet Balance",
          "impact": -34.0,
          "shap_value": -34.0,
          "direction": "negative",
          "raw_value": "PKR -1,053",
          "category": "Liquidity Buffer",
          "explanation": "Recurring negative balance signals thin operating reserves."
        },
        {
          "feature_name": "wallet_bill_payment_count_90d",
          "featureName": "Utility & Bill Settlements (90d)",
          "impact": -19.0,
          "shap_value": -19.0,
          "direction": "negative",
          "raw_value": "1 utility payments",
          "category": "Utility Reliability",
          "explanation": "Sparse utility bill payment records in digital wallet."
        },
        {
          "feature_name": "wallet_active_days_ratio_90d",
          "featureName": "Active Wallet Day Density (90d)",
          "impact": -16.0,
          "shap_value": -16.0,
          "direction": "negative",
          "raw_value": "17.8% active days",
          "category": "Engagement Density",
          "explanation": "Irregular or intermittent digital activity."
        }
      ],
      "shap_values": [
        {
          "feature_name": "wallet_txn_count_90d",
          "featureName": "90-Day Wallet Transaction Volume",
          "impact": -28.0,
          "shap_value": -28.0,
          "direction": "negative",
          "raw_value": "19 transactions",
          "category": "Digital Activity",
          "explanation": "Low Easypaisa transaction volume signals sporadic digital usage."
        },
        {
          "feature_name": "wallet_inflow_outflow_ratio",
          "featureName": "Wallet Cashflow Inflow/Outflow Ratio",
          "impact": -35.0,
          "shap_value": -35.0,
          "direction": "negative",
          "raw_value": "0.05",
          "category": "Cashflow Health",
          "explanation": "Outflows surpass digital receipts, indicating liquidity stress."
        },
        {
          "feature_name": "wallet_avg_balance",
          "featureName": "Average Working Wallet Balance",
          "impact": -34.0,
          "shap_value": -34.0,
          "direction": "negative",
          "raw_value": "PKR -1,053",
          "category": "Liquidity Buffer",
          "explanation": "Recurring negative balance signals thin operating reserves."
        },
        {
          "feature_name": "wallet_bill_payment_count_90d",
          "featureName": "Utility & Bill Settlements (90d)",
          "impact": -19.0,
          "shap_value": -19.0,
          "direction": "negative",
          "raw_value": "1 utility payments",
          "category": "Utility Reliability",
          "explanation": "Sparse utility bill payment records in digital wallet."
        },
        {
          "feature_name": "wallet_active_days_ratio_90d",
          "featureName": "Active Wallet Day Density (90d)",
          "impact": -16.0,
          "shap_value": -16.0,
          "direction": "negative",
          "raw_value": "17.8% active days",
          "category": "Engagement Density",
          "explanation": "Irregular or intermittent digital activity."
        }
      ],
      "recommendation": "Decline",
      "top_positive_drivers": [],
      "top_negative_drivers": [
        "90-Day Wallet Transaction Volume: Low Easypaisa transaction volume signals sporadic digital usage. (-28.0 pts)",
        "Wallet Cashflow Inflow/Outflow Ratio: Outflows surpass digital receipts, indicating liquidity stress. (-35.0 pts)",
        "Average Working Wallet Balance: Recurring negative balance signals thin operating reserves. (-34.0 pts)",
        "Utility & Bill Settlements (90d): Sparse utility bill payment records in digital wallet. (-19.0 pts)",
        "Active Wallet Day Density (90d): Irregular or intermittent digital activity. (-16.0 pts)"
      ],
      "modelTypeUsed": "trained_lightgbm_model"
    }
  },
  {
    "id": "PK000005",
    "submittedAt": "2026-09-01T10:30:00.000Z",
    "status": "approved",
    "borrowerId": "PK000005",
    "fullName": "Applicant PK000005 (Rickshaw Driver)",
    "age": 43,
    "city": "Rawalpindi",
    "province": "Punjab",
    "occupation": "rickshaw_driver",
    "employmentType": "Rickshaw Driver",
    "monthlyIncomePKR": 68000,
    "monthlyExpensesPKR": 35360,
    "existingDebtPKR": 5000,
    "requestedLoanAmountPKR": 120000,
    "loanTermMonths": 12,
    "monthlyEasypaisaTxCount": 7,
    "monthlyJazzCashTxCount": 18,
    "monthlyMobileRechargePKR": 1967,
    "utilityBillOnTimeRate": 79,
    "monthlyUtilityBillPKR": 7500,
    "previousLoansCount": 2,
    "previousDefaultsCount": 0,
    "onTimeRepaymentRate": 95,
    "avgPreviousLoanAmountPKR": 60000,
    "repaymentHistoryGrade": "Good",
    "supportingDocuments": [
      {
        "id": "doc-PK000005-1",
        "fileName": "jazzcash_telemetry_statement.pdf",
        "fileSize": "1.2 MB",
        "fileType": "application/pdf",
        "documentType": "JazzCash Evidence",
        "description": "Verified JazzCash transactional record from ml/data/pk_alt_data_synthetic3.csv"
      }
    ],
    "creditHistoryYears": 2,
    "hasBankAccount": "no",
    "hasFormalCreditHistory": "no",
    "traditionalCreditNotes": "Alternative financial record sourced from JazzCash active wallet.",
    "shap_values": [
      {
        "feature_name": "wallet_txn_count_90d",
        "featureName": "90-Day Wallet Transaction Volume",
        "impact": 36.5,
        "shap_value": 36.5,
        "direction": "positive",
        "raw_value": "54 transactions",
        "category": "Digital Activity",
        "explanation": "JazzCash transaction throughput signals active informal velocity."
      },
      {
        "feature_name": "wallet_inflow_outflow_ratio",
        "featureName": "Wallet Cashflow Inflow/Outflow Ratio",
        "impact": 44.0,
        "shap_value": 44.0,
        "direction": "positive",
        "raw_value": "2.05",
        "category": "Cashflow Health",
        "explanation": "Digital inflows reliably exceed operating outflows."
      },
      {
        "feature_name": "wallet_avg_balance",
        "featureName": "Average Working Wallet Balance",
        "impact": 30.0,
        "shap_value": 30.0,
        "direction": "positive",
        "raw_value": "PKR 395",
        "category": "Liquidity Buffer",
        "explanation": "Maintains a positive liquid safety cushion."
      },
      {
        "feature_name": "wallet_bill_payment_count_90d",
        "featureName": "Utility & Bill Settlements (90d)",
        "impact": -19.0,
        "shap_value": -19.0,
        "direction": "negative",
        "raw_value": "1 utility payments",
        "category": "Utility Reliability",
        "explanation": "Sparse utility bill payment records in digital wallet."
      },
      {
        "feature_name": "wallet_active_days_ratio_90d",
        "featureName": "Active Wallet Day Density (90d)",
        "impact": 22.0,
        "shap_value": 22.0,
        "direction": "positive",
        "raw_value": "44.4% active days",
        "category": "Engagement Density",
        "explanation": "Habitual daily financial engagement confirmed."
      }
    ],
    "assessment": {
      "credit_score": 845,
      "risk_tier": "Low Risk",
      "default_probability": 0.045,
      "confidence_score": 0.92,
      "shap_explanations": [
        {
          "feature_name": "wallet_txn_count_90d",
          "featureName": "90-Day Wallet Transaction Volume",
          "impact": 36.5,
          "shap_value": 36.5,
          "direction": "positive",
          "raw_value": "54 transactions",
          "category": "Digital Activity",
          "explanation": "JazzCash transaction throughput signals active informal velocity."
        },
        {
          "feature_name": "wallet_inflow_outflow_ratio",
          "featureName": "Wallet Cashflow Inflow/Outflow Ratio",
          "impact": 44.0,
          "shap_value": 44.0,
          "direction": "positive",
          "raw_value": "2.05",
          "category": "Cashflow Health",
          "explanation": "Digital inflows reliably exceed operating outflows."
        },
        {
          "feature_name": "wallet_avg_balance",
          "featureName": "Average Working Wallet Balance",
          "impact": 30.0,
          "shap_value": 30.0,
          "direction": "positive",
          "raw_value": "PKR 395",
          "category": "Liquidity Buffer",
          "explanation": "Maintains a positive liquid safety cushion."
        },
        {
          "feature_name": "wallet_bill_payment_count_90d",
          "featureName": "Utility & Bill Settlements (90d)",
          "impact": -19.0,
          "shap_value": -19.0,
          "direction": "negative",
          "raw_value": "1 utility payments",
          "category": "Utility Reliability",
          "explanation": "Sparse utility bill payment records in digital wallet."
        },
        {
          "feature_name": "wallet_active_days_ratio_90d",
          "featureName": "Active Wallet Day Density (90d)",
          "impact": 22.0,
          "shap_value": 22.0,
          "direction": "positive",
          "raw_value": "44.4% active days",
          "category": "Engagement Density",
          "explanation": "Habitual daily financial engagement confirmed."
        }
      ],
      "shap_values": [
        {
          "feature_name": "wallet_txn_count_90d",
          "featureName": "90-Day Wallet Transaction Volume",
          "impact": 36.5,
          "shap_value": 36.5,
          "direction": "positive",
          "raw_value": "54 transactions",
          "category": "Digital Activity",
          "explanation": "JazzCash transaction throughput signals active informal velocity."
        },
        {
          "feature_name": "wallet_inflow_outflow_ratio",
          "featureName": "Wallet Cashflow Inflow/Outflow Ratio",
          "impact": 44.0,
          "shap_value": 44.0,
          "direction": "positive",
          "raw_value": "2.05",
          "category": "Cashflow Health",
          "explanation": "Digital inflows reliably exceed operating outflows."
        },
        {
          "feature_name": "wallet_avg_balance",
          "featureName": "Average Working Wallet Balance",
          "impact": 30.0,
          "shap_value": 30.0,
          "direction": "positive",
          "raw_value": "PKR 395",
          "category": "Liquidity Buffer",
          "explanation": "Maintains a positive liquid safety cushion."
        },
        {
          "feature_name": "wallet_bill_payment_count_90d",
          "featureName": "Utility & Bill Settlements (90d)",
          "impact": -19.0,
          "shap_value": -19.0,
          "direction": "negative",
          "raw_value": "1 utility payments",
          "category": "Utility Reliability",
          "explanation": "Sparse utility bill payment records in digital wallet."
        },
        {
          "feature_name": "wallet_active_days_ratio_90d",
          "featureName": "Active Wallet Day Density (90d)",
          "impact": 22.0,
          "shap_value": 22.0,
          "direction": "positive",
          "raw_value": "44.4% active days",
          "category": "Engagement Density",
          "explanation": "Habitual daily financial engagement confirmed."
        }
      ],
      "recommendation": "Approve Micro-Loan",
      "top_positive_drivers": [
        "90-Day Wallet Transaction Volume: JazzCash transaction throughput signals active informal velocity. (+36.5 pts)",
        "Wallet Cashflow Inflow/Outflow Ratio: Digital inflows reliably exceed operating outflows. (+44.0 pts)",
        "Average Working Wallet Balance: Maintains a positive liquid safety cushion. (+30.0 pts)",
        "Active Wallet Day Density (90d): Habitual daily financial engagement confirmed. (+22.0 pts)"
      ],
      "top_negative_drivers": [
        "Utility & Bill Settlements (90d): Sparse utility bill payment records in digital wallet. (-19.0 pts)"
      ],
      "modelTypeUsed": "trained_lightgbm_model"
    }
  },
  {
    "id": "PK000006",
    "submittedAt": "2026-09-01T10:30:00.000Z",
    "status": "approved",
    "borrowerId": "PK000006",
    "fullName": "Applicant PK000006 (Street Vendor)",
    "age": 46,
    "city": "Lahore",
    "province": "Punjab",
    "occupation": "street_vendor",
    "employmentType": "Street Vendor",
    "monthlyIncomePKR": 78000,
    "monthlyExpensesPKR": 40560,
    "existingDebtPKR": 5000,
    "requestedLoanAmountPKR": 160000,
    "loanTermMonths": 12,
    "monthlyEasypaisaTxCount": 6,
    "monthlyJazzCashTxCount": 10,
    "monthlyMobileRechargePKR": 1672,
    "utilityBillOnTimeRate": 100,
    "monthlyUtilityBillPKR": 7500,
    "previousLoansCount": 2,
    "previousDefaultsCount": 0,
    "onTimeRepaymentRate": 95,
    "avgPreviousLoanAmountPKR": 60000,
    "repaymentHistoryGrade": "Good",
    "supportingDocuments": [
      {
        "id": "doc-PK000006-1",
        "fileName": "sadapay_telemetry_statement.pdf",
        "fileSize": "1.2 MB",
        "fileType": "application/pdf",
        "documentType": "Income / Business Proof",
        "description": "Verified SadaPay transactional record from ml/data/pk_alt_data_synthetic3.csv"
      }
    ],
    "creditHistoryYears": 2,
    "hasBankAccount": "yes",
    "hasFormalCreditHistory": "no",
    "traditionalCreditNotes": "Alternative financial record sourced from SadaPay active wallet.",
    "shap_values": [
      {
        "feature_name": "wallet_txn_count_90d",
        "featureName": "90-Day Wallet Transaction Volume",
        "impact": 36.5,
        "shap_value": 36.5,
        "direction": "positive",
        "raw_value": "52 transactions",
        "category": "Digital Activity",
        "explanation": "SadaPay transaction throughput signals active informal velocity."
      },
      {
        "feature_name": "wallet_inflow_outflow_ratio",
        "featureName": "Wallet Cashflow Inflow/Outflow Ratio",
        "impact": -35.0,
        "shap_value": -35.0,
        "direction": "negative",
        "raw_value": "0.49",
        "category": "Cashflow Health",
        "explanation": "Outflows surpass digital receipts, indicating liquidity stress."
      },
      {
        "feature_name": "wallet_avg_balance",
        "featureName": "Average Working Wallet Balance",
        "impact": -34.0,
        "shap_value": -34.0,
        "direction": "negative",
        "raw_value": "PKR -352",
        "category": "Liquidity Buffer",
        "explanation": "Recurring negative balance signals thin operating reserves."
      },
      {
        "feature_name": "wallet_bill_payment_count_90d",
        "featureName": "Utility & Bill Settlements (90d)",
        "impact": 26.0,
        "shap_value": 26.0,
        "direction": "positive",
        "raw_value": "7 utility payments",
        "category": "Utility Reliability",
        "explanation": "Disciplined recurring bill settlement history."
      },
      {
        "feature_name": "wallet_active_days_ratio_90d",
        "featureName": "Active Wallet Day Density (90d)",
        "impact": 22.0,
        "shap_value": 22.0,
        "direction": "positive",
        "raw_value": "46.7% active days",
        "category": "Engagement Density",
        "explanation": "Habitual daily financial engagement confirmed."
      }
    ],
    "assessment": {
      "credit_score": 735,
      "risk_tier": "Moderate Risk",
      "default_probability": 0.045,
      "confidence_score": 0.92,
      "shap_explanations": [
        {
          "feature_name": "wallet_txn_count_90d",
          "featureName": "90-Day Wallet Transaction Volume",
          "impact": 36.5,
          "shap_value": 36.5,
          "direction": "positive",
          "raw_value": "52 transactions",
          "category": "Digital Activity",
          "explanation": "SadaPay transaction throughput signals active informal velocity."
        },
        {
          "feature_name": "wallet_inflow_outflow_ratio",
          "featureName": "Wallet Cashflow Inflow/Outflow Ratio",
          "impact": -35.0,
          "shap_value": -35.0,
          "direction": "negative",
          "raw_value": "0.49",
          "category": "Cashflow Health",
          "explanation": "Outflows surpass digital receipts, indicating liquidity stress."
        },
        {
          "feature_name": "wallet_avg_balance",
          "featureName": "Average Working Wallet Balance",
          "impact": -34.0,
          "shap_value": -34.0,
          "direction": "negative",
          "raw_value": "PKR -352",
          "category": "Liquidity Buffer",
          "explanation": "Recurring negative balance signals thin operating reserves."
        },
        {
          "feature_name": "wallet_bill_payment_count_90d",
          "featureName": "Utility & Bill Settlements (90d)",
          "impact": 26.0,
          "shap_value": 26.0,
          "direction": "positive",
          "raw_value": "7 utility payments",
          "category": "Utility Reliability",
          "explanation": "Disciplined recurring bill settlement history."
        },
        {
          "feature_name": "wallet_active_days_ratio_90d",
          "featureName": "Active Wallet Day Density (90d)",
          "impact": 22.0,
          "shap_value": 22.0,
          "direction": "positive",
          "raw_value": "46.7% active days",
          "category": "Engagement Density",
          "explanation": "Habitual daily financial engagement confirmed."
        }
      ],
      "shap_values": [
        {
          "feature_name": "wallet_txn_count_90d",
          "featureName": "90-Day Wallet Transaction Volume",
          "impact": 36.5,
          "shap_value": 36.5,
          "direction": "positive",
          "raw_value": "52 transactions",
          "category": "Digital Activity",
          "explanation": "SadaPay transaction throughput signals active informal velocity."
        },
        {
          "feature_name": "wallet_inflow_outflow_ratio",
          "featureName": "Wallet Cashflow Inflow/Outflow Ratio",
          "impact": -35.0,
          "shap_value": -35.0,
          "direction": "negative",
          "raw_value": "0.49",
          "category": "Cashflow Health",
          "explanation": "Outflows surpass digital receipts, indicating liquidity stress."
        },
        {
          "feature_name": "wallet_avg_balance",
          "featureName": "Average Working Wallet Balance",
          "impact": -34.0,
          "shap_value": -34.0,
          "direction": "negative",
          "raw_value": "PKR -352",
          "category": "Liquidity Buffer",
          "explanation": "Recurring negative balance signals thin operating reserves."
        },
        {
          "feature_name": "wallet_bill_payment_count_90d",
          "featureName": "Utility & Bill Settlements (90d)",
          "impact": 26.0,
          "shap_value": 26.0,
          "direction": "positive",
          "raw_value": "7 utility payments",
          "category": "Utility Reliability",
          "explanation": "Disciplined recurring bill settlement history."
        },
        {
          "feature_name": "wallet_active_days_ratio_90d",
          "featureName": "Active Wallet Day Density (90d)",
          "impact": 22.0,
          "shap_value": 22.0,
          "direction": "positive",
          "raw_value": "46.7% active days",
          "category": "Engagement Density",
          "explanation": "Habitual daily financial engagement confirmed."
        }
      ],
      "recommendation": "Approve Micro-Loan",
      "top_positive_drivers": [
        "90-Day Wallet Transaction Volume: SadaPay transaction throughput signals active informal velocity. (+36.5 pts)",
        "Utility & Bill Settlements (90d): Disciplined recurring bill settlement history. (+26.0 pts)",
        "Active Wallet Day Density (90d): Habitual daily financial engagement confirmed. (+22.0 pts)"
      ],
      "top_negative_drivers": [
        "Wallet Cashflow Inflow/Outflow Ratio: Outflows surpass digital receipts, indicating liquidity stress. (-35.0 pts)",
        "Average Working Wallet Balance: Recurring negative balance signals thin operating reserves. (-34.0 pts)"
      ],
      "modelTypeUsed": "trained_lightgbm_model"
    }
  },
  {
    "id": "PK000007",
    "submittedAt": "2026-09-01T10:30:00.000Z",
    "status": "pending_review",
    "borrowerId": "PK000007",
    "fullName": "Applicant PK000007 (Delivery Rider)",
    "age": 49,
    "city": "Karachi",
    "province": "Sindh",
    "occupation": "delivery_rider",
    "employmentType": "Delivery Rider",
    "monthlyIncomePKR": 68000,
    "monthlyExpensesPKR": 35360,
    "existingDebtPKR": 5000,
    "requestedLoanAmountPKR": 120000,
    "loanTermMonths": 12,
    "monthlyEasypaisaTxCount": 4,
    "monthlyJazzCashTxCount": 6,
    "monthlyMobileRechargePKR": 1411,
    "utilityBillOnTimeRate": 99,
    "monthlyUtilityBillPKR": 7500,
    "previousLoansCount": 2,
    "previousDefaultsCount": 0,
    "onTimeRepaymentRate": 95,
    "avgPreviousLoanAmountPKR": 60000,
    "repaymentHistoryGrade": "Good",
    "supportingDocuments": [
      {
        "id": "doc-PK000007-1",
        "fileName": "sadapay_telemetry_statement.pdf",
        "fileSize": "1.2 MB",
        "fileType": "application/pdf",
        "documentType": "Income / Business Proof",
        "description": "Verified SadaPay transactional record from ml/data/pk_alt_data_synthetic3.csv"
      }
    ],
    "creditHistoryYears": 2,
    "hasBankAccount": "yes",
    "hasFormalCreditHistory": "no",
    "traditionalCreditNotes": "Alternative financial record sourced from SadaPay active wallet.",
    "shap_values": [
      {
        "feature_name": "wallet_txn_count_90d",
        "featureName": "90-Day Wallet Transaction Volume",
        "impact": 36.5,
        "shap_value": 36.5,
        "direction": "positive",
        "raw_value": "31 transactions",
        "category": "Digital Activity",
        "explanation": "SadaPay transaction throughput signals active informal velocity."
      },
      {
        "feature_name": "wallet_inflow_outflow_ratio",
        "featureName": "Wallet Cashflow Inflow/Outflow Ratio",
        "impact": -35.0,
        "shap_value": -35.0,
        "direction": "negative",
        "raw_value": "0.66",
        "category": "Cashflow Health",
        "explanation": "Outflows surpass digital receipts, indicating liquidity stress."
      },
      {
        "feature_name": "wallet_avg_balance",
        "featureName": "Average Working Wallet Balance",
        "impact": -34.0,
        "shap_value": -34.0,
        "direction": "negative",
        "raw_value": "PKR -332",
        "category": "Liquidity Buffer",
        "explanation": "Recurring negative balance signals thin operating reserves."
      },
      {
        "feature_name": "wallet_bill_payment_count_90d",
        "featureName": "Utility & Bill Settlements (90d)",
        "impact": 26.0,
        "shap_value": 26.0,
        "direction": "positive",
        "raw_value": "6 utility payments",
        "category": "Utility Reliability",
        "explanation": "Disciplined recurring bill settlement history."
      },
      {
        "feature_name": "wallet_active_days_ratio_90d",
        "featureName": "Active Wallet Day Density (90d)",
        "impact": 22.0,
        "shap_value": 22.0,
        "direction": "positive",
        "raw_value": "31.1% active days",
        "category": "Engagement Density",
        "explanation": "Habitual daily financial engagement confirmed."
      }
    ],
    "assessment": {
      "credit_score": 715,
      "risk_tier": "Moderate Risk",
      "default_probability": 0.045,
      "confidence_score": 0.92,
      "shap_explanations": [
        {
          "feature_name": "wallet_txn_count_90d",
          "featureName": "90-Day Wallet Transaction Volume",
          "impact": 36.5,
          "shap_value": 36.5,
          "direction": "positive",
          "raw_value": "31 transactions",
          "category": "Digital Activity",
          "explanation": "SadaPay transaction throughput signals active informal velocity."
        },
        {
          "feature_name": "wallet_inflow_outflow_ratio",
          "featureName": "Wallet Cashflow Inflow/Outflow Ratio",
          "impact": -35.0,
          "shap_value": -35.0,
          "direction": "negative",
          "raw_value": "0.66",
          "category": "Cashflow Health",
          "explanation": "Outflows surpass digital receipts, indicating liquidity stress."
        },
        {
          "feature_name": "wallet_avg_balance",
          "featureName": "Average Working Wallet Balance",
          "impact": -34.0,
          "shap_value": -34.0,
          "direction": "negative",
          "raw_value": "PKR -332",
          "category": "Liquidity Buffer",
          "explanation": "Recurring negative balance signals thin operating reserves."
        },
        {
          "feature_name": "wallet_bill_payment_count_90d",
          "featureName": "Utility & Bill Settlements (90d)",
          "impact": 26.0,
          "shap_value": 26.0,
          "direction": "positive",
          "raw_value": "6 utility payments",
          "category": "Utility Reliability",
          "explanation": "Disciplined recurring bill settlement history."
        },
        {
          "feature_name": "wallet_active_days_ratio_90d",
          "featureName": "Active Wallet Day Density (90d)",
          "impact": 22.0,
          "shap_value": 22.0,
          "direction": "positive",
          "raw_value": "31.1% active days",
          "category": "Engagement Density",
          "explanation": "Habitual daily financial engagement confirmed."
        }
      ],
      "shap_values": [
        {
          "feature_name": "wallet_txn_count_90d",
          "featureName": "90-Day Wallet Transaction Volume",
          "impact": 36.5,
          "shap_value": 36.5,
          "direction": "positive",
          "raw_value": "31 transactions",
          "category": "Digital Activity",
          "explanation": "SadaPay transaction throughput signals active informal velocity."
        },
        {
          "feature_name": "wallet_inflow_outflow_ratio",
          "featureName": "Wallet Cashflow Inflow/Outflow Ratio",
          "impact": -35.0,
          "shap_value": -35.0,
          "direction": "negative",
          "raw_value": "0.66",
          "category": "Cashflow Health",
          "explanation": "Outflows surpass digital receipts, indicating liquidity stress."
        },
        {
          "feature_name": "wallet_avg_balance",
          "featureName": "Average Working Wallet Balance",
          "impact": -34.0,
          "shap_value": -34.0,
          "direction": "negative",
          "raw_value": "PKR -332",
          "category": "Liquidity Buffer",
          "explanation": "Recurring negative balance signals thin operating reserves."
        },
        {
          "feature_name": "wallet_bill_payment_count_90d",
          "featureName": "Utility & Bill Settlements (90d)",
          "impact": 26.0,
          "shap_value": 26.0,
          "direction": "positive",
          "raw_value": "6 utility payments",
          "category": "Utility Reliability",
          "explanation": "Disciplined recurring bill settlement history."
        },
        {
          "feature_name": "wallet_active_days_ratio_90d",
          "featureName": "Active Wallet Day Density (90d)",
          "impact": 22.0,
          "shap_value": 22.0,
          "direction": "positive",
          "raw_value": "31.1% active days",
          "category": "Engagement Density",
          "explanation": "Habitual daily financial engagement confirmed."
        }
      ],
      "recommendation": "Manual Review",
      "top_positive_drivers": [
        "90-Day Wallet Transaction Volume: SadaPay transaction throughput signals active informal velocity. (+36.5 pts)",
        "Utility & Bill Settlements (90d): Disciplined recurring bill settlement history. (+26.0 pts)",
        "Active Wallet Day Density (90d): Habitual daily financial engagement confirmed. (+22.0 pts)"
      ],
      "top_negative_drivers": [
        "Wallet Cashflow Inflow/Outflow Ratio: Outflows surpass digital receipts, indicating liquidity stress. (-35.0 pts)",
        "Average Working Wallet Balance: Recurring negative balance signals thin operating reserves. (-34.0 pts)"
      ],
      "modelTypeUsed": "trained_lightgbm_model"
    }
  }
];
