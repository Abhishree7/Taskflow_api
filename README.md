# TaskFlow API

A full-stack task management application built as a personal SWE project to demonstrate production-ready patterns across the entire stack.

![CI](https://github.com/Abhishree7/Taskflow_api/actions/workflows/ci.yml/badge.svg)

## Stack

| Layer | Technology |
|---|---|
| Backend | FastAPI + Python 3.11 |
| Database | PostgreSQL 16 (async via SQLAlchemy + asyncpg) |
| Cache / Queue | Redis 7 + arq |
| Auth | JWT access + refresh tokens (python-jose + bcrypt) |
| Migrations | Alembic (async) |
| Rate Limiting | slowapi |
| Frontend | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS v4 |
| Data Fetching | TanStack Query v5 |
| Routing | React Router v6 |
| Containers | Docker + docker-compose |
| CI/CD | GitHub Actions |
| Tests | pytest + pytest-asyncio |

## Features

- **User auth** — register, login, JWT access tokens with refresh token rotation
- **Task CRUD** — create, read, update, delete tasks with server-side pagination
- **Task attributes** — status (`todo` / `in_progress` / `done`), priority (`low` / `medium` / `high`)
- **Background jobs** — arq worker for async tasks (e.g. welcome emails, CSV exports)
- **Rate limiting** — per-IP middleware via slowapi
- **Dark theme UI** — sidebar nav, stat cards, task grid, create/edit modals
- **CI pipeline** — runs unit + integration tests against real Postgres/Redis on every push

## Project Structure

```
taskflow_api/
├── app/
│   ├── api/v1/endpoints/   # auth.py, tasks.py
│   ├── core/               # config, security, deps
│   ├── db/                 # async SQLAlchemy engine + session
│   ├── models/             # User, Task ORM models
│   ├── schemas/            # Pydantic request/response schemas
│   ├── services/           # DB logic (user_service, task_service)
│   ├── middleware/         # rate_limit.py
│   ├── workers/            # arq background jobs
│   └── main.py
├── alembic/                # async migrations
├── tests/
│   ├── unit/               # security function tests
│   └── integration/        # auth + task CRUD against real DB
├── frontend/               # Vite + React + TypeScript
│   └── src/
│       ├── api/            # axios client + typed API calls
│       ├── components/     # TaskCard, Modal, Badge, StatCard, TaskForm
│       ├── hooks/          # useAuth
│       ├── pages/          # AuthPage, DashboardPage
│       └── types/          # shared TypeScript types
├── docker-compose.yml
├── Dockerfile
└── pyproject.toml
```

## Getting Started

### With Docker Compose (recommended)

```bash
git clone https://github.com/Abhishree7/Taskflow_api.git
cd Taskflow_api
cp .env.example .env
docker compose up --build
```

Then visit `http://localhost:8000/docs` for the API and run the frontend separately (see below).

### Local development

**Prerequisites:** Python 3.11+, Node 18+, Docker (for Postgres + Redis)

```bash
# 1. Start backing services
docker compose up -d db redis

# 2. Install Python deps
pip install -e ".[dev]"

# 3. Create .env
cp .env.example .env

# 4. Run migrations
alembic upgrade head

# 5. Start API (with hot reload)
uvicorn app.main:app --reload
# → http://localhost:8000

# 6. Start frontend (separate terminal)
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

### Environment variables

| Variable | Default | Description |
|---|---|---|
| `DATABASE_URL` | `postgresql+asyncpg://postgres:password@localhost:5432/taskflow` | Async Postgres URL |
| `REDIS_URL` | `redis://localhost:6379` | Redis URL |
| `SECRET_KEY` | `dev-secret-key` | JWT signing key — **change in production** |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `30` | Access token TTL |
| `REFRESH_TOKEN_EXPIRE_DAYS` | `7` | Refresh token TTL |

## API Reference

Interactive docs available at `http://localhost:8000/docs` (Swagger UI).

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/v1/auth/register` | — | Register a new user |
| POST | `/api/v1/auth/login` | — | Login, returns token pair |
| POST | `/api/v1/auth/refresh` | — | Rotate access + refresh tokens |
| GET | `/api/v1/tasks` | Bearer | List tasks (paginated) |
| POST | `/api/v1/tasks` | Bearer | Create a task |
| GET | `/api/v1/tasks/{id}` | Bearer | Get a single task |
| PATCH | `/api/v1/tasks/{id}` | Bearer | Update a task |
| DELETE | `/api/v1/tasks/{id}` | Bearer | Delete a task |
| GET | `/health` | — | Health check |

## Running Tests

```bash
# Unit tests only (no DB needed)
pytest tests/unit -v

# Full suite (requires Postgres + Redis running)
pytest tests/ -v --cov=app --cov-report=term-missing
```

## CI/CD

GitHub Actions runs on every push to `main` and on pull requests:

- **lint** — `ruff check app tests`
- **test** — spins up Postgres + Redis service containers, runs unit then integration tests, uploads coverage report

Check the pipeline: [Actions tab](https://github.com/Abhishree7/Taskflow_api/actions)
