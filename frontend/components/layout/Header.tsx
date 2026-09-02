'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import {
  Menu,
  Bell,
  Search,
  SlidersHorizontal,
  Layers,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface HeaderProps {
  onOpenMobileMenu: () => void;
}

export function Header({ onOpenMobileMenu }: HeaderProps) {
  const pathname = usePathname();

  const getPageMeta = () => {
    switch (pathname) {
      case '/':
        return {
          title: 'Underwriting Dashboard',
          subtitle: 'Real-time portfolio overview & loan risk scoring queue',
        };
      case '/new-application':
        return {
          title: 'New Loan Application',
          subtitle: 'Initiate Pakistani SME and individual borrower intake',
        };
      case '/risk-assessments':
        return {
          title: 'Risk Assessments',
          subtitle: 'AI credit risk matrices, scorecards & historical inquiries',
        };
      default:
        return {
          title: 'Lendora Platform',
          subtitle: 'AI-powered loan risk underwriting',
        };
    }
  };

  const { title, subtitle } = getPageMeta();

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Page Title & Breadcrumb */}
        <div>
          <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            {title}
          </h1>
          <p className="text-xs text-slate-500 hidden sm:block">{subtitle}</p>
        </div>
      </div>

      {/* Header Actions & Context */}
      <div className="flex items-center gap-3">
        {/* Quick Search / CNIC Lookup Mock Input */}
        <div className="relative hidden md:block w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            readOnly
            placeholder="Quick search CNIC / App ID..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none cursor-default"
          />
        </div>

        {/* Environment / Currency Indicator */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 rounded-md border border-slate-200 text-xs font-medium text-slate-700">
          <span className="font-semibold text-emerald-700">₨ PKR</span>
          <span className="text-slate-400">|</span>
          <span className="text-slate-600">Pakistan Desk</span>
        </div>

        {/* Notifications Mock Button */}
        <button
          className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
        </button>
      </div>
    </header>
  );
}
