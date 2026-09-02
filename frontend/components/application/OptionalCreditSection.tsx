import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { BorrowerApplication } from '@/types';
import { Shield } from 'lucide-react';

interface Props {
  formData: BorrowerApplication;
  onChange: (field: keyof BorrowerApplication, value: any) => void;
}

export function OptionalCreditSection({ formData, onChange }: Props) {
  const yesNoOptions = [
    { value: 'yes', label: 'Yes' },
    { value: 'no', label: 'No' },
  ];

  return (
    <Card id="section-5" className="border-slate-300/80 bg-slate-50/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center font-bold">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-slate-800">
                Section 5: Optional Traditional Credit History
              </CardTitle>
              <CardDescription>
                Traditional banking documentation is completely optional
              </CardDescription>
            </div>
          </div>
          <span className="text-xs font-semibold text-slate-500 bg-slate-200/80 px-2.5 py-0.5 rounded-full">
            Optional
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-3.5 rounded-lg bg-emerald-50/80 border border-emerald-200/80 text-xs text-emerald-900 leading-relaxed">
          <span className="font-semibold">Alternative Credit Philosophy:</span> Traditional credit information is optional. Lendora is designed to supplement limited traditional credit history with alternative financial signals.
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          <Input
            label="Credit History Years"
            type="number"
            optional
            suffixText="years"
            value={formData.creditHistoryYears ?? ''}
            onChange={(e) =>
              onChange('creditHistoryYears', e.target.value ? parseInt(e.target.value, 10) : '')
            }
            placeholder="e.g. 3"
            min={0}
            helperText="Number of years with an active formal bank credit facility."
          />

          <Select
            label="Existing Bank Account"
            optional
            value={formData.hasBankAccount ?? ''}
            onChange={(e) => onChange('hasBankAccount', e.target.value as 'yes' | 'no')}
            options={yesNoOptions}
            placeholder="Select status..."
            helperText="Whether applicant holds a formal commercial bank account."
          />

          <Select
            label="Previous Formal Credit"
            optional
            value={formData.hasFormalCreditHistory ?? ''}
            onChange={(e) => onChange('hasFormalCreditHistory', e.target.value as 'yes' | 'no')}
            options={yesNoOptions}
            placeholder="Select status..."
            helperText="Whether applicant appears on eCIB / formal credit bureaus."
          />

          <div className="sm:col-span-3">
            <Input
              label="Traditional Credit Notes"
              optional
              value={formData.traditionalCreditNotes ?? ''}
              onChange={(e) => onChange('traditionalCreditNotes', e.target.value)}
              placeholder="Any additional bank reference remarks or eCIB details (optional)..."
              helperText="Optional notes for the underwriting record."
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
