'use client';

import React, { useState } from 'react';
import { Header } from './Header';
import { MobileNav } from './MobileNav';

/**
 * Consumer app shell: glass sticky header + scrollable content on a soft
 * bluish-white canvas with ambient orbs.
 */
export function AppLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="relative flex h-screen w-screen overflow-hidden font-sans text-[#0F172A]">
      {/* Ambient orbs are provided globally by the root layout. */}

      {/* Mobile Slide-Over Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-slate-900/30 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-72 max-w-[85%] shadow-2xl">
            <MobileNav onClose={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Column: Fixed Top Nav + Scrollable Content */}
      <div className="relative z-10 flex min-w-0 flex-1 flex-col overflow-hidden">
        <Header onOpenMobileMenu={() => setMobileMenuOpen(true)} />
        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl space-y-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
