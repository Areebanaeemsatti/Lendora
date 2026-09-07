import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { BorrowerApplication, RepaymentHistoryGrade } from '@/types';
import { History } from 'lucide-react';

interface Props {
  formData: BorrowerApplication;
  errors: Record<string, string>;
  onChange: (field: keyof BorrowerApplication, value: any) => void;
}

export function RepaymentBehaviorSection({ formData, errors, onChange }: Props) {
  const gradeOptions = [
    { value: 'Excellent', label: 'Excellent (100% on-time settlement)' },
    { value: 'Good', label: 'Good (Occasional minor grace-period delays)' },
    { value: 'Fair', label: 'Fair (Repeated 15-30 day delays)' },
    { value: 'Poor', label: 'Poor (History of extended overdue payments)' },
    { value: 'No previous borrowing history', label: 'No previous borrowing history' },
  ];

  return (
    <Card id="section-4">
      <CardHeader>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
            <History className="w-4 h-4" />
          </div>
          <div>
            <CardTitle>Section 4: Repayment Behavior</CardTitle>
            <CardDescription>
              Track record across microfinance, supplier credit, or informal lending facilities
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Input
            label="Previous Loans Count"
            type="number"
            value={formData.previousLoansCount}
            onChange={(e) =>
              onChange('previousLoansCount', e.target.value ? parseInt(e.target.value, 10) : '')
            }
            error={errors.previousLoansCount}
            placeholder="e.g. 2"
            min={0}
            helperText="Total number of formal or informal loans taken in the past 3 years (0 if first-time borrower)."
          />

          <Input
            label="Previous Defaults Count"
            type="number"
            value={formData.previousDefaultsCount}
            onChange={(e) =>
              onChange('previousDefaultsCount', e.target.value ? parseInt(e.target.value, 10) : '')
            }
            error={errors.previousDefaultsCount}
            placeholder="e.g. 0"
            min={0}
            helperText="Number of unresolved defaulted borrowing facilities (0 if none)."
          />

          <Input
            label="On-Time Repayment Rate"
            type="number"
            suffixText="%"
            value={formData.onTimeRepaymentRate}
            onChange={(e) =>
              onChange('onTimeRepaymentRate', e.target.value ? parseFloat(e.target.value) : '')
            }
            error={errors.onTimeRepaymentRate}
            placeholder="e.g. 95"
            min={0}
            max={100}
            helperText="Historical percentage of installments cleared on or before due date."
          />

          <Input
            label="Avg Previous Loan Amount"
            type="number"
            prefixText="₨"
            value={formData.avgPreviousLoanAmountPKR}
            onChange={(e) =>
              onChange('avgPreviousLoanAmountPKR', e.target.value ? parseFloat(e.target.value) : '')
            }
            error={errors.avgPreviousLoanAmountPKR}
            placeholder="e.g. 100000"
            min={0}
            helperText="Average ticket size of previous credit facilities in PKR (0 if none)."
          />

          <div className="sm:col-span-2">
            <Select
              label="Previous Loan Repayment History"
              value={formData.repaymentHistoryGrade}
              onChange={(e) =>
                onChange('repaymentHistoryGrade', e.target.value as RepaymentHistoryGrade)
              }
              options={gradeOptions}
              placeholder="Select repayment history..."
              error={errors.repaymentHistoryGrade}
              helperText="Qualitative record of borrower consistency with past lenders or suppliers."
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
