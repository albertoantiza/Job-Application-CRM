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

- **Register** `POST /api/auth/register` — creates user, returns JWT
- **Login** `POST /api/auth/login` — validates credentials, returns JWT
- **Me** `GET /api/auth/me` — returns current user from token
- **Role-based** — `authorize('admin')` middleware on admin routes (`/api/admin/*`)

All entity routes (companies, applications, etc.) require authentication via the `authenticate` middleware applied in `routes/index.js`.

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

- Node.js 20+
- PostgreSQL running locally

### Setup

```bash
# Install dependencies
npm install

# Copy environment config
cp .env.example .env
# Edit .env with your database credentials

# Create the database and run migrations
createdb job_crm
npx prisma migrate dev

# (Optional) Seed sample data
npm run seed

# Start the server
node src/server.js
```

The API starts on `http://localhost:3000`.

## API Overview

All endpoints are under `/api`:

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Log in, receive JWT |
| `GET` | `/api/auth/me` | Get current user (requires auth) |

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

```bash
# Register and get a token
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"me@example.com","password":"password123","name":"Me"}' \
  | node -e "process.stdin.resume(); let d=''; process.stdin.on('data',c=>d+=c); process.stdin.on('end',()=>console.log(JSON.parse(d).data.token))")

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

## Scripts

```bash
npm test              # Run tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage
npm run lint          # Run ESLint
npm run lint:fix      # Run ESLint with auto-fix
npm run format        # Format with Prettier
npm run seed          # Seed the database with sample data
```
