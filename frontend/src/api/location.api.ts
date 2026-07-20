import http from '@/lib/axios';
import { ENDPOINTS } from '@/constants/endpoints';
import type { ApiResponse } from '@/types/auth';
import type { GeocodeResult } from '@/types/location';

export const geocodeApi = {
  search: async (q: string): Promise<GeocodeResult[]> => {
    const { data } = await http.get<ApiResponse<{ results: GeocodeResult[] }>>(
      ENDPOINTS.GEOCODE.SEARCH,
      { params: { q } }
    );
    return data.data.results;
  },

  reverse: async (lat: number, lng: number): Promise<string> => {
    const { data } = await http.get<ApiResponse<{ address: string }>>(ENDPOINTS.GEOCODE.REVERSE, {
      params: { lat, lng },
    });
    return data.data.address;
  },
};

export const uploadApi = {
  images: async (files: File[]): Promise<string[]> => {
    const form = new FormData();
    files.forEach((f) => form.append('images', f));
    const { data } = await http.post<ApiResponse<{ urls: string[] }>>(
      ENDPOINTS.UPLOADS,
      form,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return data.data.urls;
  },
};
