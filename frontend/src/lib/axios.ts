import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from 'axios';

// ============================================================
//  AXIOS  — one configured instance for the whole app.
//  → Maps to the "AXIOS (GET/POST/..)" box in the diagram:
//      1. BASEURL   2. HEADERS   3. INTERCEPTORS   4. EXCEPTIONS
// ============================================================

export const TOKEN_KEY = 'gadisewa_token';

/** Shape of an error after the response interceptor normalises it. */
export interface NormalizedError {
  message: string;
  status?: number;
}

// 1. BASEURL
const baseURL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5001';

const http: AxiosInstance = axios.create({
  baseURL,
  // 2. HEADERS
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// 3. INTERCEPTORS (request) — attach the auth token if present.
http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// 4. EXCEPTIONS (response) — normalise every error into { message, status }.
http.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    const status = error.response?.status;
    const message =
      error.response?.data?.message ??
      error.message ??
      'Something went wrong. Please try again.';

    // Auto clear the token on auth failure.
    if (status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
    }

    return Promise.reject({ message, status } as NormalizedError);
  }
);

export default http;
