export interface VendorApplicationPayload {
  fullName: string;
  businessName: string;
  phone: string;
  vehicleCount: number;
  message?: string;
  documentUrl: string;
}

export interface VendorApplication extends VendorApplicationPayload {
  _id: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  createdAt: string;
}
