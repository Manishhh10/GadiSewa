import http from '@/lib/axios';
import { ENDPOINTS } from '@/constants/endpoints';
import type { ApiResponse } from '@/types/auth';
import type { Booking, CreateBookingPayload } from '@/types/booking';

// API LAYER for bookings (all endpoints require auth — token attached by axios).
export const bookingApi = {
  create: async (payload: CreateBookingPayload): Promise<Booking> => {
    const { data } = await http.post<ApiResponse<{ booking: Booking }>>(
      ENDPOINTS.BOOKINGS.CREATE,
      payload
    );
    return data.data.booking;
  },

  list: async (): Promise<Booking[]> => {
    const { data } = await http.get<ApiResponse<{ bookings: Booking[] }>>(
      ENDPOINTS.BOOKINGS.LIST
    );
    return data.data.bookings;
  },

  detail: async (id: string): Promise<Booking> => {
    const { data } = await http.get<ApiResponse<{ booking: Booking }>>(
      ENDPOINTS.BOOKINGS.DETAIL(id)
    );
    return data.data.booking;
  },

  pay: async (id: string): Promise<Booking> => {
    const { data } = await http.post<ApiResponse<{ booking: Booking }>>(
      ENDPOINTS.BOOKINGS.PAY(id)
    );
    return data.data.booking;
  },
};
