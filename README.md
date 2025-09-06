# Interactive Video US1 — Fullstack (Angular + NestJS)

## Quick Start (Docker)

```bash
docker compose up --build -d
# Frontend: http://localhost:4200
# Backend:  http://localhost:3000/videos/by-youtube/dQw4w9WgXcQ
```

The backend seeds one sample video (YouTube ID: `dQw4w9WgXcQ`).

Open the frontend and paste that ID in the input, or any other YouTube ID.

## Local (no Docker)

1) Start MySQL 8 and Redis locally. Create DB `learner`.
2) Backend:
```bash
cd backend
cp .env.example .env
npm i
npm run build
npm start
```
3) Frontend:
```bash
cd frontend
npm i
npm start
```

## Notes
- Dev mode uses TypeORM `synchronize: true` for convenience.
- CORS allows `http://localhost:4200`.
- Player uses a stable host element to avoid remount on video change.
