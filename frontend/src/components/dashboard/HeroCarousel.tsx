'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Gift, Rocket, TrendingUp, Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Light, glassmorphic promo carousel for the consumer Overview tab.
 * Pure marketing offers — no charts, no technical jargon.
 */
const SLIDES = [
  {
    icon: Wallet,
    title: 'Get up to PKR 200,000',
    description:
      'Check your available limit in seconds and withdraw straight to your JazzCash or Easypaisa wallet.',
    cta: { label: 'Apply now', href: '#quick-actions' },
    accent: 'from-[#00C6FF] to-[#0072ff]',
  },
  {
    icon: TrendingUp,
    title: 'Build your limit over time',
    description:
      'Repay on time and your available amount grows automatically — no calls, no paperwork.',
    cta: { label: 'View transactions', href: '#transactions' },
    accent: 'from-[#38bdf8] to-[#2563eb]',
  },
  {
    icon: Gift,
    title: 'Cashback on every repayment',
    description:
      'Pay your instalment from your mobile wallet and earn instant cashback credited the same day.',
    cta: { label: 'See offers', href: '#settings' },
    accent: 'from-[#22d3ee] to-[#0072ff]',
  },
  {
    icon: Rocket,
    title: 'Money in your wallet in minutes',
    description:
      'Approved applications are paid out fast — usually before your chai gets cold.',
    cta: { label: 'Get started', href: '#quick-actions' },
    accent: 'from-[#60a5fa] to-[#0072ff]',
  },
];

export function HeroCarousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => {
      setActive((prev) => (prev + 1) % SLIDES.length);
    }, 5500);
    return () => window.clearInterval(id);
  }, [paused]);

  const go = (dir: number) =>
    setActive((prev) => (prev + dir + SLIDES.length) % SLIDES.length);

  return (
    <section
      className="glass relative overflow-hidden rounded-3xl"
      aria-roledescription="carousel"
      aria-label="Offers for you"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {/* soft gradient wash */}
      <div
        className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#00C6FF]/15 blur-3xl"
        aria-hidden
      />

      <div className="relative h-56 sm:h-48">
        {SLIDES.map((slide, idx) => {
          const Icon = slide.icon;
          return (
            <div
              key={slide.title}
              aria-hidden={idx !== active}
              className={cn(
                'absolute inset-0 flex flex-col items-start justify-center gap-3 px-6 py-6 transition-all duration-500 sm:px-10',
                idx === active
                  ? 'translate-x-0 opacity-100'
                  : 'pointer-events-none translate-x-3 opacity-0'
              )}
            >
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    'flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg',
                    slide.accent
                  )}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                  For you
                </span>
              </div>
              <h2 className="text-xl font-bold tracking-tight text-[#0F172A] sm:text-2xl">
                {slide.title}
              </h2>
              <p className="max-w-2xl text-sm leading-relaxed text-[#475569]">
                {slide.description}
              </p>
              <Link
                href={slide.cta.href}
                className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-[#0072ff] transition-colors hover:text-[#0059d6]"
              >
                {slide.cta.label}
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          );
        })}

        {/* Slide arrows */}
        <div className="absolute right-4 top-1/2 flex -translate-y-1/2 flex-col gap-1.5">
          <button
            onClick={() => go(-1)}
            className="rounded-xl border border-white/80 bg-white/70 p-1.5 text-slate-500 shadow-sm transition-colors hover:bg-white hover:text-[#0072ff]"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => go(1)}
            className="rounded-xl border border-white/80 bg-white/70 p-1.5 text-slate-500 shadow-sm transition-colors hover:bg-white hover:text-[#0072ff]"
            aria-label="Next slide"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Progress dots */}
      <div className="flex items-center justify-center gap-2 border-t border-white/70 bg-white/40 px-4 py-3">
        {SLIDES.map((slide, idx) => (
          <button
            key={slide.title}
            onClick={() => setActive(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={cn(
              'h-1.5 rounded-full transition-all duration-300',
              idx === active ? 'w-7 bg-[#0072ff]' : 'w-1.5 bg-slate-300 hover:bg-slate-400'
            )}
          />
        ))}
      </div>
    </section>
  );
}