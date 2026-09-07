'use client';

import React from 'react';
import Link from 'next/link';
import { BorrowerApplication } from '@/types';
import { formatPKR } from '@/lib/utils';
import { Select } from '@/components/ui/Select';
import { Users, ChevronRight, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface Props {
  applications: BorrowerApplication[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export function ApplicationSwitcher({ applications, selectedId, onSelect }: Props) {
  if (applications.length <= 1) return null;

  return (
    <div className="border border-zinc-800/80 bg-zinc-900/60 rounded-lg p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <Users className="w-4 h-4 text-zinc-500" />
        <span className="text-xs font-semibold text-zinc-300">
          Underwriting Queue ({applications.length} applications):
        </span>
      </div>

      <div className="flex items-center gap-2 flex-1 sm:max-w-md">
        <select
          value={selectedId}
          onChange={(e) => onSelect(e.target.value)}
          className="w-full text-xs px-3 py-1.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        >
          {applications.map((app) => (
            <option key={app.id} value={app.id}>
              {app.fullName} ({app.borrowerId}) — {app.city} — {typeof app.requestedLoanAmountPKR === 'number' ? formatPKR(app.requestedLoanAmountPKR) : ''}
            </option>
          ))}
        </select>

        <Link href="/new-application">
          <Button variant="outline" size="sm" className="shrink-0 text-xs py-1.5 h-8">
            <PlusCircle className="w-3.5 h-3.5 sm:mr-1" />
            <span className="hidden sm:inline">New</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
