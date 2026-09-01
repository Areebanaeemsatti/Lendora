import React from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { PortfolioStats } from '@/components/dashboard/PortfolioStats';
import { RecentAssessmentsTable } from '@/components/dashboard/RecentAssessmentsTable';
import { ModelHealthWidget } from '@/components/dashboard/ModelHealthWidget';
import { Button } from '@/components/ui/Button';
import { PlusCircle, ShieldCheck } from 'lucide-react';

export default function DashboardPage() {
  return (
    <AppLayout>
      {/* Welcome / Quick Action Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            AI Underwriting Foundation Live
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            Lendora Loan Risk Assessment Platform
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            AI-driven credit underwriting for Pakistani borrowers. Evaluate SME creditworthiness, analyze risk metrics, and process loan applications with explainable AI.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Link href="/new-application">
            <Button
              variant="primary"
              size="md"
              leftIcon={<PlusCircle className="w-4 h-4" />}
            >
              New Application
            </Button>
          </Link>
          <Link href="/risk-assessments">
            <Button
              variant="secondary"
              size="md"
              leftIcon={<ShieldCheck className="w-4 h-4" />}
            >
              Risk Assessments
            </Button>
          </Link>
        </div>
      </div>

      {/* Portfolio Overview KPIs */}
      <PortfolioStats />

      {/* Recent Underwriting Queue */}
      <RecentAssessmentsTable />

      {/* Model Health & Architecture Overview */}
      <ModelHealthWidget />
    </AppLayout>
  );
}
