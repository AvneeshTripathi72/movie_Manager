# Movie Manager Admin Frontend

React-based admin panel for managing bookings, sales metrics, and activity logs. It assumes the backend runs from `../backend` on port 3000.

## Quick start

```bash
cd frontend_admin
npm install
npm run dev
```

Default dev server: http://localhost:5174

Set custom API URL in `.env`:

```
VITE_API_URL=http://localhost:3000/api
```

## Features

- Admin-only login (role must be `admin`)
- Dashboard with revenue, bookings, and top movies
- Booking table with refresh
- Activity log summary and recent events

## Project structure

- `src/components` – layout, table, and utility components
- `src/pages` – dashboard, bookings, activity pages, login
- `src/services` – Axios client for backend APIs
- `src/context` – auth state and guard
- `src/styles` – dashboard styling
