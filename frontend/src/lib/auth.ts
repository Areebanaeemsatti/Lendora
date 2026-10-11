/**
 * Role-aware session store for Lendora (Borrower vs Underwriter/Admin).
 *
 * Isolation rules:
 *  - Exactly one identity is active at a time.
 *  - EVERY identity switch (CNIC sign-in, admin login, or logout) purges
 *    ALL client storage (localStorage + sessionStorage) before writing the
 *    new session, so no data from a previous user can leak into the next.
 *  - Sign-out purges ALL client storage as well.
 *
 * ⚠️ Demo-only. In a real deployment the authenticator below must be replaced
 * with a server-side endpoint that returns a signed session token. The
 * browser bundle must never contain a copy of any real secret.
 */

import { SHARED_QUEUE_KEY } from '@/lib/sharedQueue';

export const SESSION_KEY = 'lendora_session';

export type UserRole = 'borrower' | 'underwriter';

export interface Session {
  /** Normalized 13-digit CNIC, e.g. "3520212345671" */
  cnic: string;
  /** Display name, e.g. session-provided name; for admin it is the admin label. */
  name: string;
  /** Epoch ms when the session started. */
  createdAt: number;
  /** Which portal owns the session. */
  role: UserRole;
}

/** Strip everything but digits, cap at 13 (PK CNIC length). */
export function normalizeCnic(input: string): string {
  return (input || '').replace(/\D/g, '').slice(0, 13);
}

/** Format raw digits as 35202-1234567-1 (progressive as the user types). */
export function formatCnic(input: string): string {
  const digits = normalizeCnic(input);
  const a = digits.slice(0, 5);
  const b = digits.slice(5, 12);
  const c = digits.slice(12, 13);
  return [a, b, c].filter(Boolean).join('-');
}

/** Masked display form: 35202-******-1 (CNIC) or an admin stub (admin ****). */
export function maskCnic(cnic: string, isAdmin = false): string {
  const digits = normalizeCnic(cnic);
  if (digits.length !== 13) return (isAdmin ? 'admin' : formatCnic(digits));
  return `${digits.slice(0, 5)}-******-${digits.slice(12)}`;
}

/** A valid PK CNIC is exactly 13 digits. */
export function isValidCnic(cnic: string): boolean {
  return normalizeCnic(cnic).length === 13;
}

/** Purge every trace of client-side state for the active (or previous) identity. */
export function clearAllClientStorage(): void {
  if (typeof window === 'undefined') return;

  // The shared loan queue is a cross-role workspace (borrower ↔ underwriter),
  // so it must survive an identity switch — otherwise a submission would vanish
  // the moment the next person signs in. Snapshot it, wipe, then restore.
  let preservedQueue: string | null = null;
  try {
    preservedQueue = window.localStorage.getItem(SHARED_QUEUE_KEY);
  } catch {
    preservedQueue = null;
  }

  try {
    window.localStorage.clear();
  } catch (error) {
    console.error('Failed to clear localStorage', error);
  }
  try {
    window.sessionStorage.clear();
  } catch (error) {
    console.error('Failed to clear sessionStorage', error);
  }

  if (preservedQueue !== null) {
    try {
      window.localStorage.setItem(SHARED_QUEUE_KEY, preservedQueue);
    } catch (error) {
      console.error('Failed to restore shared loan queue', error);
    }
  }
}

/** Read the active session, if any. Validates shape defensively. */
export function getSession(): Session | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Session>;
    if (
      !parsed ||
      typeof parsed.cnic !== 'string' ||
      !isValidCnic(parsed.cnic) ||
      (parsed.role !== 'borrower' && parsed.role !== 'underwriter')
    ) {
      window.localStorage.removeItem(SESSION_KEY);
      return null;
    }
    return {
      cnic: normalizeCnic(parsed.cnic),
      name: typeof parsed.name === 'string' ? parsed.name : '',
      createdAt: typeof parsed.createdAt === 'number' ? parsed.createdAt : Date.now(),
      role: parsed.role,
    };
  } catch (error) {
    console.error('Failed to read session', error);
    return null;
  }
}

/**
 * Start a session for `cnic` with a specific role. If a different identity
 * was already signed in, ALL client storage + cached context state is purged
 * first — a hard isolation boundary between borrowers and between each admin.
 */
export function startSession(cnic: string, name = '', role: UserRole = 'borrower'): Session {
  if (role !== 'borrower' && role !== 'underwriter') {
    throw new Error(`Invalid role: ${role}. Expected 'borrower' or 'underwriter'.`);
  }
  const session: Session = {
    cnic: normalizeCnic(cnic),
    name: name.trim(),
    createdAt: Date.now(),
    role,
  };
  if (typeof window !== 'undefined') {
    clearAllClientStorage();
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }
  return session;
}

/** Sign out: purge everything (storage + any cached state rehydrates empty). */
export function endSession(): void {
  clearAllClientStorage();
}

/** Backward-compatible aliases used by the existing layout components. */
export function getAuthToken(): string | null {
  return getSession() ? 'active' : null;
}

export function clearAuthToken(): void {
  endSession();
}

// Default export for the legacy `import { ... } from '@/lib/auth'`
export default { normalizeCnic, formatCnic, maskCnic, isValidCnic, clearAllClientStorage, getSession, startSession, endSession, getAuthToken, clearAuthToken };
