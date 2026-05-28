'use client';

import { Suspense, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';

import {
  trackOrderCompleted,
  usePageTracking,
  useRudderAnalytics,
} from '@/lib/analytics';
import type { CartProductPayload } from '@/lib/analytics';
import { OrderSuccess } from '@/components/confirmation/OrderSuccess';

interface StoredOrderData {
  orderId: string;
  total: number;
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  currency: string;
  coupon?: string;
  checkout_flow?: string;
  products: CartProductPayload[];
}

function loadOrderFromStorage(orderId: string): StoredOrderData | null {
  try {
    const raw = sessionStorage.getItem('serene-leaf-last-order');
    if (!raw) return null;

    const data = JSON.parse(raw) as StoredOrderData;
    if (data.orderId === orderId) return data;

    return null;
  } catch {
    return null;
  }
}

function ConfirmationContent(): React.JSX.Element {
  usePageTracking('Order Confirmation');

  const searchParams = useSearchParams();
  const analytics = useRudderAnalytics();
  const orderTrackedRef = useRef(false);

  const orderId = searchParams.get('orderId') ?? 'unknown';
  const totalParam = searchParams.get('total') ?? '';

  const parsedTotal = parseFloat(totalParam.replace(/[^0-9.]/g, ''));
  const displayTotal = Number.isNaN(parsedTotal) ? 0 : parsedTotal;

  useEffect(() => {
    if (!analytics || orderTrackedRef.current) return;
    orderTrackedRef.current = true;

    const storedOrder = loadOrderFromStorage(orderId);

    if (storedOrder) {
      trackOrderCompleted(analytics, {
        order_id: storedOrder.orderId,
        total: storedOrder.total,
        subtotal: storedOrder.subtotal,
        discount: storedOrder.discount,
        shipping: storedOrder.shipping,
        tax: storedOrder.tax,
        currency: storedOrder.currency,
        products: storedOrder.products,
        coupon: storedOrder.coupon,
        checkout_flow: storedOrder.checkout_flow,
      });

      try {
        sessionStorage.removeItem('serene-leaf-last-order');
      } catch {
        // Ignore
      }
    } else {
      trackOrderCompleted(analytics, {
        order_id: orderId,
        total: displayTotal,
        subtotal: displayTotal,
        discount: 0,
        shipping: 0,
        tax: 0,
        currency: 'USD',
        products: [],
      });
    }
  }, [analytics, orderId, displayTotal]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <OrderSuccess orderId={orderId} total={displayTotal} />
    </div>
  );
}

export default function ConfirmationPage(): React.JSX.Element {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="text-charcoal/50">Loading order details...</div>
        </div>
      }
    >
      <ConfirmationContent />
    </Suspense>
  );
}
