import http from '@/lib/axios';
import { ENDPOINTS } from '@/constants/endpoints';
import type { ApiResponse } from '@/types/auth';
import type { Booking, CreateBookingPayload } from '@/types/booking';
import type { EsewaPaymentInit } from '@/types/payment';

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

  initiateEsewa: async (id: string): Promise<EsewaPaymentInit> => {
    const { data } = await http.post<ApiResponse<EsewaPaymentInit>>(
      ENDPOINTS.BOOKINGS.ESEWA_INITIATE(id)
    );
    return data.data;
  },

  vendorList: async (): Promise<Booking[]> => {
    const { data } = await http.get<ApiResponse<{ bookings: Booking[] }>>(
      ENDPOINTS.BOOKINGS.VENDOR
    );
    return data.data.bookings;
  },

  updateStatus: async (id: string, status: string): Promise<Booking> => {
    const { data } = await http.patch<ApiResponse<{ booking: Booking }>>(
      ENDPOINTS.BOOKINGS.STATUS(id),
      { status }
    );
    return data.data.booking;
  },

  cancel: async (id: string): Promise<Booking> => {
    const { data } = await http.patch<ApiResponse<{ booking: Booking }>>(
      ENDPOINTS.BOOKINGS.CANCEL(id)
    );
    return data.data.booking;
  },
};
