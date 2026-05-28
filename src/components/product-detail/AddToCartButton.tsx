'use client';

import { useCallback, useState } from 'react';

import { Button } from '@/components/shared/Button';
import type { TeaProduct } from '@/data/schema';
import {
  toProductPayload,
  trackProductAdded,
  useRudderAnalytics,
} from '@/lib/analytics';
import { useCart } from '@/lib/cart';

interface AddToCartButtonProps {
  product: TeaProduct;
  quantity: number;
}

export function AddToCartButton({
  product,
  quantity,
}: AddToCartButtonProps): React.JSX.Element {
  const analytics = useRudderAnalytics();
  const { addItem } = useCart();
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleAddToCart = useCallback((): void => {
    addItem(product, quantity);

    if (analytics) {
      trackProductAdded(analytics, {
        ...toProductPayload(product),
        quantity,
      });
    }

    setShowConfirmation(true);
    setTimeout(() => {
      setShowConfirmation(false);
    }, 2000);
  }, [analytics, product, quantity, addItem]);

  return (
    <Button
      variant="primary"
      size="lg"
      disabled={!product.in_stock}
      onClick={handleAddToCart}
      className="flex-1"
    >
      {showConfirmation ? 'Added!' : 'Add to Cart'}
    </Button>
  );
}
