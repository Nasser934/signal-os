// Signal OS - Environment Configuration

const env = {
  API_URL: import.meta.env.VITE_API_URL || '',
  NANGO_PUBLIC_KEY: import.meta.env.VITE_NANGO_PUBLIC_KEY || '',
  NANGO_HOST: import.meta.env.VITE_NANGO_HOST || 'https://api.nango.dev',
  POSTHOG_KEY: import.meta.env.VITE_POSTHOG_KEY || '',
  POSTHOG_HOST: import.meta.env.VITE_POSTHOG_HOST || 'https://app.posthog.com',
  APP_ENV: (import.meta.env.VITE_APP_ENV as 'development' | 'staging' | 'production') || 'development',
  APP_VERSION: '2.1.0',
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
};

export function validateEnv(): string[] {
  const missing: string[] = [];
  if (env.IS_PROD) {
    if (!env.API_URL) missing.push('VITE_API_URL');
    if (!env.NANGO_PUBLIC_KEY) missing.push('VITE_NANGO_PUBLIC_KEY');
  }
  return missing;
}

export default env;
