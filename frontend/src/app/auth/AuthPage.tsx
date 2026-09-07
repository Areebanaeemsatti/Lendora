'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BarChart3, Eye, EyeOff, Layers, Loader2, Sparkles } from 'lucide-react';
import { LogoMark } from '@/components/layout/LogoMark';
import { cn } from '@/lib/utils';
import { MOCK_AUTH_TOKEN, setAuthToken } from '@/lib/auth';

type FieldErrors = Partial<Record<'fullName' | 'email' | 'password', string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const FEATURE_HIGHLIGHTS = [
  {
    icon: BarChart3,
    title: 'Alternative Credit Scoring',
    description: 'JazzCash, Easypaisa and utility bill data analysed in real time.',
  },
  {
    icon: Sparkles,
    title: 'Explainable AI Engine',
    description: 'Every score ships with a live SHAP feature-contribution breakdown.',
  },
  {
    icon: Layers,
    title: 'Automated Underwriting Queue',
    description: 'Instant risk tiering and decisioning on submission.',
  },
] as const;

const inputClasses = (hasError: boolean) =>
  cn(
    'w-full rounded-md border bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 transition',
    'focus:outline-none focus:ring-2',
    hasError
      ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20'
      : 'border-zinc-300 focus:border-emerald-600 focus:ring-emerald-600/20',
  );

export function AuthPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [fullName, setFullName] = useState('');
  const [orgName, setOrgName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (submitTimer.current !== null) window.clearTimeout(submitTimer.current);
    };
  }, []);

  const validate = (): FieldErrors => {
    const next: FieldErrors = {};
    if (!EMAIL_PATTERN.test(email.trim())) {
      next.email = 'Enter a valid email address.';
    }
    if (password.length < 8) {
      next.password = 'Password must be at least 8 characters.';
    }
    if (isSignUp && fullName.trim().length === 0) {
      next.fullName = 'Enter your full name.';
    }
    return next;
  };

  const clearError = (field: keyof FieldErrors) =>
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));

  const switchMode = (nextMode: boolean) => {
    setIsSignUp(nextMode);
    setErrors({});
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;

    // Simulated submit: brief spinner, then persist mock token and redirect.
    setIsSubmitting(true);
    submitTimer.current = window.setTimeout(() => {
      setAuthToken(MOCK_AUTH_TOKEN);
      router.push('/dashboard');
    }, 500);
  };

  return (
    <div className="flex min-h-screen bg-zinc-50 text-zinc-900">
      {/* Left: deep emerald brand panel */}
      <aside className="relative hidden w-[44%] max-w-2xl flex-col justify-between overflow-hidden bg-emerald-950 p-10 lg:flex xl:p-14">
        <LogoMark className="pointer-events-none absolute -bottom-16 -right-16 h-72 w-72 text-emerald-100 opacity-[0.05]" />

        <div className="relative flex items-center gap-2.5">
          <LogoMark className="h-7 w-7 text-white" />
          <span className="text-lg font-semibold tracking-tight text-white">Lendora</span>
        </div>

        <div className="relative">
          <h1 className="text-3xl font-semibold leading-tight tracking-tight text-white xl:text-4xl">
            Precision Underwriting, Simplified.
          </h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-emerald-100/70">
            Lendora turns telecom, utility and repayment signals into explainable,
            decision-ready credit scores for Pakistani borrowers.
          </p>

          <ul className="mt-10 space-y-5">
            {FEATURE_HIGHLIGHTS.map(({ icon: Icon, title, description }) => (
              <li key={title} className="flex items-start gap-3.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-emerald-800/60 bg-emerald-900/60">
                  <Icon className="h-4 w-4 text-emerald-300" />
                </span>
                <div>
                  <p className="text-sm font-medium text-white">{title}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-emerald-100/60">
                    {description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-emerald-100/50">
          © 2026 Lendora · Demo build — authentication is simulated locally.
        </p>
      </aside>

      {/* Right: auth form card on a crisp light canvas */}
      <main className="flex flex-1 items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <div className="mb-6 flex items-center gap-2 lg:hidden">
            <LogoMark className="h-6 w-6 text-emerald-950" />
            <span className="text-sm font-semibold tracking-tight text-zinc-900">Lendora</span>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
            {/* Sign In / Sign Up toggle */}
            <div
              className="grid grid-cols-2 gap-1 rounded-lg bg-zinc-100 p-1"
              role="tablist"
              aria-label="Authentication mode"
            >
              <button
                type="button"
                role="tab"
                aria-selected={!isSignUp}
                onClick={() => switchMode(false)}
                className={cn(
                  'rounded-md py-1.5 text-xs font-medium transition-colors',
                  !isSignUp
                    ? 'bg-emerald-950 text-white shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-800',
                )}
              >
                Sign In
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={isSignUp}
                onClick={() => switchMode(true)}
                className={cn(
                  'rounded-md py-1.5 text-xs font-medium transition-colors',
                  isSignUp
                    ? 'bg-emerald-950 text-white shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-800',
                )}
              >
                Sign Up
              </button>
            </div>

            <h2 className="mt-6 text-lg font-semibold tracking-tight text-zinc-900">
              {isSignUp ? 'Create your account' : 'Welcome back'}
            </h2>
            <p className="mt-1 text-xs text-zinc-500">
              {isSignUp
                ? 'Set up your underwriting workspace in seconds.'
                : 'Sign in to the underwriting console.'}
            </p>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
              {isSignUp && (
                <>
                  <div className="space-y-1.5">
                    <label htmlFor="fullName" className="block text-xs font-medium text-zinc-700">
                      Full name
                    </label>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      autoComplete="name"
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        clearError('fullName');
                      }}
                      placeholder="e.g. Fatima Khan"
                      className={inputClasses(Boolean(errors.fullName))}
                    />
                    {errors.fullName && <p className="text-xs text-rose-600">{errors.fullName}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="orgName" className="block text-xs font-medium text-zinc-700">
                      Organisation <span className="font-normal text-zinc-400">(optional)</span>
                    </label>
                    <input
                      id="orgName"
                      name="orgName"
                      type="text"
                      autoComplete="organization"
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      placeholder="e.g. Lendora Microfinance"
                      className={inputClasses(false)}
                    />
                  </div>
                </>
              )}

              <div className="space-y-1.5">
                <label htmlFor="email" className="block text-xs font-medium text-zinc-700">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    clearError('email');
                  }}
                  placeholder="underwriter@lendora.pk"
                  className={inputClasses(Boolean(errors.email))}
                />
                {errors.email && <p className="text-xs text-rose-600">{errors.email}</p>}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="password" className="block text-xs font-medium text-zinc-700">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete={isSignUp ? 'new-password' : 'current-password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      clearError('password');
                    }}
                    placeholder={isSignUp ? 'Minimum 8 characters' : '••••••••'}
                    className={cn(inputClasses(Boolean(errors.password)), 'pr-10')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-zinc-400 transition-colors hover:text-zinc-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-rose-600">{errors.password}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-md bg-emerald-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/40 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {isSubmitting
                  ? isSignUp
                    ? 'Creating account…'
                    : 'Signing in…'
                  : isSignUp
                    ? 'Create account'
                    : 'Sign In'}
              </button>
            </form>
          </div>

          <p className="mt-4 text-center text-xs text-zinc-400">
            Demo authentication — credentials never leave your browser.
          </p>
        </div>
      </main>
    </div>
  );
}
