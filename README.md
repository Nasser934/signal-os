# Signal OS

**AI-Powered Attention Intelligence for X (Twitter) Content Creators**

Signal OS scores your content across 8 dimensions and predicts performance before you post. Know your score. Own the feed.

## Live Demo

**Frontend:** https://kjhppd7dd7onq.kimi.page

## Quick Start

### Frontend Only (Mock Mode)
```bash
cd app
npm install
npm run dev
```

### Full Stack (Production)
```bash
# 1. Start backend
cd signal-os-backend
cp .env.example .env
# Fill in your keys
npm install
npm run db:migrate
npm run dev

# 2. Start frontend (new terminal)
cd app
cp .env.example .env.local
# Set VITE_API_URL to your backend
npm install
npm run dev
```

## Features

- **8-Dimension AI Scoring** — Hook (25%), Readability (15%), Structure (10%), Emotional Pull (20%), Timing (10%), Engagement (10%), Audience Match (5%), Clarity (5%)
- **X Integration** — OAuth via Nango, post sync, direct publish
- **Real-Time Analysis** — Sub-200ms scoring with OpenAI GPT-4o-mini
- **17 Pages** — Dashboard, Draft Scorer, Insights, Timeline, Creators, Hashtags, Topics, Sentiment, Forecasting, Reports, Publish, Command Center, Replies, Weekly Report, Autopsy, Scorecard, Settings, Pricing
- **Analytics** — PostHog integration for product analytics

## Architecture

```
Frontend (React 19 + Vite + Tailwind)
  |
  |-- API Client --> Backend (Hono + PostgreSQL)
  |-- OAuth --> Nango --> X API
  |-- Analytics --> PostHog
  |
Backend
  |-- AI Scoring --> OpenAI GPT-4o-mini
  |-- Auth --> JWT + bcrypt
  |-- X Proxy --> Nango --> X API v2
  |-- Database --> PostgreSQL (Neon)
```

## Documentation

- [API & MCP Integration Research](app/docs/API_MCP_INTEGRATION_RESEARCH.md)
- [Deployment Guide](app/docs/DEPLOYMENT_GUIDE.md)

## Get API Keys

| Service | URL | Free Tier |
|---------|-----|-----------|
| Nango (X OAuth) | https://app.nango.dev | 1,000 connections |
| OpenAI | https://platform.openai.com | $5 credit |
| Neon DB | https://neon.tech | 500MB |
| PostHog | https://app.posthog.com | 1M events |

## License

MIT
