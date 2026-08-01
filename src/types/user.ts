export interface User {
  id: string;
  email: string;
  fullName: string;
  username: string;
  authProvider?: string;
  createdAt: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface AuthData {
  user: User;
  tokens: TokenResponse;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  tokenType?: string;
  expiresInSeconds?: number;
  user?: User;
}

export interface ApiResponse<T> {
  status: 'success' | 'error';
  message?: string;
  data: T;
}

export interface ApiErrorResponse {
  status: 'error';
  code: string;
  message: string;
  details?: Record<string, string>;
}
