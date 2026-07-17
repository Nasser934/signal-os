import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { serve } from '@hono/node-server';
import dotenv from 'dotenv';

dotenv.config();

import authRoutes from './routes/auth';
import scoreRoutes from './routes/scores';
import draftRoutes from './routes/drafts';
import xProxyRoutes from './routes/x-proxy';
import analyticsRoutes from './routes/analytics';
import webhookRoutes from './routes/webhooks';

const app = new Hono();

const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:5173', 'http://localhost:4173', 'https://signalos.app'];

app.use(logger());
app.use(prettyJSON());
app.use(cors({
  origin: (origin) => { if (!origin) return '*'; if (allowedOrigins.includes(origin)) return origin; return null; },
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400,
}));

app.route('/api/v1/auth', authRoutes);
app.route('/api/v1/scores', scoreRoutes);
app.route('/api/v1/drafts', draftRoutes);
app.route('/api/v1/x', xProxyRoutes);
app.route('/api/v1/analytics', analyticsRoutes);
app.route('/api/v1/webhooks', webhookRoutes);
app.route('/', webhookRoutes);

app.onError((err, c) => { console.error('[Error]', err.message); return c.json({ error: 'Internal server error', message: err.message }, 500); });
app.notFound((c) => c.json({ error: 'Not found' }, 404));

const PORT = Number(process.env.PORT) || 8787;

console.log(`
╔════════════════════════════════════════════════════╗
║         Signal OS Backend API v1.0.0               ║
╠════════════════════════════════════════════════════╣
║  Port:      ${PORT.toString().padEnd(41)}║
║  Database:  ${(process.env.DATABASE_URL ? 'Connected' : 'Not configured').padEnd(41)}║
║  OpenAI:    ${(process.env.OPENAI_API_KEY ? 'Enabled' : 'Fallback mode').padEnd(41)}║
║  Nango:     ${(process.env.NANGO_SECRET_KEY ? 'Enabled' : 'Not configured').padEnd(41)}║
║  JWT:       ${(process.env.JWT_SECRET ? 'Custom secret' : 'Dev secret').padEnd(41)}║
╚════════════════════════════════════════════════════╝
`);

serve({ fetch: app.fetch, port: PORT });
export default app;
