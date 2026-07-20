import http from '@/lib/axios';
import { ENDPOINTS } from '@/constants/endpoints';
import type { ApiResponse } from '@/types/auth';
import type { AdminApplication, AdminVehicle } from '@/types/admin';

export const adminApi = {
  getApplications: async (status?: string): Promise<AdminApplication[]> => {
    const { data } = await http.get<ApiResponse<{ applications: AdminApplication[] }>>(
      ENDPOINTS.ADMIN.APPLICATIONS,
      { params: status ? { status } : undefined }
    );
    return data.data.applications;
  },

  updateApplication: async (
    id: string,
    status: 'approved' | 'rejected',
    reason?: string
  ): Promise<AdminApplication> => {
    const { data } = await http.patch<ApiResponse<{ application: AdminApplication }>>(
      ENDPOINTS.ADMIN.APPLICATION(id),
      { status, reason }
    );
    return data.data.application;
  },

  getVehicles: async (): Promise<AdminVehicle[]> => {
    const { data } = await http.get<ApiResponse<{ vehicles: AdminVehicle[] }>>(
      ENDPOINTS.ADMIN.VEHICLES
    );
    return data.data.vehicles;
  },

  verifyVehicle: async (id: string, verified: boolean): Promise<AdminVehicle> => {
    const { data } = await http.patch<ApiResponse<{ vehicle: AdminVehicle }>>(
      ENDPOINTS.ADMIN.VERIFY_VEHICLE(id),
      { verified }
    );
    return data.data.vehicle;
  },
};
