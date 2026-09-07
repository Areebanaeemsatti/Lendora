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
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center font-bold">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <CardTitle>Alternative Financial Signals</CardTitle>
              <CardDescription>
                High-frequency mobile wallet velocity, telco airtime, and utility consistency
              </CardDescription>
            </div>
          </div>
          <span className="hidden sm:inline-flex text-[11px] font-semibold bg-teal-500/10 text-teal-400 px-2.5 py-0.5 rounded-full border border-teal-500/25">
            Informal Signals
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800">
            <span className="text-[11px] font-medium text-zinc-400 flex items-center gap-1">
              <Smartphone className="w-3 h-3 text-teal-400" />
              Easypaisa Activity
            </span>
            <span className="text-sm sm:text-base font-bold text-zinc-100 mt-1 block">
              {easypaisa} <span className="text-xs font-normal text-zinc-500">tx/mo</span>
            </span>
            <span className="text-[10px] text-zinc-500 mt-0.5 block">Mobile Wallet</span>
          </div>

          <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800">
            <span className="text-[11px] font-medium text-zinc-400 flex items-center gap-1">
              <Smartphone className="w-3 h-3 text-red-400" />
              JazzCash Activity
            </span>
            <span className="text-sm sm:text-base font-bold text-zinc-100 mt-1 block">
              {jazzcash} <span className="text-xs font-normal text-zinc-500">tx/mo</span>
            </span>
            <span className="text-[10px] text-zinc-500 mt-0.5 block">Mobile Wallet</span>
          </div>

          <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800">
            <span className="text-[11px] font-medium text-zinc-400 flex items-center gap-1">
              <Activity className="w-3 h-3 text-emerald-400" />
              Total Wallet Velocity
            </span>
            <span className="text-sm sm:text-base font-bold text-teal-400 mt-1 block">
              {totalDigitalTx} <span className="text-xs font-normal text-zinc-500">tx/mo</span>
            </span>
            <span className="text-[10px] text-zinc-500 mt-0.5 block">Aggregated digital volume</span>
          </div>

          <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800">
            <span className="text-[11px] font-medium text-zinc-400 flex items-center gap-1">
              <Smartphone className="w-3 h-3 text-zinc-400" />
              Mobile Telco Recharge
            </span>
            <span className="text-sm sm:text-base font-bold text-zinc-100 font-mono mt-1 block">
              {formatPKR(recharge)}
            </span>
            <span className="text-[10px] text-zinc-500 mt-0.5 block">Monthly spend</span>
          </div>

          <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800">
            <span className="text-[11px] font-medium text-zinc-400 flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-400" />
              Utility On-Time Rate
            </span>
            <span className="text-sm sm:text-base font-bold text-emerald-400 mt-1 block">
              {onTimeRate !== '—' ? `${onTimeRate}%` : '—'}
            </span>
            <span className="text-[10px] text-zinc-500 mt-0.5 block">DISCO & Gas bills</span>
          </div>

          <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800">
            <span className="text-[11px] font-medium text-zinc-400 flex items-center gap-1">
              <Zap className="w-3 h-3 text-zinc-400" />
              Avg Utility Bill
            </span>
            <span className="text-sm sm:text-base font-bold text-zinc-100 font-mono mt-1 block">
              {formatPKR(utilityBill)}
            </span>
            <span className="text-[10px] text-zinc-500 mt-0.5 block">Monthly billing size</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
