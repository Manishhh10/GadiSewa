import { createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '@/api/auth.api';
import { TOKEN_KEY, type NormalizedError } from '@/lib/axios';
import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  User,
} from '@/types/auth';

// ============================================================
//  ACTIONS — bridge between the FORM (component) and the API.
// ============================================================

export const registerUser = createAsyncThunk<
  AuthResponse,
  RegisterPayload,
  { rejectValue: string }
>('auth/register', async (formData, { rejectWithValue }) => {
  try {
    const result = await authApi.register(formData);
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, result.token);
    }
    return result;
  } catch (err) {
    return rejectWithValue((err as NormalizedError).message);
  }
});

export const loginUser = createAsyncThunk<
  AuthResponse,
  LoginPayload,
  { rejectValue: string }
>('auth/login', async (formData, { rejectWithValue }) => {
  try {
    const result = await authApi.login(formData);
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, result.token);
    }
    return result;
  } catch (err) {
    return rejectWithValue((err as NormalizedError).message);
  }
});

// Rehydrate the logged-in user from the stored token on app load.
export const fetchMe = createAsyncThunk<User, void, { rejectValue: string }>(
  'auth/me',
  async (_, { rejectWithValue }) => {
    try {
      return await authApi.me();
    } catch (err) {
      return rejectWithValue((err as NormalizedError).message);
    }
  }
);
