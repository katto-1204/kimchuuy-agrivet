# Inventory Management System — Local Setup

This project includes a simple MySQL-backed API for `products` (inventory).

Quick start:

1. Install dependencies

```powershell
npm install
```

2. Create a `.env.local` in the project root (you can copy `.env.local.example`)

3. Import the database schema located at `scripts/001-database-schema.sql` into your MySQL server (e.g. using phpMyAdmin or the `mysql` CLI). The schema creates the `kimchuyy_agrivet` database and required tables.

4. Start the dev server

```powershell
npm run dev
```

API endpoints

- `GET /api/products` — list products
- `POST /api/products` — create product (JSON body)
- `GET /api/products/:id` — get product
- `PUT /api/products/:id` — update product (JSON body)
- `DELETE /api/products/:id` — archive product (soft delete)

Notes

- The project uses `mysql2` with a pooled connection in `lib/db.ts`.
- UI pages under `app/inventory` were connected to these endpoints (list/add/edit/archive).
- For production, replace the mock auth and strengthen validation/security.
