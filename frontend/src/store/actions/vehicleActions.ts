import { createAsyncThunk } from '@reduxjs/toolkit';
import { vehicleApi } from '@/api/vehicle.api';
import { type NormalizedError } from '@/lib/axios';
import type { UpdateVehiclePayload, Vehicle, VehicleQuery } from '@/types/vehicle';

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

// ACTION — fetch the current vendor's own vehicle listings.
export const fetchMyVehicles = createAsyncThunk<Vehicle[], void, { rejectValue: string }>(
  'vehicles/fetchMine',
  async (_, { rejectWithValue }) => {
    try {
      return await vehicleApi.mine();
    } catch (err) {
      return rejectWithValue((err as NormalizedError).message);
    }
  }
);

// ACTION — update one of the vendor's own vehicles.
export const updateVehicle = createAsyncThunk<
  Vehicle,
  { id: string; payload: UpdateVehiclePayload },
  { rejectValue: string }
>('vehicles/update', async ({ id, payload }, { rejectWithValue }) => {
  try {
    return await vehicleApi.update(id, payload);
  } catch (err) {
    return rejectWithValue((err as NormalizedError).message);
  }
});

// ACTION — delete one of the vendor's own vehicles.
export const deleteVehicle = createAsyncThunk<string, string, { rejectValue: string }>(
  'vehicles/delete',
  async (id, { rejectWithValue }) => {
    try {
      await vehicleApi.remove(id);
      return id;
    } catch (err) {
      return rejectWithValue((err as NormalizedError).message);
    }
  }
);
