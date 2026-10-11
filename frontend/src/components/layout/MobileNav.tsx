'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut, X } from 'lucide-react';
import { NAV_ITEMS } from './navConfig';
import { clearAuthToken, maskCnic } from '@/lib/auth';
import { useSession } from '@/components/providers/SessionProvider';
import { LogoMark } from './LogoMark';
import { cn } from '@/lib/utils';

export function MobileNav({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { session, signOut } = useSession();

  const handleLogout = () => {
    onClose?.();
    signOut();
    clearAuthToken();
    router.replace('/auth');
  };

  const isActive = (href: string) => {
    const base = href.split('#')[0];
    return base === '/' ? pathname === '/' : pathname?.startsWith(base);
  };

  return (
    <div className="flex h-full flex-col bg-white/90 text-slate-700 backdrop-blur-xl">
      {/* Drawer header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <Link href="/dashboard" className="flex items-center gap-2.5" onClick={onClose}>
          <LogoMark className="h-6 w-6 shrink-0" />
          <span className="text-sm font-bold tracking-tight text-[#0F172A]">Lendora</span>
        </Link>
        <button
          onClick={onClose}
          className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-[#0F172A]"
          aria-label="Close navigation menu"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4" aria-label="Mobile">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            onClick={onClose}
            className={cn(
              'block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
              isActive(item.href)
                ? 'bg-[#0072ff]/10 text-[#0072ff]'
                : 'text-slate-600 hover:bg-slate-50 hover:text-[#0F172A]'
            )}
          >
            {item.title}
          </Link>
        ))}
      </nav>

      {/* User footer */}
      <div className="border-t border-slate-100 p-4">
        <div className="flex items-center justify-between">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#00C6FF] to-[#0072ff] text-[10px] font-bold text-white">
              {(session?.name || '')
                .split(/\s+/)
                .filter(Boolean)
                .map((p) => p[0]?.toUpperCase())
                .slice(0, 2)
                .join('') || session?.cnic.slice(-2) || 'LN'}
            </span>
            <div className="min-w-0 leading-tight">
              <p className="truncate text-xs font-semibold text-[#0F172A]">
                {session?.name || 'Lendora Customer'}
              </p>
              {session && (
                <p className="truncate font-mono text-[10px] text-slate-500">
                  {maskCnic(session.cnic)}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
            aria-label="Log out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
