'use client';

import React from 'react';
import Link from 'next/link';
import {
  Activity,
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Layers,
  ListChecks,
  Wallet,
  Zap,
} from 'lucide-react';
import { LogoMark } from '@/components/layout/LogoMark';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { title: 'Alternative Credit', href: '#alternative-credit' },
  { title: 'Risk Architecture', href: '#risk-architecture' },
  { title: 'Telco & Utility', href: '#telco-utility' },
  { title: 'Docs', href: '#docs' },
];

const HERO_BADGES = ['JazzCash', 'Easypaisa', 'Telco Velocity', 'Utility Data'];

const LIVE_STATS = [
  { icon: Zap, value: '< 2s', label: 'Decision Time' },
  { icon: BadgeCheck, value: '99.4%', label: 'Model Accuracy' },
  { icon: Activity, value: 'Thin-File', label: 'Focus' },
  { icon: Wallet, value: 'Rs PKR', label: 'Pakistan Desk' },
];

const CORE_FEATURES = [
  {
    icon: Wallet,
    title: 'Alternative Wallet Engine',
    description:
      'Ingests JazzCash & Easypaisa cash-flow velocity — recharge cadence, balance volatility and wallet liquidity — into normalised behavioural features.',
    stat: 'Wallet velocity',
  },
  {
    icon: BarChart3,
    title: 'Explainable SHAP Engine',
    description:
      'Every score ships with a real-time SHAP feature-contribution breakdown, producing transparent risk tiering from Tier A to Tier D.',
    stat: 'Tier A → Tier D',
  },
  {
    icon: ListChecks,
    title: 'Automated Underwriting Queue',
    description:
      'Applications are risk-tiered and decisioned in real time against configurable exposure and probability-of-default thresholds.',
    stat: 'Real-time queue',
  },
];

const pillClasses =
  'rounded-full border border-zinc-800 bg-zinc-900/60 px-3 py-1 text-[11px] font-medium text-zinc-400';

function PrimaryAction({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg bg-[#05C168] px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-[#00D068]',
        className,
      )}
    >
      {children}
    </Link>
  );
}

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0D0F11] font-sans text-zinc-100">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 border-b border-zinc-800 bg-[#0D0F11]/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          {/* Left: shield icon + logo text */}
          <Link href="/" className="flex shrink-0 items-center gap-2.5">
            <LogoMark className="h-6 w-6 text-zinc-100" />
            <span className="text-sm font-semibold tracking-tight text-zinc-100">Lendora</span>
          </Link>

          {/* Center: section links */}
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Landing">
            {NAV_LINKS.map((item) => (
              <a
                key={item.title}
                href={item.href}
                className="rounded-md px-3 py-1.5 text-xs font-medium text-zinc-400 transition-colors hover:bg-zinc-800/40 hover:text-zinc-100"
              >
                {item.title}
              </a>
            ))}
          </nav>

          {/* Right: status badge + auth actions */}
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <div className="hidden items-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-900 px-2.5 py-1 text-[11px] font-medium text-zinc-400 xl:flex">
              <span className="font-semibold text-emerald-400">Pakistan Desk</span>
              <span className="text-zinc-700">|</span>
              <span>Rs PKR</span>
            </div>

            <Link
              href="/auth"
              className="rounded-md px-3 py-1.5 text-xs font-medium text-zinc-400 transition-colors hover:text-zinc-100"
            >
              Sign In
            </Link>

            <PrimaryAction href="/dashboard">
              Launch Platform
              <ArrowRight className="h-3.5 w-3.5" />
            </PrimaryAction>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-20 px-4 pb-16 sm:px-6">
        {/* Hero Section — Product Intro */}
        <section id="alternative-credit" className="pt-14 sm:pt-20">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-400">
            01 — Alternative Credit Platform
          </p>
          <h1 className="mt-4 max-w-3xl text-3xl font-semibold leading-tight tracking-tight text-zinc-50 sm:text-4xl lg:text-5xl">
            Alternative Credit Scoring for Thin-File Pakistani Borrowers
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-zinc-400 sm:text-base">
            Lendora turns telecom recharge patterns, utility bill settlement history, and JazzCash
            / Easypaisa wallet velocity into explainable, decision-ready credit scores in real
            time.
          </p>

          {/* Feature badges */}
          <div className="mt-7 flex flex-wrap items-center gap-2">
            {HERO_BADGES.map((badge) => (
              <span key={badge} className={cn(pillClasses, 'inline-flex items-center gap-1.5')}>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/80" />
                {badge}
              </span>
            ))}
          </div>

          {/* Hero actions */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <PrimaryAction href="/auth" className="px-5 py-2.5">
              Get Started
              <ArrowRight className="h-4 w-4" />
            </PrimaryAction>
            <a
              href="#risk-architecture"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/40 px-4 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-800/60 hover:text-zinc-100"
            >
              <Layers className="h-4 w-4" />
              View Risk Model Architecture
            </a>
          </div>
        </section>

        {/* Live Stats Strip */}
        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {LIVE_STATS.map(({ icon: Icon, value, label }) => (
            <div
              key={label}
              className="rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-3"
            >
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                  {label}
                </p>
                <Icon className="h-4 w-4 text-emerald-400/80" />
              </div>
              <p className="mt-1 font-mono text-2xl font-semibold tracking-tight text-zinc-100">
                {value}
              </p>
            </div>
          ))}
        </section>

        {/* Core Features Grid */}
        <section className="space-y-6">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-400">
              02 — Core Capabilities
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-50">
              Built for the thin-file majority
            </h2>
          </div>

          <div id="telco-utility" className="grid gap-4 md:grid-cols-3">
            {CORE_FEATURES.map(({ icon: Icon, title, description, stat }) => (
              <article
                key={title}
                className="flex flex-col rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 transition-colors hover:border-zinc-700"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900">
                  <Icon className="h-4 w-4 text-emerald-400" />
                </span>
                <h3 className="mt-4 text-sm font-semibold text-zinc-100">{title}</h3>
                <p className="mt-2 flex-1 text-xs leading-relaxed text-zinc-500">{description}</p>
                <p className="mt-4 border-t border-zinc-800 pt-3 text-[11px] font-medium uppercase tracking-wider text-emerald-400/80">
                  {stat}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* Bottom Call to Action */}
        <section
          id="docs"
          className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-6 py-10 text-center sm:px-10"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-400">
            03 — Get Access
          </p>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight text-zinc-50 sm:text-3xl">
            Ready to Evaluate Alternative Credit?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-zinc-400">
            Spin up the underwriting console and start scoring thin-file applicants with wallet,
            telco and utility signals in minutes.
          </p>
          <div className="mt-7 flex justify-center">
            <PrimaryAction href="/auth" className="px-5 py-2.5">
              Get Started Now
              <Zap className="h-4 w-4" />
            </PrimaryAction>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-800">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-zinc-500 sm:flex-row sm:px-6">
          <div className="flex items-center gap-2">
            <LogoMark className="h-4 w-4 text-zinc-500" />
            <span>© 2026 Lendora — Alternative credit infrastructure for Pakistan.</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth" className="transition-colors hover:text-zinc-300">
              Sign In
            </Link>
            <Link href="/dashboard" className="transition-colors hover:text-zinc-300">
              Dashboard
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
