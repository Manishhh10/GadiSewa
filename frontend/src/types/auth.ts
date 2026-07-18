export type UserRole = 'renter' | 'vendor' | 'admin';

export interface User {
  id: string;
  email: string;
  username: string;
  fullName?: string;
  role: UserRole;
  emailVerified?: boolean;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

/** Standard response envelope returned by the backend. */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
