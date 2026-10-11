'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  KeyRound,
  Loader2,
  Phone,
  ShieldCheck,
  User,
  UserRound,
} from 'lucide-react';
import { LogoMark } from '@/components/layout/LogoMark';
import { cn } from '@/lib/utils';
import { useSession } from '@/components/providers/SessionProvider';
import { normalizeCnic } from '@/lib/auth';
import {
  DEFAULT_ADMIN_ID,
  getAdminLabelById,
  isAdminCredentialMatch,
} from '@/config/adminAuth';

type Tab = 'borrower' | 'underwriter';

const CNIC_REGEX = /^\d{5}-\d{7}-\d{1}$|^\d{13}$/;
const PHONE_REGEX = /^(0092|03)?3\d{9}$/;

/** Fixed staff session key shared by every underwriter reviewing the queue. */
const UNDERWRITER_SESSION_KEY = '3520212345671';

/** Per-tab subtitle shown under the "Welcome to Lendora" heading. */
const SUBTITLE: Record<Tab, string> = {
  borrower: 'Instant digital micro-credit directly to your wallet',
  underwriter: 'Underwriting Risk Intelligence & Portfolio Controls',
};

/** Turn a mobile number into a stable 13-digit session key. */
function phoneToCnic(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  return digits.padEnd(13, '0').slice(0, 13);
}

export default function AuthPage() {
  const router = useRouter();
  const { signIn } = useSession();

  const [tab, setTab] = useState<Tab>('borrower');
  const [identifier, setIdentifier] = useState('');
  const [adminId, setAdminId] = useState(DEFAULT_ADMIN_ID);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isBorrower = tab === 'borrower';

  const switchTab = (next: Tab) => {
    setTab(next);
    setError('');
  };

  const handleBorrowerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = identifier.trim();
    const digits = trimmed.replace(/\D/g, '');
    const looksLikePhone =
      trimmed.startsWith('03') || trimmed.startsWith('+92') || trimmed.startsWith('0092');

    if (!trimmed) {
      setError('Please enter your CNIC or mobile number.');
      return;
    }

    let cnic: string;
    if (looksLikePhone) {
      if (!PHONE_REGEX.test(trimmed.replace(/[\s-]/g, ''))) {
        setError('Enter a valid mobile number like 03XXXXXXXXX or +923XXXXXXXXX.');
        return;
      }
      cnic = phoneToCnic(trimmed);
    } else {
      if (!CNIC_REGEX.test(trimmed) || digits.length !== 13) {
        setError('Enter a valid 13-digit CNIC (e.g. 42101-1234567-1).');
        return;
      }
      cnic = normalizeCnic(trimmed);
    }

    setIsSubmitting(true);
    // Borrower Portal lives at /dashboard in this app.
    signIn(cnic, '', 'borrower');
    router.push('/dashboard');
  };

  const handleUnderwriterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminId.trim() || !password.trim()) {
      setError('Please enter your Risk Officer Admin ID and password.');
      return;
    }
    if (!isAdminCredentialMatch(adminId, password)) {
      setError('Those credentials are not recognised.');
      return;
    }

    setIsSubmitting(true);
    const label = getAdminLabelById(adminId) ?? 'Risk Underwriter';
    // Underwriters get a fixed staff session key; the shared queue is what
    // they review. The underwriter console lives at /underwriter.
    signIn(UNDERWRITER_SESSION_KEY, label, 'underwriter');
    router.push('/underwriter');
  };
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#F4F8FB] text-[#0F172A] antialiased">
      {/* Subtle light-blue mesh gradient behind the frosted surfaces. */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        <div className="absolute -left-40 -top-40 h-[28rem] w-[28rem] rounded-full bg-[#00c6ff]/10 blur-3xl" />
        <div className="absolute -right-48 top-1/4 h-[26rem] w-[26rem] rounded-full bg-[#0072ff]/10 blur-3xl" />
        <div className="absolute bottom-[-10rem] left-1/3 h-72 w-72 rounded-full bg-[#00c6ff]/10 blur-3xl" />
      </div>

      {/* ===================== TOP BAR ===================== */}
      <header className="relative z-10 w-full">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <LogoMark className="h-8 w-8" />
            <span className="text-lg font-extrabold tracking-tight text-[#0F172A]">
              Lendora
            </span>
          </Link>

          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/70 bg-emerald-50/70 px-3 py-1.5 text-xs font-semibold text-emerald-700 backdrop-blur-md">
            <ShieldCheck className="h-4 w-4 text-emerald-600" aria-hidden />
            Verified Secure Platform
          </div>
        </div>
      </header>

      {/* ===================== CENTER AUTH CARD ===================== */}
      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-6">
        <div className="w-full max-w-md rounded-2xl border border-white/60 bg-white/80 p-8 shadow-xl backdrop-blur-md">
          <div className="text-center">
            <h1 className="text-2xl font-extrabold tracking-tight text-[#0F172A]">
              Welcome to Lendora
            </h1>
            <p className="mt-1.5 text-sm text-[#475569]">{SUBTITLE[tab]}</p>
          </div>

          {/* Role switcher tabs with a sliding active indicator. */}
          <div
            role="tablist"
            aria-label="Choose your portal"
            className="relative mt-6 grid grid-cols-2 gap-1 rounded-xl border border-white/60 bg-white/60 p-1"
          >
            <span
              aria-hidden
              className={cn(
                'absolute inset-y-1 left-1 w-[calc(50%-0.375rem)] rounded-lg bg-gradient-to-r from-[#00c6ff] to-[#0072ff] shadow-[0_6px_16px_rgba(0,114,255,0.28)] transition-transform duration-300 ease-out',
                isBorrower ? 'translate-x-0' : 'translate-x-[calc(100%+0.25rem)]'
              )}
            />

            <button
              type="button"
              role="tab"
              aria-selected={isBorrower}
              onClick={() => switchTab('borrower')}
              className={cn(
                'relative z-10 flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-colors duration-200',
                isBorrower ? 'text-white' : 'text-[#475569] hover:text-[#0F172A]'
              )}
            >
              <User className="h-4 w-4" aria-hidden />
              Borrower Portal
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={!isBorrower}
              onClick={() => switchTab('underwriter')}
              className={cn(
                'relative z-10 flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-colors duration-200',
                !isBorrower ? 'text-white' : 'text-[#475569] hover:text-[#0F172A]'
              )}
            >
              <ShieldCheck className="h-4 w-4" aria-hidden />
              Risk Underwriter
            </button>
          </div>

          {error && (
            <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-medium text-rose-700">
              {error}
            </p>
          )}
          {isBorrower ? (
            <form className="mt-6 space-y-4" onSubmit={handleBorrowerSubmit} noValidate>
              <div>
                <label
                  htmlFor="identifier"
                  className="mb-1.5 block text-xs font-semibold text-[#1E293B]"
                >
                  Mobile Number or CNIC
                </label>
                <div className="relative">
                  <Phone
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]"
                    aria-hidden
                  />
                  <input
                    id="identifier"
                    type="text"
                    value={identifier}
                    onChange={(e) => {
                      setIdentifier(e.target.value);
                      setError('');
                    }}
                    placeholder="Enter Mobile Number or CNIC"
                    className="w-full rounded-xl border border-slate-300/70 bg-white/80 py-2.5 pl-9 pr-3.5 text-sm text-[#0F172A] placeholder-slate-400 transition focus:border-[#0072ff] focus:outline-none focus:ring-2 focus:ring-[#0072ff]/20"
                  />
                </div>
                <p className="mt-1.5 text-[11px] text-[#64748B]">
                  Format: 03XXXXXXXXX, +923XXXXXXXXX, or CNIC
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
                Continue to Borrower Portal
                <ArrowRight className="h-4 w-4" aria-hidden />
              </button>
            </form>
          ) : (
            <form className="mt-6 space-y-4" onSubmit={handleUnderwriterSubmit} noValidate>
              <div>
                <label
                  htmlFor="adminId"
                  className="mb-1.5 block text-xs font-semibold text-[#1E293B]"
                >
                  Risk Officer Admin ID
                </label>
                <div className="relative">
                  <UserRound
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]"
                    aria-hidden
                  />
                  <input
                    id="adminId"
                    type="text"
                    value={adminId}
                    onChange={(e) => {
                      setAdminId(e.target.value);
                      setError('');
                    }}
                    placeholder="Enter Admin ID"
                    className="w-full rounded-xl border border-slate-300/70 bg-white/80 py-2.5 pl-9 pr-3.5 text-sm text-[#0F172A] placeholder-slate-400 transition focus:border-[#0072ff] focus:outline-none focus:ring-2 focus:ring-[#0072ff]/20"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-1.5 block text-xs font-semibold text-[#1E293B]"
                >
                  Security Clearance Password
                </label>
                <div className="relative">
                  <KeyRound
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]"
                    aria-hidden
                  />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError('');
                    }}
                    placeholder="Enter Password"
                    className="w-full rounded-xl border border-slate-300/70 bg-white/80 py-2.5 pl-9 pr-3.5 text-sm text-[#0F172A] placeholder-slate-400 transition focus:border-[#0072ff] focus:outline-none focus:ring-2 focus:ring-[#0072ff]/20"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#00c6ff] to-[#0072ff] px-4 py-3 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(0,114,255,0.28)] transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(0,114,255,0.38)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
                Authenticate Underwriter Access
                <ArrowRight className="h-4 w-4" aria-hidden />
              </button>
            </form>
          )}

          <p className="mt-5 text-center text-[11px] text-[#64748B]">
            Demo only — your details stay in this browser.
          </p>
        </div>
      </main>

      {/* ===================== FOOTER ===================== */}
      <footer className="relative z-10 w-full py-6 text-center text-xs text-[#64748B]">
        Lendora Financial Technologies (Pvt) Ltd. • All Rights Reserved
      </footer>
    </div>
  );
}

