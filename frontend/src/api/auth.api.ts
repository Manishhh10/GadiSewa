import http from '@/lib/axios';
import { ENDPOINTS } from '@/constants/endpoints';
import type {
  ApiResponse,
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  User,
} from '@/types/auth';

// ============================================================
//  API LAYER — knows WHAT to send and WHAT comes back.
//  → Maps to the "API" box in the diagram.
// ============================================================

export const authApi = {
  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const { data } = await http.post<ApiResponse<AuthResponse>>(
      ENDPOINTS.AUTH.REGISTER,
      payload
    );
    return data.data;
  },

  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const { data } = await http.post<ApiResponse<AuthResponse>>(
      ENDPOINTS.AUTH.LOGIN,
      payload
    );
    return data.data;
  },

  me: async (): Promise<User> => {
    const { data } = await http.get<ApiResponse<{ user: User }>>(ENDPOINTS.AUTH.ME);
    return data.data.user;
  },

  forgotPassword: async (email: string): Promise<string> => {
    const { data } = await http.post<ApiResponse<null>>(ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
    return data.message;
  },

  resetPassword: async (token: string, password: string): Promise<string> => {
    const { data } = await http.post<ApiResponse<null>>(ENDPOINTS.AUTH.RESET_PASSWORD, {
      token,
      password,
    });
    return data.message;
  },

  sendOtp: async (): Promise<string> => {
    const { data } = await http.post<ApiResponse<null>>(ENDPOINTS.AUTH.SEND_OTP);
    return data.message;
  },

  verifyOtp: async (code: string): Promise<string> => {
    const { data } = await http.post<ApiResponse<null>>(ENDPOINTS.AUTH.VERIFY_OTP, { code });
    return data.message;
  },
};
