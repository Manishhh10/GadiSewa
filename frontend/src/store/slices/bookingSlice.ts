import { createSlice } from '@reduxjs/toolkit';
import {
  createBooking,
  fetchBookingById,
  fetchMyBookings,
  payBooking,
} from '../actions/bookingActions';
import type { Booking } from '@/types/booking';

interface BookingState {
  items: Booking[]; // my bookings list
  current: Booking | null; // active booking (review / payment / success)
  loading: boolean; // list / detail fetches
  saving: boolean; // create / pay
  error: string | null;
}

const initialState: BookingState = {
  items: [],
  current: null,
  loading: false,
  saving: false,
  error: null,
};

const bookingSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    clearCurrent: (state) => {
      state.current = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // create
      .addCase(createBooking.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.saving = false;
        state.current = action.payload;
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload ?? 'Could not create booking';
      })
      // pay
      .addCase(payBooking.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(payBooking.fulfilled, (state, action) => {
        state.saving = false;
        state.current = action.payload;
      })
      .addCase(payBooking.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload ?? 'Payment failed';
      })
      // detail
      .addCase(fetchBookingById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.current = null;
      })
      .addCase(fetchBookingById.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
      })
      .addCase(fetchBookingById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Booking not found';
      })
      // list
      .addCase(fetchMyBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchMyBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Could not load bookings';
      });
  },
});

export const { clearCurrent } = bookingSlice.actions;
export default bookingSlice.reducer;
