import http from '@/lib/axios';
import { ENDPOINTS } from '@/constants/endpoints';
import type { ApiResponse } from '@/types/auth';
import type {
  CreateVehiclePayload,
  UpdateVehiclePayload,
  Vehicle,
  VehicleQuery,
} from '@/types/vehicle';

// API LAYER for vehicles.
export const vehicleApi = {
  list: async (params?: VehicleQuery): Promise<Vehicle[]> => {
    const { data } = await http.get<ApiResponse<{ vehicles: Vehicle[] }>>(
      ENDPOINTS.VEHICLES.LIST,
      { params }
    );
    return data.data.vehicles;
  },

  mine: async (): Promise<Vehicle[]> => {
    const { data } = await http.get<ApiResponse<{ vehicles: Vehicle[] }>>(
      ENDPOINTS.VEHICLES.MINE
    );
    return data.data.vehicles;
  },

  detail: async (id: string): Promise<Vehicle> => {
    const { data } = await http.get<ApiResponse<{ vehicle: Vehicle }>>(
      ENDPOINTS.VEHICLES.DETAIL(id)
    );
    return data.data.vehicle;
  },

  create: async (payload: CreateVehiclePayload): Promise<Vehicle> => {
    const { data } = await http.post<ApiResponse<{ vehicle: Vehicle }>>(
      ENDPOINTS.VEHICLES.CREATE,
      payload
    );
    return data.data.vehicle;
  },

  update: async (id: string, payload: UpdateVehiclePayload): Promise<Vehicle> => {
    const { data } = await http.patch<ApiResponse<{ vehicle: Vehicle }>>(
      ENDPOINTS.VEHICLES.UPDATE(id),
      payload
    );
    return data.data.vehicle;
  },

  remove: async (id: string): Promise<void> => {
    await http.delete<ApiResponse<{ id: string }>>(ENDPOINTS.VEHICLES.DELETE(id));
  },
};
