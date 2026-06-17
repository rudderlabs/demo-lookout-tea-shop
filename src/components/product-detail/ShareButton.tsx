'use client';

import { useCallback, useState } from 'react';

import type { TeaProduct } from '@/data/schema';
import {
  toProductPayload,
  trackProductShared,
  useRudderAnalytics,
} from '@/lib/analytics';

interface ShareButtonProps {
  product: TeaProduct;
}

export function ShareButton({
  product,
}: ShareButtonProps): React.JSX.Element {
  const analytics = useRudderAnalytics();
  const [copied, setCopied] = useState(false);

  const handleShare = useCallback(async (): Promise<void> => {
    const productPayload = toProductPayload(product);
    const url =
      typeof window !== 'undefined' ? window.location.href : product.url;

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out ${product.name} from Tea Leafs`,
          url,
        });
        // Only fires after the user completes the share — not on cancel
        if (analytics) {
          trackProductShared(analytics, {
            ...productPayload,
            share_method: 'native',
          });
        }
      } catch (err) {
        // AbortError = user cancelled the dialog — do not track
        if (err instanceof Error && err.name !== 'AbortError') {
          // Unexpected error: fall back to clipboard
          await copyToClipboard(url, productPayload, analytics, setCopied);
        }
      }
    } else {
      await copyToClipboard(url, productPayload, analytics, setCopied);
    }
  }, [analytics, product]);

  return (
    <button
      type="button"
      onClick={handleShare}
      aria-label={copied ? 'Link copied!' : 'Share product'}
      title={copied ? 'Link copied!' : 'Share product'}
      className={`flex h-12 w-12 items-center justify-center rounded-lg border-2 transition-all duration-200 ${
        copied
          ? 'border-matcha bg-matcha/10 text-matcha'
          : 'border-sage bg-white text-charcoal/40 hover:border-matcha hover:text-matcha'
      }`}
    >
      {copied ? (
        // Checkmark — shown briefly after copy
        <svg
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ) : (
        // Share icon
        <svg
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
      )}
    </button>
  );
}

async function copyToClipboard(
  url: string,
  productPayload: ReturnType<typeof toProductPayload>,
  analytics: ReturnType<typeof useRudderAnalytics>,
  setCopied: (v: boolean) => void,
): Promise<void> {
  try {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    if (analytics) {
      trackProductShared(analytics, {
        ...productPayload,
        share_method: 'copy_link',
      });
    }
  } catch {
    // Clipboard unavailable — nothing to do
  }
}
