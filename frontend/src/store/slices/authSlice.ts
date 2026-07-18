import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { fetchMe, loginUser, registerUser } from '../actions/authActions';
import { TOKEN_KEY } from '@/lib/axios';
import type { AuthResponse, User } from '@/types/auth';

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      if (typeof window !== 'undefined') localStorage.removeItem(TOKEN_KEY);
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const onPending = (state: AuthState) => {
      state.loading = true;
      state.error = null;
    };
    const onFulfilled = (state: AuthState, action: PayloadAction<AuthResponse>) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
    };

    builder
      .addCase(registerUser.pending, onPending)
      .addCase(registerUser.fulfilled, onFulfilled)
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Registration failed';
      })
      .addCase(loginUser.pending, onPending)
      .addCase(loginUser.fulfilled, onFulfilled)
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Login failed';
      })
      // rehydrate
      .addCase(fetchMe.fulfilled, (state, action: PayloadAction<User>) => {
        state.user = action.payload;
      })
      .addCase(fetchMe.rejected, (state) => {
        state.user = null;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
