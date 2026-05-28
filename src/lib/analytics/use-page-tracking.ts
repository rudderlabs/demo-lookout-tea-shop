'use client';

import type { ApiObject } from '@rudderstack/analytics-js';
import { useEffect } from 'react';

import { useRudderAnalytics } from './use-rudder-analytics';

export function usePageTracking(
  pageName: string,
  properties?: Record<string, unknown>,
): void {
  const analytics = useRudderAnalytics();
  const propsKey = JSON.stringify(properties);

  useEffect(() => {
    if (!analytics) return;

    const parsed: ApiObject | undefined = propsKey
      ? (JSON.parse(propsKey) as ApiObject)
      : undefined;

    console.log('[Analytics] Page:', pageName, parsed);
    analytics.page(pageName, pageName, parsed);
  }, [analytics, pageName, propsKey]);
}
