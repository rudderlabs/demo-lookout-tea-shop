'use client';

import { useState } from 'react';

import { QuantitySelector } from '@/components/shared/QuantitySelector';
import type { TeaProduct } from '@/data/schema';

import { AddToCartButton } from './AddToCartButton';
import { BuyNowButton } from './BuyNowButton';

interface ProductActionsProps {
  product: TeaProduct;
}

export function ProductActions({
  product,
}: ProductActionsProps): React.JSX.Element {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="flex flex-wrap items-center gap-4">
      <QuantitySelector quantity={quantity} onChange={setQuantity} />
      <AddToCartButton product={product} quantity={quantity} />
      <BuyNowButton product={product} quantity={quantity} />
    </div>
  );
}
