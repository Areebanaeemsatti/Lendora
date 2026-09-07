'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Bell, LogOut, Menu, PlusCircle, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { clearAuthToken } from '@/lib/auth';
import { NAV_ITEMS } from './navConfig';
import { LogoMark } from './LogoMark';
import { cn } from '@/lib/utils';

interface HeaderProps {
  onOpenMobileMenu: () => void;
}

export function Header({ onOpenMobileMenu }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    clearAuthToken();
    router.replace('/auth');
  };

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname?.startsWith(href);

  return (
    <header className="sticky top-0 z-40 h-14 border-b border-zinc-800/60 bg-zinc-950/95">
      <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6">
        {/* Left: mobile trigger + brand */}
        <div className="flex min-w-0 shrink-0 items-center gap-2">
          <button
            onClick={onOpenMobileMenu}
            className="rounded-md p-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100 lg:hidden"
            aria-label="Toggle navigation menu"
          >
            <Menu className="h-4 w-4" />
          </button>
          <Link href="/" className="flex items-center gap-2.5">
            <LogoMark className="h-6 w-6 shrink-0 text-zinc-100" />
            <span className="text-sm font-semibold tracking-tight text-zinc-100">Lendora</span>
          </Link>
        </div>

        {/* Center: primary navigation */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
                isActive(item.href)
                  ? 'bg-zinc-800/80 text-zinc-100'
                  : 'text-zinc-400 hover:bg-zinc-800/40 hover:text-zinc-100'
              )}
            >
              {item.title}
            </Link>
          ))}
        </nav>

        {/* Right: context, actions, profile */}
        <div className="flex shrink-0 items-center gap-2">
          <div className="hidden items-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-900 px-2.5 py-1 text-[11px] font-medium text-zinc-400 xl:flex">
            <span className="font-semibold text-emerald-400">₨ PKR</span>
            <span className="text-zinc-700">|</span>
            <span>Pakistan Desk</span>
          </div>

          <button
            className="relative hidden rounded-md p-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200 sm:inline-flex"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-zinc-950" />
          </button>

          <Link href="/new-application">
            <Button variant="primary" size="sm" leftIcon={<PlusCircle className="h-3.5 w-3.5" />}>
              New Application
            </Button>
          </Link>

          <Link href="/risk-assessments" className="hidden md:inline-flex">
            <Button variant="secondary" size="sm" leftIcon={<ShieldCheck className="h-3.5 w-3.5" />}>
              Risk Assessments
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="sm"
            leftIcon={<LogOut className="h-3.5 w-3.5" />}
            onClick={handleLogout}
            className="hidden sm:inline-flex"
          >
            Log Out
          </Button>

          <div className="ml-1 flex items-center gap-2 border-l border-zinc-800 pl-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-full border border-zinc-700 bg-zinc-800 text-[10px] font-semibold text-zinc-200">
              UW
            </div>
            <div className="hidden leading-tight xl:block">
              <p className="text-xs font-medium text-zinc-200">Risk Underwriter</p>
              <p className="text-[10px] text-zinc-500">Karachi Desk (PK)</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
