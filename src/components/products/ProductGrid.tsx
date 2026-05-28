'use client';

import { useEffect, useMemo, useRef } from 'react';

import { ProductCard } from '@/components/products/ProductCard';
import type { TeaProduct } from '@/data/schema';
import {
  toProductPayload,
  trackProductListViewed,
  useRudderAnalytics,
} from '@/lib/analytics';

interface ProductGridProps {
  products: TeaProduct[];
  searchTerm: string;
  category: string;
}

export function ProductGrid({
  products,
  searchTerm,
  category,
}: ProductGridProps): React.JSX.Element {
  const analytics = useRudderAnalytics();
  const previousFilterKey = useRef('');

  const filteredProducts = useMemo(() => {
    let result = products;

    if (category !== 'all') {
      result = result.filter((p) => p.category === category);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term) ||
          p.origin.toLowerCase().includes(term) ||
          p.category.toLowerCase().includes(term),
      );
    }

    return result;
  }, [products, searchTerm, category]);

  useEffect(() => {
    if (!analytics) return;

    const filterKey = `${category}:${searchTerm.trim()}`;
    if (filterKey === previousFilterKey.current) return;
    previousFilterKey.current = filterKey;

    if (filteredProducts.length === 0) return;

    trackProductListViewed(analytics, {
      list_id: category === 'all' ? 'catalog' : `catalog-${category}`,
      category: category === 'all' ? 'all' : category,
      products: filteredProducts.map(toProductPayload),
    });
  }, [analytics, filteredProducts, category, searchTerm]);

  if (filteredProducts.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-6xl" role="img" aria-label="No results">
          {'\u{1F343}'}
        </p>
        <h3 className="mt-4 text-lg font-semibold text-charcoal">
          No teas found
        </h3>
        <p className="mt-2 text-charcoal/60">
          Try adjusting your search or filter to find what you&apos;re looking
          for.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {filteredProducts.map((product) => (
        <ProductCard key={product.product_id} product={product} />
      ))}
    </div>
  );
}
