import type { Metadata } from 'next';
import { LandingPage } from '@/pages/LandingPage';

export const metadata: Metadata = {
  title: 'Lendora — Alternative Credit Platform',
  description:
    'Lendora turns telecom, utility and wallet data into explainable, decision-ready credit scores for thin-file Pakistani borrowers.',
};

/**
 * Public marketing landing page at `/`. The underwriting console lives at
 * `/dashboard` (protected), and sign-in/sign-up at `/auth`.
 */
export default function RootPage() {
  return <LandingPage />;
}
