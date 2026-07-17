// Signal OS - Analytics Integration (PostHog-ready)

import env from './env';

interface AnalyticsEvent {
  event: string;
  properties?: Record<string, unknown>;
}

class Analytics {
  private enabled = false;
  private queue: AnalyticsEvent[] = [];
  private initialized = false;

  init() {
    if (this.initialized) return;
    this.initialized = true;
    if (env.POSTHOG_KEY) { this.enabled = true; this.loadPostHog(); }
    else { console.info('[Analytics] PostHog not configured - dev mode'); }
    this.queue.forEach((e) => this.capture(e.event, e.properties));
    this.queue = [];
  }

  private async loadPostHog() {
    try {
      const posthog = await import('posthog-js');
      posthog.default.init(env.POSTHOG_KEY, { api_host: env.POSTHOG_HOST, capture_pageview: true, autocapture: true, persistence: 'localStorage' });
      (window as any).posthog = posthog.default;
      console.info('[Analytics] PostHog loaded');
    } catch { console.warn('[Analytics] Failed to load PostHog'); }
  }

  capture(event: string, properties?: Record<string, unknown>) {
    if (!this.initialized) { this.queue.push({ event, properties }); return; }
    if (env.IS_DEV) console.log(`[Analytics] ${event}`, properties);
    if (!this.enabled) return;
    try { const ph = (window as any).posthog; if (ph) ph.capture(event, properties); } catch { /* silently fail */ }
  }

  pageView(page: string) { this.capture('page_viewed', { page }); }
  scoreCreated(overallScore: number, dimensions: Record<string, number>) { this.capture('score_created', { overallScore, dimensions }); }
  draftSaved(score: number) { this.capture('draft_saved', { score }); }
  xConnected() { this.capture('x_connected'); }
  xDisconnected() { this.capture('x_disconnected'); }
  postPublished(score?: number) { this.capture('post_published', { score }); }
  postSynced(count: number) { this.capture('x_posts_synced', { count }); }
  upgradeClicked(plan: string) { this.capture('upgrade_clicked', { plan }); }
  settingsChanged(category: string, setting: string, value: unknown) { this.capture('settings_changed', { category, setting, value }); }
  identify(userId: string, traits?: Record<string, unknown>) {
    if (!this.enabled) return;
    try { const ph = (window as any).posthog; if (ph) ph.identify(userId, traits); } catch { /* silently fail */ }
  }
  reset() {
    if (!this.enabled) return;
    try { const ph = (window as any).posthog; if (ph) ph.reset(); } catch { /* silently fail */ }
  }
}

export const analytics = new Analytics();
