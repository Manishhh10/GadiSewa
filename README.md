# GadiSewa — Vehicle Booking Platform

Full-stack foundation for the GadiSewa vehicle booking platform (Nepal), built to the
layered architecture in the reference diagram.

**Stack**

| Layer    | Tech                                                        |
| -------- | ----------------------------------------------------------- |
| Frontend | Next.js 15 (App Router) · TypeScript · Tailwind CSS · Redux Toolkit · Axios |
| Backend  | Node.js · TypeScript · Express · Mongoose (MongoDB) · JWT · bcrypt |

The UI uses the **GadiSewa design system** ported from the Stitch export
(`stitch_gadisewa_vehicle_booking_platform/`): orange-led palette (`#ff6b00`),
Plus Jakarta Sans + Inter typography, card-based layout.

---

## How the code maps to the architecture diagram

```
 ┌─────────────┐   ACTIONS    ┌──────────────┐   API    ┌──────────────┐ ENDPOINTS ┌────────────┐
 │  COMPONENT  │ ───────────▶ │   ACTIONS    │ ───────▶ │     AXIOS    │ ────────▶ │  BACKEND   │
 │  (the form) │              │ (Redux thunk)│          │ (configured) │           │ :5001      │
 └─────────────┘   ◀───────── └──────────────┘ ◀─────── └──────────────┘           └────────────┘
```

| Diagram box                | File                                              | Responsibility |
| -------------------------- | ------------------------------------------------- | -------------- |
| **COMPONENT (form)**       | `frontend/src/components/auth/RegisterForm.tsx`, `LoginForm.tsx` | Collects form data, dispatches an action, reads result/loading/error from the store |
| **ACTIONS (Request Body)** | `frontend/src/store/actions/authActions.ts`       | Redux Toolkit async thunks — take FORM data in, push BACKEND data back to the component (via the slice) |
| **API**                    | `frontend/src/api/auth.api.ts`                    | Knows *what* to send and *what* comes back |
| **AXIOS (GET/POST/..)**    | `frontend/src/lib/axios.ts`                       | 1. BASEURL · 2. HEADERS · 3. INTERCEPTORS · 4. EXCEPTIONS |
| **ENDPOINTS**              | `frontend/src/constants/endpoints.ts`             | `LOGIN: /api/auth/login`, `REGISTER: /api/auth/register` |
| **BACKEND** (`:5001`)      | `backend/`                                         | Express + Mongoose REST API |

Supporting Redux pieces: `store/slices/authSlice.ts` (state), `store/store.ts`,
`store/hooks.ts`, `store/provider.tsx`.

---

## Project structure

```
gadisewa/
├── backend/                      # Node + Express + TS + Mongoose (port 5001)
│   ├── .env                      # PORT, MONGO_URI, JWT_SECRET, CLIENT_URL
│   └── src/
│       ├── index.ts              # express app + middleware
│       ├── config/{env,db}.ts
│       ├── models/User.ts        # email, username, password (hashed)
│       ├── controllers/auth.controller.ts   # register, login
│       ├── routes/{index,auth.routes}.ts
│       ├── middlewares/error.middleware.ts
│       └── utils/{jwt,AppError}.ts
│
└── frontend/                     # Next.js 15 (App Router) + Tailwind + RTK
    ├── tailwind.config.ts        # GadiSewa design tokens
    └── src/
        ├── app/
        │   ├── layout.tsx        # fonts + ReduxProvider
        │   ├── page.tsx          # landing page
        │   └── (auth)/{login,register}/page.tsx
        ├── components/{ui,auth}/
        ├── store/                # Redux Toolkit (ACTIONS + slice)
        ├── api/auth.api.ts       # API layer
        ├── lib/axios.ts          # AXIOS layer
        ├── constants/endpoints.ts
        └── types/auth.ts
```

---

## Getting started

### Prerequisites
- Node.js 18+
- A running MongoDB (local `mongod`, or set `MONGO_URI` to MongoDB Atlas)

### 1. Backend

```bash
cd backend
npm install
# make sure MongoDB is running (default: mongodb://127.0.0.1:27017/gadisewa)
npm run dev          # → http://localhost:5001  (health: /api/health)
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev          # → http://localhost:3000
```

Open <http://localhost:3000>, go to **Sign Up**, create an account, and you are
redirected home. The JWT is stored in `localStorage` and auto-attached to every
request by the axios interceptor.

Run `npm run seed` in `backend/` to populate sample vehicles and bootstrap an
admin account (`admin@gadisewa.com` / `Admin@12345` — change this before any
real deployment).

### Optional environment variables

- **eSewa payments**: works out of the box against eSewa's public UAT/sandbox
  merchant (`ESEWA_MERCHANT_CODE=EPAYTEST` etc. in `backend/.env.example`) —
  no setup needed, no real money moves. Pay with test ID `9711111111` /
  password `Nepal@123` / MPIN `1122`. Swap in real merchant credentials for
  production.
- **Email (password reset / OTP)**: set `SMTP_HOST`/`SMTP_PORT`/`SMTP_USER`/
  `SMTP_PASS`/`SMTP_FROM` in `backend/.env` (a Gmail "App Password" works).
  Without SMTP configured, emails are logged to the backend console instead
  of being sent — the rest of the app still works.

---

## Feature overview

- **Auth**: register/login, JWT + role (`renter`/`vendor`/`admin`) reissued
  live from the DB on every request, forgot-password + reset-password, email
  OTP verification — all via real email.
- **Vehicles**: search/filter by type, location, price range and date
  availability; vendors can create, edit and delete their own listings.
- **Bookings**: double-booking prevention, vendor accept/decline/complete
  with an enforced status-transition table, renter cancellation.
- **Payments**: real eSewa ePay v2 sandbox integration — signed redirect,
  signature-verified callback, idempotent.
- **Reviews**: renters review completed bookings; vehicle ratings are
  computed live; admins can hide/restore reviews.
- **Vendor tools**: apply → admin-approved → list vehicles → manage
  bookings, all backed by real endpoints.
- **Admin**: moderate vendor applications, vehicle listings, reviews, and
  disputes; a report-issue flow that auto-opens a dispute when it
  references a real booking; a damage checklist persisted per booking.
- **i18n**: English/Nepali toggle (persisted), covering the core
  renter/auth/booking flows.

## API

All endpoints are namespaced under `/api` and return the envelope:

```json
{ "success": true, "message": "...", "data": { ... } }
```

See `backend/src/routes/index.ts` for the full route map — `auth`,
`vehicles` (incl. `/mine`, `/:id/reviews`), `bookings` (incl. `/vendor`,
`/:id/status`, `/:id/cancel`, `/:id/checklist`, `/:id/esewa/initiate`),
`vendor`, `admin` (applications/vehicles/reviews/issues/disputes),
`reviews`, `payments/esewa/{success,failure}`, and `issues`.
