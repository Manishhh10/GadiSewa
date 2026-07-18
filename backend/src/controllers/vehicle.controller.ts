import { NextFunction, Request, Response } from 'express';
import { Vehicle } from '../models/Vehicle';
import { Booking } from '../models/Booking';
import { AppError } from '../utils/AppError';

const ACTIVE_BOOKING_STATUSES = ['pending', 'confirmed', 'active'];

/**
 * GET /api/vehicles
 * Optional query: ?type=SUV &featured=true &q=scorpio &location=Pokhara
 *                 &minPrice=1000 &maxPrice=9000 &pickupDate=...&returnDate=...
 */
export async function getVehicles(req: Request, res: Response, next: NextFunction) {
  try {
    const { type, featured, q, location, minPrice, maxPrice, pickupDate, returnDate } = req.query;
    const filter: Record<string, unknown> = {};

    if (type) filter.type = type;
    if (featured === 'true') filter.featured = true;
    if (q) filter.name = { $regex: String(q), $options: 'i' };
    if (location) filter.location = { $regex: String(location), $options: 'i' };
    if (minPrice || maxPrice) {
      filter.dailyRate = {
        ...(minPrice ? { $gte: Number(minPrice) } : {}),
        ...(maxPrice ? { $lte: Number(maxPrice) } : {}),
      };
    }

    // Exclude vehicles with an overlapping active booking for the requested date range.
    if (pickupDate && returnDate) {
      const start = new Date(String(pickupDate));
      const end = new Date(String(returnDate));
      const overlapping = await Booking.find({
        status: { $in: ACTIVE_BOOKING_STATUSES },
        pickupDate: { $lt: end },
        returnDate: { $gt: start },
      }).distinct('vehicle');
      if (overlapping.length > 0) {
        filter._id = { $nin: overlapping };
      }
    }

    const vehicles = await Vehicle.find(filter).sort({ featured: -1, rating: -1 });

    res.json({
      success: true,
      message: 'Vehicles fetched',
      data: { vehicles },
    });
  } catch (err) {
    next(err);
  }
}

/** GET /api/vehicles/mine  (protected) — vehicles owned by the current user */
export async function getMyVehicles(req: Request, res: Response, next: NextFunction) {
  try {
    const vehicles = await Vehicle.find({ owner: req.userId }).sort({ createdAt: -1 });
    res.json({ success: true, message: 'Your vehicles', data: { vehicles } });
  } catch (err) {
    next(err);
  }
}

/** GET /api/vehicles/:id */
export async function getVehicleById(req: Request, res: Response, next: NextFunction) {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) throw new AppError('Vehicle not found', 404);

    res.json({ success: true, message: 'Vehicle fetched', data: { vehicle } });
  } catch (err) {
    next(err);
  }
}

/** POST /api/vehicles  (protected) — list a new vehicle */
export async function createVehicle(req: Request, res: Response, next: NextFunction) {
  try {
    const {
      name,
      type,
      dailyRate,
      description,
      location,
      imageUrl,
      seats,
      transmission,
      fuelType,
    } = req.body;

    if (!name || !type || !dailyRate) {
      throw new AppError('name, type and dailyRate are required', 400);
    }

    const specs: { icon: string; label: string }[] = [];
    if (transmission) specs.push({ icon: 'settings', label: String(transmission) });
    if (seats) specs.push({ icon: 'group', label: `${seats} Seats` });
    if (fuelType) specs.push({ icon: 'local_gas_station', label: String(fuelType) });

    const vehicle = await Vehicle.create({
      name,
      type,
      dailyRate: Number(dailyRate),
      description: description || '',
      location: location || 'Kathmandu',
      imageUrl: imageUrl || '',
      specs,
      owner: req.userId,
      verified: false,
      featured: false,
    });

    res.status(201).json({ success: true, message: 'Vehicle listed', data: { vehicle } });
  } catch (err) {
    next(err);
  }
}

function assertOwnerOrAdmin(req: Request, ownerId: unknown) {
  const isOwner = ownerId && String(ownerId) === req.userId;
  const isAdmin = req.userRole === 'admin';
  if (!isOwner && !isAdmin) {
    throw new AppError('You do not have permission to modify this vehicle', 403);
  }
}

/** PATCH /api/vehicles/:id  (protected, owner or admin) */
export async function updateVehicle(req: Request, res: Response, next: NextFunction) {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) throw new AppError('Vehicle not found', 404);
    assertOwnerOrAdmin(req, vehicle.owner);

    const {
      name,
      type,
      dailyRate,
      description,
      location,
      imageUrl,
      seats,
      transmission,
      fuelType,
    } = req.body;

    if (name !== undefined) vehicle.name = name;
    if (type !== undefined) vehicle.type = type;
    if (dailyRate !== undefined) vehicle.dailyRate = Number(dailyRate);
    if (description !== undefined) vehicle.description = description;
    if (location !== undefined) vehicle.location = location;
    if (imageUrl !== undefined) vehicle.imageUrl = imageUrl;

    if (seats !== undefined || transmission !== undefined || fuelType !== undefined) {
      const specs: { icon: string; label: string }[] = [];
      if (transmission) specs.push({ icon: 'settings', label: String(transmission) });
      if (seats) specs.push({ icon: 'group', label: `${seats} Seats` });
      if (fuelType) specs.push({ icon: 'local_gas_station', label: String(fuelType) });
      vehicle.specs = specs;
    }

    await vehicle.save();
    res.json({ success: true, message: 'Vehicle updated', data: { vehicle } });
  } catch (err) {
    next(err);
  }
}

/** DELETE /api/vehicles/:id  (protected, owner or admin) */
export async function deleteVehicle(req: Request, res: Response, next: NextFunction) {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) throw new AppError('Vehicle not found', 404);
    assertOwnerOrAdmin(req, vehicle.owner);

    await vehicle.deleteOne();
    res.json({ success: true, message: 'Vehicle deleted', data: { id: req.params.id } });
  } catch (err) {
    next(err);
  }
}
