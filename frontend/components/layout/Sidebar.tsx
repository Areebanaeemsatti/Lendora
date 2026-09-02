'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FilePlus,
  ShieldCheck,
  Building2,
  Sparkles,
  UserCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  onClose?: () => void;
  className?: string;
}

export function Sidebar({ onClose, className }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    {
      title: 'Dashboard',
      href: '/',
      icon: LayoutDashboard,
      description: 'Portfolio & Risk Overview',
    },
    {
      title: 'New Application',
      href: '/new-application',
      icon: FilePlus,
      description: 'Intake & Onboarding',
    },
    {
      title: 'Risk Assessments',
      href: '/risk-assessments',
      icon: ShieldCheck,
      description: 'AI Scoring & Scorecards',
    },
    {
      title: 'SME Telecom/Utility Feed',
      href: '/telecom-feed',
      icon: Building2,
      description: 'Alternative Data Monitoring',
    },
  ];

  return (
    <aside
      className={cn(
        'flex flex-col w-72 bg-slate-950 text-slate-200 border-r border-slate-800/80 h-full select-none',
        className
      )}
    >
      {/* Brand Header */}
      <div className="px-6 py-5 border-b border-slate-850 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group" onClick={onClose}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-950 text-white font-bold text-lg ring-1 ring-emerald-400/30 group-hover:ring-emerald-400/60 transition-all">
            <ShieldCheck className="w-5 h-5 text-emerald-100" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg text-white tracking-tight">Lendora</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/50">
                AI
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Pakistan Risk Platform</p>
          </div>
        </Link>
      </div>

      {/* Underwriting Region Badge */}
      <div className="px-5 py-3 mx-4 mt-4 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-medium text-slate-300">PKR Underwriting Engine</span>
        </div>
        <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
          v1.0-alpha
        </span>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 px-4 py-4 space-y-6 overflow-y-auto">
        <div>
          <div className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Core Navigation
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === '/'
                  ? pathname === '/'
                  : pathname?.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    'flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all group relative',
                    isActive
                      ? 'bg-emerald-600/15 text-emerald-400 border border-emerald-500/30'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/70 border border-transparent'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={cn(
                        'w-4 h-4 transition-colors',
                        isActive
                          ? 'text-emerald-400'
                          : 'text-slate-400 group-hover:text-slate-200'
                      )}
                    />
                    <span>{item.title}</span>
                  </div>
                  {isActive && (
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-xs shadow-emerald-400" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* AI Pipelines Section */}
        <div>
          <div className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            AI Pipelines
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between px-3.5 py-2 rounded-lg text-xs font-medium text-slate-400 bg-slate-900/40 border border-slate-800/40">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                <span>SHAP Explainability</span>
              </div>
              <span className="text-[10px] text-emerald-400 bg-emerald-950 px-1 py-0.5 rounded border border-emerald-800/50">
                Active
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* User / Underwriter Profile Footer */}
      <div className="p-4 border-t border-slate-850 bg-slate-900/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 font-semibold text-xs">
              UW
            </div>
            <div>
              <p className="text-xs font-medium text-slate-200">Risk Underwriter</p>
              <p className="text-[11px] text-slate-400">Karachi Desk (PK)</p>
            </div>
          </div>
          <UserCheck className="w-4 h-4 text-emerald-400" />
        </div>
      </div>
    </aside>
  );
}
