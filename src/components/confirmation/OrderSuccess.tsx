import Link from 'next/link';

import { Button } from '@/components/shared/Button';
import { formatPrice } from '@/lib/utils/format';

interface OrderSuccessProps {
  orderId: string;
  total: number;
}

export function OrderSuccess({
  orderId,
  total,
}: OrderSuccessProps): React.JSX.Element {
  return (
    <div className="flex flex-col items-center px-4 py-16 text-center">
      {/* Success checkmark */}
      <div className="relative mb-8">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-matcha/10">
          <div className="flex h-16 w-16 animate-[scaleIn_0.4s_ease-out_both] items-center justify-center rounded-full bg-matcha">
            <svg
              className="h-8 w-8 animate-[drawCheck_0.4s_ease-out_0.3s_both] text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        {/* Decorative sparkles */}
        <div className="absolute -right-1 -top-1 h-3 w-3 animate-[fadeIn_0.3s_ease-out_0.6s_both] rounded-full bg-oolong/60" />
        <div className="absolute -left-2 top-4 h-2 w-2 animate-[fadeIn_0.3s_ease-out_0.8s_both] rounded-full bg-matcha-light/60" />
        <div className="absolute -bottom-1 right-2 h-2.5 w-2.5 animate-[fadeIn_0.3s_ease-out_1s_both] rounded-full bg-oolong-light/60" />
      </div>

      {/* Heading */}
      <h1 className="mb-2 text-3xl font-bold text-charcoal">
        Order Confirmed!
      </h1>

      <p className="mb-6 max-w-md text-charcoal/60">
        Thank you for your purchase. Your tea is being carefully prepared and
        will be on its way shortly.
      </p>

      {/* Order details card */}
      <div className="mb-8 w-full max-w-sm rounded-xl bg-white p-6 shadow-sm">
        <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-charcoal/40">
          Order Number
        </div>
        <div className="mb-4 rounded-lg bg-steam px-4 py-2 font-mono text-sm font-medium text-charcoal">
          {orderId}
        </div>
        <div className="flex items-center justify-between border-t border-sage/40 pt-3">
          <span className="text-sm text-charcoal/60">Total Charged</span>
          <span className="text-lg font-bold text-charcoal">
            {formatPrice(total)}
          </span>
        </div>
      </div>

      {/* CTA */}
      <Link href="/products">
        <Button variant="primary" size="lg">
          Continue Shopping
        </Button>
      </Link>

      <p className="mt-4 text-xs text-charcoal/40">
        A confirmation email has been sent to your inbox.
      </p>
    </div>
  );
}
