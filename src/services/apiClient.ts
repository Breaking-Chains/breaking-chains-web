import type { ApiResponse, ApiErrorResponse } from '../types/user';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export class ApiError extends Error {
  code: string;
  details?: Record<string, string>;

  constructor(message: string, code: string, details?: Record<string, string>) {
    super(message);
    this.code = code;
    this.details = details;
    this.name = 'ApiError';
  }
}

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('accessToken');
  const requestId = `req-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Request-ID': requestId,
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const json = await response.json();

    if (!response.ok || json.status === 'error') {
      const errorJson = json as ApiErrorResponse;
      throw new ApiError(
        errorJson.message || 'An unexpected error occurred',
        errorJson.code || `HTTP_${response.status}`,
        errorJson.details
      );
    }

    const successJson = json as ApiResponse<T>;
    return successJson.data;
  } catch (err: unknown) {
    if (err instanceof ApiError) {
      throw err;
    }
    throw new ApiError(
      err instanceof Error ? err.message : 'Network connection failed',
      'NETWORK_ERROR'
    );
  }
}
