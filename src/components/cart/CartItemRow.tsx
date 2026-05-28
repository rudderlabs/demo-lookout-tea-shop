'use client';

import type { CartItem } from '@/data/schema';
import { useCart } from '@/lib/cart';
import {
  toProductPayload,
  trackProductRemoved,
  useRudderAnalytics,
} from '@/lib/analytics';
import { QuantitySelector } from '@/components/shared/QuantitySelector';
import { PriceDisplay } from '@/components/shared/PriceDisplay';

interface CartItemRowProps {
  item: CartItem;
}

function TrashIcon(): React.JSX.Element {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  );
}

export function CartItemRow({ item }: CartItemRowProps): React.JSX.Element {
  const { removeItem, updateQuantity } = useCart();
  const analytics = useRudderAnalytics();

  function handleRemove(): void {
    removeItem(item.product_id);

    if (analytics) {
      trackProductRemoved(analytics, {
        ...toProductPayload(item),
        quantity: item.quantity,
      });
    }
  }

  function handleQuantityChange(quantity: number): void {
    updateQuantity(item.product_id, quantity);
  }

  const lineTotal = item.price * item.quantity;

  return (
    <div className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:gap-6">
      {/* Product image placeholder */}
      <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-lg bg-steam sm:h-24 sm:w-24">
        <svg
          className="h-10 w-10 text-sage"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.71c.79.14 1.6.21 2.34.21 5.05 0 9.88-3.71 11.45-9.5l.1-.35-.35-.1C18.48 9.07 17 8.35 17 8zm-5.24 9.5c-.82 0-1.68-.12-2.5-.34C10.82 14.28 12.34 12 15 10.5c-2.16 1.5-3.5 3.62-4.24 5.77V16c0-4.5 3-8.5 8-10-.17.5-.62 1.33-1.34 2.5-.71 1.16-1.82 2.5-3.33 3.67-.24.8-.4 1.5-.47 2.08-.1.5-.14.87-.14 1.25h-.72z" />
        </svg>
      </div>

      {/* Product info */}
      <div className="flex flex-1 flex-col gap-1">
        <h3 className="text-base font-semibold text-charcoal">{item.name}</h3>
        <p className="text-sm text-charcoal/60">{item.variant}</p>
        <div className="mt-1">
          <PriceDisplay price={item.price} className="text-sm text-charcoal/80" />
          <span className="text-sm text-charcoal/40"> / unit</span>
        </div>
      </div>

      {/* Quantity + Remove */}
      <div className="flex flex-col items-end gap-3">
        <button
          type="button"
          onClick={handleRemove}
          aria-label={`Remove ${item.name} from cart`}
          className="text-charcoal/40 transition-colors hover:text-red-500"
        >
          <TrashIcon />
        </button>

        <QuantitySelector
          quantity={item.quantity}
          onChange={handleQuantityChange}
        />

        {/* Line total */}
        <PriceDisplay price={lineTotal} className="text-base font-bold" />
      </div>
    </div>
  );
}
