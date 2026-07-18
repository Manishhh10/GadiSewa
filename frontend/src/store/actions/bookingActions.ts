import { createAsyncThunk } from '@reduxjs/toolkit';
import { bookingApi } from '@/api/booking.api';
import { type NormalizedError } from '@/lib/axios';
import type { Booking, CreateBookingPayload } from '@/types/booking';

export const createBooking = createAsyncThunk<
  Booking,
  CreateBookingPayload,
  { rejectValue: string }
>('bookings/create', async (payload, { rejectWithValue }) => {
  try {
    return await bookingApi.create(payload);
  } catch (err) {
    return rejectWithValue((err as NormalizedError).message);
  }
});

export const fetchMyBookings = createAsyncThunk<
  Booking[],
  void,
  { rejectValue: string }
>('bookings/list', async (_, { rejectWithValue }) => {
  try {
    return await bookingApi.list();
  } catch (err) {
    return rejectWithValue((err as NormalizedError).message);
  }
});

export const fetchBookingById = createAsyncThunk<
  Booking,
  string,
  { rejectValue: string }
>('bookings/detail', async (id, { rejectWithValue }) => {
  try {
    return await bookingApi.detail(id);
  } catch (err) {
    return rejectWithValue((err as NormalizedError).message);
  }
});

export const payBooking = createAsyncThunk<Booking, string, { rejectValue: string }>(
  'bookings/pay',
  async (id, { rejectWithValue }) => {
    try {
      return await bookingApi.pay(id);
    } catch (err) {
      return rejectWithValue((err as NormalizedError).message);
    }
  }
);

export const fetchVendorBookings = createAsyncThunk<
  Booking[],
  void,
  { rejectValue: string }
>('bookings/vendorList', async (_, { rejectWithValue }) => {
  try {
    return await bookingApi.vendorList();
  } catch (err) {
    return rejectWithValue((err as NormalizedError).message);
  }
});

export const updateBookingStatus = createAsyncThunk<
  Booking,
  { id: string; status: string },
  { rejectValue: string }
>('bookings/updateStatus', async ({ id, status }, { rejectWithValue }) => {
  try {
    return await bookingApi.updateStatus(id, status);
  } catch (err) {
    return rejectWithValue((err as NormalizedError).message);
  }
});

export const cancelBooking = createAsyncThunk<Booking, string, { rejectValue: string }>(
  'bookings/cancel',
  async (id, { rejectWithValue }) => {
    try {
      return await bookingApi.cancel(id);
    } catch (err) {
      return rejectWithValue((err as NormalizedError).message);
    }
  }
);
