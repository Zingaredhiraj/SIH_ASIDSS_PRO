import { apiGet, apiPost, API_BASE } from './client';
import { ApiResponse, User, Role, AuditLog } from '../types';

export async function login(email: string, password: string): Promise<{access_token: string; user: User}> {
  // Uses direct fetch because client.ts assumes token for auth
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Login failed');
  }
  return res.json();
}

export async function register(userData: {
  name?: string;
  email: string;
  password: string;
  role?: string;
  station?: string;
}): Promise<{ access_token: string; user: User; message: string }> {
  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Registration failed');
  }
  return res.json();
}

export async function fetchUsers(): Promise<ApiResponse<User[]>> {
  return apiGet<ApiResponse<User[]>>(`/api/admin/users`);
}

export async function fetchRoles(): Promise<ApiResponse<Role[]>> {
  return apiGet<ApiResponse<Role[]>>(`/api/admin/roles`);
}

export async function fetchAuditLog(params?: {limit?: number; action?: string}): Promise<ApiResponse<AuditLog[]>> {
  const query = new URLSearchParams();
  if (params?.limit) query.append('limit', params.limit.toString());
  if (params?.action) query.append('action', params.action);
  return apiGet<ApiResponse<AuditLog[]>>(`/api/admin/audit?${query.toString()}`);
}
