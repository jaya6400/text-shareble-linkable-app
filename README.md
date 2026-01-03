# Text Sharable Linkable App

A lightweight Pastebin-like web application that allows users to create text pastes, generate shareable links, and view pastes with optional expiration constraints.

Built as a take-home assignment with automated testing compatibility in mind.

---

## Features

- 📝 Create text pastes with arbitrary content
- 🔗 Generate unique shareable URLs for each paste
- 👀 View pastes via API or HTML interface
- ⏱️ Optional expiration mechanisms:
  - **Time-based (TTL)** - Auto-expire after a set duration
  - **View-count limit** - Expire after a specified number of views
- 🧪 Deterministic expiry testing support

---

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL (Neon)
- **ORM:** Prisma 7
- **Deployment:** Vercel

---

## Architecture

### Persistence Layer

The application uses **PostgreSQL** hosted on **Neon** for data persistence, managed through **Prisma ORM**.

A persistent database is required because the application is deployed on a serverless platform where in-memory storage is not reliable across invocations.

### Database Schema
```prisma
model Paste {
  id        String    @id
  content   String
  createdAt DateTime  @default(now())
  expiresAt DateTime?
  maxViews  Int?
  viewCount Int       @default(0)
}
```

---

## Running Locally

### Prerequisites

- Node.js 18 or higher
- PostgreSQL database (Neon recommended)
- npm or yarn package manager

### Setup Instructions

1. **Clone the repository**
```bash
   git clone 
   cd text-shareble-linkable-app
```

2. **Install dependencies**
```bash
   npm install
```

3. **Configure environment variables**

   Create a `.env` file in the project root:
```env
   DATABASE_URL="postgresql://user:password@host/database?sslmode=require"
   NEXT_PUBLIC_BASE_URL="http://localhost:3000"
   TEST_MODE="1"
```

4. **Set up the database**

   Create `prisma.config.ts` in the project root:
```typescript
   import { defineConfig } from "@prisma/client";

   export default defineConfig({
     datasources: {
       db: {
         url: process.env.DATABASE_URL!,
       },
     },
   });
```

   Then push the schema to your database:
```bash
   npx prisma db push
```

5. **Start the development server**
```bash
   npm run dev
```

   The application will be available at `http://localhost:3000`

---

## API Documentation

### Health Check

Check if the API is running and database is connected.
```http
GET /api/healthz
```

**Response:**
```json
{
  "ok": true
}
```

---

### Create a Paste

Create a new text paste with optional expiration settings.
```http
POST /api/pastes
Content-Type: application/json
```

**Request Body:**
```json
{
  "content": "Your text content here",
  "ttl_seconds": 3600,
  "max_views": 10
}
```

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `content` | string | Yes | The text content of the paste |
| `ttl_seconds` | number | No | Time to live in seconds |
| `max_views` | number | No | Maximum number of views allowed |

**Response:**
```json
{
  "id": "abc123xyz",
  "url": "http://localhost:3000/p/abc123xyz"
}
```

---

### Fetch a Paste (JSON)

Retrieve paste data in JSON format.
```http
GET /api/pastes/:id
```

**Response:**
```json
{
  "id": "abc123xyz",
  "content": "Your text content here",
  "createdAt": "2025-01-03T10:30:00.000Z",
  "expiresAt": "2025-01-03T11:30:00.000Z",
  "viewCount": 5,
  "maxViews": 10
}
```

**Error Responses:**

- `404 Not Found` - Paste doesn't exist or has expired
- `410 Gone` - Paste has reached maximum views

---

### View a Paste (HTML)

View paste content in a formatted HTML page.
```http
GET /p/:id
```

Opens a web page displaying the paste content with metadata.

---

## Testing Features

### Deterministic Time Testing

When `TEST_MODE=1` is set in the environment, you can control the "current time" for testing expiration logic.

**Usage:**

Send the `x-test-now-ms` header with requests:
```http
GET /api/pastes/:id
x-test-now-ms: 1704279600000
```

The value should be milliseconds since Unix epoch. This allows deterministic testing of TTL-based expiration without waiting for actual time to pass.

---

## Deployment

The application is deployed on **Vercel** with the following configuration:

1. **Build Command:** `npm run build`
2. **Output Directory:** `.next`
3. **Environment Variables:** Set via Vercel dashboard
   - `DATABASE_URL`
   - `NEXT_PUBLIC_BASE_URL`
   - `TEST_MODE` (optional, for testing)

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=<your-repo-url>)

Or manually:
```bash
npm run build
vercel --prod
```

---

## Project Structure
```
text-shareble-linkable-app/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── healthz/       # Health check endpoint
│   │   │   └── pastes/        # Paste CRUD endpoints
│   │   └── p/[id]/            # Paste view page
│   └── lib/
│       └── prisma.ts          # Prisma client instance
├── prisma.config.ts           # Prisma 7 configuration
├── .env                       # Environment variables
├── next.config.js             # Next.js configuration
└── package.json
```

---

## Environment Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Yes | `postgresql://user:pass@host/db` |
| `NEXT_PUBLIC_BASE_URL` | Base URL for generated links | Yes | `https://yourapp.vercel.app` |
| `TEST_MODE` | Enable deterministic time testing | No | `1` |

---

## Support

For issues or questions, please open an issue on the repository.