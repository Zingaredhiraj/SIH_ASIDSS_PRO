export const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  let token: string | null = null;
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('access_token');
  }
  
  const headers = new Headers(options.headers || {});
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  headers.set('Content-Type', 'application/json');

  const res = await fetch(url, { ...options, headers });
  
  if (res.status === 401) {
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    throw new Error('Unauthorized');
  }

  if (!res.ok) {
    throw new Error(`API error: ${res.statusText}`);
  }

  return res.json();
}

export async function apiGet<T>(path: string): Promise<T> {
  return fetchWithAuth(`${API_BASE}${path}`, { method: 'GET' });
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  return fetchWithAuth(`${API_BASE}${path}`, {
    method: 'POST',
    body: JSON.stringify(body)
  });
}

export async function apiPut<T>(path: string, body: unknown): Promise<T> {
  return fetchWithAuth(`${API_BASE}${path}`, {
    method: 'PUT',
    body: JSON.stringify(body)
  });
}
