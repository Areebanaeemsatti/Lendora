import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { formatPKR } from '@/lib/utils';
import { BorrowerApplication } from '@/types';
import { History, ShieldAlert, Award } from 'lucide-react';

interface Props {
  application: BorrowerApplication;
}

export function RepaymentBehaviorCard({ application }: Props) {
  const previousLoans = application.previousLoansCount !== '' ? application.previousLoansCount : 0;
  const previousDefaults = application.previousDefaultsCount !== '' ? application.previousDefaultsCount : 0;
  const onTimeRate = application.onTimeRepaymentRate !== '' ? application.onTimeRepaymentRate : '—';
  const avgAmount = typeof application.avgPreviousLoanAmountPKR === 'number' ? application.avgPreviousLoanAmountPKR : 0;
  const grade = application.repaymentHistoryGrade || 'Not recorded';

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
            <History className="w-4 h-4" />
          </div>
          <div>
            <CardTitle>Past Loan &amp; Repayment History</CardTitle>
            <CardDescription>
              Overview of past borrowing, timely payments, and repayment track record
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-lg bg-white/70 border border-white/80">
            <span className="text-[11px] font-medium text-[#475569] block">Previous Loans</span>
            <span className="text-sm sm:text-base font-bold text-[#0F172A] mt-1 block">
              {previousLoans}
            </span>
            <span className="text-[10px] text-[#475569] mt-0.5 block">Past loans taken</span>
          </div>

          <div className="p-3 rounded-lg bg-white/70 border border-white/80">
            <span className="text-[11px] font-medium text-[#475569] block">Late / Unpaid</span>
            <span className="text-sm sm:text-base font-bold text-[#0F172A] mt-1 block">
              {previousDefaults}
            </span>
            <span className="text-[10px] text-[#475569] mt-0.5 block">Overdue count</span>
          </div>

          <div className="p-3 rounded-lg bg-white/70 border border-white/80">
            <span className="text-[11px] font-medium text-[#475569] block">On-Time Repayment</span>
            <span className="text-sm sm:text-base font-bold text-emerald-600 mt-1 block">
              {onTimeRate !== '—' ? `${onTimeRate}%` : '—'}
            </span>
            <span className="text-[10px] text-[#475569] mt-0.5 block">Paid on schedule</span>
          </div>

          <div className="p-3 rounded-lg bg-white/70 border border-white/80">
            <span className="text-[11px] font-medium text-[#475569] block">Avg Previous Loan</span>
            <span className="text-sm sm:text-base font-bold text-[#0F172A] font-mono mt-1 block">
              {formatPKR(avgAmount)}
            </span>
            <span className="text-[10px] text-[#475569] mt-0.5 block">Typical loan amount</span>
          </div>
        </div>

        {/* Qualitative Grade & Optional Traditional Credit Remarks */}
        <div className="p-3.5 rounded-lg bg-white/70 border border-white/80 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[#475569] font-semibold flex items-center gap-1.5">
              <Award className="w-4 h-4 text-emerald-600" />
              Repayment Track Record:
            </span>
            <span className="font-bold text-[#0F172A] bg-white/70 px-2.5 py-1 rounded border border-slate-200">
              {grade}
            </span>
          </div>

          <div className="pt-2 border-t border-white/80 text-[#475569] flex flex-wrap items-center justify-between gap-2 text-[11px]">
            <span>
              Bank Account:{' '}
              <strong className="text-[#0F172A] uppercase">
                {application.hasBankAccount || 'Not specified'}
              </strong>
            </span>
            <span>•</span>
            <span>
              Credit Bureau Record:{' '}
              <strong className="text-[#0F172A] uppercase">
                {application.hasFormalCreditHistory || 'None (Alternative Profile)'}
              </strong>
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
