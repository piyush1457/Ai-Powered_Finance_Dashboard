import { useEffect, useCallback } from 'react';

/**
 * Custom hook for analytics tracking.
 * @param {string} [pageName] - Optional page name to track on mount.
 * @returns {{ trackEvent: Function, trackPageView: Function }}
 */
export const useAnalytics = (pageName) => {
  // Use import.meta.env for Vite instead of process.env if possible, 
  // but process.env is defined in vite.config.js for this project.
  const isDev = typeof process !== 'undefined' && process.env.NODE_ENV === 'development';

  const trackEvent = useCallback((category, action, label = null, value = null) => {
    const eventData = { event: 'custom_event', category, action, label, value };
    
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(eventData);

    if (isDev) {
      console.log('%c[Analytics Event]', 'color: #0058BE; font-weight: bold;', eventData);
    }
  }, [isDev]);

  const trackPageView = useCallback((name) => {
    const eventData = { event: 'page_view', pageName: name };
    
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(eventData);

    if (isDev) {
      console.log('%c[Analytics PageView]', 'color: #10B981; font-weight: bold;', eventData);
    }
  }, [isDev]);

  useEffect(() => {
    if (pageName) {
      trackPageView(pageName);
    }
  }, [pageName, trackPageView]);

  return { trackEvent, trackPageView };
};
