'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut, X } from 'lucide-react';
import { NAV_ITEMS } from './navConfig';
import { clearAuthToken } from '@/lib/auth';
import { LogoMark } from './LogoMark';
import { cn } from '@/lib/utils';

export function MobileNav({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    onClose?.();
    clearAuthToken();
    router.replace('/auth');
  };

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname?.startsWith(href);

  return (
    <div className="flex h-full flex-col bg-zinc-950 text-zinc-300">
      {/* Drawer header */}
      <div className="flex items-center justify-between border-b border-zinc-800/60 px-4 py-3">
        <Link href="/" className="flex items-center gap-2.5" onClick={onClose}>
          <LogoMark className="h-6 w-6 shrink-0 text-zinc-100" />
          <span className="text-sm font-semibold tracking-tight text-zinc-100">Lendora</span>
        </Link>
        <button
          onClick={onClose}
          className="rounded-md p-1.5 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
          aria-label="Close navigation menu"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4" aria-label="Mobile">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className={cn(
              'block rounded-md px-3 py-2 text-sm font-medium transition-colors',
              isActive(item.href)
                ? 'bg-zinc-800/80 text-zinc-100'
                : 'text-zinc-400 hover:bg-zinc-800/40 hover:text-zinc-100'
            )}
          >
            {item.title}
          </Link>
        ))}
      </nav>

      {/* User footer */}
      <div className="border-t border-zinc-800/60 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-700 bg-zinc-800 text-[10px] font-semibold text-zinc-200">
              UW
            </div>
            <div className="leading-tight">
              <p className="text-xs font-medium text-zinc-200">Risk Underwriter</p>
              <p className="text-[10px] text-zinc-500">Karachi Desk (PK)</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-md p-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
            aria-label="Log out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
