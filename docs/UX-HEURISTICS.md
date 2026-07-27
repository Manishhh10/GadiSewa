# UX Principles in GadiSewa: Nielsen's 10 Heuristics + 10 Laws of UX

This document maps each principle to concrete, working implementation in this
codebase — not aspirational design intent. Every claim below points at a real
file. Where a principle is only partially satisfied, that's stated explicitly
rather than glossed over.

---

## Part 1 — Nielsen's 10 Usability Heuristics

### 1. Visibility of system status
Every async action gives immediate, honest feedback instead of failing silently:
- A global toast system (`frontend/src/lib/toast/ToastContext.tsx`) confirms
  or reports the outcome of every mutating action — approve/reject a vendor
  application, verify a listing, resolve a dispute, accept/decline/complete a
  booking, save/delete a vehicle, cancel a booking. See the `act()` handler in
  `frontend/src/app/vendor/page.tsx` or `resolve()` in
  `frontend/src/app/admin/disputes/page.tsx`.
- Buttons disable and show inline spinners during requests
  (`Button.tsx`'s `loading` prop; `disabled={actingOn === id}` patterns
  throughout the vendor/admin dashboards) so a click never appears to do
  nothing.
- The eSewa payment flow ends on a dedicated status page
  (`app/booking/[id]/success/page.tsx`) that re-fetches the booking from the
  server rather than trusting client state, so "payment successful" is only
  ever shown once the backend has verified it.

### 2. Match between system and the real world
- Currency is always formatted as Nepali Rupees via `rs()`
  (`frontend/src/lib/format.ts`), not raw numbers.
- The payment gateway is eSewa — the payment method Nepali users actually
  recognize — not a generic/unfamiliar card form
  (`backend/src/utils/esewa.ts`, `app/booking/[id]/payment/page.tsx`).
- Full English/Nepali bilingual support via `frontend/src/lib/i18n/` reflects
  the real language mix of the target market, not just an English-only app
  with a decorative toggle.
- Vendor identity verification asks for a real Nepali government ID type
  (citizenship, passport, or National ID) — see the upload copy in
  `app/vendor/apply/page.tsx`.

### 3. User control and freedom
- Destructive actions are confirmable and reversible where it matters:
  deleting a vehicle or cancelling a booking asks for confirmation
  (`window.confirm` in `app/vendor/vehicles/page.tsx`, `app/bookings/page.tsx`)
  before committing.
- Booking cancellation is a first-class, always-visible action while a
  booking is still `pending`/`confirmed` (`canCancel` in
  `app/bookings/page.tsx`), not something buried in a settings menu.
- Edit flows (`EditVehicleCard` in `app/vendor/vehicles/page.tsx`) always
  pair Save with a Cancel that discards the draft and returns to the list.

### 4. Consistency and standards
- A single shared `ApplicationActions` component
  (`frontend/src/components/admin/ApplicationActions.tsx`) now drives vendor
  application approve/reject everywhere it appears — `admin/page.tsx` and
  `admin/applications/page.tsx` used to have two different UIs (one
  `window.prompt`-based, one an inline form) for the same action. That
  inconsistency was a direct heuristic violation and has been fixed.
- Status badges use the same color language platform-wide: tertiary/green for
  positive states (verified, approved, resolved), error/red for negative
  ones, primary for pending — see `statusStyle`/`badge` maps repeated across
  `app/bookings/page.tsx`, `app/admin/applications/page.tsx`,
  `app/admin/disputes/page.tsx`.
- One design-token system (`font-headline-*`, `font-body-*`, `font-label-*`,
  the `surface`/`primary`/`tertiary`/`error` color roles) is used everywhere;
  no page invents its own type scale or palette.

### 5. Error prevention
- The backend rejects overlapping bookings for the same vehicle before they
  can ever be created (`createBooking` in
  `backend/src/controllers/booking.controller.ts`), rather than letting a
  double-booking happen and requiring manual cleanup.
- Role-gated routes (`requireRole()` in
  `backend/src/middlewares/auth.middleware.ts`) prevent a renter from ever
  reaching an admin/vendor action in the first place, rather than showing the
  UI and failing after the fact.
- The vendor application form disables submission until a government ID is
  attached (`if (!documentUrl) { setError(...) }` in
  `app/vendor/apply/page.tsx`), and the damage checklist's Submit button
  stays disabled until every section is answered (`disabled={completed !==
  CATEGORIES.length}` in `app/damage-checklist/page.tsx`).
- eSewa payment callbacks are signature-verified server-side
  (`backend/src/utils/esewa.ts`) so a forged success redirect cannot mark a
  booking paid.

**Known gap:** most text forms (vehicle details, issue reports) validate only
on submit, not per-field as the user types. Acceptable for this scope, but a
real next step.

### 6. Recognition rather than recall
- Vendor application status is shown immediately on `/vendor/apply` if one
  already exists, instead of making the user remember whether they applied.
- A Navbar badge now marks the "Vendors" link whenever the logged-in renter
  has a pending application (`frontend/src/components/layout/Navbar.tsx`),
  and the vendor dashboard shows a banner whenever any of the vendor's own
  vehicles are still awaiting admin verification
  (`app/vendor/page.tsx`) — both were previously invisible unless the user
  happened to click back into the exact page that showed the status.
- Every admin sub-page carries a "← Admin Dashboard" breadcrumb
  (`app/admin/applications/page.tsx`, `app/admin/listings/page.tsx`,
  `app/admin/disputes/page.tsx`) so users always see where they are instead
  of having to recall the nav structure.

### 7. Flexibility and efficiency of use
- The renter price filter accepts direct numeric min/max entry in addition
  to the slider (`app/dashboard/page.tsx`) — power users who know exactly
  what they want don't have to drag a slider pixel-by-pixel.
- The language toggle (`Navbar.tsx`'s `toggleLocale`) is a single click
  reachable from every page, not buried in a settings page.
- Search accepts free-text location plus explicit date range simultaneously
  (`components/home/Hero.tsx` → `app/dashboard/page.tsx`), so an experienced
  user can jump straight to filtered results instead of browsing then
  filtering in two separate steps.

### 8. Aesthetic and minimalist design
- The add-vehicle form now shows a plain 3-item completion checklist
  (Photos / Details / Location) reflecting the form's real structure,
  replacing a fake 5-step wizard graphic (`Documents`, `Review`) that
  implied steps and a linear flow that didn't exist
  (`app/vendor/add-vehicle/page.tsx`).
- The vendor dashboard's "Quality Report" panel now shows only two real,
  computed numbers (average rating, completed trips) instead of a fabricated
  "98% Response Rate" metric that added visual noise without truth.

### 9. Help users recognize, diagnose, and recover from errors
- Toast and inline error banners surface the backend's actual message
  (`NormalizedError.message`, e.g. `frontend/src/lib/axios.ts`'s interceptor)
  rather than a generic "Something went wrong."
- A rejected vendor application shows the admin's specific rejection reason
  back to the applicant, with an explicit "you can address this and re-apply"
  path (`app/vendor/apply/page.tsx`), instead of a bare "rejected" status
  with no recovery route.
- Forms that depend on route state handle the missing-state case explicitly
  — e.g. `app/damage-checklist/page.tsx` shows "No trip selected. Open this
  checklist from your active trip" with a working link, rather than crashing
  or silently doing nothing.

### 10. Help and documentation
`app/help/page.tsx` is a Help Center with an FAQ accordion covering booking,
payment, cancellation, becoming a vendor, in-trip issues, language
switching, profile editing, and reviews. It's reachable from a persistent
help icon in `Navbar.tsx` (desktop and mobile, visible regardless of login
state) and from the footer's "Contact Support" link
(`Footer.tsx`). The eSewa payment step links directly to the relevant FAQ
entry (`/help#payment`) rather than leaving the single most likely point of
user confusion unaddressed. This was previously the one heuristic with no
real implementation; it now has one, closing the last gap in this
document.

---

## Part 2 — 10 Laws of UX (lawsofux.com)

### Jakob's Law
*Users spend most of their time on other sites/apps and expect yours to work the same way.*
Fixed directly this pass: the two divergent approve/reject UIs (prompt-based
vs. inline form) were unified into one `ApplicationActions` component so the
same action always looks and behaves the same way everywhere it appears.
Booking status badges, card layouts, and the confirm-before-destroy pattern
are otherwise kept consistent with common e-commerce/marketplace
conventions (status chips, card grids, sticky nav) rather than inventing
unfamiliar patterns.

### Fitts's Law
*The time to acquire a target is a function of its size and distance.*
The photo remove-button in `ImageUploader.tsx` was a 28px target visible only
on `:hover` — unusable on any touch device, since touch has no hover state.
It's now a persistent 40px target with no hover-gating. Primary CTAs
throughout (`Button.tsx`) use generous `px-6 py-3`/`py-4` padding, and
mobile nav/menu targets follow the same sizing.

### Hick's Law
*The time to make a decision increases with the number and complexity of choices.*
The add-vehicle page previously displayed a 5-step stepper (`Photos,
Documents, Details, Location, Review`) for what is actually one scrolling
3-section form — implying decision points and a linear flow that didn't
exist, which is pure extraneous cognitive load. Replaced with a 3-item
completion checklist that matches the form's real structure
(`app/vendor/add-vehicle/page.tsx`).

### Miller's Law
*The average person can keep about 7 (±2) items in working memory.*
Primary navigation is deliberately kept to 3 top-level links
(Renters/Vendors/Admin, `Navbar.tsx`) plus profile actions. Dashboard stat
grids are grouped into small sets of 4–5 `StatCard`s
(`app/admin/page.tsx`, `app/vendor/page.tsx`) rather than one long list of
every possible metric. Vehicle filters on `app/dashboard/page.tsx` expose a
small, fixed set of facets (type, price, location, dates) instead of an
open-ended filter builder.

### Aesthetic-Usability Effect
*Users perceive aesthetically pleasing designs as more usable.*
A single Material-inspired design-token system (`font-headline-*`,
`font-body-*`, `font-label-*` type scale; `primary`/`tertiary`/`error`
color roles; consistent `rounded-xl`/`rounded-lg` radii and shadow scale)
is applied uniformly across every page, rather than each page having its
own ad-hoc styling — this consistency is itself what makes the app read as
polished.

### Peak-End Rule
*People judge an experience by its peak moment and how it ends, not the average.*
The booking flow's end state (`app/booking/[id]/success/page.tsx`) is
deliberately the strongest moment in the app: a large success icon, the
confirmed amount paid, booking reference, full trip summary and a real
transaction ID — pulled fresh from the server rather than assumed from
client state, so the peak feels earned and trustworthy rather than
decorative.

### Von Restorff Effect (Isolation Effect)
*The item that differs from its surroundings is the one remembered.*
"Verified" badges use a distinct tertiary/green treatment against an
otherwise neutral card (`app/admin/listings/page.tsx`,
`app/booking/[id]/success/page.tsx`) so trust signals stand out at a glance.
Destructive actions (Delete, Reject, Cancel) are consistently rendered in
the `error` color against otherwise neutral button rows, so the one
irreversible option is visually distinct from safe ones.

### Serial Position Effect
*Users best remember the first and last items in a series.*
In booking/vehicle cards, the primary action (View Details / Save) is
always placed last in the action row — the position most likely to be
acted on — while destructive/secondary actions (Cancel, Delete) sit before
it, not after (`app/bookings/page.tsx`, `app/vendor/vehicles/page.tsx`).
Vendor dashboard stat cards lead with the two numbers vendors check most
(Total Vehicles, Active Bookings) and end with Avg Rating, the number
they're most likely to want to end their scan on.

### Law of Proximity
*Objects near each other are perceived as related.*
Form fields are grouped by real-world relationship, not by field type —
e.g. phone and vehicle-count sit in one grouped grid row in
`app/vendor/apply/page.tsx`, and vehicle name/type/rate are grouped in
`app/vendor/add-vehicle/page.tsx`, while unrelated sections (Photos,
Details, Location) are separated into distinct bordered cards rather than
one continuous field list.

### Zeigarnik Effect
*People remember interrupted or incomplete tasks better than completed ones.*
This was a real, previously-unaddressed gap: a renter who applied to become
a vendor, or a vendor whose new listing was awaiting review, had no
reminder anywhere except the exact page that showed status — easy to
forget about entirely. Fixed with two persistent, ambient indicators: a
Navbar badge on the Vendors link while an application is pending
(`components/layout/Navbar.tsx`), and a banner on the vendor dashboard
listing exactly which vehicles are still awaiting admin verification
(`app/vendor/page.tsx`) — both visible without navigating back into the
one page that used to hold that state.

---

## Summary of code changes this pass

| Area | File(s) | Principle(s) addressed |
|---|---|---|
| Toast system | `lib/toast/ToastContext.tsx`, `store/provider.tsx` | Nielsen #1 |
| Toasts wired into actions | `admin/page.tsx`, `admin/disputes/page.tsx`, `admin/listings/page.tsx`, `vendor/page.tsx`, `vendor/vehicles/page.tsx`, `bookings/page.tsx` | Nielsen #1, #9 |
| Unified reject UI | `components/admin/ApplicationActions.tsx` | Nielsen #4, Jakob's Law |
| Bigger, always-visible remove-photo target | `components/vehicle/ImageUploader.tsx` | Fitts's Law |
| Honest section checklist instead of fake stepper | `vendor/add-vehicle/page.tsx` | Nielsen #8, Hick's Law |
| Removed fabricated "98% response rate" stat | `vendor/page.tsx` | Nielsen #8 (honesty/minimalism) |
| Pending-status Navbar badge + vendor dashboard banner | `components/layout/Navbar.tsx`, `vendor/page.tsx` | Nielsen #6, Zeigarnik Effect |
| Help Center (FAQ) + navbar/footer links + payment-step link | `app/help/page.tsx`, `components/layout/Navbar.tsx`, `components/layout/Footer.tsx`, `booking/[id]/payment/page.tsx` | Nielsen #10 |
