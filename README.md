# HackTTrain2

A full-stack PERN application (PostgreSQL, Express, React, Node.js) with JWT authentication, protected routes, and a modern TailwindCSS UI.

## Project Structure

```
hackttrain2/
├── client/                  # React + Vite frontend
│   └── src/
│       ├── api/             # Axios instance with interceptors
│       ├── components/      # Navbar, ProtectedRoute
│       ├── context/         # AuthContext (JWT state)
│       └── pages/           # Home, Login, Register, Dashboard, Profile
└── server/                  # Express backend
    ├── config/              # DB connection + initDb
    ├── controllers/         # authController, userController
    ├── middleware/          # auth (JWT), errorHandler
    ├── models/              # userModel (pg queries)
    └── routes/              # /api/auth, /api/users
```

## Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [PostgreSQL](https://www.postgresql.org/) running locally

## Setup

### 1. Configure environment

```bash
cp server/.env.example server/.env
```

Edit `server/.env` with your PostgreSQL credentials:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=hackttrain2
DB_USER=postgres
DB_PASSWORD=yourpassword
JWT_SECRET=your_super_secret_key
```

### 2. Create the database

```sql
CREATE DATABASE hackttrain2;
```

Tables are **auto-created** on first server start via `initDb`.

### 3. Install dependencies

```bash
npm run install:all
```

### 4. Run in development

```bash
npm run dev
```

This starts both the backend (`localhost:5000`) and frontend (`localhost:5173`) concurrently.

## API Endpoints

| Method | Endpoint             | Auth     | Description         |
|--------|----------------------|----------|---------------------|
| POST   | /api/auth/register   | —        | Register a user     |
| POST   | /api/auth/login      | —        | Login               |
| GET    | /api/auth/me         | Bearer   | Get current user    |
| GET    | /api/users           | Admin    | List all users      |
| GET    | /api/users/:id       | Bearer   | Get user by ID      |
| PUT    | /api/users/:id       | Bearer   | Update user         |
| DELETE | /api/users/:id       | Bearer   | Delete user         |
| GET    | /api/health          | —        | Health check        |
