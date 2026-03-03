# ◈ SmartRent — Smart Vehicle Rental Management System

> Academic ISS Project — South Mediterranean University, MedTech  
> A full-stack web application for managing vehicle rentals with two rental models: instant self-service and admin-approved contracts.

🌐 **Live Demo:** [smart-vehicle-rental-system.vercel.app](https://smart-vehicle-rental-system.vercel.app)

---

## Overview

SmartRent is a vehicle rental platform built as part of the ISS curriculum. It supports two distinct rental workflows and enforces role-based access control throughout.

**Instant Rental** — The customer finds an available vehicle, starts the rental immediately, and ends it anywhere. Price is calculated per minute automatically.

**Contract Rental** — The customer submits a rental request for a specific date range. An admin reviews and approves or rejects the request. Price is calculated per day.

---

## Features

- JWT-based authentication with role-based access control (Visitor, Customer, Admin)
- Browse and filter available vehicles
- Start and end instant rentals in real time
- Submit contract rental requests with delivery location
- Admin dashboard: approve contracts, manage fleet, view all rentals
- Overlap detection to prevent double-booking
- Automatic price calculation for both rental types
- Deployed frontend on Vercel, backend-ready for Docker

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Vue 3 + Vite |
| Backend | Spring Boot (Java) |
| Database | MySQL with JPA / Hibernate |
| Authentication | JWT (JSON Web Tokens) |
| HTTP Client | Axios |
| Deployment | Vercel (frontend) + Docker (backend) |

---

## Project Structure
```
smart-vehicle-rental-system/
├── backend/                        # Spring Boot application
│   └── src/main/java/com/svrms/
│       ├── config/                 # JWT filter, Security config
│       ├── controller/             # REST API endpoints
│       ├── dto/                    # Request/Response DTOs
│       ├── entity/                 # JPA entities: User, Vehicle, Rental, Contract
│       ├── repository/             # Spring Data JPA repositories
│       └── service/                # Business logic
├── frontend/                       # Vue 3 application
│   └── src/
│       ├── router/                 # Vue Router with route guards
│       └── views/
│           ├── LoginView.vue       # Login and registration
│           ├── VehiclesView.vue    # Browse vehicles, start rentals
│           ├── RentalsView.vue     # Customer rental history
│           └── AdminView.vue       # Admin dashboard
├── docker-compose.yml
└── README.md
```

---

## API Endpoints

### Authentication
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register a new customer account |
| POST | `/api/auth/login` | Public | Login and receive JWT token |

### Vehicles
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/vehicles` | Public | Get all vehicles |
| POST | `/api/vehicles` | Admin | Add a new vehicle |
| PUT | `/api/vehicles/{id}` | Admin | Update vehicle details |
| DELETE | `/api/vehicles/{id}` | Admin | Delete a vehicle |

### Rentals
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/rentals` | Admin | Get all rentals (all users) |
| GET | `/api/rentals/my` | Customer | Get current user's rentals |
| POST | `/api/rentals/instant/start` | Customer | Start an instant rental |
| POST | `/api/rentals/instant/end/{id}` | Customer | End an active instant rental |
| POST | `/api/rentals/contract` | Customer | Submit a contract rental request |
| POST | `/api/rentals/contract/approve/{id}` | Admin | Approve a pending contract rental |

---

## User Roles

| Role | Permissions |
|---|---|
| **Visitor** | Browse vehicles only |
| **Customer** | Browse vehicles, start/end instant rentals, request contract rentals, view own history |
| **Admin** | All customer permissions + approve contracts, manage fleet, view all rentals |

---

## Running Locally

### Prerequisites
- Java 17+
- Node.js 20+
- MySQL 8+
- Maven

### Backend
```bash
# Clone the repository
git clone https://github.com/Kernel-Hunter/smart-vehicle-rental-system.git
cd smart-vehicle-rental-system

# Configure your database connection
# Edit: backend/src/main/resources/application.properties
# Set: spring.datasource.url, spring.datasource.username, spring.datasource.password

# Run the Spring Boot application
cd backend
mvn spring-boot:run
```
Backend runs at `http://localhost:8080`

### Frontend
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```
Frontend runs at `http://localhost:5173`

### Docker (Full Stack)
```bash
# From the repo root
docker-compose up --build
```

---

## Business Rules

- Only `AVAILABLE` vehicles can be rented
- A vehicle becomes `RENTED` when an instant rental starts, and returns to `AVAILABLE` when it ends
- Contract rentals start as `PENDING` and become `ACTIVE` only after admin approval
- Overlapping rentals are blocked — only `ACTIVE` and `PENDING` rentals block availability
- Instant rental price = duration in minutes × price per minute
- Contract rental price = number of days × price per day

---

## Team

| Name | Role |
|---|---|
| **Karim Masmoudi** | Full Stack Developer |
| **Bilel Didi** | Full Stack Developer |
| **Aziz Zemzmi** | Full Stack Developer |
| **Ahmed Tahri** | Full Stack Developer |

**Institution:** South Mediterranean University — MedTech  
**Program:** ISS — Ingénierie des Systèmes et des Services

---

## License

This project was developed for academic purposes as part of the ISS curriculum at MedTech, South Mediterranean University.
