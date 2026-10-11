import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/Badge';
import { formatPKR } from '@/lib/utils';
import { BorrowerApplication } from '@/types';
import {
  User,
  MapPin,
  Briefcase,
  Calendar,
  Banknote,
  Clock,
  Building2,
} from 'lucide-react';

interface Props {
  application: BorrowerApplication;
}

export function BorrowerOverviewCard({ application }: Props) {
  const formattedDate = application.submittedAt
    ? new Date(application.submittedAt).toLocaleDateString('en-PK', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Recent Submission';

  return (
    <div className="bg-white rounded-lg p-6 border border-white/80 shadow-md">
      {/* Top Banner: Name, ID, Amount, Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-white/80">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-700 text-white border border-emerald-400/30 flex items-center justify-center font-bold text-2xl shadow-lg shadow-emerald-500/20 shrink-0">
            {application.fullName ? application.fullName.charAt(0) : 'B'}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0F172A]">
                {application.fullName || 'Unnamed Applicant'}
              </h2>
              <span className="text-xs font-mono font-bold tracking-wider px-2.5 py-0.5 rounded bg-slate-100 text-emerald-600 border border-slate-200">
                {application.borrowerId}
              </span>
              <StatusBadge status={application.status} />
            </div>

            <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-[#475569] mt-1">
              <span className="flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5 text-[#475569]" />
                {application.occupation}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#475569]" />
                {application.city}, {application.province}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#475569]" />
                {formattedDate}
              </span>
            </div>
          </div>
        </div>

        {/* Requested Financing Callout */}
        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center p-3 sm:p-0 rounded-xl bg-white/70 sm:bg-transparent border border-white/80 sm:border-none">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#475569]">
            Requested Loan Amount
          </span>
          <div className="text-xl sm:text-2xl font-bold text-emerald-600 font-mono tracking-tight mt-0.5">
            {typeof application.requestedLoanAmountPKR === 'number'
              ? formatPKR(application.requestedLoanAmountPKR)
              : '—'}
          </div>
        </div>
      </div>

      {/* Profile Details Matrix */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-5 text-xs">
        <div className="space-y-1">
          <span className="text-[#475569] flex items-center gap-1">
            <User className="w-3 h-3 text-[#475569]" />
            Age & Demographics
          </span>
          <p className="font-semibold text-[#0F172A] text-sm">
            {application.age ? `${application.age} Years` : '—'}
          </p>
        </div>

        <div className="space-y-1">
          <span className="text-[#475569] flex items-center gap-1">
            <Building2 className="w-3 h-3 text-[#475569]" />
            Employment Type
          </span>
          <p className="font-semibold text-[#0F172A] text-sm truncate">
            {application.employmentType || '—'}
          </p>
        </div>

        <div className="space-y-1">
          <span className="text-[#475569] flex items-center gap-1">
            <Banknote className="w-3 h-3 text-[#475569]" />
            Stated Monthly Income
          </span>
          <p className="font-semibold text-[#0F172A] text-sm font-mono">
            {typeof application.monthlyIncomePKR === 'number'
              ? formatPKR(application.monthlyIncomePKR)
              : '—'}
          </p>
        </div>

        <div className="space-y-1">
          <span className="text-[#475569] flex items-center gap-1">
            <Clock className="w-3 h-3 text-[#475569]" />
            Requested Term
          </span>
          <p className="font-semibold text-[#0F172A] text-sm">
            {application.loanTermMonths ? `${application.loanTermMonths} Months` : '—'}
          </p>
        </div>
      </div>
    </div>
  );
}
