/**
 * Frontend-only session helpers for the simulated auth flow.
 * No backend involvement: the token is a static mock value held in localStorage.
 */

export const AUTH_TOKEN_KEY = 'lendora_auth_token';
export const MOCK_AUTH_TOKEN = 'mock-jwt-token-123';

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setAuthToken(token: string): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function clearAuthToken(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(AUTH_TOKEN_KEY);
}
