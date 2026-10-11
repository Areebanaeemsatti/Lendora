'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { AppLayout } from '@/components/layout/AppLayout';
import { BorrowerHero } from './BorrowerHero';
import { LoanApplicationForm } from './LoanApplicationForm';
import { LoanApplicationModal } from './LoanApplicationModal';
import { ProfileTab } from './ProfileTab';
import { SettingsTab } from './SettingsTab';
import { BorrowerStatusBanner } from './BorrowerStatusBanner';
import { cn } from '@/lib/utils';

type TabKey = 'overview' | 'profile' | 'settings' | 'documents';

const TABS: { key: TabKey; label: string; href: string }[] = [
  { key: 'overview', label: 'Dashboard Overview', href: '#overview' },
  { key: 'profile', label: 'My Profile', href: '#profile' },
  { key: 'settings', label: 'Settings', href: '#settings' },
  { key: 'documents', label: 'Upload Documents', href: '#documents' },
];

const HASH_TO_TAB: Record<string, TabKey> = {
  '#overview': 'overview',
  '#profile': 'profile',
  '#settings': 'settings',
  '#documents': 'documents',
};

function tabFromHash(hash: string): TabKey {
  return HASH_TO_TAB[hash] ?? 'overview';
}

/**
 * Borrower portal: Overview / Profile / Settings / Upload Documents.
 *
 * Overview shows the marketing-style hero + summary metric cards and opens the
 * loan application modal (with an optional one-tap Auto-Fill). "Upload
 * Documents" hosts the same application form inline. Submissions write to the
 * SHARED queue, so they appear on the underwriter console instantly.
 */
export function DashboardView() {
  const [active, setActive] = useState<TabKey>(() => tabFromHash(window.location.hash));
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAutoFill, setModalAutoFill] = useState(false);

  useEffect(() => {
    const onHashChange = () => setActive(tabFromHash(window.location.hash));
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const selectTab = (key: TabKey) => {
    setActive(key);
    if (window.location.hash !== `#${key}`) {
      window.history.replaceState(null, '', `#${key}`);
    }
  };

  const openModal = (autoFill: boolean) => {
    setModalAutoFill(autoFill);
    setModalOpen(true);
  };
  return (
    <AppLayout>
      {/* Live loan-status banner — reflects the underwriter's decision in real time. */}
      <BorrowerStatusBanner />

      {/* In-page tab bar */}
      <div
        className="flex gap-1 overflow-x-auto border-b border-white/70"
        role="tablist"
        aria-label="Dashboard sections"
      >
        {TABS.map((tab) => (
          <Link
            key={tab.key}
            href={tab.href}
            role="tab"
            aria-selected={active === tab.key}
            onClick={(e) => {
              e.preventDefault();
              selectTab(tab.key);
            }}
            className={cn(
              'relative shrink-0 px-4 py-3 text-sm font-semibold transition-colors',
              active === tab.key
                ? 'text-[#0072ff]'
                : 'text-slate-500 hover:text-slate-700'
            )}
          >
            {tab.label}
            <span
              className={cn(
                'absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-[#0072ff] transition-opacity',
                active === tab.key ? 'opacity-100' : 'opacity-0'
              )}
            />
          </Link>
        ))}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          {active === 'overview' && (
            <BorrowerHero onApply={() => openModal(false)} onAutoFill={() => openModal(true)} />
          )}
          {active === 'profile' && <ProfileTab />}
          {active === 'settings' && <SettingsTab />}
          {active === 'documents' && (
            <div className="rounded-2xl border border-white/60 bg-white/80 p-6 shadow-sm backdrop-blur-md">
              <h2 className="text-lg font-bold tracking-tight text-[#0F172A]">Upload Documents</h2>
              <p className="mt-1 text-sm text-[#475569]">
                Complete the application below and attach your documents. This syncs directly to the underwriting team.
              </p>
              <LoanApplicationForm className="mt-5" />
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Loan application modal (Apply / Auto-Fill entry point). */}
      <LoanApplicationModal
        open={modalOpen}
        autoFill={modalAutoFill}
        onClose={() => setModalOpen(false)}
      />
    </AppLayout>
  );
}