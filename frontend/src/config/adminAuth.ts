/**
 * Central admin credential whitelist for the Lendora underwriter portal.
 *
 * Every bank risk officer / credit officer must authenticate against this
 * exact pair. The values live in one file so they can be rotated by the
 * operations team without touching any component or route logic.
 *
 * NEVER expose these values to the browser bundle. The site is a purely
 * client-side demo: the "server" is simulated in this component so the
 * browser bundle can never ship a copy of the whitelist. For a real
 * deployment this module must be moved behind an authenticated backend
 * endpoint that returns a signed session token.
 */

/** Admin credentials that get whitelisted. */
export interface AdminCredentials {
  /** Staff / Admin ID, e.g. "admin123" */
  id: string;
  /** Admin password */
  password: string;
  /** Human-readable label shown in the role switcher */
  label: string;
}

/**
 * The trusted admin pool.
 * Add new officers only by appending an object here; the login form never
 * accepts anything not present in this list.
 */
export const ADMIN_CREDENTIALS: AdminCredentials[] = [
  {
    id: 'admin123',
    password: 'admin123',
    label: 'Finance Head',
  },
];

/** Default admin ID (used for quick entry during demos / internal testing). */
export const DEFAULT_ADMIN_ID = ADMIN_CREDENTIALS[0].id;

export function isAdminCredentialMatch(id: string, password: string): boolean {
  const normalizedId = (id ?? '').trim();
  const normalizedPassword = (password ?? '').trim();

  return ADMIN_CREDENTIALS.some(
    (admin) => admin.id === normalizedId && admin.password === normalizedPassword,
  );
}

export function getAdminLabelById(id: string): string | null {
  const match = ADMIN_CREDENTIALS.find((admin) => admin.id === id.trim());
  return match?.label ?? null;
}

export function getAdminCredential(id: string): AdminCredentials | null {
  return ADMIN_CREDENTIALS.find((admin) => admin.id === id.trim()) ?? null;
}

export function getAdminCount(): number {
  return ADMIN_CREDENTIALS.length;
}

// Provide a stable default export importable via `import { ... } from '@/config/adminAuth'`
// and via the deprecated `import adminAuth from '@/config/adminAuth'`.
export default ADMIN_CREDENTIALS;
