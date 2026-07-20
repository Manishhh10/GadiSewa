import http from '@/lib/axios';
import { ENDPOINTS } from '@/constants/endpoints';
import type { ApiResponse } from '@/types/auth';
import type { CreateReviewPayload, Review } from '@/types/review';

// API LAYER for reviews.
export const reviewApi = {
  create: async (payload: CreateReviewPayload): Promise<Review> => {
    const { data } = await http.post<ApiResponse<{ review: Review }>>(
      ENDPOINTS.REVIEWS.CREATE,
      payload
    );
    return data.data.review;
  },

  forVehicle: async (vehicleId: string): Promise<Review[]> => {
    const { data } = await http.get<ApiResponse<{ reviews: Review[] }>>(
      ENDPOINTS.REVIEWS.FOR_VEHICLE(vehicleId)
    );
    return data.data.reviews;
  },
};
