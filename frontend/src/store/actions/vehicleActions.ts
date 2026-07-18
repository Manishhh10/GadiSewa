import { createAsyncThunk } from '@reduxjs/toolkit';
import { vehicleApi } from '@/api/vehicle.api';
import { type NormalizedError } from '@/lib/axios';
import type { Vehicle, VehicleQuery } from '@/types/vehicle';

// ACTION — fetch the vehicle list (optionally filtered by type / search).
export const fetchVehicles = createAsyncThunk<
  Vehicle[],
  VehicleQuery | undefined,
  { rejectValue: string }
>('vehicles/fetch', async (params, { rejectWithValue }) => {
  try {
    return await vehicleApi.list(params);
  } catch (err) {
    return rejectWithValue((err as NormalizedError).message);
  }
});

// ACTION — fetch a single vehicle by id (for the details page).
export const fetchVehicleById = createAsyncThunk<
  Vehicle,
  string,
  { rejectValue: string }
>('vehicles/fetchById', async (id, { rejectWithValue }) => {
  try {
    return await vehicleApi.detail(id);
  } catch (err) {
    return rejectWithValue((err as NormalizedError).message);
  }
});
