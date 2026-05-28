'use client';

import { useCallback, useState } from 'react';

import type { TeaProduct } from '@/data/schema';
import {
  toProductPayload,
  trackProductAddedToWishlist,
  useRudderAnalytics,
} from '@/lib/analytics';

interface WishlistButtonProps {
  product: TeaProduct;
}

export function WishlistButton({
  product,
}: WishlistButtonProps): React.JSX.Element {
  const analytics = useRudderAnalytics();
  const [wishlisted, setWishlisted] = useState(false);

  const handleToggle = useCallback((): void => {
    const newState = !wishlisted;
    setWishlisted(newState);

    if (newState && analytics) {
      trackProductAddedToWishlist(analytics, toProductPayload(product));
    }
  }, [wishlisted, analytics, product]);

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      className={`flex h-12 w-12 items-center justify-center rounded-lg border-2 transition-all duration-200 ${
        wishlisted
          ? 'border-red-300 bg-red-50 text-red-500'
          : 'border-sage bg-white text-charcoal/40 hover:border-red-300 hover:text-red-400'
      }`}
    >
      <svg
        className="h-6 w-6"
        viewBox="0 0 24 24"
        fill={wishlisted ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
      </svg>
    </button>
  );
}
