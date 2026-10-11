'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Bell, LogOut, Menu, Settings, User } from 'lucide-react';
import { clearAuthToken, maskCnic } from '@/lib/auth';
import { useSession } from '@/components/providers/SessionProvider';
import { NAV_ITEMS } from './navConfig';
import { LogoMark } from './LogoMark';
import { cn } from '@/lib/utils';

interface HeaderProps {
  onOpenMobileMenu: () => void;
}

const DEMO_NOTIFICATIONS = [
  { id: 1, title: 'Payment due in 3 days', body: 'Your monthly instalment reminder.' },
  { id: 2, title: 'New offer for you', body: 'Lower rates on top-up loans this week.' },
  { id: 3, title: 'Repayment received', body: 'Thanks — your last payment went through.' },
];

export function Header({ onOpenMobileMenu }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { session, signOut } = useSession();
  const [bellOpen, setBellOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    // Purges localStorage + sessionStorage and resets session context.
    signOut();
    clearAuthToken();
    router.replace('/auth');
  };

  const isActive = (href: string) => {
    if (href.includes('#')) {
      return false; // section links highlight via in-page scroll, not here
    }
    return href === '/' ? pathname === '/' : pathname?.startsWith(href);
  };

  const initials = (session?.name || '')
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase())
    .slice(0, 2)
    .join('');
  const avatarText = initials || (session ? session.cnic.slice(-2) : 'LN');

  // Role label shown beside the name — the header is shared across portals.
  const roleLabel = session?.role === 'underwriter' ? 'Risk Underwriter' : 'Verified Borrower';
  const displayName = session?.name || 'Lendora Customer';

  return (
    <header className="sticky top-0 z-40 border-b border-white/70 bg-white/65 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6">
        {/* Left: mobile trigger + brand */}
        <div className="flex min-w-0 shrink-0 items-center gap-2">
          <button
            onClick={onOpenMobileMenu}
            className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-white/80 hover:text-[#0F172A] lg:hidden"
            aria-label="Toggle navigation menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <LogoMark className="h-7 w-7 shrink-0" />
            <span className="text-base font-bold tracking-tight text-[#0F172A]">Lendora</span>
          </Link>
        </div>

        {/* Center: primary navigation — Home/Dashboard, Transactions, Profile, Settings */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className={cn(
                'relative rounded-lg px-3.5 py-2 text-sm font-medium transition-colors',
                isActive(item.href)
                  ? 'text-[#0072ff]'
                  : 'text-slate-500 hover:bg-white/80 hover:text-[#0F172A]'
              )}
            >
              {item.title}
              <span
                className={cn(
                  'absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-[#0072ff] transition-opacity',
                  isActive(item.href) ? 'opacity-100' : 'opacity-0'
                )}
              />
            </Link>
          ))}
        </nav>

        {/* Right: bell + avatar menu */}
        <div ref={wrapperRef} className="flex shrink-0 items-center gap-1.5 sm:gap-2">

          <div className="relative">
            <button
              onClick={() => {
                setBellOpen((v) => !v);
                setAvatarOpen(false);
              }}
              className="relative rounded-lg p-2 text-slate-500 transition-colors hover:bg-white/80 hover:text-[#0F172A]"
              aria-label="Notifications"
              aria-expanded={bellOpen}
            >
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#0072ff] ring-2 ring-white" />
            </button>
            {bellOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 animate-fade-in overflow-hidden rounded-2xl border border-white/80 bg-white/90 shadow-xl backdrop-blur-xl">
                <p className="border-b border-slate-100 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Notifications
                </p>
                <ul>
                  {DEMO_NOTIFICATIONS.map((n) => (
                    <li key={n.id} className="border-b border-slate-50 px-4 py-3 last:border-b-0">
                      <p className="text-sm font-semibold text-[#0F172A]">{n.title}</p>
                      <p className="mt-0.5 text-xs text-slate-500">{n.body}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => {
                setAvatarOpen((v) => !v);
                setBellOpen(false);
              }}
              className="flex items-center gap-2 rounded-lg p-1 pr-2 transition-colors hover:bg-white/80"
              aria-label="Account menu"
              aria-expanded={avatarOpen}
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#00C6FF] to-[#0072ff] text-[11px] font-bold text-white">
                {avatarText}
              </span>
              <span className="hidden items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-emerald-700 sm:inline-flex">
                {roleLabel}
              </span>
            </button>
            {avatarOpen && (
              <div className="absolute right-0 top-full mt-2 w-60 animate-fade-in overflow-hidden rounded-2xl border border-white/80 bg-white/90 shadow-xl backdrop-blur-xl">
                <div className="border-b border-slate-100 px-4 py-3">
                  <p className="truncate text-sm font-semibold text-[#0F172A]">{displayName}</p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-xs font-medium text-[#0F172A]">
                    <span
                      className={cn(
                        'inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide',
                        session?.role === 'underwriter'
                          ? 'bg-blue-50 text-blue-700'
                          : 'bg-emerald-50 text-emerald-700'
                      )}
                    >
                      {roleLabel}
                    </span>
                    {session?.cnic ? <span className="font-mono text-xs text-slate-500">· {maskCnic(session.cnic)}</span> : null}
                  </p>
                </div>
                <div className="flex flex-col gap-0.5 px-4 pb-1">
                  <Link
                    href="/dashboard#profile"
                    onClick={() => setAvatarOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-[#0F172A]"
                  >
                    <User className="h-4 w-4" /> My Profile
                  </Link>
                  <Link
                    href="/dashboard#settings"
                    onClick={() => setAvatarOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-[#0F172A]"
                  >
                    <Settings className="h-4 w-4" /> Settings
                  </Link>
                </div>
                <div className="border-t border-slate-100 px-4 py-2">
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50"
                  >
                    <LogOut className="h-4 w-4" /> Log out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

