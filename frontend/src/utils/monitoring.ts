type MetricName = 'CLS' | 'FID' | 'LCP' | 'FCP' | 'TTFB';

interface WebVitalMetric {
  name: MetricName;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
}

// Function to send metrics to Google Analytics
const sendToAnalytics = (metric: WebVitalMetric) => {
  const gtag = (window as any).gtag;
  
  if (gtag) {
    gtag('event', 'web_vitals', {
      event_category: 'Web Vitals',
      event_label: metric.name,
      value: Math.round(metric.value),
      non_interaction: true,
      metric_rating: metric.rating,
    });
  }
};

// Function to get rating based on metric values
const getRating = (name: MetricName, value: number): WebVitalMetric['rating'] => {
  switch (name) {
    case 'CLS':
      return value <= 0.1 ? 'good' : value <= 0.25 ? 'needs-improvement' : 'poor';
    case 'FID':
      return value <= 100 ? 'good' : value <= 300 ? 'needs-improvement' : 'poor';
    case 'LCP':
      return value <= 2500 ? 'good' : value <= 4000 ? 'needs-improvement' : 'poor';
    case 'FCP':
      return value <= 1800 ? 'good' : value <= 3000 ? 'needs-improvement' : 'poor';
    case 'TTFB':
      return value <= 800 ? 'good' : value <= 1800 ? 'needs-improvement' : 'poor';
    default:
      return 'needs-improvement';
  }
};

// Function to track user interactions
export const trackEvent = (
  category: string,
  action: string,
  label?: string,
  value?: number
) => {
  const gtag = (window as any).gtag;
  
  if (gtag) {
    gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Function to track page views
export const trackPageView = (path: string, title: string) => {
  const gtag = (window as any).gtag;
  
  if (gtag) {
    gtag('config', import.meta.env.VITE_GA_TRACKING_ID, {
      page_path: path,
      page_title: title,
    });
  }
};

// Function to measure web vitals
export const measureWebVitals = () => {
  try {
    if ('performance' in window) {
      // First Contentful Paint
      const paintEntries = performance.getEntriesByType('paint');
      const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint');
      
      if (fcp) {
        const metric: WebVitalMetric = {
          name: 'FCP',
          value: fcp.startTime,
          rating: getRating('FCP', fcp.startTime),
        };
        sendToAnalytics(metric);
      }

      // Time to First Byte
      const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navEntry) {
        const ttfb = navEntry.responseStart;
        const metric: WebVitalMetric = {
          name: 'TTFB',
          value: ttfb,
          rating: getRating('TTFB', ttfb),
        };
        sendToAnalytics(metric);
      }
    }
  } catch (error) {
    console.error('Error measuring web vitals:', error);
  }
};

// Export monitoring functions
export const monitoring = {
  trackEvent,
  trackPageView,
  measureWebVitals,
}; 