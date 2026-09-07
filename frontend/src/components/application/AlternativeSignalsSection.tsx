import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { BorrowerApplication } from '@/types';
import { Activity, Smartphone, Zap } from 'lucide-react';

interface Props {
  formData: BorrowerApplication;
  errors: Record<string, string>;
  onChange: (field: keyof BorrowerApplication, value: any) => void;
}

export function AlternativeSignalsSection({ formData, errors, onChange }: Props) {
  return (
    <Card id="section-3" className="border-teal-500/20 bg-teal-500/5">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center font-bold">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <CardTitle>Section 3: Digital Financial Activity (Alternative Signals)</CardTitle>
              <CardDescription>
                High-frequency mobile wallet, telco recharge, and utility payment signals
              </CardDescription>
            </div>
          </div>
          <span className="hidden sm:inline-flex text-[11px] font-semibold bg-teal-500/10 text-teal-400 px-2.5 py-0.5 rounded-full border border-teal-500/25">
            Pakistan Informal Economy
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Input
            label="Avg Monthly Easypaisa Transactions"
            type="number"
            suffixText="tx/mo"
            value={formData.monthlyEasypaisaTxCount}
            onChange={(e) =>
              onChange('monthlyEasypaisaTxCount', e.target.value ? parseInt(e.target.value, 10) : '')
            }
            error={errors.monthlyEasypaisaTxCount}
            placeholder="e.g. 18"
            min={0}
            helperText="Number of inbound/outbound mobile wallet transactions per month."
          />

          <Input
            label="Avg Monthly JazzCash Transactions"
            type="number"
            suffixText="tx/mo"
            value={formData.monthlyJazzCashTxCount}
            onChange={(e) =>
              onChange('monthlyJazzCashTxCount', e.target.value ? parseInt(e.target.value, 10) : '')
            }
            error={errors.monthlyJazzCashTxCount}
            placeholder="e.g. 12"
            min={0}
            helperText="Monthly volume of digital wallet transactions on JazzCash."
          />

          <Input
            label="Avg Monthly Mobile Recharge"
            type="number"
            prefixText="₨"
            value={formData.monthlyMobileRechargePKR}
            onChange={(e) =>
              onChange('monthlyMobileRechargePKR', e.target.value ? parseFloat(e.target.value) : '')
            }
            error={errors.monthlyMobileRechargePKR}
            placeholder="e.g. 2500"
            min={0}
            helperText="Average expenditure on mobile telco airtime and data bundles."
          />

          <Input
            label="Utility Bills Paid On Time"
            type="number"
            suffixText="%"
            value={formData.utilityBillOnTimeRate}
            onChange={(e) =>
              onChange('utilityBillOnTimeRate', e.target.value ? parseFloat(e.target.value) : '')
            }
            error={errors.utilityBillOnTimeRate}
            placeholder="e.g. 90"
            min={0}
            max={100}
            helperText="Percentage of electricity (DISCOs), gas (SSGC/SNGPL), and water bills settled on time."
          />

          <Input
            label="Avg Monthly Utility Bill"
            type="number"
            prefixText="₨"
            value={formData.monthlyUtilityBillPKR}
            onChange={(e) =>
              onChange('monthlyUtilityBillPKR', e.target.value ? parseFloat(e.target.value) : '')
            }
            error={errors.monthlyUtilityBillPKR}
            placeholder="e.g. 14000"
            min={0}
            helperText="Average aggregate monthly electricity and gas bill amount in PKR."
          />
        </div>
      </CardContent>
    </Card>
  );
}
