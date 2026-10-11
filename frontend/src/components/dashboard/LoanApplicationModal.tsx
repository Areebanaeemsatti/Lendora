'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { LoanApplicationForm } from './LoanApplicationForm';

interface LoanApplicationModalProps {
  open: boolean;
  /** Prefill the form with demo data the moment it opens. */
  autoFill?: boolean;
  onClose: () => void;
}

/**
 * Frosted-glass modal that hosts the loan application form. Locks background
 * scroll while open and closes on Escape / backdrop click.
 */
export function LoanApplicationModal({ open, autoFill = false, onClose }: LoanApplicationModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 sm:p-6">
      <div className="fixed inset-0 bg-[#0F172A]/30 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <div className="relative z-10 my-6 w-full max-w-lg rounded-2xl border border-white/60 bg-white/85 p-6 shadow-xl backdrop-blur-md sm:p-8">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-extrabold tracking-tight text-[#0F172A]">Apply for Cash</h2>
            <p className="mt-1 text-sm text-[#475569]">Complete the form and attach your documents to apply.</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 rounded-lg p-1.5 text-[#475569] transition-colors hover:bg-white/80 hover:text-[#0F172A]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <LoanApplicationForm onSubmitted={onClose} autoFillOnMount={autoFill} />
      </div>
    </div>
  );
}
