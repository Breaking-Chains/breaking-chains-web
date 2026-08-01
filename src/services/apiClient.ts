import type { ApiResponse, ApiErrorResponse } from '../types/user';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export class ApiError extends Error {
  code: string;
  status?: number;
  details?: Record<string, string>;

  constructor(message: string, code: string, details?: Record<string, string>, status?: number) {
    super(message);
    this.code = code;
    this.details = details;
    this.status = status;
    this.name = 'ApiError';
  }
}

export function formatApiErrorMessage(err: unknown): string {
  if (err instanceof ApiError) {
    if (err.details && Object.keys(err.details).length > 0) {
      const fieldErrors = Object.entries(err.details)
        .map(([field, msg]) => `${field}: ${msg}`)
        .join(' | ');
      return `${err.message || 'Validation failed'}: ${fieldErrors}`;
    }

    switch (err.code) {
      case 'INVALID_CREDENTIALS':
        return 'Incorrect email or password. Please check your credentials and try again.';
      case 'UNAUTHORIZED':
      case 'TOKEN_EXPIRED':
      case 'INVALID_REFRESH_TOKEN':
        return 'Your session has expired. Please sign in again to continue.';
      case 'FORBIDDEN':
        return 'You do not have permission to perform this action.';
      case 'USER_EXISTS':
        return 'An account with this email or username already exists.';
      case 'NOT_FOUND':
        return 'The requested resource was not found.';
      case 'VALIDATION_ERROR':
      case 'MALFORMED_JSON':
      case 'INVALID_PARAMETER':
        return err.message || 'Invalid data provided. Please verify your inputs.';
      case 'INTERNAL_SERVER_ERROR':
        return 'Server error. The server encountered an issue processing your request. Please try again shortly.';
      case 'NETWORK_ERROR':
        return 'Unable to connect to backend server. Please verify your connection or check if the server is running.';
      default:
        if (err.message && !err.message.includes('Unexpected token') && !err.message.includes('JSON')) {
          return err.message;
        }
        return `Request failed (${err.code || 'HTTP_' + (err.status || 500)}). Please try again.`;
    }
  }

  if (err instanceof Error) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      return 'Network Error: Cannot connect to the server. Please check your connection.';
    }
    if (err.message.includes('JSON') || err.message.includes('Unexpected token')) {
      return 'Server response error. The backend returned an unparseable response.';
    }
    return err.message;
  }

  return 'An unexpected error occurred. Please try again.';
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

    if (response.status === 204) {
      return {} as T;
    }

    let json: any;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      try {
        json = await response.json();
      } catch {
        throw new ApiError(
          `Server returned unparseable response (HTTP ${response.status})`,
          `HTTP_${response.status}`,
          undefined,
          response.status
        );
      }
    } else {
      const text = await response.text();
      if (!response.ok) {
        throw new ApiError(
          text || `Server error (HTTP ${response.status})`,
          `HTTP_${response.status}`,
          undefined,
          response.status
        );
      }
      return text as unknown as T;
    }

    if (!response.ok || json.status === 'error') {
      const errorJson = json as ApiErrorResponse;
      throw new ApiError(
        errorJson.message || `Request failed with status ${response.status}`,
        errorJson.code || `HTTP_${response.status}`,
        errorJson.details,
        response.status
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
