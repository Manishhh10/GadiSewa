export interface VehicleSpec {
  icon: string;
  label: string;
}

export interface Host {
  name: string;
  avatarUrl: string;
  verified: boolean;
  memberSince: string;
  responseRate: number;
  bookings: number;
}

export type VehicleType = 'Bike' | 'Car' | 'SUV' | 'Truck' | 'Van';

export interface Vehicle {
  _id: string;
  name: string;
  type: VehicleType;
  imageUrl: string;
  images: string[];
  rating: number;
  reviewsCount: number;
  conditionScore: number;
  dailyRate: number;
  verified: boolean;
  featured: boolean;
  description: string;
  specs: VehicleSpec[];
  location?: string;
  host?: Host;
}

export interface VehicleQuery {
  type?: string;
  featured?: boolean;
  q?: string;
}

export interface CreateVehiclePayload {
  name: string;
  type: VehicleType;
  dailyRate: number;
  description?: string;
  location?: string;
  imageUrl?: string;
  seats?: string;
  transmission?: string;
  fuelType?: string;
}
