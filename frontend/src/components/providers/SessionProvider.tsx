'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  endSession,
  getSession,
  startSession,
  type Session,
  type UserRole,
} from '@/lib/auth';

interface SessionContextValue {
  /** Active session, or null when signed out. */
  session: Session | null;
  /** False until the initial storage read completes (guards SSR hydration). */
  hydrated: boolean;
  /**
   * Start a session for `cnic`. If a different identity was already signed in,
   * ALL client storage + cached context state is purged first (isolation).
   * The shared loan queue is preserved so cross-role submissions survive.
   */
  signIn: (cnic: string, name?: string, role?: UserRole) => Session;
  /** Sign out: purges ALL client storage so nothing leaks to the next user. */
  signOut: () => void;
}

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setSession(getSession());
    setHydrated(true);
  }, []);

  const signIn = useCallback((cnic: string, name = '', role: UserRole = 'borrower') => {
    // startSession purges localStorage + sessionStorage before writing the
    // new identity — a hard isolation boundary between CNICs. The shared loan
    // queue is preserved by clearAllClientStorage so cross-role work survives.
    const next = startSession(cnic, name, role);
    setSession(next);
    return next;
  }, []);

  const signOut = useCallback(() => {
    endSession();
    setSession(null);
  }, []);

  const value = useMemo(
    () => ({ session, hydrated, signIn, signOut }),
    [session, hydrated, signIn, signOut]
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext);
  if (!ctx) {
    throw new Error('useSession must be used within SessionProvider');
  }
  return ctx;
}