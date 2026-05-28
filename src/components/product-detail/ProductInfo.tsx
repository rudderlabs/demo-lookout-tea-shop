'use client';

import { useEffect, useRef } from 'react';

import { Badge } from '@/components/shared/Badge';
import { PriceDisplay } from '@/components/shared/PriceDisplay';
import { Rating } from '@/components/shared/Rating';
import type { TeaProduct } from '@/data/schema';
import {
  toProductPayload,
  trackProductViewed,
  usePageTracking,
  useRudderAnalytics,
} from '@/lib/analytics';

interface ProductInfoProps {
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

export function ProductInfo({
  product,
}: ProductInfoProps): React.JSX.Element {
  const analytics = useRudderAnalytics();
  const hasTrackedView = useRef(false);

  usePageTracking('Product Detail', {
    product_id: product.product_id,
    product_name: product.name,
    category: product.category,
  });

  useEffect(() => {
    if (!analytics || hasTrackedView.current) return;
    hasTrackedView.current = true;

    trackProductViewed(analytics, toProductPayload(product));
  }, [analytics, product]);

  const icon = categoryIcons[product.category] ?? '\u{1F343}';

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
      {/* Image placeholder */}
      <div className="flex aspect-square items-center justify-center rounded-2xl bg-steam">
        <span
          className="text-9xl"
          role="img"
          aria-label={product.category}
        >
          {icon}
        </span>
      </div>

      {/* Product info */}
      <div className="flex flex-col justify-center">
        <div className="mb-3">
          <Badge>{capitalizeFirst(product.category)}</Badge>
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-charcoal sm:text-4xl">
          {product.name}
        </h1>

        <p className="mt-2 text-sm text-charcoal/50">
          {product.variant} &middot; {product.brand}
        </p>

        <div className="mt-4">
          <Rating rating={product.rating} reviewCount={product.review_count} />
        </div>

        <div className="mt-4">
          <PriceDisplay price={product.price} className="text-2xl" />
        </div>

        <p className="mt-2 text-sm text-charcoal/50">
          Origin: {product.origin}
        </p>

        <p className="mt-6 leading-relaxed text-charcoal/80">
          {product.description}
        </p>

        {!product.in_stock && (
          <div className="mt-4 rounded-lg bg-oolong/10 px-4 py-3 text-sm font-medium text-oolong">
            This tea is currently out of stock.
          </div>
        )}
      </div>
    </div>
  );
}
