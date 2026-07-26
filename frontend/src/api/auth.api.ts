import http from '@/lib/axios';
import { ENDPOINTS } from '@/constants/endpoints';
import type {
  ApiResponse,
  AuthResponse,
  ChangePasswordPayload,
  LoginPayload,
  RegisterPayload,
  UpdateProfilePayload,
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

  updateProfile: async (payload: UpdateProfilePayload): Promise<User> => {
    const { data } = await http.patch<ApiResponse<{ user: User }>>(
      ENDPOINTS.AUTH.UPDATE_ME,
      payload
    );
    return data.data.user;
  },

  changePassword: async (payload: ChangePasswordPayload): Promise<string> => {
    const { data } = await http.patch<ApiResponse<null>>(ENDPOINTS.AUTH.CHANGE_PASSWORD, payload);
    return data.message;
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
