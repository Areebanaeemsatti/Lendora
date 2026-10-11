import type { Metadata } from 'next';
import { LandingPage } from '@/components/landing/LandingPage';

export const metadata: Metadata = {
  title: 'Lendora — Simple credit access for everyday borrowers',
  description:
    'A transparent digital platform helping borrowers and teams review applications clearly and fairly. Role-Based Protected Access • Digital Lending Standards Compliant.',
};

/**
 * Public marketing landing page at `/`. The underwriting console lives at
 * `/dashboard` (protected), and sign-in/sign-up at `/auth`.
 */
export default function RootPage() {
  return <LandingPage />;
}
