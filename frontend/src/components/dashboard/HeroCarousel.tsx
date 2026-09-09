'use client';

import React, { useEffect, useState } from 'react';
import { BarChart3, ChevronLeft, ChevronRight, ListChecks, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const SLIDES = [
  {
    eyebrow: 'Credit Scoring',
    title: 'Credit Scoring Without a Bank History',
    description:
      'Lendora checks JazzCash and Easypaisa payment activity, phone recharge patterns, and utility bill payments to give fair credit scores to small business owners who may not have a formal bank account.',
    chip: 'JazzCash · Easypaisa · Utility Bills',
    icon: BarChart3,
    accent: 'text-emerald-400',
  },
  {
    eyebrow: 'Clear Explanations',
    title: 'Understand Why Every Score Was Given',
    description:
      'Every credit score comes with a simple, plain-language explanation showing exactly which factors helped or lowered the score — no technical knowledge needed to understand it.',
    chip: 'Step-by-step breakdown · Easy to read',
    icon: Sparkles,
    accent: 'text-sky-400',
  },
  {
    eyebrow: 'Quick Decisions',
    title: 'Fast Loan Review & Approval',
    description:
      'Applications are automatically sorted by risk level (Low, Medium, or High), making it easy for loan officers to approve or decline quickly without manual calculations.',
    chip: 'Risk Sorting · One-click Decisions',
    icon: ListChecks,
    accent: 'text-teal-400',
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
      className="relative overflow-hidden rounded-lg border border-zinc-800/80 bg-zinc-900/60"
      aria-roledescription="carousel"
      aria-label="Platform capabilities"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {/* Slides */}
      <div className="relative h-52 sm:h-48">
        {SLIDES.map((slide, idx) => {
          const Icon = slide.icon;
          return (
            <div
              key={slide.title}
              aria-hidden={idx !== active}
              className={cn(
                'absolute inset-0 flex flex-col items-start justify-center gap-2.5 px-5 py-5 transition-opacity duration-500 sm:px-10',
                idx === active ? 'opacity-100' : 'pointer-events-none opacity-0'
              )}
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                {String(idx + 1).padStart(2, '0')} — {slide.eyebrow}
              </span>
              <h2 className="text-xl font-semibold tracking-tight text-zinc-100 sm:text-2xl">
                {slide.title}
              </h2>
              <p className="max-w-2xl text-xs leading-relaxed text-zinc-400 sm:text-sm">
                {slide.description}
              </p>
              <span className="mt-1 inline-flex w-fit items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-950/60 px-2.5 py-1 text-[10px] font-medium text-zinc-400">
                <Icon className={cn('h-3 w-3', slide.accent)} />
                {slide.chip}
              </span>
            </div>
          );
        })}

        {/* Slide arrows */}
        <div className="absolute right-3 top-1/2 flex -translate-y-1/2 flex-col gap-1">
          <button
            onClick={() => go(-1)}
            className="rounded-md border border-zinc-800 bg-zinc-950/70 p-1.5 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => go(1)}
            className="rounded-md border border-zinc-800 bg-zinc-950/70 p-1.5 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
            aria-label="Next slide"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Dots / controls */}
      <div className="flex items-center justify-between border-t border-zinc-800/60 bg-zinc-950/60 px-4 py-2">
        <span className="font-mono text-[10px] text-zinc-500">
          {String(active + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}
        </span>
        <div className="flex items-center gap-1.5">
          {SLIDES.map((slide, idx) => (
            <button
              key={slide.title}
              onClick={() => setActive(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={cn(
                'h-1.5 rounded-full transition-all duration-300',
                idx === active ? 'w-6 bg-zinc-100' : 'w-1.5 bg-zinc-700 hover:bg-zinc-500'
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
