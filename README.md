# CampusLedger — MERN Student Management System

Full-stack student management app built with **MongoDB, Express, React, and Node.js**.

Brand name: **CampusLedger**

---

## Features

- JWT authentication (register / login / logout)
- Role-based access: `admin`, `teacher`, `student`
- Student CRUD (search, filter, pagination)
- Course catalog CRUD
- Dashboard stats by department
- Seed data for instant demo
- Postman collection for API testing

---

## Architecture

```text
React (Vite + TypeScript)
        ↓  REST / JSON + JWT
Express API (TypeScript)
        ↓  Mongoose
MongoDB
```

```mermaid
flowchart LR
  Browser[React Frontend] --> API[Express API]
  API --> Auth[JWT Middleware]
  Auth --> Services[Services]
  Services --> Mongo[(MongoDB)]
```

---

## Project structure

```text
mern-student-management/
├── backend/          # Express + MongoDB API
├── frontend/         # React + Vite UI
├── postman/          # API collection
└── README.md
```

### Backend folders

| Folder | Responsibility |
|--------|----------------|
| `config/` | Env + DB connection |
| `models/` | Mongoose schemas |
| `routes/` | URL → controller mapping |
| `controllers/` | HTTP request/response |
| `services/` | Business logic |
| `middleware/` | Auth, validation, errors |
| `utils/` | Helpers + seed |

### Frontend folders

| Folder | Responsibility |
|--------|----------------|
| `pages/` | Route-level screens |
| `layouts/` | Shell / sidebar |
| `context/` | Auth state |
| `services/` | Axios API calls |
| `types/` | Shared TypeScript types |

---

## Prerequisites

- Node.js 18+
- MongoDB running locally (`mongodb://127.0.0.1:27017`)

---

## Setup

```bash
cd WorkSpace/mern-student-management

# Install root + both apps (first time)
npm install
npm run install:all
npm run seed

# Start backend + frontend together
npm run dev
# Backend  → http://localhost:5001
# Frontend → http://localhost:5173
```

---

## Demo accounts

| Role    | Email               | Password     |
|---------|---------------------|--------------|
| Admin   | `admin@sms.edu`     | `Admin@123`  |
| Teacher | `priya@sms.edu`     | `Teacher@123`|
| Student | `arjun@student.edu` | `Student@123`|

---

## API overview

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/api/auth/register` | No | Register student |
| POST | `/api/auth/login` | No | Login, get JWT |
| GET | `/api/auth/me` | Yes | Current user |
| GET | `/api/students` | Admin/Teacher | List students |
| POST | `/api/students` | Admin/Teacher | Create student |
| GET | `/api/students/:id` | Yes | Get student |
| PUT | `/api/students/:id` | Admin/Teacher | Update student |
| DELETE | `/api/students/:id` | Admin | Delete student |
| GET | `/api/students/stats/dashboard` | Admin/Teacher | Stats |
| GET | `/api/courses` | Yes | List courses |
| POST | `/api/courses` | Admin/Teacher | Create course |
| PUT | `/api/courses/:id` | Admin/Teacher | Update course |
| DELETE | `/api/courses/:id` | Admin | Soft-delete course |

### Response format

```json
{
  "success": true,
  "message": "Students fetched successfully",
  "data": {}
}
```

---

## Database models

- **User** — auth identity (email, hashed password, role)
- **Student** — academic profile (roll, department, courses, GPA)
- **Course** — catalog item (code, credits, teacher)

Relationships:

```text
User 1──1 Student
Student *──* Course
Course *──1 User (teacher)
```

---

## Auth flow

1. User submits email/password
2. Backend verifies with bcrypt
3. JWT is returned
4. Frontend stores token in `localStorage`
5. Axios attaches `Authorization: Bearer <token>`
6. `protect` + `authorize` middleware gate routes

---

## Postman

Import `postman/CampusLedger.postman_collection.json`.

1. Run **Login** (saves token automatically)
2. Call Students / Courses endpoints

---

## CI/CD (GitHub Actions)

| Workflow | When | What it does |
|----------|------|----------------|
| `CI` | Push / PR to `main` | Installs deps, builds backend + frontend |
| `Deploy` | Push to `main` (or manual) | Pushes Docker images to GHCR + triggers Render deploy hooks |

### Public website link (GitHub Pages)

After the **Deploy GitHub Pages** workflow succeeds:

**https://vamsikrishna-1530.github.io/student-management/**

(Also shown under repo → **Settings → Pages**, and in the Actions run summary.)

> Login/API need a live backend. Set repo variable `VITE_API_URL` (e.g. your Render API `…/api`) so the Pages site can call it.

### Public URL (Render — optional full hosting)

Follow **[DEPLOY.md](./DEPLOY.md)** once. After setup, typical URLs:

- Frontend: `https://student-management-ui.onrender.com`
- Backend: `https://student-management-api.onrender.com`

GitHub secrets required for Actions → Render:

- `RENDER_DEPLOY_HOOK_BACKEND`
- `RENDER_DEPLOY_HOOK_FRONTEND`

### Docker images (GHCR)

- `ghcr.io/vamsikrishna-1530/student-management-backend:latest`
- `ghcr.io/vamsikrishna-1530/student-management-frontend:latest`

### Local Docker

```bash
docker compose up --build
# Frontend http://localhost:8080
# Backend  http://localhost:5001
```

---

## Why React does not talk to MongoDB directly

Database credentials and business rules must stay on the server. The browser only calls the REST API. That is how real products keep secrets safe and enforce authorization.
