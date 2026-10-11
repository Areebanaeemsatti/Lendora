'use client';

import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { UnderwriterDesk } from '@/components/dashboard/UnderwriterDesk';

/**
 * Underwriter console at `/underwriter`.
 *
 * A clean, jargon-free workspace where a bank officer reviews loan
 * applications that arrive in real time from borrowers and records decisions
 * that flow straight back to the borrower's dashboard.
 */
export default function UnderwriterPage() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <UnderwriterDesk />
      </AppLayout>
    </ProtectedRoute>
  );
}
