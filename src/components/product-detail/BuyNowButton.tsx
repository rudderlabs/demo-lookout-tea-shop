'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/shared/Button';
import type { TeaProduct } from '@/data/schema';
import { useAuth } from '@/lib/auth';
import { useCart } from '@/lib/cart';
import {
  toProductPayload,
  trackProductAdded,
  useRudderAnalytics,
} from '@/lib/analytics';

interface BuyNowButtonProps {
  product: TeaProduct;
  quantity: number;
}

export function BuyNowButton({
  product,
  quantity,
}: BuyNowButtonProps): React.JSX.Element | null {
  const { addItem } = useCart();
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const analytics = useRudderAnalytics();

  const handleBuyNow = useCallback((): void => {
    addItem(product, quantity);

    if (analytics) {
      trackProductAdded(analytics, {
        ...toProductPayload(product),
        quantity,
        checkout_flow: 'instant',
      });
    }

    router.push('/checkout/instant');
  }, [addItem, product, quantity, router, analytics]);

  if (!isLoggedIn) return null;

  return (
    <Button
      variant="secondary"
      size="lg"
      disabled={!product.in_stock}
      onClick={handleBuyNow}
      className="flex-1"
    >
      Buy Now
    </Button>
  );
}
