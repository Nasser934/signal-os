import { Hono } from 'hono';

const router = new Hono();

router.post('/nango', async (c) => {
  try {
    const body = await c.req.json();
    console.log('[Webhook] Nango connection:', body);
    return c.json({ received: true });
  } catch (err: any) {
    console.error('[Webhook] Nango error:', err.message);
    return c.json({ error: err.message }, 500);
  }
});

router.get('/health', (c) => c.json({ status: 'ok', version: '1.0.0', timestamp: new Date().toISOString() }));

export default router;
