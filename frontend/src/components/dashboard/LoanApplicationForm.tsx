'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { UploadField } from './UploadField';
import { useApplications } from '@/components/providers/ApplicationsProvider';
import { formatPKR, cn } from '@/lib/utils';
import {
  DEMO_FILES,
  DEMO_FORM,
  PAYOUT_OPTIONS,
  buildLoanApplication,
  type DemoForm,
} from '@/lib/demoApplication';

type Files = { cnic: string[]; salary: string[]; bank: string[] };

const EMPTY_FILES: Files = { cnic: [], salary: [], bank: [] };

const FIELD_GRID = 'grid grid-cols-1 gap-4 sm:grid-cols-2';

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-[#1E293B]">{label}</label>
      {children}
    </div>
  );
}

const inputCls =
  'w-full rounded-xl border border-slate-300/70 bg-white/80 px-3.5 py-2.5 text-sm text-[#0F172A] placeholder-slate-400 transition focus:border-[#0072ff] focus:outline-none focus:ring-2 focus:ring-[#0072ff]/20';

interface LoanApplicationFormProps {
  onSubmitted?: () => void;
  /** Prefill every field + mock the uploads with demo data on first render. */
  autoFillOnMount?: boolean;
  /** Compact single-column layout for the modal. */
  className?: string;
}

/**
 * Loan application form with document upload + one-tap Auto-Fill demo.
 *
 * Submission writes to the SHARED queue (localStorage), so the record appears
 * on the underwriter console instantly and the officer's decision flows back
 * to this borrower's status banner. No backend required for the demo path.
 */
export function LoanApplicationForm({ onSubmitted, autoFillOnMount, className }: LoanApplicationFormProps) {
  const { addApplication } = useApplications();

  const [form, setForm] = useState<DemoForm>({
    fullName: '',
    cnic: '',
    mobile: '',
    monthlyIncomePKR: '',
    requestedLoanAmountPKR: '',
    payout: PAYOUT_OPTIONS[0],
  });
  const [files, setFiles] = useState<Files>(EMPTY_FILES);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  // Derived: all three required document uploads are present.
  const filesAttached = files.cnic.length > 0 && files.salary.length > 0 && files.bank.length > 0;
  // Guard: when opened via the hero "Auto-Fill Demo Data" button, prefill once
  // and then ignore further autoFill() calls so the form isn't overwritten by
  // user edits.
  const formChangedSinceMount = useRef(false);

  const set = (key: keyof DemoForm) => (value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setError('');
    formChangedSinceMount.current = true;
  };

  const autoFill = () => {
    setForm(DEMO_FORM);
    setFiles({ cnic: DEMO_FILES.cnic, salary: DEMO_FILES.salarySlip, bank: DEMO_FILES.bankStatement });
    setError('');
  };

  // One-tap demo: prefilled if opened via the hero Auto-Fill button.
  const isAutoFill = autoFillOnMount ?? false;
  if (isAutoFill && !formChangedSinceMount) {
    autoFill();
  }

  const validate = (): string => {
    if (!form.fullName.trim()) return 'Please enter your full name.';
    if (!/^\d{5}-\d{7}-\d{1}$/.test(form.cnic.trim()) && form.cnic.replace(/\D/g, '').length !== 13)
      return 'Please enter a valid 13-digit CNIC (e.g. 42101-1234567-9).';
    if (!/^(\+92|0092|0)?3\d{9}$/.test(form.mobile.replace(/[\s-]/g, '')))
      return 'Please enter a valid mobile number (e.g. 03001234567).';
    if (!(Number(form.monthlyIncomePKR) > 0)) return 'Please enter your monthly income.';
    if (!(Number(form.requestedLoanAmountPKR) > 0)) return 'Please enter the requested loan amount.';
    if (!filesAttached) return 'Please attach all required documents (CNIC, income proof, statement).';
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const message = validate();
    if (message) {
      setError(message);
      return;
    }
    setSubmitting(true);
    // Build + push to the shared queue so it syncs live with the underwriter.
    addApplication(buildLoanApplication(form));
    setSubmitting(false);
    setDone(true);
    onSubmitted?.();
  };
  if (done) {
    return (
      <div className={cn('flex flex-col items-center justify-center gap-3 rounded-2xl bg-emerald-50/70 px-6 py-10 text-center', className)}>
        <CheckCircle2 className="h-12 w-12 text-emerald-600" aria-hidden />
        <h3 className="text-lg font-bold text-[#0F172A]">Application Submitted</h3>
        <p className="max-w-sm text-sm text-[#475569]">
          Your application has been sent to the underwriting team. You will see the decision on your dashboard as soon as it is reviewed.
        </p>
        <button
          type="button"
          onClick={() => {
            setDone(false);
            setForm({ fullName: '', cnic: '', mobile: '', monthlyIncomePKR: '', requestedLoanAmountPKR: '', payout: PAYOUT_OPTIONS[0] });
            setFiles(EMPTY_FILES);
          }}
          className="mt-1 text-sm font-semibold text-[#0072ff] hover:underline"
        >
          Submit another application
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={cn('space-y-5', className)} noValidate>
      <div className={FIELD_GRID}>
        <Field label="Full Name">
          <input className={inputCls} placeholder="Enter your full name" value={form.fullName} onChange={(e) => set('fullName')(e.target.value)} />
        </Field>
        <Field label="CNIC Number">
          <input className={inputCls} placeholder="42101-1234567-9" value={form.cnic} onChange={(e) => set('cnic')(e.target.value)} />
        </Field>
        <Field label="Mobile Number">
          <input className={inputCls} placeholder="03001234567" value={form.mobile} onChange={(e) => set('mobile')(e.target.value)} />
        </Field>
        <Field label="Monthly Income (PKR)">
          <input className={inputCls} inputMode="numeric" placeholder="85000" value={form.monthlyIncomePKR} onChange={(e) => set('monthlyIncomePKR')(e.target.value)} />
        </Field>
        <Field label="Requested Loan Amount (PKR)">
          <input className={inputCls} inputMode="numeric" placeholder="25000" value={form.requestedLoanAmountPKR} onChange={(e) => set('requestedLoanAmountPKR')(e.target.value)} />
        </Field>
        <Field label="Preferred Payout Account">
          <select className={cn(inputCls, 'appearance-none')} value={form.payout} onChange={(e) => set('payout')(e.target.value)}>
            {PAYOUT_OPTIONS.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </Field>
      </div>

      {form.requestedLoanAmountPKR && Number(form.requestedLoanAmountPKR) > 0 && (
        <p className="rounded-xl bg-[#0072ff]/5 px-3.5 py-2.5 text-xs font-medium text-[#475569]">
          Requesting <span className="font-bold text-[#0F172A]">{formatPKR(Number(form.requestedLoanAmountPKR))}</span> sent to {form.payout}
        </p>
      )}

      <div className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#475569]">Required documents</p>
        <div className={FIELD_GRID}>
          <UploadField label="CNIC Front & Back Image" hint="JPG or PNG" files={files.cnic} onFilesChange={(f) => { setFiles((s) => ({ ...s, cnic: f })); setError(''); }} multiple />
          <UploadField label="Proof of Income / Salary Slip" hint="PDF or image" files={files.salary} onFilesChange={(f) => { setFiles((s) => ({ ...s, salary: f })); setError(''); }} />
        </div>
        <UploadField label="Bank / Wallet Statement" hint="PDF or image" files={files.bank} onFilesChange={(f) => { setFiles((s) => ({ ...s, bank: f })); setError(''); }} />
      </div>

      {error && (
        <p className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-medium text-rose-700">{error}</p>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          disabled={submitting}
          className="btn-primary inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
          Submit Application
          <ArrowRight className="h-4 w-4" aria-hidden />
        </button>
        <button
          type="button"
          onClick={autoFill}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#0072ff]/30 bg-white/70 px-5 py-3 text-sm font-semibold text-[#0072ff] transition-colors hover:border-[#0072ff]/60 hover:bg-white/90"
        >
          <Sparkles className="h-4 w-4" aria-hidden />
          Auto-Fill Demo Application
        </button>
      </div>
    </form>
  );
}
