'use client';

import { useCart } from '@/lib/cart';

import { CartItemRow } from './CartItemRow';

export function CartItemList(): React.JSX.Element {
  const { items } = useCart();

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-charcoal">
        Your Items ({items.length})
      </h2>
      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <CartItemRow key={item.product_id} item={item} />
        ))}
      </div>
    </div>
  );
}
