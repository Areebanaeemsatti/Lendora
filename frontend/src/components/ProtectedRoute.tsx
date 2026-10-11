'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/components/providers/SessionProvider';

/**
 * Guards protected routes: until the session hydrates we render a neutral
 * placeholder (avoids a flash-redirect on first paint); if no CNIC session
 * exists after hydration we bounce to /auth.
 */
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session, hydrated } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (hydrated && !session) {
      router.replace('/auth');
    }
  }, [hydrated, session, router]);

  if (!hydrated || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div
          className="h-8 w-8 animate-spin rounded-full border-2 border-[#0072ff] border-t-transparent"
          aria-label="Loading"
        />
      </div>
    );
  }

  return <>{children}</>;
}
