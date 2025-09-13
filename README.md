# Parallel Lives Playground (hackathon MVP)

## What it is
An interactive demo where children spawn multiple alternate timelines based on financial/behavior decisions and can visit them.

## Run locally
1. Copy backend/.env.example -> backend/.env
2. Install:
   - cd backend && python3 -m pip install -r requirements.txt
   - cd frontend && npm install
3. Start:
   - cd backend && python3 run.py
   - cd frontend && npm run dev
4. Open http://localhost:5173

## Note
- Timelines stored locally in localStorage by default (use the Create Timeline page).
- Backend holds shared timelines in-memory for demo (restart clears them).
- Cohere integration is mocked; replace `backend/src/services/cohere.py` with real API calls if you have an API key.

## For production
- Replace in-memory store with a DB.
- Replace marketSimulator mock with real market data.
- Secure Cohere key and user auth, add accounts.

## Architecture
- **Backend**: Flask + Flask-SocketIO (Python)
- **Frontend**: React + Three.js + Socket.IO client
- **Simulation**: Deterministic market simulator with seeded randomization
- **Visualization**: 3D timeline representation using Three.js

## What's implemented in this scaffold (hackathon MVP):
- Timeline creation + simulation using a seeded mock market engine (marketSimulator) so results are deterministic for a given seed + choices.
- Persistent local timelines in browser localStorage.
- Server endpoints to create/list/get timelines so friends can share and visit each others' timelines.
- Socket.IO broadcast for realtime timeline spawn/updates (basic).
- Simple Three.js visualization representing timelines as rotating columns (easy to extend to full WebGL scenes).
- Mock Cohere analysis (returns tags + summary). Hook placeholder is in backend/src/services/cohere.py.
- Parent overlay & emotional messaging in the Visit page.
- Social endpoints to list mock friends & share timelines.

## What's intentionally NOT fully implemented (but clearly marked and easy to add):
- Real Cohere API calls — must add your COHERE_API_KEY and replace the mock function.
- Real market data feed — the marketSimulator is a mock deterministic engine; to use real market data you'll swap in a market data fetch and a deterministic divergence function.
- Database persistence — server uses in-memory store for timelines. For cross-session permanence, attach a DB (SQLite or Mongo Atlas). For a hackathon localStorage is fine.
- Authentication / accounts — currently anonymous owner strings. Add auth if needed.

## Security & privacy:
- Do not commit keys; use .env for Cohere or market API keys.
- In production, secure Socket.IO origins and validate / sanitize inputs.
