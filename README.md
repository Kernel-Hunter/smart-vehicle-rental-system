# SmartRent 🚗

A two-sided vehicle rental marketplace built with Vue 3, Vuetify 3, and localStorage. No backend required — fully client-side.

**Live demo:** [smart-vehicle-rental-system.vercel.app](https://smart-vehicle-rental-system.vercel.app)

---

## Overview

SmartRent connects rental companies with customers through an interactive map interface. Companies list their vehicles; customers find and rent them instantly or via contract.

---

## Features

### Three User Roles

| Role | Access |
|---|---|
| **Visitor** | Browse the fleet and map without logging in |
| **Customer** | Rent vehicles (instant or contract), track rentals, manage profile |
| **Company** | Register fleet, approve contracts, view earnings dashboard |

### Core Functionality

- **Interactive Map** — fake SVG city grid with live vehicle markers, pulse animations, city filter (Tunis / Sousse / Sfax), and a sidebar detail panel
- **Two Rental Modes** — Instant Rental (pay by the minute) and Contract Rental (multi-day, requires company approval)
- **Company Dashboard** — KPI cards, animated earnings tracker, fleet management, rental approvals
- **Light / Dark Mode** — full theme toggle with glassmorphism navbar blur on scroll
- **Mobile Responsive** — bottom navigation bar on mobile with all routes including About

### UI & Animations

- Animated hero section with shifting gradient background
- Floating hero map card and earnings card
- Staggered fade-up on stat, step, and vehicle grid cards
- Pulse-glow effect on primary CTA buttons
- Shimmer sweep on the map preview
- Marker bounce-in animation on the map
- Slide-in animation on sidebar vehicle list items
- Scroll reveal on all section content
- Hover lift with teal-tinted shadow on all cards
- Underline slide on desktop nav links
- Button press micro-interaction

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Vue 3 (Options API) |
| UI Library | Vuetify 3 |
| Build Tool | Vite |
| Icons | Material Design Icons (`@mdi/font`) |
| Fonts | Cabinet Grotesk (headings) · Instrument Sans (body) |
| Data | localStorage (no backend) |
| Deployment | Vercel |

---

## Project Structure

```
frontend/
├── vercel.json
├── package.json
├── vite.config.js
└── src/
    ├── main.js                     # Vuetify theme setup (light/dark)
    ├── App.vue                     # Navbar, bottom nav, page transitions, global CSS
    ├── composables/
    │   └── useReveal.js            # IntersectionObserver scroll reveal
    ├── store/
    │   └── data.js                 # All data logic + localStorage CRUD
    ├── router/
    │   └── index.js                # 15 routes with role guards
    └── views/
        ├── HomeView.vue            # Hero, animated stats, how-it-works, CTA
        ├── LoginView.vue           # Customer login, company login, register
        ├── MapView.vue             # SVG map, markers, sidebar, rent from map
        ├── VehiclesView.vue        # Fleet grid with skeleton loading
        ├── VehicleDetailView.vue   # Price estimator, sticky action panel
        ├── RentalsView.vue         # Customer rental history
        ├── ProfileView.vue         # Edit account, rental stats
        ├── ContractDetailView.vue  # Contract progress stepper
        ├── RentalReceiptView.vue   # Completed rental receipt with print
        ├── CompanyDashboard.vue    # KPI cards, earnings, quick actions
        ├── CompanyVehicles.vue     # Add / edit / delete own vehicles
        ├── CompanyRentals.vue      # All rentals, approve contracts
        ├── AboutView.vue           # Tech stack, team cards
        └── NotFoundView.vue        # 404 page
```

---

## Getting Started

```bash
# Clone the repo
git clone https://github.com/Kernel-Hunter/smart-vehicle-rental-system.git
cd smart-vehicle-rental-system/frontend

# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

---

## Demo Credentials

### Customers
| Username | Password |
|---|---|
| karim | karim123 |
| bilel | bilel123 |
| aziz | aziz123 |
| ahmed | ahmed123 |

### Companies
| Username | Password |
|---|---|
| autoplus | company123 |
| drivefast | company123 |
| luxauto | company123 |

---

## Data & Storage

All data is stored in `localStorage` under these keys:

| Key | Contents |
|---|---|
| `sr_companies` | Company accounts and earnings |
| `sr_customers` | Customer accounts |
| `sr_vehicles` | Fleet with map coordinates and pricing (TND) |
| `sr_rentals` | All rental records |
| `sr_data_version` | Version key — bumped to wipe stale data on updates |
| `sr_theme` | User's last selected theme (light/dark) |

Session (clears on tab close): `sr_user` in `sessionStorage`.

> **Note:** Bumping `DATA_VERSION` in `data.js` wipes all localStorage on next load and reinitializes with fresh mock data. Use this whenever the data schema changes.

---

## Theme

### Light Mode
- Background: `#c8d6e5` (slate-300) — white cards visibly contrast
- Cards: `#ffffff` with `1.5px solid #94a3b8` border
- Text: `#0f172a` (slate-900)
- Accent: `#0d9488` (teal-600)

### Dark Mode
- Background: `#0a0f1e` (deep navy)
- Cards: `#111827` (gray-900)
- Text: `#f0f9ff`
- Accent: `#2dd4bf` (teal-300)

Vuetify's internal `--v-medium-emphasis-opacity` is forced to `1` in both themes to prevent text from being dimmed invisible.

---

## Team

Built as a university project at South Mediterranean University (MedTech).

| Name | Role |
|---|---|
| Karim Masmoudi | Lead Developer |
| Bilel Didi | Developer |
| Aziz Zemzmi | Developer |
| Ahmed Tahri | Developer |
