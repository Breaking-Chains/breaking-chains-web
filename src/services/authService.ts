import { apiFetch } from './apiClient';
import type { User, AuthTokens } from '../types/user';

export async function loginUser(email: string, password: string): Promise<AuthTokens> {
  const data = await apiFetch<AuthTokens>('/api/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  if (data.accessToken) {
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
  }
  return data;
}

export async function registerUser(
  email: string,
  password: string,
  fullName: string,
  username: string
): Promise<AuthTokens> {
  const data = await apiFetch<AuthTokens>('/api/v1/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, fullName, username }),
  });
  if (data.accessToken) {
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
  }
  return data;
}

export async function getCurrentUser(): Promise<User> {
  return apiFetch<User>('/api/v1/users/me', {
    method: 'GET',
  });
}
