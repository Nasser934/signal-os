const NANGO_SECRET_KEY = process.env.NANGO_SECRET_KEY;
const NANGO_HOST = process.env.NANGO_HOST || 'https://api.nango.dev';

interface NangoProxyRequest {
  endpoint: string;
  method?: 'GET' | 'POST' | 'DELETE';
  providerConfigKey: string;
  connectionId: string;
  data?: unknown;
}

async function nangoProxy({ endpoint, method = 'GET', providerConfigKey, connectionId, data }: NangoProxyRequest) {
  if (!NANGO_SECRET_KEY) throw new Error('NANGO_SECRET_KEY not configured');
  const res = await fetch(`${NANGO_HOST}/proxy${endpoint}`, {
    method,
    headers: {
      'Authorization': `Bearer ${NANGO_SECRET_KEY}`,
      'Connection-Id': connectionId,
      'Provider-Config-Key': providerConfigKey,
      'Content-Type': 'application/json',
    },
    body: data ? JSON.stringify(data) : undefined,
  });
  if (!res.ok) { const err = await res.text(); throw new Error(`Nango proxy error: ${res.status} - ${err}`); }
  return res.json();
}

export async function getXUserProfile(connectionId: string) {
  return nangoProxy({ endpoint: '/users/me?user.fields=public_metrics,profile_image_url', providerConfigKey: 'twitter', connectionId });
}
export async function getXUserTweets(connectionId: string, maxResults = 50) {
  return nangoProxy({ endpoint: `/users/me/tweets?max_results=${maxResults}&tweet.fields=public_metrics,created_at`, providerConfigKey: 'twitter', connectionId });
}
export async function publishTweet(connectionId: string, text: string) {
  return nangoProxy({ endpoint: '/tweets', method: 'POST', providerConfigKey: 'twitter', connectionId, data: { text } });
}
export async function deleteTweet(connectionId: string, tweetId: string) {
  return nangoProxy({ endpoint: `/tweets/${tweetId}`, method: 'DELETE', providerConfigKey: 'twitter', connectionId });
}
export async function searchRecentTweets(connectionId: string, query: string, maxResults = 10) {
  return nangoProxy({ endpoint: `/tweets/search/recent?query=${encodeURIComponent(query)}&max_results=${maxResults}&tweet.fields=public_metrics,created_at`, providerConfigKey: 'twitter', connectionId });
}
