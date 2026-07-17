// Signal OS - API Client Layer
// Centralized HTTP client for all backend API calls

import env from './env';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

export interface ScorePayload {
  content: string;
  dimensions?: string[];
}

export interface ScoreApiResult {
  overallScore: number;
  dimensions: Record<string, { score: number; feedback: string[] }>;
  feedback: string[];
  estimatedEngagement: string;
  processingTime: string;
}

export interface TrendData {
  hashtags: Array<{ tag: string; posts: string; engagement: string; trend: string; hot: boolean }>;
  topics: Array<{ name: string; score: number; trend: string; volume: string; posts: string }>;
  creators: Array<{ rank: number; name: string; handle: string; followers: string; avgScore: number; engagement: string; niche: string; avatar: string }>;
}

class ApiClient {
  private baseUrl: string;
  private token: string | null;

  constructor() {
    this.baseUrl = env.API_URL;
    this.token = localStorage.getItem('sos_auth_token');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) localStorage.setItem('sos_auth_token', token);
    else localStorage.removeItem('sos_auth_token');
  }

  private async request<T>(method: string, path: string, body?: unknown): Promise<ApiResponse<T>> {
    if (!this.baseUrl) return { status: 200 };
    const url = `${this.baseUrl}${path}`;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (this.token) headers['Authorization'] = `Bearer ${this.token}`;
    try {
      const res = await fetch(url, { method, headers, body: body ? JSON.stringify(body) : undefined });
      if (!res.ok) { const errText = await res.text(); return { status: res.status, error: errText || `HTTP ${res.status}` }; }
      const data = await res.json();
      return { status: res.status, data };
    } catch (err) { const message = err instanceof Error ? err.message : 'Network error'; return { status: 0, error: message }; }
  }

  async login(email: string, password: string) {
    return this.request<{ token: string; user: { id: string; email: string; name: string } }>('POST', '/api/v1/auth/login', { email, password });
  }
  async register(email: string, password: string, name: string) {
    return this.request<{ token: string; user: { id: string; email: string; name: string } }>('POST', '/api/v1/auth/register', { email, password, name });
  }
  async me() {
    return this.request<{ id: string; email: string; name: string; plan: string }>('GET', '/api/v1/auth/me');
  }
  async scoreContent(payload: ScorePayload): Promise<ApiResponse<ScoreApiResult>> {
    if (!this.baseUrl) return { status: 200 };
    return this.request<ScoreApiResult>('POST', '/api/v1/scores', payload);
  }
  async getScoreHistory() {
    return this.request<Array<{ id: string; content: string; overallScore: number; createdAt: string }>>('GET', '/api/v1/scores');
  }
  async saveDraft(content: string, scoreResult: unknown) {
    return this.request<{ id: string }>('POST', '/api/v1/drafts', { content, scoreResult });
  }
  async getDrafts() {
    return this.request<Array<{ id: string; content: string; createdAt: string }>>('GET', '/api/v1/drafts');
  }
  async deleteDraft(id: string) {
    return this.request<void>('DELETE', `/api/v1/drafts/${id}`);
  }
  async getDashboardKpis() {
    return this.request<{ avgScore: number; postsScored: number; engagementRate: string; bestTime: string }>('GET', '/api/v1/analytics/dashboard');
  }
  async getTrends(): Promise<ApiResponse<TrendData>> {
    return this.request<TrendData>('GET', '/api/v1/analytics/trends');
  }
  async getXProfile(connectionId: string) {
    return this.request<unknown>('GET', `/api/v1/x/profile?connectionId=${connectionId}`);
  }
  async getXPosts(connectionId: string) {
    return this.request<unknown>('GET', `/api/v1/x/posts?connectionId=${connectionId}`);
  }
  async publishToX(connectionId: string, text: string) {
    return this.request<{ postId: string }>('POST', '/api/v1/x/publish', { connectionId, text });
  }
}

export const api = new ApiClient();

export async function checkApiHealth(): Promise<boolean> {
  if (!env.API_URL) return false;
  try { const res = await fetch(`${env.API_URL}/api/v1/health`, { method: 'GET' }); return res.ok; } catch { return false; }
}

export async function withFallback<T>(apiCall: () => Promise<ApiResponse<T>>, fallback: T, errorMessage = 'API unavailable, using local data'): Promise<T> {
  const res = await apiCall();
  if (res.error || !res.data) { if (env.IS_DEV) console.warn(errorMessage, res.error); return fallback; }
  return res.data;
}
