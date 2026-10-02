# Zara Challenge

Mobile shop using Vite + React.

## Setup

```bash
cp .env.example .env.local
# Fill API_KEY and API_BASE_URL in .env.local
npm install
npm run dev
```

## Scripts

- `npm run dev` — Vite (proxy `/api` → with external api `x-api-key`)
- `npm run build` — Create a production build
- `npm start` — Express serve `dist` + proxy BFF
- `npm run lint` — ESLint

## Arquitectura

- `src/` — frontend React (hooks, services, pages and components)
- `server/` — BFF Express (hide API key in production)
- Request in the browser goes to `/api/products`; it never expose the api key.
