'use client';

import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  Activity, 
  Zap, 
  Smartphone, 
  Wifi, 
  CheckCircle, 
  AlertCircle, 
  XCircle,
  TrendingUp,
  Clock,
  Signal
} from 'lucide-react';
import { cn } from '@/lib/utils';

type FeedStatus = 'verified' | 'delayed' | 'disconnected';

interface TelecomFeed {
  id: string;
  provider: string;
  serviceType: 'utility' | 'telecom' | 'internet' | 'mobile_wallet';
  accountNumber: string;
  businessName: string;
  amountPKR: number;
  dueDate: string;
  paymentDate?: string;
  status: FeedStatus;
  delayDays?: number;
  reliabilityScore: number;
  dataPoint: string;
}

const mockTelecomFeeds: TelecomFeed[] = [
  {
    id: 'feed-001',
    provider: 'K-Electric',
    serviceType: 'utility',
    accountNumber: 'KE-8842-2910',
    businessName: 'Muhammad Tariq Enterprises',
    amountPKR: 45000,
    dueDate: '2026-08-25',
    paymentDate: '2026-08-24',
    status: 'verified',
    reliabilityScore: 98,
    dataPoint: 'On-time payment (1 day early)'
  },
  {
    id: 'feed-002',
    provider: 'Jazz',
    serviceType: 'telecom',
    accountNumber: 'JZ-0321-8845',
    businessName: 'Farhan Electronics & Mobile Care',
    amountPKR: 2500,
    dueDate: '2026-08-28',
    paymentDate: '2026-08-30',
    status: 'delayed',
    delayDays: 2,
    reliabilityScore: 85,
    dataPoint: 'Payment 2 days late'
  },
  {
    id: 'feed-003',
    provider: 'Sui Southern Gas',
    serviceType: 'utility',
    accountNumber: 'SSG-5521-4432',
    businessName: 'Rashid Mahmood Ansari',
    amountPKR: 12000,
    dueDate: '2026-08-20',
    paymentDate: '2026-08-20',
    status: 'verified',
    reliabilityScore: 95,
    dataPoint: 'On-time payment'
  },
  {
    id: 'feed-004',
    provider: 'PTCL',
    serviceType: 'internet',
    accountNumber: 'PT-9912-3321',
    businessName: 'Noor Modern Pharmacy',
    amountPKR: 3500,
    dueDate: '2026-08-15',
    status: 'disconnected',
    delayDays: 18,
    reliabilityScore: 42,
    dataPoint: 'Service suspended due to non-payment'
  },
  {
    id: 'feed-005',
    provider: 'Easypaisa',
    serviceType: 'mobile_wallet',
    accountNumber: 'EP-0300-1234567',
    businessName: 'Khyber Agro Logistics',
    amountPKR: 85000,
    dueDate: '2026-08-30',
    paymentDate: '2026-08-29',
    status: 'verified',
    reliabilityScore: 92,
    dataPoint: 'High volume transaction (consistent)'
  },
  {
    id: 'feed-006',
    provider: 'SCOM',
    serviceType: 'telecom',
    accountNumber: 'SC-1122-5566',
    businessName: 'Apex Digital Solutions',
    amountPKR: 4200,
    dueDate: '2026-08-22',
    paymentDate: '2026-08-22',
    status: 'verified',
    reliabilityScore: 96,
    dataPoint: 'On-time payment'
  },
  {
    id: 'feed-007',
    provider: 'JazzCash',
    serviceType: 'mobile_wallet',
    accountNumber: 'JC-0345-9876543',
    businessName: 'Sana Boutique & Stitching House',
    amountPKR: 15000,
    dueDate: '2026-08-18',
    paymentDate: '2026-08-25',
    status: 'delayed',
    delayDays: 7,
    reliabilityScore: 68,
    dataPoint: 'Payment 7 days late'
  },
  {
    id: 'feed-008',
    provider: 'K-Electric',
    serviceType: 'utility',
    accountNumber: 'KE-7733-2211',
    businessName: 'TechZone Solutions',
    amountPKR: 28000,
    dueDate: '2026-08-27',
    paymentDate: '2026-08-26',
    status: 'verified',
    reliabilityScore: 94,
    dataPoint: 'On-time payment (1 day early)'
  },
];

const serviceIcons = {
  utility: Zap,
  telecom: Smartphone,
  internet: Wifi,
  mobile_wallet: Activity,
};

const statusConfig = {
  verified: {
    icon: CheckCircle,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    badgeColor: 'bg-emerald-100 text-emerald-700 border-emerald-300'
  },
  delayed: {
    icon: AlertCircle,
    color: 'text-amber-500',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    badgeColor: 'bg-amber-100 text-amber-700 border-amber-300'
  },
  disconnected: {
    icon: XCircle,
    color: 'text-rose-500',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-200',
    badgeColor: 'bg-rose-100 text-rose-700 border-rose-300'
  }
};

function formatPKR(amount: number): string {
  return `PKR ${amount.toLocaleString()}`;
}

export default function TelecomFeedPage() {
  const [filter, setFilter] = useState<FeedStatus | 'all'>('all');

  const stats = {
    totalFeeds: mockTelecomFeeds.length,
    dataReliabilityScore: 94,
    avgUtilityDelayDays: 3.2,
    verifiedCount: mockTelecomFeeds.filter(f => f.status === 'verified').length,
    delayedCount: mockTelecomFeeds.filter(f => f.status === 'delayed').length,
    disconnectedCount: mockTelecomFeeds.filter(f => f.status === 'disconnected').length,
  };

  const filteredFeeds = filter === 'all' 
    ? mockTelecomFeeds 
    : mockTelecomFeeds.filter(feed => feed.status === filter);

  return (
    <AppLayout>
      <div className="space-y-6 max-w-7xl mx-auto pb-16">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <Signal className="w-5 h-5 text-emerald-600" />
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                SME Telecom/Utility Feed
              </h2>
              <Badge variant="emerald" dot>
                Live Monitoring
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Real-time alternative data feeds from utility providers, telecom operators, and mobile wallet services for SME credit assessment.
            </p>
          </div>
        </div>

        {/* Summary Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="Total Feeds Active"
            value={String(stats.totalFeeds)}
            icon={Activity}
            color="emerald"
            description="Data points monitored"
          />
          <MetricCard
            label="Data Reliability Score"
            value={`${stats.dataReliabilityScore}%`}
            icon={TrendingUp}
            color="teal"
            description="Feed accuracy rate"
          />
          <MetricCard
            label="Avg Utility Delay Days"
            value={`${stats.avgUtilityDelayDays}d`}
            icon={Clock}
            color="amber"
            description="Payment latency"
          />
          <MetricCard
            label="Verified Payments"
            value={`${stats.verifiedCount}/${stats.totalFeeds}`}
            icon={CheckCircle}
            color="sky"
            description="On-time rate"
          />
        </div>

        {/* Feed Table */}
        <Card>
          <CardHeader className="bg-slate-950 text-white border-b border-slate-800">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-white">Live Data Feed Monitor</CardTitle>
                <p className="text-slate-400 text-xs mt-1">
                  Recent SME transactions and bill payment status from alternative data sources
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {(['all', 'verified', 'delayed', 'disconnected'] as const).map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setFilter(status)}
                    className={cn(
                      'px-2.5 py-1 rounded-md text-xs font-medium border transition-colors capitalize',
                      filter === status
                        ? 'bg-emerald-600 text-white border-emerald-500'
                        : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-emerald-500/40'
                    )}
                  >
                    {status === 'all' ? 'All' : status}
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-5 py-3.5">Provider</th>
                    <th className="px-5 py-3.5">Business</th>
                    <th className="px-5 py-3.5">Service Type</th>
                    <th className="px-5 py-3.5">Amount</th>
                    <th className="px-5 py-3.5">Due Date</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5">Reliability</th>
                    <th className="px-5 py-3.5">Data Point</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredFeeds.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-5 py-10 text-center text-sm text-slate-500">
                        No feeds found for this filter.
                      </td>
                    </tr>
                  )}
                  {filteredFeeds.map((feed) => {
                    const Icon = serviceIcons[feed.serviceType];
                    const status = statusConfig[feed.status];
                    const StatusIcon = status.icon;

                    return (
                      <tr key={feed.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4 text-slate-400" />
                            <span className="font-semibold text-slate-900">{feed.provider}</span>
                          </div>
                          <div className="text-[11px] font-mono text-slate-400 mt-0.5">{feed.accountNumber}</div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="font-medium text-slate-900">{feed.businessName}</div>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-xs text-slate-600 capitalize">{feed.serviceType.replace('_', ' ')}</span>
                        </td>
                        <td className="px-5 py-4 font-mono font-semibold text-slate-900">
                          {formatPKR(feed.amountPKR)}
                        </td>
                        <td className="px-5 py-4 text-slate-600">
                          {feed.dueDate}
                        </td>
                        <td className="px-5 py-4">
                          <div className={cn('inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium border', status.badgeColor)}>
                            <StatusIcon className="w-3.5 h-3.5" />
                            <span className="capitalize">{feed.status}</span>
                            {feed.delayDays && feed.status === 'delayed' && (
                              <span className="text-[10px] opacity-75">({feed.delayDays}d)</span>
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-slate-200 rounded-full h-2 overflow-hidden">
                              <div
                                className={cn(
                                  'h-full rounded-full',
                                  feed.reliabilityScore >= 90 ? 'bg-emerald-500' :
                                  feed.reliabilityScore >= 70 ? 'bg-amber-500' : 'bg-rose-500'
                                )}
                                style={{ width: `${feed.reliabilityScore}%` }}
                              />
                            </div>
                            <span className="text-xs font-medium text-slate-700">{feed.reliabilityScore}%</span>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-xs text-slate-600">{feed.dataPoint}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Status Legend */}
        <Card className="bg-slate-50 border-slate-200">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-6 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-slate-600"><strong className="text-slate-800">Verified:</strong> Payment received on or before due date</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="text-slate-600"><strong className="text-slate-800">Delayed:</strong> Payment received after due date</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500" />
                <span className="text-slate-600"><strong className="text-slate-800">Disconnected:</strong> Service suspended due to non-payment</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

function MetricCard({
  label,
  value,
  icon: Icon,
  color,
  description,
}: {
  label: string;
  value: string;
  icon: any;
  color: 'emerald' | 'teal' | 'amber' | 'sky';
  description: string;
}) {
  const colorClasses = {
    emerald: 'text-emerald-600',
    teal: 'text-teal-600',
    amber: 'text-amber-600',
    sky: 'text-sky-600',
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">{label}</p>
        <Icon className={cn('w-4 h-4', colorClasses[color])} />
      </div>
      <p className={cn('text-2xl font-bold tracking-tight', colorClasses[color])}>
        {value}
      </p>
      <p className="text-[11px] text-slate-400 mt-0.5">{description}</p>
    </div>
  );
}