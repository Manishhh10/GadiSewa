import http from '@/lib/axios';
import { ENDPOINTS } from '@/constants/endpoints';
import type { ApiResponse } from '@/types/auth';
import type { Overview, VendorOverview } from '@/types/stats';

export const statsApi = {
  overview: async (): Promise<Overview> => {
    const { data } = await http.get<ApiResponse<{ stats: Overview }>>(
      ENDPOINTS.STATS.OVERVIEW
    );
    return data.data.stats;
  },

  vendorOverview: async (): Promise<VendorOverview> => {
    const { data } = await http.get<ApiResponse<{ stats: VendorOverview }>>(
      ENDPOINTS.STATS.VENDOR
    );
    return data.data.stats;
  },
};
