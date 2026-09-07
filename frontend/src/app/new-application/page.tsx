'use client';

import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { BorrowerForm } from '@/components/application/BorrowerForm';

export default function NewApplicationPage() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <BorrowerForm />
      </AppLayout>
    </ProtectedRoute>
  );
}
