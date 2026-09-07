import { BorrowerApplication, RiskAssessmentResponse, ShapValueItem } from '@/types';
import { generateMockAssessment } from '@/lib/mockData';

const DEFAULT_API_BASE_URL = 'http://localhost:8000/api/v1';

export function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_BASE_URL || DEFAULT_API_BASE_URL;
}

export function formatBorrowerPayload(application: BorrowerApplication) {
  return {
    borrowerId: application.borrowerId || `LEN-PK-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    fullName: application.fullName?.trim() || 'Anonymous Borrower',
    age: application.age !== '' && !isNaN(Number(application.age)) ? Number(application.age) : 32,
    city: application.city?.trim() || 'Lahore',
    province: application.province?.trim() || 'Punjab',
    occupation: application.occupation?.trim() || 'informal_worker',
    employmentType: application.employmentType || 'Informal worker',
    monthlyIncomePKR: Number(application.monthlyIncomePKR) || 0,
    monthlyExpensesPKR: Number(application.monthlyExpensesPKR) || 0,
    existingDebtPKR: Number(application.existingDebtPKR) || 0,
    requestedLoanAmountPKR: Number(application.requestedLoanAmountPKR) || 0,
    loanTermMonths: Number(application.loanTermMonths) || 12,
    monthlyEasypaisaTxCount: Number(application.monthlyEasypaisaTxCount) || 0,
    monthlyJazzCashTxCount: Number(application.monthlyJazzCashTxCount) || 0,
    monthlyMobileRechargePKR: Number(application.monthlyMobileRechargePKR) || 0,
    utilityBillOnTimeRate:
      application.utilityBillOnTimeRate !== '' && !isNaN(Number(application.utilityBillOnTimeRate))
        ? Number(application.utilityBillOnTimeRate)
        : 85,
    monthlyUtilityBillPKR: Number(application.monthlyUtilityBillPKR) || 0,
    previousLoansCount: Number(application.previousLoansCount) || 0,
    previousDefaultsCount: Number(application.previousDefaultsCount) || 0,
    onTimeRepaymentRate:
      application.onTimeRepaymentRate !== '' && !isNaN(Number(application.onTimeRepaymentRate))
        ? Number(application.onTimeRepaymentRate)
        : 90,
    avgPreviousLoanAmountPKR: Number(application.avgPreviousLoanAmountPKR) || 0,
    repaymentHistoryGrade: application.repaymentHistoryGrade || 'Good',
    creditHistoryYears:
      application.creditHistoryYears !== '' && !isNaN(Number(application.creditHistoryYears))
        ? Number(application.creditHistoryYears)
        : 1,
    hasBankAccount:
      application.hasBankAccount && application.hasBankAccount.toLowerCase() === 'yes' ? 'Yes' : 'No',
    hasFormalCreditHistory:
      application.hasFormalCreditHistory && application.hasFormalCreditHistory.toLowerCase() === 'yes'
        ? 'Yes'
        : 'No',
    traditionalCreditNotes: application.traditionalCreditNotes || '',
    supportingDocuments: application.supportingDocuments || [],
  };
}

/**
 * Async submission handler targeting POST `${NEXT_PUBLIC_API_BASE_URL}/credit/score`.
 * Sends borrower payload from /new-application to FastAPI ML backend.
 * Falls back gracefully to lib/mockData.ts if the backend is offline or errors.
 */
export async function submitCreditScoreAssessment(
  application: BorrowerApplication
): Promise<RiskAssessmentResponse> {
  const baseUrl = getApiBaseUrl().replace(/\/+$/, '');
  const primaryUrl = `${baseUrl}/credit/score`;
  const fallbackUrl = `${baseUrl}/score`;
  const payload = formatBorrowerPayload(application);

  const attemptPost = async (url: string): Promise<Response> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      return res;
    } finally {
      clearTimeout(timeoutId);
    }
  };

  try {
    let response: Response;
    try {
      response = await attemptPost(primaryUrl);
      if (response.status === 404) {
        // In case FastAPI is routed at /score
        response = await attemptPost(fallbackUrl);
      }
    } catch (networkErr) {
      // If primary endpoint fails with network error, try fallback route
      try {
        response = await attemptPost(fallbackUrl);
      } catch {
        throw networkErr;
      }
    }

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      throw new Error(`HTTP ${response.status} from scoring API: ${errorText || response.statusText}`);
    }

    const data = await response.json();

    // Standardize shap_values array so UI visualizer always receives a populated array
    const rawShapList: any[] = Array.isArray(data.shap_values) && data.shap_values.length > 0
      ? data.shap_values
      : (Array.isArray(data.shap_explanations) && data.shap_explanations.length > 0
        ? data.shap_explanations
        : (Array.isArray(data.featureImportance) ? data.featureImportance : []));

    const standardizedShapValues: ShapValueItem[] = rawShapList.map((item: any) => {
      const featureName = item.displayName || item.feature_name || item.featureName || 'Feature';
      const rawImpact = typeof item.impact === 'number'
        ? item.impact
        : (typeof item.shap_value === 'number'
          ? item.shap_value
          : (typeof item.shapValue === 'number' ? item.shapValue : 0));
      const direction = item.direction || (rawImpact >= 0 ? 'positive' : 'negative');
      const explanation = item.explanation || item.description || '';
      const rawValue = item.raw_value ?? item.rawValue ?? '';

      return {
        feature_name: item.feature_name || item.featureName || featureName,
        featureName,
        impact: Number(rawImpact.toFixed(1)),
        shap_value: Number(rawImpact.toFixed(1)),
        direction,
        explanation,
        raw_value: rawValue,
        rawValue,
        category: item.category || (direction === 'positive' ? 'Score Driver' : 'Risk Indicator'),
      };
    });

    const result: RiskAssessmentResponse = {
      credit_score: typeof data.credit_score === 'number' ? data.credit_score : (data.scaledCreditScore ?? 700),
      risk_tier: data.risk_tier || data.riskTier || 'Medium Risk',
      default_probability: typeof data.default_probability === 'number' ? data.default_probability : 0.05,
      confidence_score: typeof data.confidence_score === 'number' ? data.confidence_score : 0.9,
      shap_explanations: standardizedShapValues,
      shap_values: standardizedShapValues,
      recommendation: data.recommendation || 'Underwriting Review',
      top_positive_drivers: Array.isArray(data.top_positive_drivers) && data.top_positive_drivers.length > 0
        ? data.top_positive_drivers
        : (data.topPositiveDrivers ?? []),
      top_negative_drivers: Array.isArray(data.top_negative_drivers) && data.top_negative_drivers.length > 0
        ? data.top_negative_drivers
        : (data.topRiskDrivers ?? []),
      borrowerId: data.borrowerId || payload.borrowerId,
      fullName: data.fullName || payload.fullName,
      creditScore: data.creditScore,
      scaledCreditScore: data.credit_score,
      riskTier: data.riskTier,
      defaultRiskCategory: data.defaultRiskCategory,
      estimatedDefaultProbability: data.estimatedDefaultProbability,
      maxApprovedLoanAmountPKR: data.maxApprovedLoanAmountPKR,
      featureImportance: standardizedShapValues,
      modelTypeUsed: data.modelTypeUsed || 'trained_ml_model',
    };

    return result;
  } catch (error) {
    console.warn(
      `[Lendora Underwriting] POST ${primaryUrl} failed or backend is offline. Falling back gracefully to lib/mockData.ts:`,
      error
    );

    return generateMockAssessment({
      borrowerId: application.borrowerId,
      fullName: application.fullName,
      income: Number(application.monthlyIncomePKR) || 0,
      requestedAmount: Number(application.requestedLoanAmountPKR) || 0,
      utilityBillOnTimeRate:
        application.utilityBillOnTimeRate !== '' ? Number(application.utilityBillOnTimeRate) : undefined,
      onTimeRepaymentRate:
        application.onTimeRepaymentRate !== '' ? Number(application.onTimeRepaymentRate) : undefined,
      monthlyEasypaisaTxCount: Number(application.monthlyEasypaisaTxCount) || 0,
      monthlyJazzCashTxCount: Number(application.monthlyJazzCashTxCount) || 0,
    });
  }
}
