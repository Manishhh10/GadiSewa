import type { Vehicle } from './vehicle';

export interface AdminUser {
  _id: string;
  username: string;
  email: string;
}

export interface AdminApplication {
  _id: string;
  fullName: string;
  businessName: string;
  phone: string;
  vehicleCount: number;
  message: string;
  /** Absent on applications submitted before this was required. */
  documentUrl?: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  createdAt: string;
  user: AdminUser | null;
}

export type AdminVehicle = Vehicle & { owner?: AdminUser | null };
