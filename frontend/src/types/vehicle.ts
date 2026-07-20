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
  latitude?: number;
  longitude?: number;
  host?: Host;
  /** A plain user id in most contexts; populated with contact info on a booking's vehicle. */
  owner?: string | { _id: string; fullName?: string; phone?: string; email?: string };
}

export interface VehicleQuery {
  type?: string;
  featured?: boolean;
  q?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  pickupDate?: string;
  returnDate?: string;
}

export interface CreateVehiclePayload {
  name: string;
  type: VehicleType;
  dailyRate: number;
  description?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  images?: string[];
  seats?: string;
  transmission?: string;
  fuelType?: string;
}

export type UpdateVehiclePayload = Partial<CreateVehiclePayload>;
