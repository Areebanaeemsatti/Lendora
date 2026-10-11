'use client';

import React, { useMemo, useState } from 'react';
import { ArrowDownLeft, ArrowUpRight, Search } from 'lucide-react';
import { useSession } from '@/components/providers/SessionProvider';
import {
  formatAmount,
  formatDate,
  getTransactions,
  type TransactionCategory,
} from '@/lib/consumerData';
import { cn } from '@/lib/utils';

type FilterKey = 'all' | TransactionCategory;

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'disbursement', label: 'Loans in' },
  { key: 'repayment', label: 'Repayments' },
  { key: 'fee', label: 'Fees' },
  { key: 'topup', label: 'Top-ups' },
];

/**
 * Transactions tab: searchable, filterable history for the signed-in CNIC.
 * Filters are underline tabs (no pills), list rows sit on glass cards.
 */
export function TransactionsTab() {
  const { session } = useSession();
  const cnic = session?.cnic ?? '';
  const [filter, setFilter] = useState<FilterKey>('all');
  const [query, setQuery] = useState('');

  const transactions = useMemo(() => getTransactions(cnic), [cnic]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return transactions.filter((tx) => {
      const matchesFilter = filter === 'all' || tx.category === filter;
      const matchesQuery = q.length === 0 || tx.title.toLowerCase().includes(q);
      return matchesFilter && matchesQuery;
    });
  }, [transactions, filter, query]);

  return (
    <div className="space-y-5">
      <div className="animate-fade-up">
        <h1 className="text-2xl font-bold tracking-tight text-[#0F172A]">Transactions</h1>
        <p className="mt-1 text-sm text-[#475569]">
          Every loan, repayment and top-up on your account.
        </p>
      </div>

      {/* Search + filters */}
      <div className="glass rounded-3xl p-4 sm:p-5">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search transactions…"
            aria-label="Search transactions"
            className="w-full rounded-xl border border-white/80 bg-white/80 py-2.5 pl-10 pr-3.5 text-sm text-[#0F172A] placeholder-slate-400 transition focus:border-[#0072ff]/50 focus:outline-none focus:ring-2 focus:ring-[#0072ff]/20"
          />
        </div>

        <div className="mt-4 flex gap-5 overflow-x-auto border-b border-slate-200/70">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={cn(
                'relative -mb-px shrink-0 pb-2.5 text-sm font-semibold transition-colors',
                filter === f.key
                  ? 'text-[#0072ff]'
                  : 'text-slate-500 hover:text-slate-700'
              )}
            >
              {f.label}
              <span
                className={cn(
                  'absolute inset-x-0 -bottom-px h-0.5 rounded-full transition-all',
                  filter === f.key ? 'bg-[#0072ff]' : 'bg-transparent'
                )}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Transaction list */}
      <section className="glass overflow-hidden rounded-3xl">
        {visible.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-sm font-semibold text-[#0F172A]">No transactions found</p>
            <p className="mt-1 text-xs text-[#475569]">Try a different search or filter.</p>
          </div>
        ) : (
          <ul>
            {visible.map((tx) => (
              <li
                key={tx.id}
                className="flex items-center justify-between gap-4 border-b border-slate-50 px-5 py-4 transition-colors last:border-b-0 hover:bg-white/60 sm:px-6"
              >
                <span
                  className={cn(
                    'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
                    tx.amount >= 0
                      ? 'bg-emerald-50 text-emerald-600'
                      : 'bg-slate-100 text-slate-500'
                  )}
                >
                  {tx.amount >= 0 ? (
                    <ArrowDownLeft className="h-4.5 w-4.5" />
                  ) : (
                    <ArrowUpRight className="h-4.5 w-4.5" />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-[#0F172A]">{tx.title}</p>
                  <p className="mt-0.5 text-xs text-[#475569]">
                    {formatDate(tx.date)} ·{' '}
                    <span className={tx.status === 'pending' ? 'text-amber-600' : 'text-emerald-600'}>
                      {tx.status === 'pending' ? 'Processing' : 'Completed'}
                    </span>
                  </p>
                </div>
                <span
                  className={cn(
                    'shrink-0 text-sm font-bold tabular-nums',
                    tx.amount >= 0 ? 'text-emerald-600' : 'text-[#0F172A]'
                  )}
                >
                  {formatAmount(tx.amount)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}