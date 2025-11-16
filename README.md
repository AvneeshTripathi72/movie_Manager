# Movie Management System

A full-stack movie management application built with Next.js, Clerk authentication, Prisma ORM, and Neon PostgreSQL database.

## Features

- User authentication with Clerk
- CRUD operations for movies
- Responsive UI with Tailwind CSS
- Real-time database with Neon
- RESTful API endpoints
- Type-safe database queries with Prisma

## Setup

### 1. Clone and Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Create a `.env.local` file:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
DATABASE_URL=postgresql://user:password@host/database
```

### 3. Database Setup

Initialize Prisma and push schema:

```bash
npx prisma migrate dev --name init
```

### 4. Run the Application

```bash
npm run dev
```

Visit http://localhost:3000

## Project Structure

```
src/
├── app/              # Next.js App Router
├── components/       # React components
├── lib/              # Utility functions
├── types/            # TypeScript types
└── middleware.ts     # Clerk middleware
prisma/
└── schema.prisma     # Database schema
```

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Clerk
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma
- **Validation**: Zod, React Hook Form
