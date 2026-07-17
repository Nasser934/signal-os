# Signal OS Backend API

AI scoring, authentication, and X API proxy for Signal OS.

## Quick Start

```bash
npm install
cp .env.example .env
# Fill in your keys
npm run db:migrate
npm run dev
```

## API Endpoints

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/v1/auth/register` | POST | No | Register new user |
| `/api/v1/auth/login` | POST | No | Login (returns JWT) |
| `/api/v1/auth/me` | GET | Yes | Get current user |
| `/api/v1/scores` | POST | Yes | Score content with AI |
| `/api/v1/scores` | GET | Yes | Score history |
| `/api/v1/drafts` | POST | Yes | Save draft |
| `/api/v1/drafts` | GET | Yes | List drafts |
| `/api/v1/x/profile` | GET | Yes | Get X profile via Nango |
| `/api/v1/x/posts` | GET | Yes | Get X posts via Nango |
| `/api/v1/x/publish` | POST | Yes | Publish to X via Nango |
| `/api/v1/analytics/dashboard` | GET | Yes | Dashboard KPIs |
| `/api/v1/analytics/trends` | GET | Yes | Trend data |
| `/` | GET | No | Health check |

## Deploy

### Railway (Recommended)
Push to GitHub, connect at https://railway.app

### Cloudflare Workers
```bash
npm i -g wrangler
wrangler login
wrangler secret put DATABASE_URL
wrangler secret put JWT_SECRET
wrangler secret put OPENAI_API_KEY
wrangler secret put NANGO_SECRET_KEY
wrangler deploy
```
