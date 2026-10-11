'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Banknote,
  Clock,
  HandCoins,
  Repeat,
  Wallet,
} from 'lucide-react';
import { HeroCarousel } from './HeroCarousel';
import { CountUp } from './CountUp';
import { useSession } from '@/components/providers/SessionProvider';
import {
  formatAmount,
  formatDate,
  getConsumerProfile,
  getTransactions,
  getWalletSummary,
} from '@/lib/consumerData';

const QUICK_ACTIONS = [
  { icon: HandCoins, label: 'Apply for a loan', href: '/new-application', primary: true },
  { icon: Repeat, label: 'Repay early', href: '#transactions', primary: false },
  { icon: Wallet, label: 'Top up wallet', href: '#settings', primary: false },
  { icon: Banknote, label: 'Withdraw funds', href: '#transactions', primary: false },
] as const;

/**
 * Overview tab: balance cards, quick actions, promo carousel and recent
 * activity — all derived from the signed-in CNIC (isolated per session).
 */
export function OverviewTab() {
  const { session } = useSession();
  const cnic = session?.cnic ?? '';

  const profile = getConsumerProfile(cnic, session?.name);
  const summary = getWalletSummary(cnic);
  const recent = getTransactions(cnic).slice(0, 4);

  const firstName = (session?.name || profile.name).split(/\s+/)[0];

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div className="animate-fade-up">
        <p className="text-sm font-medium text-[#475569]">Welcome back</p>
        <h1 className="mt-0.5 text-2xl font-bold tracking-tight text-[#0F172A] sm:text-3xl">
          {firstName} 👋
        </h1>
      </div>

      {/* Balance cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="glass rounded-3xl bg-gradient-to-br from-[#00C6FF]/90 to-[#0072ff]/90 p-6 text-white">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-white/80">Available limit</p>
            <Wallet className="h-5 w-5 text-white/80" />
          </div>
          <CountUp
            value={summary.availableCredit}
            format={(n) => `PKR ${Math.round(n).toLocaleString('en-PK')}`}
            className="mt-3 block text-3xl font-extrabold tracking-tight"
          />
          <p className="mt-2 text-xs text-white/75">
            Of PKR {(summary.availableCredit + summary.outstandingBalance).toLocaleString('en-PK')} total
          </p>
        </div>

        <div className="glass rounded-3xl p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-[#475569]">Outstanding balance</p>
            <ArrowUpRight className="h-5 w-5 text-[#0072ff]" />
          </div>
          <CountUp
            value={summary.outstandingBalance}
            format={(n) => `PKR ${Math.round(n).toLocaleString('en-PK')}`}
            className="mt-3 block text-3xl font-extrabold tracking-tight text-[#0F172A]"
          />
          <p className="mt-2 text-xs text-[#475569]">
            {summary.activeLoans} active loan{summary.activeLoans > 1 ? 's' : ''} ·{' '}
            {summary.completedLoans} repaid
          </p>
        </div>

        <div className="glass rounded-3xl p-6 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-[#475569]">Next payment</p>
            <Clock className="h-5 w-5 text-[#0072ff]" />
          </div>
          <CountUp
            value={summary.nextPaymentAmount}
            format={(n) => `PKR ${Math.round(n).toLocaleString('en-PK')}`}
            className="mt-3 block text-3xl font-extrabold tracking-tight text-[#0F172A]"
          />
          <p className="mt-2 text-xs text-[#475569]">Due {formatDate(summary.nextPaymentDue)}</p>
        </div>
      </div>

      {/* Quick actions */}
      <div id="quick-actions" className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {QUICK_ACTIONS.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.label}
              href={action.href}
              className={
                action.primary
                  ? 'btn-primary flex flex-col items-center gap-2 rounded-2xl px-4 py-4 text-center text-sm'
                  : 'glass flex flex-col items-center gap-2 rounded-2xl px-4 py-4 text-center text-sm font-semibold text-[#1E293B] transition-all hover:-translate-y-0.5 hover:bg-white/85 hover:text-[#0072ff]'
              }
            >
              <Icon className="h-5 w-5" />
              {action.label}
            </Link>
          );
        })}
      </div>

      {/* Promo carousel */}
      <HeroCarousel />

      {/* Recent activity */}
      <section className="glass overflow-hidden rounded-3xl">
        <div className="flex items-center justify-between border-b border-white/70 px-6 py-4">
          <h2 className="text-base font-bold text-[#0F172A]">Recent activity</h2>
          <Link
            href="#transactions"
            className="text-sm font-semibold text-[#0072ff] hover:text-[#0059d6]"
          >
            View all
          </Link>
        </div>
        <ul>
          {recent.map((tx) => (
            <li
              key={tx.id}
              className="flex items-center justify-between gap-4 border-b border-slate-50 px-6 py-3.5 last:border-b-0"
            >
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                  tx.amount >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {tx.amount >= 0 ? (
                  <ArrowDownLeft className="h-4 w-4" />
                ) : (
                  <ArrowUpRight className="h-4 w-4" />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-[#0F172A]">{tx.title}</p>
                <p className="text-xs text-[#475569]">{formatDate(tx.date)}</p>
              </div>
              <span
                className={`shrink-0 text-sm font-bold tabular-nums ${
                  tx.amount >= 0 ? 'text-emerald-600' : 'text-[#0F172A]'
                }`}
              >
                {formatAmount(tx.amount)}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

