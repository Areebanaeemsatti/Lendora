'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { StatusBadge, RiskTierBadge } from '@/components/ui/Badge';
import { formatPKR } from '@/lib/utils';
import { ChevronRight, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useApplications } from '@/components/providers/ApplicationsProvider';
import { toApplicationStatus, toRiskTier } from '@/lib/mockData';

export function RecentAssessmentsTable() {
  const { applications } = useApplications();

  return (
    <Card>
      <CardHeader className="flex sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <CardTitle>Recent Underwriting Queue</CardTitle>
          <CardDescription>
            Live mock applications shared with the borrower form and underwriter dashboard
          </CardDescription>
        </div>
        <Link href="/risk-assessments">
          <Button variant="outline" size="sm" rightIcon={<ChevronRight className="w-3.5 h-3.5" />}>
            View All Assessments
          </Button>
        </Link>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-6 py-3.5">Borrower / Application ID</th>
                <th className="px-6 py-3.5">Income</th>
                <th className="px-6 py-3.5">Amount (PKR)</th>
                <th className="px-6 py-3.5">AI Risk Tier</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {applications.slice(0, 6).map((app) => (
                <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900">{app.applicantName}</div>
                    <div className="text-xs text-slate-400 font-mono mt-0.5">{app.id}</div>
                  </td>
                  <td className="px-6 py-4 font-mono text-slate-800">{formatPKR(app.income)}</td>
                  <td className="px-6 py-4 font-mono font-semibold text-slate-900">
                    {formatPKR(app.requestedAmount)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <RiskTierBadge tier={toRiskTier(app.riskLevel)} />
                      <span className="text-xs font-mono font-medium text-slate-500">
                        ({app.altCreditScore})
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={toApplicationStatus(app.status)} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/risk-assessments?id=${app.id}`}>
                      <Button variant="ghost" size="sm" className="text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50">
                        Review
                        <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
