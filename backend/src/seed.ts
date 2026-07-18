import mongoose from 'mongoose';
import { connectDB } from './config/db';
import { Vehicle } from './models/Vehicle';
import { User } from './models/User';

const ADMIN_EMAIL = 'admin@gadisewa.com';
const ADMIN_PASSWORD = 'Admin@12345';

// Vehicle imagery reused from the Stitch design export.
const IMG = {
  suv: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAVrDiqaXfjG8O23oQYYH_3dOFdR2ODQAAfNKJULmJydBVNl4XzUjqhaY9sL0sCxkdWLRn8CHRLUvGF5jGBWuufHu1DWp0dzr3Imz2g-uFKez4VahqQ6P5b4shu3ZCPrVYxsHVUOSnm_6i7XBThAypNorN_SNsvrPxbJj2nYGFKDCAGUJzC6fag-VJnQ42Ot99btAFUCUtCAXyS6Bh3lpqmq_KZ27kPsQfUL0eAJme_as94NNGC385LXrkSJM4_5Xyw5boDE7gbiMQ',
  bike: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCD3rTLTQzm6ZwGf5Aljs6_jykRrPOYPMm5tnTjXJXxFySGjXjCz-CebcgACpTsrrWH0B3lhna6j3lO0zhZoA-HlKFgtI14fwzMOpWXMMZzaWUw4QJK1DxCSmbJAUozILnFfxRSz6NbIf4T3fNth5WPz52hAJ44Ou1934P0yMLlzqh0yFkgaGF-F7slLDZR4zrnI40K2fA7ga2VQb_8sNWf-T8-wy3UfH_J1YjkRQMl4N1NhIrbKqYgFX-FrVA0NWsO1GHZdf17M8k',
  van: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDIr_6cNRSCicxFAZRW06c61P4Zz0ZMzkvRUu7k4um61l9cygRnfkJYN6jW460ANrhIwRbszCG8vwkMe4EAE2ilgp8JMGPP8tQDS2-EyPtJEPwHU4KBO8nUH-IyXbSPLqr7YNQxh8IEqY5DC059Zv5WFQjWqTeMb91HDA6AF0xJrm44iK9WaYWtk-fmcWpn__rnjbTeVmhmhZTUABK5gCaq5b8iB-EKnMDyZb1zlp-piIxflzjq4-0PxtsXo-6oL7sg6Q1GwZV1JxA',
};

const avatar = (name: string) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=a04100&color=fff&size=128`;

const HOSTS = {
  rohan: { name: 'Rohan Shrestha', avatarUrl: avatar('Rohan Shrestha'), verified: true, memberSince: 'May 2021', responseRate: 98, bookings: 450 },
  sita: { name: 'Sita Gurung', avatarUrl: avatar('Sita Gurung'), verified: true, memberSince: 'Jan 2022', responseRate: 95, bookings: 210 },
  bikash: { name: 'Bikash Tamang', avatarUrl: avatar('Bikash Tamang'), verified: true, memberSince: 'Aug 2020', responseRate: 92, bookings: 320 },
};

const vehicles = [
  {
    name: 'Mahindra Scorpio S11',
    type: 'SUV',
    imageUrl: IMG.suv,
    rating: 4.8,
    reviewsCount: 124,
    conditionScore: 9.8,
    dailyRate: 8500,
    verified: true,
    featured: true,
    location: 'Lazimpat, Kathmandu',
    description:
      'A rugged and reliable 7-seater SUV, perfect for both city drives and mountain expeditions across Nepal. Spacious, powerful and well-maintained with full service history.',
    specs: [
      { icon: 'settings', label: 'Manual' },
      { icon: 'group', label: '7 Seats' },
      { icon: 'local_gas_station', label: 'Diesel' },
    ],
    host: HOSTS.rohan,
  },
  {
    name: 'Royal Enfield Classic 350',
    type: 'Bike',
    imageUrl: IMG.bike,
    rating: 4.9,
    reviewsCount: 88,
    conditionScore: 9.5,
    dailyRate: 2500,
    verified: true,
    featured: true,
    location: 'Lakeside, Pokhara',
    description:
      'The iconic Royal Enfield Classic 350 — built for the open road and the thrill of the ride. Ideal for touring Pokhara and the surrounding hills.',
    specs: [
      { icon: 'ev_station', label: 'Petrol' },
      { icon: 'speed', label: '350cc' },
    ],
    host: HOSTS.sita,
  },
  {
    name: 'Tata Winger (Commercial)',
    type: 'Van',
    imageUrl: IMG.van,
    rating: 4.7,
    reviewsCount: 56,
    conditionScore: 9.0,
    dailyRate: 12000,
    verified: false,
    featured: true,
    location: 'Balaju, Kathmandu',
    description:
      'A spacious 12-seater commercial van suited for group travel, corporate transport and cargo. Comfortable seating with ample luggage space.',
    specs: [
      { icon: 'inventory', label: '1.5 Ton' },
      { icon: 'group', label: '12 Seats' },
    ],
    host: HOSTS.bikash,
  },
  {
    name: 'Hyundai Creta',
    type: 'SUV',
    imageUrl: IMG.suv,
    rating: 4.6,
    reviewsCount: 73,
    conditionScore: 9.3,
    dailyRate: 7000,
    verified: true,
    featured: false,
    location: 'Jhamsikhel, Lalitpur',
    description:
      'A stylish and fuel-efficient compact SUV with automatic transmission. Smooth handling and a premium interior make it a favourite for city travel.',
    specs: [
      { icon: 'settings', label: 'Automatic' },
      { icon: 'group', label: '5 Seats' },
      { icon: 'local_gas_station', label: 'Petrol' },
    ],
    host: HOSTS.rohan,
  },
  {
    name: 'Yamaha FZ-S',
    type: 'Bike',
    imageUrl: IMG.bike,
    rating: 4.5,
    reviewsCount: 41,
    conditionScore: 8.9,
    dailyRate: 1500,
    verified: true,
    featured: false,
    location: 'Bhaktapur Durbar Square',
    description:
      'A nimble and economical 150cc commuter bike, great for navigating busy streets and short daily trips around the valley.',
    specs: [
      { icon: 'ev_station', label: 'Petrol' },
      { icon: 'speed', label: '150cc' },
    ],
    host: HOSTS.sita,
  },
  {
    name: 'Toyota Hiace',
    type: 'Van',
    imageUrl: IMG.van,
    rating: 4.8,
    reviewsCount: 96,
    conditionScore: 9.6,
    dailyRate: 10000,
    verified: true,
    featured: false,
    location: 'Thamel, Kathmandu',
    description:
      'A premium 14-seater tourist van with reclining seats and AC — the standard choice for comfortable long-distance group travel in Nepal.',
    specs: [
      { icon: 'group', label: '14 Seats' },
      { icon: 'inventory', label: '2 Ton' },
      { icon: 'local_gas_station', label: 'Diesel' },
    ],
    host: HOSTS.bikash,
  },
];

async function seed() {
  await connectDB();
  await Vehicle.deleteMany({});
  await Vehicle.insertMany(vehicles);
  console.log(`🌱  Seeded ${vehicles.length} vehicles`);

  let admin = await User.findOne({ email: ADMIN_EMAIL });
  if (!admin) {
    admin = await User.create({
      fullName: 'GadiSewa Admin',
      email: ADMIN_EMAIL,
      username: 'admin',
      password: ADMIN_PASSWORD,
      role: 'admin',
    });
    console.log(`🔑  Created admin account — email: ${ADMIN_EMAIL}  password: ${ADMIN_PASSWORD}`);
  } else if (admin.role !== 'admin') {
    admin.role = 'admin';
    await admin.save();
    console.log(`🔑  Promoted existing account ${ADMIN_EMAIL} to admin`);
  } else {
    console.log(`🔑  Admin account already exists — email: ${ADMIN_EMAIL}`);
  }

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
