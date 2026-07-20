import http from '@/lib/axios';
import { ENDPOINTS } from '@/constants/endpoints';
import type { ApiResponse } from '@/types/auth';
import type { VendorApplication, VendorApplicationPayload } from '@/types/vendor';

export const vendorApi = {
  apply: async (payload: VendorApplicationPayload): Promise<VendorApplication> => {
    const { data } = await http.post<ApiResponse<{ application: VendorApplication }>>(
      ENDPOINTS.VENDOR.APPLY,
      payload
    );
    return data.data.application;
  },

  myApplications: async (): Promise<VendorApplication[]> => {
    const { data } = await http.get<ApiResponse<{ applications: VendorApplication[] }>>(
      ENDPOINTS.VENDOR.APPLICATIONS
    );
    return data.data.applications;
  },
};
