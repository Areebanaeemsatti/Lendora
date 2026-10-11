import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { formatPKR } from '@/lib/utils';
import { BorrowerApplication } from '@/types';
import { Wallet, ArrowDownRight, ArrowUpRight, Scale } from 'lucide-react';

interface Props {
  application: BorrowerApplication;
}

export function FinancialProfileCard({ application }: Props) {
  const income = typeof application.monthlyIncomePKR === 'number' ? application.monthlyIncomePKR : 0;
  const expenses = typeof application.monthlyExpensesPKR === 'number' ? application.monthlyExpensesPKR : 0;
  const debt = typeof application.existingDebtPKR === 'number' ? application.existingDebtPKR : 0;
  const netSurplus = income - (expenses + debt);

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
            <Wallet className="w-4 h-4" />
          </div>
          <div>
            <CardTitle>Monthly Income &amp; Budget</CardTitle>
            <CardDescription>
              Reported monthly income, living expenses, and commitments
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-lg bg-white/70 border border-white/80">
            <span className="text-[11px] font-medium text-[#475569] block">
              Monthly Income
            </span>
            <span className="text-sm sm:text-base font-bold text-[#0F172A] font-mono mt-1 block">
              {formatPKR(income)}
            </span>
            <span className="text-[10px] text-[#475569] mt-0.5 block">Estimated / Stated</span>
          </div>

          <div className="p-3 rounded-lg bg-white/70 border border-white/80">
            <span className="text-[11px] font-medium text-[#475569] block">
              Household Expenses
            </span>
            <span className="text-sm sm:text-base font-bold text-[#0F172A] font-mono mt-1 block">
              {formatPKR(expenses)}
            </span>
            <span className="text-[10px] text-[#475569] mt-0.5 block">Living &amp; Rent</span>
          </div>

          <div className="p-3 rounded-lg bg-white/70 border border-white/80">
            <span className="text-[11px] font-medium text-[#475569] block">
              Existing Debt
            </span>
            <span className="text-sm sm:text-base font-bold text-[#0F172A] font-mono mt-1 block">
              {formatPKR(debt)}
            </span>
            <span className="text-[10px] text-[#475569] mt-0.5 block">Monthly commitments</span>
          </div>
        </div>

        {/* Cashflow Surplus / Net Balance Bar */}
        <div className="p-4 rounded-lg bg-gradient-to-r from-[#00C6FF] to-[#0072ff] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-600 flex items-center justify-center font-bold">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#0F172A]">
                Estimated Monthly Savings
              </p>
              <p className="text-[11px] text-[#475569]">
                Income left over after covering living costs and debts
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-base sm:text-lg font-bold font-mono text-emerald-600">
              {formatPKR(netSurplus)}
            </span>
            <span className="block text-[10px] text-[#475569]">per month</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
