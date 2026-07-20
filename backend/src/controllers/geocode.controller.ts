import { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/AppError';

// OpenStreetMap's Nominatim usage policy requires a descriptive User-Agent
// identifying the application — proxying through the backend (rather than
// calling it directly from the browser) lets us set that properly and keep
// the free geocoder's usage terms in one place.
const NOMINATIM_BASE = 'https://nominatim.openstreetmap.org';
const USER_AGENT = 'GadiSewa/1.0 (vehicle rental platform, Nepal)';

// Bias/limit results to Nepal, where this platform operates.
const NEPAL_VIEWBOX = 'countrycodes=np';

/** GET /api/geocode/search?q=Thamel,Kathmandu */
export async function geocodeSearch(req: Request, res: Response, next: NextFunction) {
  try {
    const q = String(req.query.q ?? '').trim();
    if (!q) throw new AppError('q is required', 400);

    const url = `${NOMINATIM_BASE}/search?format=json&limit=6&${NEPAL_VIEWBOX}&q=${encodeURIComponent(q)}`;
    const resp = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
    if (!resp.ok) throw new AppError('Location search is temporarily unavailable', 502);

    const results = (await resp.json()) as { display_name: string; lat: string; lon: string }[];
    res.json({
      success: true,
      message: 'Search results',
      data: {
        results: results.map((r) => ({
          address: r.display_name,
          latitude: Number(r.lat),
          longitude: Number(r.lon),
        })),
      },
    });
  } catch (err) {
    next(err);
  }
}

/** GET /api/geocode/reverse?lat=27.7&lng=85.3 */
export async function geocodeReverse(req: Request, res: Response, next: NextFunction) {
  try {
    const lat = Number(req.query.lat);
    const lng = Number(req.query.lng);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      throw new AppError('lat and lng are required', 400);
    }

    const url = `${NOMINATIM_BASE}/reverse?format=json&lat=${lat}&lon=${lng}`;
    const resp = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
    if (!resp.ok) throw new AppError('Reverse geocoding is temporarily unavailable', 502);

    const result = (await resp.json()) as { display_name?: string };
    res.json({
      success: true,
      message: 'Reverse geocode result',
      data: { address: result.display_name ?? `${lat.toFixed(5)}, ${lng.toFixed(5)}` },
    });
  } catch (err) {
    next(err);
  }
}
