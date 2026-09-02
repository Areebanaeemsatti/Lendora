'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ApplicationProgress } from '@/components/application/ApplicationProgress';
import { BasicInfoSection } from '@/components/application/BasicInfoSection';
import { FinancialProfileSection } from '@/components/application/FinancialProfileSection';
import { AlternativeSignalsSection } from '@/components/application/AlternativeSignalsSection';
import { RepaymentBehaviorSection } from '@/components/application/RepaymentBehaviorSection';
import { SupportingDocumentsSection } from '@/components/application/SupportingDocumentsSection';
import { OptionalCreditSection } from '@/components/application/OptionalCreditSection';
import { Button } from '@/components/ui/Button';
import { BorrowerApplication, SupportingDocument } from '@/types';
import { saveApplicationLocally } from '@/lib/storage';
import { useApplications } from '@/components/providers/ApplicationsProvider';
import { deriveAltCreditScore, deriveRiskLevel } from '@/lib/mockData';
import { ArrowRight, RotateCcw, Sparkles, AlertCircle } from 'lucide-react';
import { formatPKR } from '@/lib/utils';

function createBorrowerId() {
  return 'LEN-PK-2026-' + Math.floor(1000 + Math.random() * 9000);
}

const initialFormData: BorrowerApplication = {
  id: '',
  submittedAt: '',
  status: 'pending_review',

  borrowerId: '',
  fullName: '',
  age: '',
  city: '',
  province: '',
  occupation: '',
  employmentType: '',

  monthlyIncomePKR: '',
  monthlyExpensesPKR: '',
  existingDebtPKR: 0,
  requestedLoanAmountPKR: '',
  loanTermMonths: 12,

  monthlyEasypaisaTxCount: '',
  monthlyJazzCashTxCount: '',
  monthlyMobileRechargePKR: '',
  utilityBillOnTimeRate: '',
  monthlyUtilityBillPKR: '',

  previousLoansCount: 0,
  previousDefaultsCount: 0,
  onTimeRepaymentRate: '',
  avgPreviousLoanAmountPKR: 0,
  repaymentHistoryGrade: '',

  supportingDocuments: [],

  creditHistoryYears: '',
  hasBankAccount: '',
  hasFormalCreditHistory: '',
  traditionalCreditNotes: '',
};

export function BorrowerForm() {
  const router = useRouter();
  const { addApplication } = useApplications();
  const [formData, setFormData] = useState<BorrowerApplication>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const liveScore = useMemo(() => {
    const income = Number(formData.monthlyIncomePKR) || 0;
    const requestedAmount = Number(formData.requestedLoanAmountPKR) || 0;
    if (!income || !requestedAmount) return null;
    const altCreditScore = deriveAltCreditScore({
      income,
      requestedAmount,
      utilityOnTimeRate: Number(formData.utilityBillOnTimeRate) || undefined,
      onTimeRepaymentRate: Number(formData.onTimeRepaymentRate) || undefined,
    });
    return {
      altCreditScore,
      riskLevel: deriveRiskLevel(altCreditScore),
    };
  }, [
    formData.monthlyIncomePKR,
    formData.requestedLoanAmountPKR,
    formData.utilityBillOnTimeRate,
    formData.onTimeRepaymentRate,
  ]);

  const handleFieldChange = (field: keyof BorrowerApplication, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSupportingDocumentsChange = (docs: SupportingDocument[]) => {
    setFormData((prev) => ({
      ...prev,
      supportingDocuments: docs,
    }));
  };

  const prefillSampleData = () => {
    setFormData({
      id: 'app-' + Date.now(),
      submittedAt: new Date().toISOString(),
      status: 'pending_review',
      borrowerId: 'LEN-PK-2026-8942',
      fullName: 'Rashid Mahmood Ansari',
      age: 38,
      city: 'Lahore',
      province: 'Punjab',
      occupation: 'Textile Artisan & Retail Shopkeeper',
      employmentType: 'Small business owner',
      monthlyIncomePKR: 85000,
      monthlyExpensesPKR: 48000,
      existingDebtPKR: 5000,
      requestedLoanAmountPKR: 250000,
      loanTermMonths: 12,
      monthlyEasypaisaTxCount: 22,
      monthlyJazzCashTxCount: 15,
      monthlyMobileRechargePKR: 3200,
      utilityBillOnTimeRate: 92,
      monthlyUtilityBillPKR: 16500,
      previousLoansCount: 2,
      previousDefaultsCount: 0,
      onTimeRepaymentRate: 96,
      avgPreviousLoanAmountPKR: 120000,
      repaymentHistoryGrade: 'Good',
      supportingDocuments: [
        {
          id: 'doc-sample-1',
          fileName: 'lesco_electricity_bill_aug.jpg',
          fileSize: '1.4 MB',
          fileType: 'image/jpeg',
          documentType: 'Utility Bill',
          description: 'LESCO 3-phase commercial electricity bill with paid stamp',
        },
        {
          id: 'doc-sample-2',
          fileName: 'jazzcash_merchant_statement.png',
          fileSize: '820 KB',
          fileType: 'image/png',
          documentType: 'JazzCash Evidence',
          description: 'QR merchant receiving statement for past 30 days',
        },
      ],
      creditHistoryYears: '',
      hasBankAccount: 'yes',
      hasFormalCreditHistory: 'no',
      traditionalCreditNotes: 'Active JazzCash merchant with consistent seasonal sales.',
    });
    setErrors({});
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.borrowerId.trim()) newErrors.borrowerId = 'Borrower ID is required.';
    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required.';
    if (!formData.age || typeof formData.age !== 'number' || formData.age < 18 || formData.age > 85) {
      newErrors.age = 'Valid age between 18 and 85 is required.';
    }
    if (!formData.city.trim()) newErrors.city = 'City is required.';
    if (!formData.province.trim()) newErrors.province = 'Province is required.';
    if (!formData.occupation.trim()) newErrors.occupation = 'Occupation is required.';
    if (!formData.employmentType) newErrors.employmentType = 'Employment Type is required.';

    if (formData.monthlyIncomePKR === '' || Number(formData.monthlyIncomePKR) < 0) {
      newErrors.monthlyIncomePKR = 'Valid monthly income is required.';
    }
    if (formData.monthlyExpensesPKR === '' || Number(formData.monthlyExpensesPKR) < 0) {
      newErrors.monthlyExpensesPKR = 'Monthly expenses are required.';
    }
    if (formData.existingDebtPKR === '' || Number(formData.existingDebtPKR) < 0) {
      newErrors.existingDebtPKR = 'Existing debt must be 0 or positive.';
    }
    if (formData.requestedLoanAmountPKR === '' || Number(formData.requestedLoanAmountPKR) <= 0) {
      newErrors.requestedLoanAmountPKR = 'Requested loan amount must be greater than 0.';
    }
    if (formData.loanTermMonths === '' || Number(formData.loanTermMonths) <= 0) {
      newErrors.loanTermMonths = 'Loan term in months is required.';
    }

    if (formData.monthlyEasypaisaTxCount === '' || Number(formData.monthlyEasypaisaTxCount) < 0) {
      newErrors.monthlyEasypaisaTxCount = 'Easypaisa transaction count cannot be negative.';
    }
    if (formData.monthlyJazzCashTxCount === '' || Number(formData.monthlyJazzCashTxCount) < 0) {
      newErrors.monthlyJazzCashTxCount = 'JazzCash transaction count cannot be negative.';
    }
    if (formData.monthlyMobileRechargePKR === '' || Number(formData.monthlyMobileRechargePKR) < 0) {
      newErrors.monthlyMobileRechargePKR = 'Mobile recharge amount cannot be negative.';
    }
    if (
      formData.utilityBillOnTimeRate === '' ||
      Number(formData.utilityBillOnTimeRate) < 0 ||
      Number(formData.utilityBillOnTimeRate) > 100
    ) {
      newErrors.utilityBillOnTimeRate = 'Utility on-time rate must be between 0% and 100%.';
    }
    if (formData.monthlyUtilityBillPKR === '' || Number(formData.monthlyUtilityBillPKR) < 0) {
      newErrors.monthlyUtilityBillPKR = 'Monthly utility bill cannot be negative.';
    }

    if (formData.previousLoansCount === '' || Number(formData.previousLoansCount) < 0) {
      newErrors.previousLoansCount = 'Previous loans count cannot be negative.';
    }
    if (formData.previousDefaultsCount === '' || Number(formData.previousDefaultsCount) < 0) {
      newErrors.previousDefaultsCount = 'Previous defaults count cannot be negative.';
    }
    if (
      typeof formData.previousDefaultsCount === 'number' &&
      typeof formData.previousLoansCount === 'number' &&
      formData.previousDefaultsCount > formData.previousLoansCount
    ) {
      newErrors.previousDefaultsCount = 'Defaults cannot exceed total previous loans.';
    }
    if (
      formData.onTimeRepaymentRate === '' ||
      Number(formData.onTimeRepaymentRate) < 0 ||
      Number(formData.onTimeRepaymentRate) > 100
    ) {
      newErrors.onTimeRepaymentRate = 'Repayment rate must be between 0% and 100%.';
    }
    if (formData.avgPreviousLoanAmountPKR === '' || Number(formData.avgPreviousLoanAmountPKR) < 0) {
      newErrors.avgPreviousLoanAmountPKR = 'Average previous loan amount cannot be negative.';
    }
    if (!formData.repaymentHistoryGrade) {
      newErrors.repaymentHistoryGrade = 'Repayment history grade is required.';
    }

    if (!formData.supportingDocuments || formData.supportingDocuments.length === 0) {
      newErrors.supportingDocuments = 'At least one image proof document is required.';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      const firstErrorKey = Object.keys(newErrors)[0];
      const el = document.getElementById(firstErrorKey);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const income = Number(formData.monthlyIncomePKR);
    const requestedAmount = Number(formData.requestedLoanAmountPKR);
    const altCreditScore = deriveAltCreditScore({
      income,
      requestedAmount,
      utilityOnTimeRate: Number(formData.utilityBillOnTimeRate),
      onTimeRepaymentRate: Number(formData.onTimeRepaymentRate),
    });

    const submissionPayload: BorrowerApplication = {
      ...formData,
      id: formData.id || 'app-' + Date.now(),
      submittedAt: new Date().toISOString(),
      status: 'pending_review',
    };

    saveApplicationLocally(submissionPayload);
    addApplication({
      id: submissionPayload.id,
      applicantName: submissionPayload.fullName,
      income,
      requestedAmount,
      altCreditScore,
      riskLevel: deriveRiskLevel(altCreditScore),
      status: 'pending',
    });

    setTimeout(() => {
      setIsSubmitting(false);
      router.push(`/risk-assessments?id=${submissionPayload.id}`);
    }, 700);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              New Borrower Application
            </h2>
            <span className="text-xs font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
              Alternative Financial Data
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Collect applicant details, cashflow estimates, and high-frequency mobile wallet signals for risk assessment.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={prefillSampleData}
            leftIcon={<Sparkles className="w-3.5 h-3.5 text-emerald-600" />}
          >
            Fill Sample Borrower
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              setFormData(initialFormData);
              setErrors({});
            }}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            Reset
          </Button>
        </div>
      </div>

      {liveScore && (
        <div className="rounded-xl border border-emerald-500/20 bg-slate-950 text-slate-100 px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-wider font-semibold text-emerald-400">
              Live mock underwriting preview
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Alt credit score is estimated from income, requested amount, and repayment signals. No API call is made.
            </p>
          </div>
          <div className="flex items-center gap-6">
            <div>
              <p className="text-[10px] uppercase text-slate-500 font-semibold">Alt Score</p>
              <p className="text-2xl font-bold text-emerald-400 font-mono">{liveScore.altCreditScore}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase text-slate-500 font-semibold">Risk Level</p>
              <p className="text-sm font-semibold text-white">{liveScore.riskLevel}</p>
            </div>
            {Number(formData.requestedLoanAmountPKR) > 0 && (
              <div className="hidden md:block">
                <p className="text-[10px] uppercase text-slate-500 font-semibold">Requested</p>
                <p className="text-sm font-semibold text-white">
                  {formatPKR(Number(formData.requestedLoanAmountPKR))}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <ApplicationProgress currentStep={3} />

      <form onSubmit={handleSubmit} className="space-y-6">
        <BasicInfoSection formData={formData} errors={errors} onChange={handleFieldChange} />
        <FinancialProfileSection formData={formData} errors={errors} onChange={handleFieldChange} />
        <AlternativeSignalsSection formData={formData} errors={errors} onChange={handleFieldChange} />
        <RepaymentBehaviorSection formData={formData} errors={errors} onChange={handleFieldChange} />
        <SupportingDocumentsSection
          documents={formData.supportingDocuments || []}
          error={errors.supportingDocuments}
          onChange={handleSupportingDocumentsChange}
        />
        <OptionalCreditSection formData={formData} onChange={handleFieldChange} />

        {Object.keys(errors).length > 0 && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs text-rose-800">
              <p className="font-semibold">Please resolve the following required fields before proceeding:</p>
              <ul className="list-disc list-inside space-y-0.5 text-rose-700">
                {Object.values(errors).map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500 text-center sm:text-left">
            <span>By continuing, this application is added to the local underwriter queue for </span>
            <span className="font-semibold text-slate-700">Approve / Reject review</span>.
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isSubmitting}
            rightIcon={!isSubmitting && <ArrowRight className="w-4 h-4" />}
          >
            {isSubmitting ? 'Saving to underwriter queue...' : 'Submit to Underwriter Dashboard'}
          </Button>
        </div>
      </form>
    </div>
  );
}
