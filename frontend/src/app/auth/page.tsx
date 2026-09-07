'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const [identifier, setIdentifier] = useState('');
  const [error, setError] = useState('');
  const [detectedType, setDetectedType] = useState<'cnic' | 'phone' | null>(null);
  const router = useRouter();

  // Clean raw digits from string
  const cleanDigits = identifier.replace(/\D/g, '');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setIdentifier(value);
    setError('');

    const digits = value.replace(/\D/g, '');

    // Auto-detect format type
    if (value.startsWith('+92') || value.startsWith('03')) {
      setDetectedType('phone');
    } else if (digits.length >= 5) {
      setDetectedType('cnic');
    } else {
      setDetectedType(null);
    }
  };

  const validateInput = () => {
    const raw = identifier.trim();
    const digits = cleanDigits;

    // Pakistani CNIC Validation: Exactly 13 digits (15 chars formatted as 12345-1234567-1)
    const cnicRegex = /^\d{5}-\d{7}-\d{1}$|^\d{13}$/;

    // Pakistani Phone Validation: 03XX-XXXXXXX (11 digits) or +923XXXXXXXXX (12 digits)
    const phoneRegex = /^((\+92)|(0092))?3\d{9}$|^03\d{9}$/;

    if (!raw) {
      setError('Please enter a valid CNIC or Mobile Number.');
      return false;
    }

    if (detectedType === 'cnic' || digits.length === 13) {
      if (!cnicRegex.test(raw)) {
        setError('Invalid CNIC format. Use 13 digits (e.g., 42101-1234567-1).');
        return false;
      }
    } else if (detectedType === 'phone' || raw.startsWith('03') || raw.startsWith('+92')) {
      if (!phoneRegex.test(raw.replace(/[\s-]/g, ''))) {
        setError('Invalid Pakistani mobile number. Must start with 03 or +923 (e.g., 03001234567).');
        return false;
      }
    } else {
      setError('Format not recognized. Enter a 13-digit CNIC or a valid Pakistani mobile number.');
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateInput()) {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0F11] text-white flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-zinc-900/60 border border-zinc-800 rounded-2xl p-8 space-y-6 shadow-2xl">
        <div className="space-y-2">
          <div className="inline-block bg-emerald-500/10 text-[#05C168] text-xs font-mono font-semibold px-2.5 py-1 rounded-full border border-emerald-500/20">
            LENDORA AUTHENTICATION
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Sign in to Desk</h1>
          <p className="text-sm text-zinc-400">
            Enter your Pakistani CNIC or Mobile Number to access underwriting scores.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-medium text-zinc-400">
                CNIC or Mobile Number
              </label>
              {detectedType && (
                <span className="text-[10px] font-mono uppercase bg-zinc-800 text-emerald-400 px-2 py-0.5 rounded border border-zinc-700">
                  {detectedType === 'cnic' ? 'CNIC Detected' : 'Mobile Detected'}
                </span>
              )}
            </div>

            <input
              type="text"
              value={identifier}
              onChange={handleInputChange}
              placeholder="e.g. 42101-1234567-1 or 03001234567"
              className={`w-full bg-zinc-950/80 border rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none transition ${error
                  ? 'border-red-500/80 focus:ring-1 focus:ring-red-500'
                  : 'border-zinc-800 focus:border-[#05C168] focus:ring-1 focus:ring-[#05C168]'
                }`}
            />

            {error && (
              <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                <span>⚠</span> {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full text-center bg-[#05C168] hover:bg-[#00D068] text-black font-semibold rounded-lg px-4 py-3 transition duration-150 ease-in-out shadow-lg shadow-emerald-500/10 cursor-pointer"
          >
            Continue to Dashboard
          </button>
        </form>

        <div className="pt-2 border-t border-zinc-800/60 flex justify-between items-center text-xs text-zinc-500">
          <span>Pakistan Desk | PKR</span>
          <Link href="/" className="hover:text-zinc-300 transition">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}