# Movie Manager Frontend

This is the React frontend for the Movie Manager platform. It connects to the Express backend located in `../backend` and provides the booking experience for customers and admins.

## Quick start

```bash
cd frontend
npm install
npm run dev
```

The app runs at http://localhost:5173 by default. Update the API base URL through `.env`:

```
VITE_API_URL=http://localhost:3000/api
```

## Available scripts

- `npm run dev` – start the Vite development server
- `npm run build` – create an optimized production build
- `npm run preview` – preview the production build locally

## Folders

- `src/components` – shared UI components such as header, seat map, and cards
- `src/pages` – application pages (home, movies, booking, admin dashboard)
- `src/services` – API clients built on Axios, matching backend routes
- `src/context` – React context for authentication and theming
- `src/styles` – global styles and theme variables

## Authentication

Tokens are stored in `localStorage` (`accessToken` and `refreshToken`). API requests automatically attach the access token and redirect to `/login` when a 401 response is returned.

## Theme toggle

Theme preferences persist in `localStorage` and respect the operating system preference on first load. Styles are driven by CSS variables in `src/styles/index.css`.
