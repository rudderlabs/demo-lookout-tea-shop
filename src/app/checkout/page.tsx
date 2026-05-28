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
import { generateId } from '@/lib/utils/id';
import { formatPrice } from '@/lib/utils/format';
import { CheckoutStepper } from '@/components/checkout/CheckoutStepper';
import { ShippingForm } from '@/components/checkout/ShippingForm';
import type { ShippingData } from '@/components/checkout/ShippingForm';
import { PaymentForm } from '@/components/checkout/PaymentForm';
import type { PaymentData } from '@/components/checkout/PaymentForm';
import { OrderReview } from '@/components/checkout/OrderReview';

const CHECKOUT_STEPS = ['Shipping', 'Payment', 'Review'];

const SHIPPING_THRESHOLD = 50;
const SHIPPING_COST = 5.99;
const TAX_RATE = 0.08;

export default function CheckoutPage(): React.JSX.Element {
  usePageTracking('Checkout');

  const router = useRouter();
  const { items, subtotal, discount, coupon, clearCart, isHydrated } =
    useCart();
  const analytics = useRudderAnalytics();

  // Stable IDs for the checkout session — initialized once via useState lazy init
  const [stableOrderId] = useState(generateId);
  const [stableCheckoutId] = useState(generateId);
  const checkoutStartedFired = useRef(false);
  const isPlacingOrder = useRef(false);

  const [currentStep, setCurrentStep] = useState(1);
  const [shippingData, setShippingData] = useState<ShippingData | null>(null);
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);

  // Redirect to cart if empty (but not during order placement or before hydration)
  useEffect(() => {
    if (isHydrated && items.length === 0 && !isPlacingOrder.current) {
      router.replace('/cart');
    }
  }, [isHydrated, items.length, router]);

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
      checkout_flow: 'standard',
    });
  }, [analytics, items, subtotal, coupon, stableOrderId]);

  function handleShippingComplete(data: ShippingData): void {
    setShippingData(data);
    setCurrentStep(2);
  }

  function handlePaymentComplete(data: PaymentData): void {
    setPaymentData(data);
    setCurrentStep(3);
  }

  function handlePlaceOrder(): void {
    isPlacingOrder.current = true;
    const shipping = subtotal > SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
    const taxableAmount = subtotal - discount;
    const tax = taxableAmount * TAX_RATE;
    const total = taxableAmount + shipping + tax;

    // Store order data in sessionStorage for confirmation page
    const orderData = {
      orderId: stableOrderId,
      total,
      subtotal,
      discount,
      shipping,
      tax,
      currency: 'USD',
      coupon: coupon?.code,
      checkout_flow: 'standard',
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

  // Prevent rendering checkout content while redirecting
  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-charcoal/60">Redirecting to cart...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-center text-3xl font-bold text-charcoal">
        Checkout
      </h1>

      <CheckoutStepper currentStep={currentStep} steps={CHECKOUT_STEPS} />

      <div className="rounded-2xl bg-cream/50 p-6 shadow-sm sm:p-8">
        {currentStep === 1 && (
          <ShippingForm
            onComplete={handleShippingComplete}
            checkoutId={stableCheckoutId}
          />
        )}

        {currentStep === 2 && (
          <PaymentForm
            onComplete={handlePaymentComplete}
            checkoutId={stableCheckoutId}
            orderId={stableOrderId}
          />
        )}

        {currentStep === 3 && shippingData && paymentData && (
          <OrderReview
            shippingData={shippingData}
            paymentData={paymentData}
            onPlaceOrder={handlePlaceOrder}
            checkoutId={stableCheckoutId}
          />
        )}
      </div>
    </div>
  );
}
