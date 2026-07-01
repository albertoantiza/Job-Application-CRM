# Job Application CRM

A personal REST API for tracking job applications, interviews, contacts, and notes during the job hunt. Backend-focused — no frontend, just a layered API built with Express 5 and Prisma.

## Tech Stack

| Layer | Tool |
|---|---|
| Runtime | Node.js (Express 5) |
| Database | PostgreSQL |
| ORM | Prisma |
| Auth | bcryptjs + jsonwebtoken |
| Validation | Custom schema-based middleware |
| Testing | Vitest + Supertest |

## Architecture

The project follows a **layered architecture** with clear separation of concerns:

```
HTTP Request
    │
    ▼
┌──────────────┐
│  Middlewares  │  Request logging, auth, authorization, validation
│  (chain)      │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   Routes     │  Map URL paths to controllers, apply validators
│  (factory)   │  Entity routes use createEntityRoutes()
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Controllers  │  Parse req, delegate to service, format res
│  (factory)   │  Entity controllers use createEntityController()
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Services    │  Business logic, Prisma queries, error handling
│              │  Entity services extend createBaseService()
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   Prisma     │  Type-safe queries, migrations
│   (ORM)      │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  PostgreSQL  │
└──────────────┘
```

### Request flow

A typical authenticated request goes through:

1. **`requestLogger`** — logs method, URL, response status and duration
2. **`authenticate`** — verifies `Authorization: Bearer <token>`, attaches `req.user`
3. **`authorize`** (admin routes only) — checks user role
4. **`validateRequest`** — validates params/body against a schema, returns 400 on failure
5. **Route handler** — calls controller method
6. **Controller** — calls service, formats response (always `{ data: ... }` or `{ data: [...], pagination: {...} }`)
7. **Service** — runs Prisma queries, throws domain errors (`NotFoundError`, `ValidationError`, etc.)
8. **Error handler** — catches all errors, returns consistent JSON (`{ error, type, status }`)

### Factory patterns

Entity resources (companies, applications, contacts, interviews, notes) share identical CRUD patterns. Two factories eliminate duplication:

- **`routes/factory.js`** (`createEntityRoutes`) — generates GET `/:id`, POST `/`, PATCH `/:id`, DELETE `/:id` for any entity, applying `validateRequest` with the entity's schemas.
- **`controllers/factory.js`** (`createEntityController`) — generates getAll, getById, create, update, delete methods that handle pagination, sorting, search filtering, and `req.user.id` scoping.

Controllers pass options to the factory for entity-specific behavior:
```js
createEntityController(service, {
  entityName: 'Company',
  sortableFields: ['id', 'name', 'status', 'createdAt'],
  buildFilters: (query) => ({ status: query.status })
})
```

### Service layer

- **`base.service.js`** (`createBaseService`) — provides `findMany`, `findById`, `update`, `delete` using a Prisma model name. All entity services extend it.
- **Entity services** add `findAll` (with search/filter logic) and `create` (with FK validation).
- **`user.service.js`** and **`admin.service.js`** are specialized services that don't use the base.

### Auth & authorization

Authentication is **JWT-based**. The flow is:

```
Register/Login → receive JWT → send JWT in Authorization header → authenticate middleware → req.user
```

#### Registration (`POST /api/auth/register`)

1. **`validateRequest`** checks the body against `registerSchema`:
   - `email` — required, validated as email format
   - `password` — required, 8–32 characters
   - `name` — optional
   - `role` — optional, must be `user` or `admin`
2. **`authController.register`** calls `userService.create(req.body)`
3. **`userService.create`** checks for duplicate email (`ConflictError` if taken), hashes password with bcrypt (cost factor 10), inserts the user
4. **Controller** signs a JWT with `{ userId, email }` using `env.JWT_SECRET`, sanitizes the user object (removes `password`), returns both:

```json
{
  "data": {
    "user": { "id": 1, "email": "me@example.com", "name": "Me", "role": "user" },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

#### Login (`POST /api/auth/login`)

1. **`validateRequest`** checks `email` and `password` are present
2. **`authController.login`** looks up the user by email
3. Returns `AuthError('Invalid email or password')` for **both** unknown email and wrong password — avoids leaking which field is incorrect
4. Compares password with bcrypt, signs and returns the same shape as registration

#### Authenticate middleware (`src/middlewares/authenticate.js`)

Applied to all routes after `/auth` and `/health` in `routes/index.js`:

```js
router.get('/health', healthController.check)  // public
router.use('/auth', authRoutes)                // public
router.use(authenticate)                       // ↓ everything below requires auth
router.use('/companies', companiesRoutes)      // protected
// ...
```

The middleware:

1. Reads `Authorization` header — must start with `Bearer `
2. Extracts the token, verifies it with `jwt.verify(token, env.JWT_SECRET)`
3. Looks up the user in the database with `prisma.user.findUnique` (excludes password)
4. If valid, attaches the user object to `req.user` and calls `next()`
5. On failure at any step, passes an `AuthError` to the error handler:

| Failure point | Response |
|---|---|
| Missing/ malformed `Authorization` header | `401 { "error": "Authentication required" }` |
| Invalid or expired token | `401 { "error": "Invalid or expired token" }` |
| Token valid but user deleted | `401 { "error": "User not found" }` |

#### Authorize middleware (`src/middlewares/authorize.js`)

Applied on admin routes after `authenticate`:

```js
router.use(authorize('admin'))
```

Checks `req.user.role` against the allowed roles. If the user lacks the required role, returns:

```json
{ "error": "Insufficient permissions", "type": "forbidden", "status": 403 }
```

#### Security notes

- Passwords are **never stored in plain text** — bcrypt hash with cost factor 10
- The password field is **stripped from all responses** via `omit: { password: true }` in Prisma queries and the `sanitizeUser` helper
- The JWT secret defaults to `dev-secret-change-in-production` in `.env.example` — **must be changed** for any real use
- Token expiry is configurable via `JWT_EXPIRES_IN` (defaults to `7d`)

### Error handling

Errors flow from services → controllers → error handler middleware:

- Domain errors (`NotFoundError`, `AuthError`, `ValidationError`, `ConflictError`) extend `ApiError` with a `statusCode`, `type`, optional `field` and `details`.
- Prisma errors (`P2025` not found, `P2003` FK violation) are caught in services and re-thrown as domain errors.
- The error handler returns a consistent JSON shape:
  ```json
  { "error": "Company not found", "type": "not_found", "status": 404 }
  { "error": "name is required", "type": "validation", "status": 400, "field": "name" }
  ```
- Malformed JSON bodies are caught as 400, JWT errors outside the auth middleware are caught as 401.

## Project Structure

```
src/
├── config/
│   ├── env.js           # Environment variables with defaults
│   ├── permissions.js   # Role/permission definitions
│   └── prisma.js        # Prisma client singleton
│
├── controllers/
│   ├── factory.js        # createEntityController() — CRUD generator
│   ├── companies.controller.js
│   ├── applications.controller.js
│   ├── contacts.controller.js
│   ├── interviews.controller.js
│   ├── notes.controller.js
│   ├── auth.controller.js    # register, login, me
│   ├── admin.controller.js   # user management
│   └── health.controller.js  # DB health check
│
├── middlewares/
│   ├── authenticate.js     # JWT verification → req.user
│   ├── authorize.js        # Role-based access control
│   ├── errorHandler.js     # Catches ApiError, SyntaxError, JWT errors
│   ├── notFound.js         # 404 for unknown routes
│   ├── requestLogger.js    # Request/response logging
│   └── validateRequest.js  # Schema-based body/param validation
│
├── routes/
│   ├── factory.js          # createEntityRoutes() — route generator
│   ├── index.js            # Central router, mounts all endpoints
│   ├── companies.routes.js
│   ├── applications.routes.js
│   ├── contacts.routes.js
│   ├── interviews.routes.js
│   ├── notes.routes.js
│   ├── auth.routes.js
│   └── admin.routes.js
│
├── services/
│   ├── base.service.js      # createBaseService() — shared CRUD
│   ├── company.service.js
│   ├── application.service.js
│   ├── contact.service.js
│   ├── interview.service.js
│   ├── note.service.js
│   ├── user.service.js
│   └── admin.service.js
│
├── utils/
│   ├── ApiError.js          # Base error class
│   ├── errors.js            # Domain errors (NotFound, Auth, Validation, etc.)
│   ├── constants.js         # Status enums
│   ├── logger.js            # Console logger wrapper
│   ├── pagination.js        # parsePagination, parseSort, formatPaginatedResponse
│   ├── prismaError.js       # Prisma error code helpers
│   └── updateFields.js      # requireUpdateFields validator
│
├── validators/
│   ├── common.js             # entityIdSchema
│   ├── auth.schema.js
│   ├── companies.schema.js
│   ├── applications.schema.js
│   ├── contacts.schema.js
│   ├── interviews.schema.js
│   └── notes.schema.js
│
├── app.js                  # Express app setup
└── server.js               # Entry point
```

## Models

```
User
 ├── Company        (1:N — each company belongs to a user)
 ├── Application    (1:N — each application belongs to a user)
 ├── Contact        (1:N)
 ├── Interview      (1:N)
 └── Note           (1:N)

Company
 ├── Application    (1:N — each application references a company)
 └── Contact        (1:N)

Application
 ├── Interview      (1:N — each interview references an application)
 └── Note           (1:N)
```

## Getting Started

### Prerequisites

- **Node.js 20+** — [nodejs.org](https://nodejs.org) (includes `npm` and `node --watch`)
- **PostgreSQL** running locally — [postgresql.org/download](https://www.postgresql.org/download/)
- **psql** command-line tool (ships with PostgreSQL)

Verify everything is installed:

```bash
node --version    # v20 or higher
psql --version    # PostgreSQL is accessible
```

### 1. Configure the database

This project needs two databases: one for development and one for tests.

```bash
# Create both databases
createdb job_crm
createdb crm_test
```

If `createdb` fails, your PostgreSQL user might need different credentials. See [Troubleshooting](#troubleshooting) below.

### 2. Set up environment variables

```bash
cp .env.example .env
```

Open `.env` and replace the placeholder values with your local PostgreSQL credentials:

```env
DATABASE_URL=postgresql://YOUR_USER:YOUR_PASSWORD@localhost:5432/job_crm
JWT_SECRET=your-own-random-secret-at-least-32-chars
```

The `DATABASE_URL` format is: `postgresql://USER:PASSWORD@HOST:PORT/DATABASE_NAME`. The defaults are usually `postgresql://localhost:5432/job_crm` if your PostgreSQL allows peer/trust auth. If you set a password during PostgreSQL install, use it here.

> **For tests**: a `.env.test` file already exists with `DATABASE_URL` pointing to `crm_test` and a separate JWT secret. This is loaded automatically when running tests — you may need to update the credentials there too.

### 3. Install dependencies and run migrations

```bash
npm install
npx prisma migrate dev
```

`prisma migrate dev` applies all pending migrations to the `job_crm` database and generates the Prisma client.

For the test database, apply migrations separately:

```bash
DATABASE_URL="postgresql://localhost:5432/crm_test" npx prisma migrate deploy
```

### 4. (Optional) Seed sample data

```bash
npm run seed
```

This creates a demo user (`alberto@example.com` / `password123`) with sample companies, applications, interviews, contacts, and notes — useful for exploring the API.

### 5. Start the server

```bash
npm run dev
```

The server starts on `http://localhost:3000`. The `--watch` flag automatically restarts when you edit source files.

To verify the API is running:

```bash
curl http://localhost:3000/api/health
# → { "data": { "status": "ok" } }
```

### Troubleshooting

| Problem | Fix |
|---|---|
| `createdb: command not found` | PostgreSQL is not installed or not in your PATH. Install via [brew.sh](https://brew.sh) (`brew install postgresql`) or download from [postgresql.org](https://www.postgresql.org/download/). |
| `createdb: role "user" does not exist` | Your PostgreSQL user name doesn't match your system user. Run `createdb job_crm` as a specific user: `createdb -U postgres job_crm` or create a role matching your system user. |
| `prisma: command not found` | You skipped `npm install`. Run it first. |
| `Error: Can't reach database server` | PostgreSQL isn't running. Start it: `brew services start postgresql` (Homebrew) or `sudo systemctl start postgresql` (Linux). |
| `Error: database "job_crm" does not exist` | Run `createdb job_crm` before `npx prisma migrate dev`. |
| `TokenExpiredError` or `JsonWebTokenError` | The JWT secret in `.env` was changed after tokens were issued. Log in again to get a new token. |

### Scripts

```bash
npm run dev           # Start dev server with auto-restart on file changes
npm start             # Start production server
npm test              # Run all tests once
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
npm run lint          # Run ESLint
npm run lint:fix      # Run ESLint with auto-fix
npm run format        # Format code with Prettier
npm run seed          # Seed database with sample data
```

## API Overview

All endpoints are under `/api`:

### Authentication

| Method | Endpoint | Request body | Response |
|---|---|---|---|
| `POST` | `/api/auth/register` | `{ email, password, name?, role? }` | `201 { data: { user, token } }` |
| `POST` | `/api/auth/login` | `{ email, password }` | `200 { data: { user, token } }` |
| `GET` | `/api/auth/me` | — | `200 { data: { user } }` (requires auth) |

### Companies

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/companies` | List companies |
| `POST` | `/api/companies` | Create a company |
| `GET` | `/api/companies/:id` | Get a company by ID |
| `PATCH` | `/api/companies/:id` | Update a company |
| `DELETE` | `/api/companies/:id` | Delete a company |

### Applications

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/applications` | List applications |
| `POST` | `/api/applications` | Create an application |
| `GET` | `/api/applications/:id` | Get an application by ID |
| `PATCH` | `/api/applications/:id` | Update an application |
| `DELETE` | `/api/applications/:id` | Delete an application |

### Contacts, Interviews, Notes

The same CRUD pattern applies at `/api/contacts`, `/api/interviews`, and `/api/notes`.

### Admin

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/admin/users` | List all users (admin only) |
| `GET` | `/api/admin/users/:id` | Get user by ID (admin only) |
| `PATCH` | `/api/admin/users/:id/role` | Update user role (admin only) |
| `DELETE` | `/api/admin/users/:id` | Delete user (admin only) |

### Health

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Database connectivity check |

### Status values

- **Application status**: `applied`, `phone_screen`, `interview`, `offer`, `rejected`, `accepted`, `withdrawn`
- **Company/Contact status**: `active`, `inactive`

### Query parameters

List endpoints support:

| Param | Description |
|---|---|
| `?search=` | Full-text search across relevant fields |
| `?page=&limit=` | Pagination (defaults: page=1, limit=20, max=100) |
| `?sortBy=&sortOrder=` | Sort by allowed fields (`asc`/`desc`) |

## Testing

```bash
npm test             # Run all tests once
npm run test:watch   # Watch mode
npm run test:coverage  # With coverage report
```

Tests use a dedicated PostgreSQL database (`crm_test`). See `.env.test` for the test database configuration.

### Test structure

- `tests/unit/` — Pure function tests (pagination utils, service logic with mocked Prisma)
- `tests/integration/` — Full-stack tests against the real test DB using Supertest

## Usage

All endpoints require a valid JWT token (except `/api/health` and `/api/auth/register`/`/api/auth/login`). Get one by registering a new user or using the seeded demo account.

```bash
# Option A: Register a new account
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"me@example.com","password":"password123","name":"Me"}' \
  | node -e "process.stdin.resume(); let d=''; process.stdin.on('data',c=>d+=c); process.stdin.on('end',()=>console.log(JSON.parse(d).data.token))")

# Option B: Use the seeded demo account (after running npm run seed)
# TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
#   -H "Content-Type: application/json" \
#   -d '{"email":"alberto@example.com","password":"password123"}' \
#   | node -e "process.stdin.resume(); let d=''; process.stdin.on('data',c=>d+=c); process.stdin.on('end',()=>console.log(JSON.parse(d).data.token))")
# Create a company
curl -X POST http://localhost:3000/api/companies \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name": "Acme Corp"}'

# List companies with search and pagination
curl "http://localhost:3000/api/companies?search=acme&page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN"

# Create an application
curl -X POST http://localhost:3000/api/applications \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"companyId": 1, "role": "Software Engineer"}'

# Log an interview
curl -X POST http://localhost:3000/api/interviews \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"applicationId": 1, "stage": "Technical Screen", "date": "2026-07-10T10:00:00Z"}'
```

