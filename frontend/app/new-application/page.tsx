'use client';

import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { BorrowerForm } from '@/components/application/BorrowerForm';

export default function NewApplicationPage() {
  return (
    <AppLayout>
      <BorrowerForm />
    </AppLayout>
  );
}
