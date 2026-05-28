'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import { useCart } from '@/lib/cart';
import {
  toProductPayload,
  trackCheckoutStarted,
  usePageTracking,
  useRudderAnalytics,
} from '@/lib/analytics';
import { useAuth } from '@/lib/auth';
import { generateId } from '@/lib/utils/id';
import { formatPrice } from '@/lib/utils/format';
import { OrderReview } from '@/components/checkout/OrderReview';
import { getDemoPersonaByEmail } from '@/data/demo-personas';

const SHIPPING_THRESHOLD = 50;
const SHIPPING_COST = 5.99;
const TAX_RATE = 0.08;

export default function InstantCheckoutPage(): React.JSX.Element {
  usePageTracking('Instant Checkout');

  const router = useRouter();
  const { user, isLoggedIn } = useAuth();
  const { items, subtotal, discount, coupon, clearCart } = useCart();
  const analytics = useRudderAnalytics();

  const [stableOrderId] = useState(generateId);
  const [stableCheckoutId] = useState(generateId);
  const checkoutStartedFired = useRef(false);
  const isPlacingOrder = useRef(false);

  // Guard: redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      router.replace('/account');
    }
  }, [isLoggedIn, router]);

  // Guard: redirect if cart empty (but not during order placement)
  useEffect(() => {
    if (items.length === 0 && !isPlacingOrder.current) {
      router.replace('/cart');
    }
  }, [items.length, router]);

  // Fire checkout started
  useEffect(() => {
    if (!analytics || items.length === 0 || checkoutStartedFired.current)
      return;

    checkoutStartedFired.current = true;

    trackCheckoutStarted(analytics, {
      order_id: stableOrderId,
      value: subtotal,
      currency: 'USD',
      products: items.map((item) => ({
        ...toProductPayload(item),
        quantity: item.quantity,
      })),
      coupon: coupon?.code,
      checkout_flow: 'instant',
    });
  }, [analytics, items, subtotal, coupon, stableOrderId]);

  function handlePlaceOrder(): void {
    isPlacingOrder.current = true;
    const shipping = subtotal > SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
    const taxableAmount = subtotal - discount;
    const tax = taxableAmount * TAX_RATE;
    const total = taxableAmount + shipping + tax;

    const orderData = {
      orderId: stableOrderId,
      total,
      subtotal,
      discount,
      shipping,
      tax,
      currency: 'USD',
      coupon: coupon?.code,
      checkout_flow: 'instant',
      products: items.map((item) => ({
        ...toProductPayload(item),
        quantity: item.quantity,
      })),
    };

    try {
      sessionStorage.setItem(
        'serene-leaf-last-order',
        JSON.stringify(orderData),
      );
    } catch {
      // sessionStorage may be unavailable
    }

    clearCart();
    router.push(
      `/checkout/confirmation?orderId=${encodeURIComponent(stableOrderId)}&total=${encodeURIComponent(formatPrice(total))}`,
    );
  }

  // Show redirecting message while guards fire
  if (!isLoggedIn || items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-charcoal/60">Redirecting...</p>
      </div>
    );
  }

  const { shipping: shippingData, payment: paymentData } =
    getDemoPersonaByEmail(user?.email ?? '');

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-center text-3xl font-bold text-charcoal">
        Instant Checkout
      </h1>

      <div className="rounded-2xl bg-cream/50 p-6 shadow-sm sm:p-8">
        <OrderReview
          shippingData={shippingData}
          paymentData={paymentData}
          onPlaceOrder={handlePlaceOrder}
          checkoutId={stableCheckoutId}
        />
      </div>
    </div>
  );
}
