// ---------------------------------------------------------------------------
// Typed fetch wrapper for calling the Flask backend via the Next.js proxy.
// All /api/* requests are rewritten to http://localhost:5000/api/* by next.config.
// ---------------------------------------------------------------------------

const TOKEN_KEY = 'deskmate_token'

/** Read the stored JWT token from localStorage. */
export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(TOKEN_KEY)
}

/** Store the JWT token in localStorage. */
export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

/** Remove the stored JWT token. */
export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}

/** Build headers, including Authorization if a token is stored. */
function buildHeaders(extra: Record<string, string> = {}): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...extra,
  }
  const token = getToken()
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  return headers
}

/** Generic API error class with status and body. */
export class ApiError extends Error {
  status: number
  body: unknown

  constructor(status: number, body: unknown) {
    const msg = typeof body === 'object' && body !== null && 'error' in body
      ? (body as { error: string }).error
      : `Request failed with status ${status}`
    super(msg)
    this.name = 'ApiError'
    this.status = status
    this.body = body
  }
}

/** Internal fetch helper. Throws `ApiError` on non-2xx responses. */
async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const opts: RequestInit = {
    method,
    headers: buildHeaders(),
    credentials: 'include',
  }
  if (body !== undefined) {
    opts.body = JSON.stringify(body)
  }

  let url = path
  // Bypass Next.js proxy in development to avoid 30s/60s proxy timeouts on long-running AI tasks
  if (path.startsWith('/api/') && typeof window !== 'undefined') {
    url = `http://localhost:5000${path}`
  }

  const res = await fetch(url, opts)

  // Handle 204 No Content
  if (res.status === 204) return undefined as unknown as T

  const json = await res.json().catch(() => null)

  if (!res.ok) {
    throw new ApiError(res.status, json)
  }

  return json as T
}

// ---------------------------------------------------------------------------
// Public helpers
// ---------------------------------------------------------------------------

export function apiGet<T>(path: string): Promise<T> {
  return request<T>('GET', path)
}

export function apiPost<T>(path: string, body?: unknown): Promise<T> {
  return request<T>('POST', path, body)
}

export function apiPut<T>(path: string, body?: unknown): Promise<T> {
  return request<T>('PUT', path, body)
}

export function apiDelete<T>(path: string): Promise<T> {
  return request<T>('DELETE', path)
}
