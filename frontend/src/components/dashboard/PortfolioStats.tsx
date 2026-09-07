'use client';

import React, { useMemo } from 'react';
import { StatCard } from '@/components/ui/StatCard';
import { FileText, ShieldCheck, TrendingUp, Banknote } from 'lucide-react';
import { formatPKR } from '@/lib/utils';
import { useApplications } from '@/components/providers/ApplicationsProvider';

export function PortfolioStats() {
  const { applications } = useApplications();

  const metrics = useMemo(() => {
    const approved = applications.filter((app) => app.status === 'approved');
    const approvalRate =
      applications.length === 0 ? 0 : Math.round((approved.length / applications.length) * 100);
    const volume = approved.reduce((sum, app) => sum + app.requestedAmount, 0);
    const avgScore =
      applications.length === 0
        ? 0
        : Math.round(
            applications.reduce((sum, app) => sum + app.altCreditScore, 0) / applications.length
          );

    return [
      {
        title: 'Total Applications',
        value: String(applications.length),
        subtext: 'Active queue',
        trend: 'up' as const,
        trendValue: `${applications.filter((app) => app.status === 'pending').length} pending`,
        icon: <FileText className="w-4 h-4 text-zinc-400" />,
      },
      {
        title: 'Approved Volume',
        value: formatPKR(volume),
        subtext: 'Total approved PKR',
        trend: 'up' as const,
        trendValue: `${approved.length} approved`,
        icon: <Banknote className="w-4 h-4 text-emerald-400" />,
      },
      {
        title: 'Approval Rate',
        value: `${approvalRate}%`,
        subtext: 'Of submitted applications',
        trend: 'neutral' as const,
        trendValue: 'Local state',
        icon: <TrendingUp className="w-4 h-4 text-sky-400" />,
      },
      {
        title: 'Avg AI Credit Score',
        value: String(avgScore),
        subtext: 'Alternative credit median',
        trend: 'up' as const,
        trendValue: 'AI median score',
        icon: <ShieldCheck className="w-4 h-4 text-teal-400" />,
      },
    ];
  }, [applications]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric) => (
        <StatCard
          key={metric.title}
          title={metric.title}
          value={metric.value}
          subtext={metric.subtext}
          trend={metric.trend}
          trendValue={metric.trendValue}
          icon={metric.icon}
        />
      ))}
    </div>
  );
}
