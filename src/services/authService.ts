import { apiFetch } from './apiClient';
import type { User, AuthData } from '../types/user';

function extractAndStoreTokens(data: AuthData): void {
  const accessToken = data.tokens?.accessToken || (data as unknown as { accessToken?: string }).accessToken;
  const refreshToken = data.tokens?.refreshToken || (data as unknown as { refreshToken?: string }).refreshToken;

  if (accessToken) {
    localStorage.setItem('accessToken', accessToken);
  }
  if (refreshToken) {
    localStorage.setItem('refreshToken', refreshToken);
  }
}

export async function loginUser(email: string, password: string): Promise<AuthData> {
  const data = await apiFetch<AuthData>('/api/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  extractAndStoreTokens(data);
  return data;
}

export async function registerUser(
  email: string,
  password: string,
  fullName: string,
  username: string
): Promise<AuthData> {
  const data = await apiFetch<AuthData>('/api/v1/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, fullName, username }),
  });
  extractAndStoreTokens(data);
  return data;
}

export async function getCurrentUser(): Promise<User> {
  return apiFetch<User>('/api/v1/users/me', {
    method: 'GET',
  });
}
