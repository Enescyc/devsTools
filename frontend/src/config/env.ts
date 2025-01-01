interface EnvConfig {
  app: {
    url: string;
    apiUrl: string;
    environment: 'development' | 'production';
  };
  analytics: {
    enabled: boolean;
    gtmId: string;
    gaTrackingId: string;
  };
  ads: {
    enabled: boolean;
    clientId: string;
    slots: {
      footer: string;
    };
  };
}

function getEnvVar(key: string, defaultValue: string = ''): string {
  return import.meta.env[`VITE_${key}`] || defaultValue;
}

function getBooleanEnvVar(key: string, defaultValue: boolean = false): boolean {
  const value = getEnvVar(key);
  if (value === '') return defaultValue;
  return value.toLowerCase() === 'true';
}

export const env: EnvConfig = {
  app: {
    url: getEnvVar('APP_URL', 'http://localhost:5173'),
    apiUrl: getEnvVar('API_URL', 'http://localhost:3000'),
    environment: import.meta.env.MODE as 'development' | 'production',
  },
  analytics: {
    enabled: getBooleanEnvVar('ENABLE_ANALYTICS', false),
    gtmId: getEnvVar('GTM_ID'),
    gaTrackingId: getEnvVar('GA_TRACKING_ID'),
  },
  ads: {
    enabled: getBooleanEnvVar('ENABLE_ADS', false),
    clientId: getEnvVar('ADSENSE_CLIENT_ID'),
    slots: {
      footer: getEnvVar('ADSENSE_SLOT_FOOTER'),
    },
  },
};

// Type-safe environment helpers
export const isDevelopment = import.meta.env.DEV;
export const isProduction = import.meta.env.PROD;

// Validation
if (isProduction) {
  const requiredVars = [
    ['APP_URL', env.app.url],
    ['API_URL', env.app.apiUrl],
    ['GTM_ID', env.analytics.gtmId],
    ['GA_TRACKING_ID', env.analytics.gaTrackingId],
    ['ADSENSE_CLIENT_ID', env.ads.clientId],
    ['ADSENSE_SLOT_FOOTER', env.ads.slots.footer],
  ];

  for (const [key, value] of requiredVars) {
    if (!value) {
      throw new Error(`Missing required environment variable: VITE_${key}`);
    }
  }
} 