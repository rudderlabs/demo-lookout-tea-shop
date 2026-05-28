'use client';

import { useEffect } from 'react';

import { useCart } from '@/lib/cart';
import { formatPrice } from '@/lib/utils/format';
import { PriceDisplay } from '@/components/shared/PriceDisplay';
import { Button } from '@/components/shared/Button';
import {
  trackCheckoutStepViewed,
  useRudderAnalytics,
} from '@/lib/analytics';

import type { ShippingData } from './ShippingForm';
import type { PaymentData } from './PaymentForm';

interface OrderReviewProps {
  shippingData: ShippingData;
  paymentData: PaymentData;
  onPlaceOrder: () => void;
  checkoutId: string;
}

const SHIPPING_THRESHOLD = 50;
const SHIPPING_COST = 5.99;
const TAX_RATE = 0.08;

export function OrderReview({
  shippingData,
  paymentData,
  onPlaceOrder,
  checkoutId,
}: OrderReviewProps): React.JSX.Element {
  const { items, subtotal, discount, coupon } = useCart();
  const analytics = useRudderAnalytics();

  useEffect(() => {
    if (analytics) {
      trackCheckoutStepViewed(analytics, {
        checkout_id: checkoutId,
        step: 3,
        step_name: 'Review',
      });
    }
  }, [analytics, checkoutId]);

  const shipping = subtotal > SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const taxableAmount = subtotal - discount;
  const tax = taxableAmount * TAX_RATE;
  const total = taxableAmount + shipping + tax;

  const maskedCard = `**** **** **** ${paymentData.cardNumber.replace(/\s/g, '').slice(-4)}`;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-charcoal">Review Your Order</h2>

      {/* Order items */}
      <div className="rounded-xl bg-white p-5 shadow-sm">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-charcoal/50">
          Items
        </h3>
        <div className="divide-y divide-sage/40">
          {items.map((item) => (
            <div
              key={item.product_id}
              className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
            >
              <div className="flex-1">
                <p className="text-sm font-medium text-charcoal">{item.name}</p>
                <p className="text-xs text-charcoal/50">
                  {item.variant} x {item.quantity}
                </p>
              </div>
              <PriceDisplay
                price={item.price * item.quantity}
                className="text-sm"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Shipping address */}
      <div className="rounded-xl bg-white p-5 shadow-sm">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-charcoal/50">
          Shipping Address
        </h3>
        <div className="text-sm text-charcoal/80">
          <p className="font-medium text-charcoal">
            {shippingData.firstName} {shippingData.lastName}
          </p>
          <p>{shippingData.address}</p>
          <p>
            {shippingData.city}, {shippingData.state} {shippingData.zipCode}
          </p>
          <p>{shippingData.country}</p>
          <p className="mt-1 text-charcoal/50">{shippingData.email}</p>
        </div>
      </div>

      {/* Payment method */}
      <div className="rounded-xl bg-white p-5 shadow-sm">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-charcoal/50">
          Payment Method
        </h3>
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-12 items-center justify-center rounded bg-steam">
            <svg
              className="h-5 w-5 text-charcoal/60"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
              <line x1="1" y1="10" x2="23" y2="10" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-charcoal">{maskedCard}</p>
            <p className="text-xs text-charcoal/50">
              Expires {paymentData.expiry}
            </p>
          </div>
        </div>
      </div>

      {/* Order totals */}
      <div className="rounded-xl bg-white p-5 shadow-sm">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-charcoal/50">
          Order Total
        </h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-charcoal/70">Subtotal</span>
            <span className="text-charcoal">{formatPrice(subtotal)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-matcha">
                Discount{coupon ? ` (${coupon.code})` : ''}
              </span>
              <span className="text-matcha">-{formatPrice(discount)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-charcoal/70">Shipping</span>
            <span className="text-charcoal">
              {shipping === 0 ? 'Free' : formatPrice(shipping)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-charcoal/70">Tax (8%)</span>
            <span className="text-charcoal">{formatPrice(tax)}</span>
          </div>
          <div className="border-t border-sage/60 pt-2">
            <div className="flex justify-between">
              <span className="text-base font-bold text-charcoal">Total</span>
              <span className="text-lg font-bold text-charcoal">
                {formatPrice(total)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Place order */}
      <div className="flex justify-end pt-2">
        <Button
          type="button"
          variant="primary"
          size="lg"
          onClick={onPlaceOrder}
          className="w-full sm:w-auto"
        >
          Place Order
        </Button>
      </div>
    </div>
  );
}
