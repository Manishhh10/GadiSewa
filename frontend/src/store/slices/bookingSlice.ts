import { createSlice } from '@reduxjs/toolkit';
import {
  cancelBooking,
  createBooking,
  fetchBookingById,
  fetchMyBookings,
  fetchVendorBookings,
  initiateEsewaPayment,
  updateBookingStatus,
} from '../actions/bookingActions';
import type { Booking } from '@/types/booking';

interface BookingState {
  items: Booking[]; // my bookings list (as a renter)
  current: Booking | null; // active booking (review / payment / success)
  vendorItems: Booking[]; // bookings for vehicles the current vendor owns
  vendorLoading: boolean;
  vendorError: string | null;
  loading: boolean; // list / detail fetches
  saving: boolean; // create / pay
  error: string | null;
}

const initialState: BookingState = {
  items: [],
  current: null,
  vendorItems: [],
  vendorLoading: false,
  vendorError: null,
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
      // initiate eSewa payment (redirects away from the app on success — no `current` update needed)
      .addCase(initiateEsewaPayment.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(initiateEsewaPayment.fulfilled, (state) => {
        state.saving = false;
      })
      .addCase(initiateEsewaPayment.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload ?? 'Could not start payment';
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
      })
      // vendor list
      .addCase(fetchVendorBookings.pending, (state) => {
        state.vendorLoading = true;
        state.vendorError = null;
      })
      .addCase(fetchVendorBookings.fulfilled, (state, action) => {
        state.vendorLoading = false;
        state.vendorItems = action.payload;
      })
      .addCase(fetchVendorBookings.rejected, (state, action) => {
        state.vendorLoading = false;
        state.vendorError = action.payload ?? 'Could not load bookings';
      })
      // vendor status update
      .addCase(updateBookingStatus.fulfilled, (state, action) => {
        state.vendorItems = state.vendorItems.map((b) =>
          b._id === action.payload._id ? action.payload : b
        );
      })
      // renter cancel
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.items = state.items.map((b) => (b._id === action.payload._id ? action.payload : b));
        if (state.current?._id === action.payload._id) state.current = action.payload;
      });
  },
});

export const { clearCurrent } = bookingSlice.actions;
export default bookingSlice.reducer;
