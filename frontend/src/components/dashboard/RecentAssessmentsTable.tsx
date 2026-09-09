'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { StatusBadge, RiskTierBadge } from '@/components/ui/Badge';
import { formatPKR } from '@/lib/utils';
import { ChevronRight, ArrowUpRight, Search, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useApplications } from '@/components/providers/ApplicationsProvider';
import { toApplicationStatus, toRiskTier } from '@/lib/mockData';

export function RecentAssessmentsTable() {
  const { applications } = useApplications();
  const [search, setSearch] = useState('');

  const filteredApps = useMemo(() => {
    if (!search.trim()) return applications.slice(0, 6);
    const q = search.toLowerCase();
    return applications
      .filter(
        (app) =>
          app.applicantName.toLowerCase().includes(q) ||
          app.id.toLowerCase().includes(q) ||
          String(app.altCreditScore).includes(q)
      )
      .slice(0, 6);
  }, [applications, search]);

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
            <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <CardTitle>Recent Applications</CardTitle>
          </div>
          <CardDescription>
            Latest loan applications submitted for credit score review
          </CardDescription>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Search queue..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 rounded-md pl-8 pr-2 py-1 text-xs text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <Link href="/risk-assessments">
            <Button variant="outline" size="sm" rightIcon={<ChevronRight className="w-3.5 h-3.5" />}>
              View All
            </Button>
          </Link>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {filteredApps.length === 0 ? (
          <div className="p-8 flex items-center justify-center">
            <div className="border border-dashed border-zinc-800 rounded-md p-8 w-full max-w-md text-center space-y-2">
              <p className="text-sm font-semibold text-zinc-300">No applications match your search</p>
              <p className="text-xs text-zinc-500">Try searching by applicant name or application ID.</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm" aria-label="Recent Underwriting Applications Queue">
              <thead className="bg-zinc-900/80 border-b border-zinc-800/80 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                <tr>
                  <th scope="col" className="px-6 py-3.5">Applicant</th>
                  <th scope="col" className="px-6 py-3.5">Monthly Income</th>
                  <th scope="col" className="px-6 py-3.5">Requested Loan</th>
                  <th scope="col" className="px-6 py-3.5">Risk Level</th>
                  <th scope="col" className="px-6 py-3.5">Status</th>
                  <th scope="col" className="px-6 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                {filteredApps.map((app) => (
                  <tr key={app.id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-zinc-100">{app.applicantName}</div>
                      <div className="text-xs text-zinc-500 font-mono mt-0.5">{app.id}</div>
                    </td>
                    <td className="px-6 py-4 font-mono text-zinc-300">{formatPKR(app.income)}</td>
                    <td className="px-6 py-4 font-mono font-semibold text-zinc-100">
                      {formatPKR(app.requestedAmount)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <RiskTierBadge tier={toRiskTier(app.riskLevel)} />
                        <span className="text-xs font-mono font-medium text-emerald-400">
                          ({app.altCreditScore})
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={toApplicationStatus(app.status)} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/risk-assessments?id=${app.id}`}>
                        <Button variant="ghost" size="sm" className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10">
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
        )}
      </CardContent>
    </Card>
  );
}

