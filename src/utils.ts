declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
  }
}

export const analytics = {
  page: () => {
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'page_view');
    }
  },
  track: (eventName: string, properties?: Record<string, unknown>) => {
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, properties);
    }
  }
};
