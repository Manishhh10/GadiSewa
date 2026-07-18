import { createSlice } from '@reduxjs/toolkit';
import {
  deleteVehicle,
  fetchMyVehicles,
  fetchVehicleById,
  fetchVehicles,
  updateVehicle,
} from '../actions/vehicleActions';
import type { Vehicle } from '@/types/vehicle';

interface VehicleState {
  items: Vehicle[];
  loading: boolean;
  error: string | null;
  // single vehicle (details page)
  selected: Vehicle | null;
  selectedLoading: boolean;
  selectedError: string | null;
  // the current vendor's own listings
  mine: Vehicle[];
  mineLoading: boolean;
  mineError: string | null;
}

const initialState: VehicleState = {
  items: [],
  loading: false,
  error: null,
  selected: null,
  selectedLoading: false,
  selectedError: null,
  mine: [],
  mineLoading: false,
  mineError: null,
};

const vehicleSlice = createSlice({
  name: 'vehicles',
  initialState,
  reducers: {
    clearSelected: (state) => {
      state.selected = null;
      state.selectedError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // list
      .addCase(fetchVehicles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVehicles.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchVehicles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to load vehicles';
      })
      // single
      .addCase(fetchVehicleById.pending, (state) => {
        state.selectedLoading = true;
        state.selectedError = null;
        state.selected = null;
      })
      .addCase(fetchVehicleById.fulfilled, (state, action) => {
        state.selectedLoading = false;
        state.selected = action.payload;
      })
      .addCase(fetchVehicleById.rejected, (state, action) => {
        state.selectedLoading = false;
        state.selectedError = action.payload ?? 'Failed to load vehicle';
      })
      // mine
      .addCase(fetchMyVehicles.pending, (state) => {
        state.mineLoading = true;
        state.mineError = null;
      })
      .addCase(fetchMyVehicles.fulfilled, (state, action) => {
        state.mineLoading = false;
        state.mine = action.payload;
      })
      .addCase(fetchMyVehicles.rejected, (state, action) => {
        state.mineLoading = false;
        state.mineError = action.payload ?? 'Failed to load your vehicles';
      })
      // update
      .addCase(updateVehicle.fulfilled, (state, action) => {
        state.mine = state.mine.map((v) => (v._id === action.payload._id ? action.payload : v));
      })
      // delete
      .addCase(deleteVehicle.fulfilled, (state, action) => {
        state.mine = state.mine.filter((v) => v._id !== action.payload);
      });
  },
});

export const { clearSelected } = vehicleSlice.actions;
export default vehicleSlice.reducer;
