import http from '@/lib/axios';
import { ENDPOINTS } from '@/constants/endpoints';
import type { ApiResponse } from '@/types/auth';
import type { Booking } from '@/types/booking';
import type { ChecklistItem, Dispute, Issue } from '@/types/support';

export const issueApi = {
  create: async (payload: { category: string; description: string; bookingRef?: string }): Promise<Issue> => {
    const { data } = await http.post<ApiResponse<{ issue: Issue }>>(ENDPOINTS.ISSUES.CREATE, payload);
    return data.data.issue;
  },
  adminList: async (): Promise<Issue[]> => {
    const { data } = await http.get<ApiResponse<{ issues: Issue[] }>>(ENDPOINTS.ADMIN.ISSUES);
    return data.data.issues;
  },
};

export const disputeApi = {
  adminList: async (): Promise<Dispute[]> => {
    const { data } = await http.get<ApiResponse<{ disputes: Dispute[] }>>(ENDPOINTS.ADMIN.DISPUTES);
    return data.data.disputes;
  },
  resolve: async (id: string, resolution: 'refund_renter' | 'side_with_vendor'): Promise<Dispute> => {
    const { data } = await http.patch<ApiResponse<{ dispute: Dispute }>>(ENDPOINTS.ADMIN.DISPUTE(id), {
      resolution,
    });
    return data.data.dispute;
  },
};

export const checklistApi = {
  update: async (bookingId: string, items: ChecklistItem[]): Promise<Booking> => {
    const { data } = await http.patch<ApiResponse<{ booking: Booking }>>(ENDPOINTS.CHECKLIST(bookingId), {
      items,
    });
    return data.data.booking;
  },
};
