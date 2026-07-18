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

---

## API

| Method | Endpoint             | Body                                          |
| ------ | -------------------- | --------------------------------------------- |
| GET    | `/api/health`        | —                                             |
| POST   | `/api/auth/register` | `{ email, username, password, confirmPassword }` |
| POST   | `/api/auth/login`    | `{ email, password }`                         |

Success envelope:

```json
{ "success": true, "message": "...", "data": { "token": "...", "user": { "id": "...", "email": "...", "username": "..." } } }
```

---

## Next steps (not yet built)
This is the **auth foundation**. The remaining 58 Stitch screens (home, vehicle
details, booking, eSewa payment, vendor + admin dashboards, etc.) can be added
screen-by-screen using the same layered pattern.
