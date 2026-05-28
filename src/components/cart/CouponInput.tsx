'use client';

import { useState } from 'react';

import { coupons } from '@/data/coupons';
import { useCart } from '@/lib/cart';
import {
  trackCouponApplied,
  trackCouponDenied,
  useRudderAnalytics,
} from '@/lib/analytics';
import { Button } from '@/components/shared/Button';

function TagIcon(): React.JSX.Element {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  );
}

function CloseIcon(): React.JSX.Element {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export function CouponInput(): React.JSX.Element {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const { coupon, applyCoupon, removeCoupon, subtotal } = useCart();
  const analytics = useRudderAnalytics();

  function handleApply(): void {
    setError('');
    const trimmed = code.trim().toUpperCase();

    if (!trimmed) {
      setError('Please enter a coupon code.');
      return;
    }

    const found = coupons.find((c) => c.code === trimmed);

    if (!found) {
      setError('Invalid coupon code.');
      if (analytics) {
        trackCouponDenied(analytics, {
          coupon_id: trimmed,
          coupon_name: trimmed,
          discount: 0,
          reason: 'Coupon not found',
        });
      }
      return;
    }

    if (subtotal < found.min_order_amount) {
      setError(
        `This coupon requires a minimum order of $${String(found.min_order_amount)}.`,
      );
      if (analytics) {
        trackCouponDenied(analytics, {
          coupon_id: found.code,
          coupon_name: found.description,
          discount: found.discount_percentage,
          reason: `Minimum order amount not met (requires $${String(found.min_order_amount)})`,
        });
      }
      return;
    }

    applyCoupon(found);
    setCode('');

    if (analytics) {
      trackCouponApplied(analytics, {
        coupon_id: found.code,
        coupon_name: found.description,
        discount: found.discount_percentage,
      });
    }
  }

  function handleRemoveCoupon(): void {
    removeCoupon();
    setError('');
  }

  if (coupon) {
    return (
      <div className="rounded-xl border border-matcha/30 bg-matcha/5 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-matcha/10 text-matcha">
              <TagIcon />
            </div>
            <div>
              <p className="text-sm font-semibold text-matcha">{coupon.code}</p>
              <p className="text-xs text-charcoal/60">{coupon.description}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleRemoveCoupon}
            aria-label="Remove coupon"
            className="rounded-full p-1 text-charcoal/40 transition-colors hover:bg-charcoal/10 hover:text-charcoal"
          >
            <CloseIcon />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-white p-4 shadow-sm">
      <label
        htmlFor="coupon-code"
        className="mb-2 block text-sm font-medium text-charcoal"
      >
        Have a coupon?
      </label>
      <div className="flex gap-2">
        <input
          id="coupon-code"
          type="text"
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            setError('');
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleApply();
          }}
          placeholder="Enter coupon code"
          className="flex-1 rounded-lg border border-sage bg-cream/50 px-3 py-2 text-sm text-charcoal placeholder:text-charcoal/40 focus:border-matcha focus:outline-none focus:ring-1 focus:ring-matcha"
        />
        <Button variant="outline" size="sm" onClick={handleApply}>
          Apply
        </Button>
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
