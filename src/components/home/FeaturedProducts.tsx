'use client';

import { useEffect, useRef } from 'react';

import { ProductCard } from '@/components/products/ProductCard';
import type { TeaProduct } from '@/data/schema';
import {
  toProductPayload,
  trackProductListViewed,
  useRudderAnalytics,
} from '@/lib/analytics';

interface FeaturedProductsProps {
  products: TeaProduct[];
}

export function FeaturedProducts({
  products,
}: FeaturedProductsProps): React.JSX.Element {
  const analytics = useRudderAnalytics();
  const hasTrackedView = useRef(false);

  useEffect(() => {
    if (!analytics || hasTrackedView.current) return;
    hasTrackedView.current = true;

    trackProductListViewed(analytics, {
      list_id: 'featured',
      category: 'featured',
      products: products.map(toProductPayload),
    });
  }, [analytics, products]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:py-20">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-charcoal sm:text-4xl">
          Featured Teas
        </h2>
        <p className="mt-3 text-lg text-charcoal/60">
          Handpicked selections from our most beloved collections
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.product_id} product={product} />
        ))}
      </div>
    </section>
  );
}
