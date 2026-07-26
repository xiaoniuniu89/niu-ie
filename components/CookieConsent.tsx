'use client';
import React, { useState, useEffect } from 'react';

const COOKIE_CONSENT_KEY = 'cookie-consent';

export const CookieConsent: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
    setVisible(false);
    if (typeof window !== 'undefined' && 'gtag' in window) {
      // @ts-expect-error gtag is a global function
      window.gtag('consent', 'update', {
        analytics_storage: 'granted',
      });
    }
  };

  const decline = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'declined');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6" role="dialog" aria-label="Cookie consent">
      <div className="mx-auto max-w-3xl rounded-2xl bg-foreground/5 backdrop-blur-md border border-border/30 p-6 shadow-lg">
        <p className="text-sm text-foreground/80 mb-4">
          This site uses cookies to improve your experience and for analytics.
          By clicking &quot;Accept&quot;, you consent to the use of cookies.
        </p>
        <div className="flex gap-3">
          <button
            onClick={accept}
            className="rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Accept
          </button>
          <button
            onClick={decline}
            className="rounded-md border border-border/50 px-5 py-2 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
};