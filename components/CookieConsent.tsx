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
      <div className="mx-auto max-w-2xl rounded-lg bg-card border border-border p-5 shadow-lg">
        <p className="text-sm font-sans text-foreground/85 mb-4 leading-relaxed">
          This site uses cookies to improve your experience and for analytics.
          By clicking &quot;Accept&quot;, you consent to the use of cookies.
        </p>
        <div className="flex gap-3">
          <button
            onClick={accept}
            className="rounded-md bg-primary px-5 py-2 text-sm font-condensed font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs"
          >
            Accept
          </button>
          <button
            onClick={decline}
            className="rounded-md border border-border bg-card px-5 py-2 text-sm font-condensed font-semibold text-foreground/80 hover:text-foreground hover:bg-muted/60 transition-colors"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
};