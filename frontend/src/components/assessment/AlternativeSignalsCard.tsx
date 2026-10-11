import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { formatPKR } from '@/lib/utils';
import { BorrowerApplication } from '@/types';
import { Activity, Smartphone, Zap, CheckCircle2 } from 'lucide-react';

interface Props {
  application: BorrowerApplication;
}

export function AlternativeSignalsCard({ application }: Props) {
  const easypaisa = Number(application.monthlyEasypaisaTxCount) || 0;
  const jazzcash = Number(application.monthlyJazzCashTxCount) || 0;
  const totalDigitalTx = easypaisa + jazzcash;
  const recharge = typeof application.monthlyMobileRechargePKR === 'number' ? application.monthlyMobileRechargePKR : 0;
  const utilityBill = typeof application.monthlyUtilityBillPKR === 'number' ? application.monthlyUtilityBillPKR : 0;
  const onTimeRate = application.utilityBillOnTimeRate !== '' ? application.utilityBillOnTimeRate : '—';

  return (
    <Card className="h-full border-teal-500/20 bg-teal-500/5">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-600 flex items-center justify-center font-bold">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <CardTitle>Daily Financial Activity</CardTitle>
              <CardDescription>
                Everyday mobile wallet transactions, mobile recharges, and utility bill history
              </CardDescription>
            </div>
          </div>
          <span className="hidden sm:inline-flex text-[11px] font-semibold bg-teal-500/10 text-teal-600 px-2.5 py-0.5 rounded-full border border-teal-500/25">
            Digital Habits
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-lg bg-white/70 border border-white/80">
            <span className="text-[11px] font-medium text-[#475569] flex items-center gap-1">
              <Smartphone className="w-3 h-3 text-teal-600" />
              Easypaisa Activity
            </span>
            <span className="text-sm sm:text-base font-bold text-[#0F172A] mt-1 block">
              {easypaisa} <span className="text-xs font-normal text-[#475569]">tx/mo</span>
            </span>
            <span className="text-[10px] text-[#475569] mt-0.5 block">Mobile Wallet</span>
          </div>

          <div className="p-3 rounded-lg bg-white/70 border border-white/80">
            <span className="text-[11px] font-medium text-[#475569] flex items-center gap-1">
              <Smartphone className="w-3 h-3 text-red-400" />
              JazzCash Activity
            </span>
            <span className="text-sm sm:text-base font-bold text-[#0F172A] mt-1 block">
              {jazzcash} <span className="text-xs font-normal text-[#475569]">tx/mo</span>
            </span>
            <span className="text-[10px] text-[#475569] mt-0.5 block">Mobile Wallet</span>
          </div>

          <div className="p-3 rounded-lg bg-white/70 border border-white/80">
            <span className="text-[11px] font-medium text-[#475569] flex items-center gap-1">
              <Activity className="w-3 h-3 text-emerald-600" />
              Total Monthly Transactions
            </span>
            <span className="text-sm sm:text-base font-bold text-teal-600 mt-1 block">
              {totalDigitalTx} <span className="text-xs font-normal text-[#475569]">tx/mo</span>
            </span>
            <span className="text-[10px] text-[#475569] mt-0.5 block">Combined monthly wallet count</span>
          </div>

          <div className="p-3 rounded-lg bg-white/70 border border-white/80">
            <span className="text-[11px] font-medium text-[#475569] flex items-center gap-1">
              <Smartphone className="w-3 h-3 text-[#475569]" />
              Mobile Recharge
            </span>
            <span className="text-sm sm:text-base font-bold text-[#0F172A] font-mono mt-1 block">
              {formatPKR(recharge)}
            </span>
            <span className="text-[10px] text-[#475569] mt-0.5 block">Monthly phone credit</span>
          </div>

          <div className="p-3 rounded-lg bg-white/70 border border-white/80">
            <span className="text-[11px] font-medium text-[#475569] flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-600" />
              Utility On-Time Rate
            </span>
            <span className="text-sm sm:text-base font-bold text-emerald-600 mt-1 block">
              {onTimeRate !== '—' ? `${onTimeRate}%` : '—'}
            </span>
            <span className="text-[10px] text-[#475569] mt-0.5 block">Electricity &amp; gas bills</span>
          </div>

          <div className="p-3 rounded-lg bg-white/70 border border-white/80">
            <span className="text-[11px] font-medium text-[#475569] flex items-center gap-1">
              <Zap className="w-3 h-3 text-[#475569]" />
              Avg Utility Bill
            </span>
            <span className="text-sm sm:text-base font-bold text-[#0F172A] font-mono mt-1 block">
              {formatPKR(utilityBill)}
            </span>
            <span className="text-[10px] text-[#475569] mt-0.5 block">Monthly bills</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
