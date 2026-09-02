import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { BorrowerApplication } from '@/types';
import { Wallet } from 'lucide-react';

interface Props {
  formData: BorrowerApplication;
  errors: Record<string, string>;
  onChange: (field: keyof BorrowerApplication, value: any) => void;
}

export function FinancialProfileSection({ formData, errors, onChange }: Props) {
  return (
    <Card id="section-2">
      <CardHeader>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <Wallet className="w-4 h-4" />
          </div>
          <div>
            <CardTitle>Section 2: Income & Financial Profile</CardTitle>
            <CardDescription>
              Cashflow estimates and requested loan financing parameters
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Input
            label="Average Monthly Income"
            type="number"
            prefixText="₨"
            value={formData.monthlyIncomePKR}
            onChange={(e) =>
              onChange('monthlyIncomePKR', e.target.value ? parseFloat(e.target.value) : '')
            }
            error={errors.monthlyIncomePKR}
            placeholder="e.g. 75000"
            helperText="Estimated average monthly income based on available financial activity."
          />

          <Input
            label="Monthly Household Expenses"
            type="number"
            prefixText="₨"
            value={formData.monthlyExpensesPKR}
            onChange={(e) =>
              onChange('monthlyExpensesPKR', e.target.value ? parseFloat(e.target.value) : '')
            }
            error={errors.monthlyExpensesPKR}
            placeholder="e.g. 45000"
            helperText="Estimated food, utility, rent, and recurring family living costs."
          />

          <Input
            label="Existing Debt Obligations"
            type="number"
            prefixText="₨"
            value={formData.existingDebtPKR}
            onChange={(e) =>
              onChange('existingDebtPKR', e.target.value ? parseFloat(e.target.value) : '')
            }
            error={errors.existingDebtPKR}
            placeholder="e.g. 10000"
            helperText="Total existing monthly repayment or outstanding credit obligations (0 if none)."
          />

          <Input
            label="Requested Loan Amount"
            type="number"
            prefixText="₨"
            value={formData.requestedLoanAmountPKR}
            onChange={(e) =>
              onChange('requestedLoanAmountPKR', e.target.value ? parseFloat(e.target.value) : '')
            }
            error={errors.requestedLoanAmountPKR}
            placeholder="e.g. 200000"
            helperText="Financing amount requested by the applicant in PKR."
          />

          <Input
            label="Loan Term"
            type="number"
            suffixText="months"
            value={formData.loanTermMonths}
            onChange={(e) =>
              onChange('loanTermMonths', e.target.value ? parseInt(e.target.value, 10) : '')
            }
            error={errors.loanTermMonths}
            placeholder="e.g. 12"
            min={1}
            max={60}
            helperText="Proposed duration of repayment in months."
          />
        </div>
      </CardContent>
    </Card>
  );
}
