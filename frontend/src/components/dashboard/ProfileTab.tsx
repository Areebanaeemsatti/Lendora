'use client';

import React from 'react';
import { CalendarDays, IdCard, Mail, MapPin, Phone, ShieldCheck } from 'lucide-react';
import { useSession } from '@/components/providers/SessionProvider';
import { getConsumerProfile } from '@/lib/consumerData';

/**
 * Profile tab: identity details for the signed-in CNIC with the CNIC always
 * masked (35202-******-1) — full digits are never rendered after sign-in.
 */
export function ProfileTab() {
  const { session } = useSession();
  const cnic = session?.cnic ?? '';
  const profile = getConsumerProfile(cnic, session?.name);

  const rows = [
    { icon: IdCard, label: 'CNIC', value: profile.maskedCnic, mono: true },
    { icon: Phone, label: 'Mobile', value: profile.phone, mono: false },
    { icon: Mail, label: 'Email', value: profile.email, mono: false },
    { icon: MapPin, label: 'City', value: profile.city, mono: false },
    { icon: CalendarDays, label: 'Member since', value: profile.memberSince, mono: false },
  ];

  return (
    <div className="space-y-5">
      <div className="animate-fade-up">
        <h1 className="text-2xl font-bold tracking-tight text-[#0F172A]">Profile</h1>
        <p className="mt-1 text-sm text-[#475569]">
          Your personal details as they appear on your Lendora account.
        </p>
      </div>

      {/* Identity header */}
      <div className="glass rounded-3xl p-6">
        <div className="flex items-center gap-4">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#00C6FF] to-[#0072ff] text-xl font-extrabold text-white shadow-lg">
            {(session?.name || profile.name)
              .split(/\s+/)
              .filter(Boolean)
              .map((p) => p[0]?.toUpperCase())
              .slice(0, 2)
              .join('')}
          </span>
          <div className="min-w-0">
            <h2 className="truncate text-lg font-bold text-[#0F172A]">{profile.name}</h2>
            <p className="mt-0.5 font-mono text-sm text-[#475569]">{profile.maskedCnic}</p>
          </div>
        </div>

        <div className="mt-5 flex items-start gap-2.5 rounded-2xl bg-[#0072ff]/5 px-4 py-3">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#0072ff]" />
          <p className="text-xs leading-relaxed text-[#475569]">
            Your CNIC verifies your identity and keeps your account private. We only show the
            masked version anywhere in the app.
          </p>
        </div>
      </div>

      {/* Detail rows */}
      <section className="glass overflow-hidden rounded-3xl">
        <ul>
          {rows.map(({ icon: Icon, label, value, mono }) => (
            <li
              key={label}
              className="flex items-center justify-between gap-4 border-b border-slate-50 px-6 py-4 last:border-b-0"
            >
              <span className="flex items-center gap-3 text-sm text-[#475569]">
                <Icon className="h-4 w-4 text-[#0072ff]" />
                {label}
              </span>
              <span
                className={`text-sm font-semibold text-[#0F172A] ${mono ? 'font-mono' : ''}`}
              >
                {value}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}