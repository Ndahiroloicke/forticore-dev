import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface GoogleAnalyticsProps {
  measurementId?: string;
}

/**
 * Google Analytics Component
 * Tracks page views and user interactions
 * 
 * Usage:
 * 1. Add this component to your main App.tsx
 * 2. Set VITE_GA_MEASUREMENT_ID in your .env file
 * 3. Example: VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
 */
const GoogleAnalytics = ({ measurementId }: GoogleAnalyticsProps) => {
  const location = useLocation();
  const GA_MEASUREMENT_ID = measurementId || import.meta.env.VITE_GA_MEASUREMENT_ID;

  useEffect(() => {
    // Only load in production
    if (!GA_MEASUREMENT_ID || import.meta.env.DEV) {
      return;
    }

    // Load Google Analytics script
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script1);

    // Initialize Google Analytics
    const script2 = document.createElement('script');
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${GA_MEASUREMENT_ID}', {
        send_page_view: false
      });
    `;
    document.head.appendChild(script2);

    return () => {
      // Cleanup scripts on unmount
      document.head.removeChild(script1);
      document.head.removeChild(script2);
    };
  }, [GA_MEASUREMENT_ID]);

  useEffect(() => {
    if (!GA_MEASUREMENT_ID || import.meta.env.DEV) {
      return;
    }

    // Track page view on route change
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('config', GA_MEASUREMENT_ID, {
        page_path: location.pathname + location.search,
      });
    }
  }, [location, GA_MEASUREMENT_ID]);

  return null;
};

/**
 * Track custom events
 * Usage: trackEvent('button_click', { button_name: 'download' })
 */
export const trackEvent = (
  eventName: string,
  eventParams?: Record<string, any>
) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, eventParams);
  }
};

/**
 * Track conversion events
 */
export const trackConversion = (conversionId: string, value?: number) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'conversion', {
      send_to: conversionId,
      value: value || 0,
      currency: 'USD',
    });
  }
};

/**
 * Track user engagement
 */
export const trackEngagement = (engagementType: string, data?: any) => {
  trackEvent('user_engagement', {
    engagement_type: engagementType,
    ...data,
  });
};

export default GoogleAnalytics;

