'use client';

import { useCart } from '@/lib/cart';
import { formatPrice } from '@/lib/utils/format';

const SHIPPING_THRESHOLD = 50;
const SHIPPING_COST = 5.99;
const TAX_RATE = 0.08;

export function CartSummary(): React.JSX.Element {
  const { subtotal, discount, coupon } = useCart();

  const shipping = subtotal > SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const taxableAmount = subtotal - discount;
  const tax = taxableAmount * TAX_RATE;
  const total = taxableAmount + shipping + tax;

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-charcoal">
        Order Summary
      </h2>

      <div className="flex flex-col gap-3">
        {/* Subtotal */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-charcoal/70">Subtotal</span>
          <span className="text-sm font-medium text-charcoal">
            {formatPrice(subtotal)}
          </span>
        </div>

        {/* Discount */}
        {discount > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-matcha">
              Discount
              {coupon ? ` (${coupon.code})` : ''}
            </span>
            <span className="text-sm font-medium text-matcha">
              -{formatPrice(discount)}
            </span>
          </div>
        )}

        {/* Shipping */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-charcoal/70">Shipping</span>
          <span className="text-sm font-medium text-charcoal">
            {shipping === 0 ? (
              <span className="text-matcha">Free</span>
            ) : (
              formatPrice(shipping)
            )}
          </span>
        </div>

        {shipping > 0 && (
          <p className="text-xs text-charcoal/50">
            Free shipping on orders over {formatPrice(SHIPPING_THRESHOLD)}
          </p>
        )}

        {/* Tax */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-charcoal/70">Tax (8%)</span>
          <span className="text-sm font-medium text-charcoal">
            {formatPrice(tax)}
          </span>
        </div>

        {/* Divider */}
        <div className="border-t border-sage/60" />

        {/* Total */}
        <div className="flex items-center justify-between">
          <span className="text-base font-bold text-charcoal">Total</span>
          <span className="text-lg font-bold text-charcoal">
            {formatPrice(total)}
          </span>
        </div>
      </div>
    </div>
  );
}
