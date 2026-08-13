/**
 * Shared API client for talking to the Driver State Intelligence backend.
 *
 * Base URL resolution order:
 *   1. VITE_API_URL (set this in a .env file to point at a deployed backend)
 *   2. Falls back to the local backend dev server on port 3000.
 */
const API_BASE_URL: string =
  (import.meta.env.VITE_API_URL as string | undefined) || 'http://localhost:3000/api';

interface ApiEnvelope<T> {
  success: boolean;
  data?: T;
  message?: string;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  let response: Response;

  try {
    response = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      ...init,
    });
  } catch {
    throw new Error(`Unable to reach the API at ${url}. Is the backend server running?`);
  }

  let payload: ApiEnvelope<T> | undefined;
  try {
    payload = (await response.json()) as ApiEnvelope<T>;
  } catch {
    // Response wasn't valid JSON; fall through to status-based error handling below.
  }

  if (!response.ok || !payload?.success) {
    throw new Error(payload?.message || `Request to ${path} failed with status ${response.status}`);
  }

  return payload.data as T;
}

export const apiGet = <T>(path: string): Promise<T> => request<T>(path, { method: 'GET' });

export const apiPost = <T>(path: string, body?: unknown): Promise<T> =>
  request<T>(path, { method: 'POST', body: body !== undefined ? JSON.stringify(body) : undefined });