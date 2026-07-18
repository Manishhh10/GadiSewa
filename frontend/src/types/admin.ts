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
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  user: AdminUser | null;
}

export type AdminVehicle = Vehicle & { owner?: AdminUser | null };
