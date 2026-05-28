'use client';

import type { RudderAnalytics } from '@rudderstack/analytics-js';
import { useEffect, useRef, useState } from 'react';

let initializationPromise: Promise<RudderAnalytics> | null = null;

async function initializeAnalytics(): Promise<RudderAnalytics> {
  if (initializationPromise) {
    return initializationPromise;
  }

  initializationPromise = (async () => {
    const { RudderAnalytics } = await import('@rudderstack/analytics-js');
    const analytics = new RudderAnalytics();

    const writeKey =
      process.env['NEXT_PUBLIC_RUDDERSTACK_WRITE_KEY'] ||
      '3A2gZcVrnZOo48WpqNMzdDNWv2r';
    const dataPlaneUrl =
      process.env['NEXT_PUBLIC_RUDDERSTACK_DATAPLANE_URL'] ||
      'https://rudderstacmww.dataplane.rudderstack.com';

    if (writeKey && dataPlaneUrl) {
      analytics.load(writeKey, dataPlaneUrl, {
        plugins: ['BeaconQueue'],
      });
      analytics.ready(() => {
        console.log('[Analytics] RudderStack SDK ready');
      });
    } else {
      console.warn(
        '[Analytics] Missing RUDDERSTACK_WRITE_KEY or DATAPLANE_URL — running in dry-run mode',
      );
    }

    return analytics;
  })();

  return initializationPromise;
}

export function useRudderAnalytics(): RudderAnalytics | undefined {
  const [analytics, setAnalytics] = useState<RudderAnalytics | undefined>(
    undefined,
  );
  const isInitializing = useRef(false);

  useEffect(() => {
    if (isInitializing.current) return;
    isInitializing.current = true;

    void initializeAnalytics().then(setAnalytics);
  }, []);

  return analytics;
}
