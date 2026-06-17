# Job Application CRM

A personal backend API for tracking job applications during the job hunt.

**Intent** — I built this to keep a structured record of every application I submit, every interview I attend, and every contact I make along the way. Instead of spreadsheets or scattered notes, this CRM gives me a single API to log, query, and review my job search data.

**Backend focus** — The project deliberately puts the backend first. There is no frontend; everything is exposed through a REST API. The goal was to practice layered architecture (controllers → services → Prisma), error handling patterns, validation, pagination, and clean separation of concerns — all without the distraction of a UI.

## Tech Stack

| Layer | Tool |
|---|---|
| Runtime | Node.js (Express 5) |
| Database | PostgreSQL |
| ORM | Prisma |
| Language | JavaScript (ES Modules) |

### Why these choices

I started programming with JavaScript, so **Node.js** and **Express** were the natural pick — they're what I know best and let me move fast without fighting a new syntax. **JavaScript** keeps the stack uniform across the whole project.

**PostgreSQL** is reliable, widely used, and a great fit for the relational data that a CRM needs (applications ↔ interviews ↔ contacts). **Prisma** sits on top of it because its schema-driven approach and type-safe queries make modeling those relationships straightforward and reduce boilerplate compared to raw SQL or other ORMs.

No TypeScript on purpose — I wanted to solidify my vanilla JavaScript skills and keep the setup lean. Every tool in the stack is something I've worked with before, so the focus stays on architecture, patterns and APIs.

## Models

- **Companies** — Where you applied
- **Applications** — Each role you applied for, linked to a company
- **Contacts** — People you connected with, linked to a company
- **Interviews** — Interview events, linked to an application
- **Notes** — Free-form notes, linked to an application

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL running locally

### Setup

```bash
# Clone and install
npm install

# Copy environment config
cp .env.example .env
# Edit .env with your database credentials

# Run database migrations
npx prisma migrate dev

# Start the server
npm run dev
```

The API starts on `http://localhost:3000`.

## API Overview

All endpoints are under `/api`:

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/companies` | List companies (with search, sort, pagination) |
| `POST` | `/api/companies` | Create a company |
| `GET` | `/api/companies/:id` | Get a company by ID |
| `PATCH` | `/api/companies/:id` | Update a company |
| `DELETE` | `/api/companies/:id` | Delete a company |
| `GET` | `/api/contacts` | List contacts |
| `POST` | `/api/contacts` | Create a contact |
| `GET` | `/api/contacts/:id` | Get a contact by ID |
| `PATCH` | `/api/contacts/:id` | Update a contact |
| `DELETE` | `/api/contacts/:id` | Delete a contact |
| `GET` | `/api/applications` | List applications |
| `POST` | `/api/applications` | Create an application |
| `GET` | `/api/applications/:id` | Get an application by ID |
| `PATCH` | `/api/applications/:id` | Update an application |
| `DELETE` | `/api/applications/:id` | Delete an application |
| `GET` | `/api/interviews` | List interviews |
| `POST` | `/api/interviews` | Create an interview |
| `GET` | `/api/interviews/:id` | Get an interview by ID |
| `PATCH` | `/api/interviews/:id` | Update an interview |
| `DELETE` | `/api/interviews/:id` | Delete an interview |
| `GET` | `/api/notes` | List notes |
| `POST` | `/api/notes` | Create a note |
| `GET` | `/api/notes/:id` | Get a note by ID |
| `PATCH` | `/api/notes/:id` | Update a note |
| `DELETE` | `/api/notes/:id` | Delete a note |

### Status values

- **Application status**: `applied`, `phone_screen`, `interview`, `offer`, `rejected`, `accepted`, `withdrawn`
- **Company/Contact status**: `active`, `inactive`

### Query parameters

List endpoints support:

- `?search=` — Full-text search across relevant fields
- `?page=&limit=` — Pagination
- `?sortBy=&sortOrder=` — Sort by any allowed field


