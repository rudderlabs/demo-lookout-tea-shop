'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import { useCart } from '@/lib/cart';
import {
  toProductPayload,
  trackCartViewed,
  usePageTracking,
  useRudderAnalytics,
} from '@/lib/analytics';
import { Button } from '@/components/shared/Button';
import { CartItemList } from '@/components/cart/CartItemList';
import { CouponInput } from '@/components/cart/CouponInput';
import { CartSummary } from '@/components/cart/CartSummary';
import { generateId } from '@/lib/utils/id';

export default function CartPage(): React.JSX.Element {
  usePageTracking('Cart');

  const { items, subtotal } = useCart();
  const analytics = useRudderAnalytics();
  const [stableCartId] = useState(generateId);
  const cartViewedFired = useRef(false);

  useEffect(() => {
    if (!analytics || items.length === 0 || cartViewedFired.current) return;
    cartViewedFired.current = true;

    trackCartViewed(analytics, {
      cart_id: stableCartId,
      products: items.map((item) => ({
        ...toProductPayload(item),
        quantity: item.quantity,
      })),
      value: subtotal,
      currency: 'USD',
    });
  }, [analytics, items, subtotal, stableCartId]);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="flex flex-col items-center text-center">
          {/* Empty cart illustration */}
          <div className="mb-6 flex h-28 w-28 items-center justify-center rounded-full bg-steam">
            <svg
              className="h-14 w-14 text-sage"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
          </div>

          <h1 className="mb-2 text-2xl font-bold text-charcoal">
            Your cart is empty
          </h1>
          <p className="mb-8 max-w-sm text-charcoal/60">
            Looks like you haven&apos;t added any teas yet. Explore our
            collection and find your perfect cup.
          </p>

          <Link href="/products">
            <Button variant="primary" size="lg">
              Browse Teas
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-charcoal">Your Cart</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left: Items + Coupon */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          <CartItemList />
          <CouponInput />
        </div>

        {/* Right: Summary + Checkout */}
        <div className="flex flex-col gap-4">
          <CartSummary />
          <Link href="/checkout" className="w-full">
            <Button variant="primary" size="lg" className="w-full">
              Proceed to Checkout
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
