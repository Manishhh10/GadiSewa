import { NextFunction, Request, Response } from 'express';
import { Vehicle } from '../models/Vehicle';
import { AppError } from '../utils/AppError';

/**
 * GET /api/vehicles
 * Optional query: ?type=SUV  &featured=true  &q=scorpio
 */
export async function getVehicles(req: Request, res: Response, next: NextFunction) {
  try {
    const { type, featured, q } = req.query;
    const filter: Record<string, unknown> = {};

    if (type) filter.type = type;
    if (featured === 'true') filter.featured = true;
    if (q) filter.name = { $regex: String(q), $options: 'i' };

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
