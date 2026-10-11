'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, CalendarDays, Sparkles, Wallet } from 'lucide-react';
import { formatPKR, cn } from '@/lib/utils';

/**
 * Borrower home hero + summary metric cards.
 *
 * "Apply For Cash Now" and the primary metric action open the loan application
 * modal (via onApply). The ⚡ Auto-Fill button opens the same modal pre-filled
 * with realistic demo data so the flow can be tested in one tap.
 */

// Fixed, spec-defined demo figures for the summary strip.
const CREDIT = { available: 45000, limit: 60000, inUse: 15000 };
const REPAYMENT = { amount: 15000, due: '24 Oct 2026' };

interface BorrowerHeroProps {
  onApply: () => void;
  onAutoFill: () => void;
}

export function BorrowerHero({ onApply, onAutoFill }: BorrowerHeroProps) {
  return (
    <div className="space-y-5">
      {/* Hero banner */}
      <div className="relative overflow-hidden rounded-3xl border border-white/60 bg-gradient-to-br from-[#00C6FF]/90 to-[#0072ff]/90 p-6 text-white shadow-sm sm:p-8">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" aria-hidden />
        <div className="absolute -bottom-16 right-24 h-40 w-40 rounded-full bg-white/10" aria-hidden />
        <div className="relative max-w-xl">
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Need quick funds today?</h1>
          <p className="mt-2 text-sm leading-relaxed text-white/85 sm:text-base">
            Get instant cash transfers directly into your JazzCash, Easypaisa, or bank account in under 3 minutes.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={onApply}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#0072ff] shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              Apply For Cash Now
              <ArrowRight className="h-4 w-4" aria-hidden />
            </button>
            <button
              onClick={onAutoFill}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/50 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/20"
            >
              <Sparkles className="h-4 w-4" aria-hidden />
              Auto-Fill Demo Data
            </button>
          </div>
        </div>
      </div>

      {/* Summary metric cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <MetricCard
          icon={<Wallet className="h-5 w-5" aria-hidden />}
          label="Approved Credit Line"
          value={formatPKR(CREDIT.available)}
          caption={
            <>
              Limit: <span className="font-semibold text-[#0F172A]">{formatPKR(CREDIT.limit)}</span>
              <span className="mx-1.5 text-slate-300">|</span>
              In Use: <span className="font-semibold text-[#0F172A]">{formatPKR(CREDIT.inUse)}</span>
            </>
          }
          action={{ label: 'Get Cash Now', onClick: onApply }}
        />
        <MetricCard
          icon={<CalendarDays className="h-5 w-5" aria-hidden />}
          label="Repayment Schedule"
          value={formatPKR(REPAYMENT.amount)}
          caption={
            <>
              Due <span className="font-semibold text-[#0F172A]">{REPAYMENT.due}</span>
            </>
          }
          action={{ label: 'Repay Now', onClick: onApply }}
        />
      </div>
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
  caption,
  action,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  caption: React.ReactNode;
  action: { label: string; onClick: () => void };
}) {
  return (
    <div className="flex flex-col rounded-2xl border border-white/60 bg-white/80 p-6 shadow-sm backdrop-blur-md">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-[#475569]">{label}</p>
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0072ff]/10 text-[#0072ff]">{icon}</span>
      </div>
      <p className="mt-3 text-3xl font-extrabold tracking-tight text-[#0F172A]">{value}</p>
      <p className="mt-1.5 text-xs text-[#475569]">{caption}</p>
      <button
        onClick={action.onClick}
        className="btn-primary mt-4 inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-sm"
      >
        {action.label}
        <ArrowRight className="h-4 w-4" aria-hidden />
      </button>
    </div>
  );
}