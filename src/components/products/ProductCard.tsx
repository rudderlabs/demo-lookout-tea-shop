'use client';

import Link from 'next/link';

import { Badge } from '@/components/shared/Badge';
import { PriceDisplay } from '@/components/shared/PriceDisplay';
import { Rating } from '@/components/shared/Rating';
import type { TeaProduct } from '@/data/schema';
import {
  toProductPayload,
  trackProductClicked,
  useRudderAnalytics,
} from '@/lib/analytics';

interface ProductCardProps {
  product: TeaProduct;
}

const categoryIcons: Record<string, string> = {
  green: '\u{1F343}',
  black: '\u{1F375}',
  oolong: '\u{1F33F}',
  white: '\u{2728}',
  herbal: '\u{1F33C}',
  'pu-erh': '\u{1FAB5}',
};

function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function ProductCard({ product }: ProductCardProps): React.JSX.Element {
  const analytics = useRudderAnalytics();

  function handleClick(): void {
    if (!analytics) return;
    trackProductClicked(analytics, toProductPayload(product));
  }

  const icon = categoryIcons[product.category] ?? '\u{1F343}';

  return (
    <Link
      href={`/products/${product.slug}`}
      onClick={handleClick}
      className="group block overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-sage/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:ring-matcha/30"
    >
      {/* Image placeholder */}
      <div className="relative flex h-48 items-center justify-center bg-steam">
        <span className="text-6xl transition-transform duration-300 group-hover:scale-110" role="img" aria-label={product.category}>
          {icon}
        </span>
        {!product.in_stock && (
          <div className="absolute inset-0 flex items-center justify-center bg-charcoal/40">
            <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-charcoal">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="mb-2">
          <Badge>{capitalizeFirst(product.category)}</Badge>
        </div>
        <h3 className="text-lg font-semibold text-charcoal transition-colors group-hover:text-matcha">
          {product.name}
        </h3>
        <p className="mt-1 text-sm text-charcoal/60">{product.variant}</p>
        <div className="mt-3 flex items-center justify-between">
          <PriceDisplay price={product.price} className="text-lg" />
          <Rating rating={product.rating} reviewCount={product.review_count} />
        </div>
      </div>
    </Link>
  );
}
