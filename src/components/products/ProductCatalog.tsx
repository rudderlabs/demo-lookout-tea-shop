'use client';

import { useState } from 'react';

import { CategoryFilter } from '@/components/products/CategoryFilter';
import { ProductGrid } from '@/components/products/ProductGrid';
import { SearchBar } from '@/components/products/SearchBar';
import type { TeaProduct } from '@/data/schema';
import { usePageTracking } from '@/lib/analytics';

interface ProductCatalogProps {
  products: TeaProduct[];
}

export function ProductCatalog({
  products,
}: ProductCatalogProps): React.JSX.Element {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');

  usePageTracking('Products');

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-charcoal sm:text-4xl">
          Our Tea Collection
        </h1>
        <p className="mt-2 text-lg text-charcoal/60">
          Explore our curated selection of premium teas from around the world
        </p>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full sm:max-w-sm">
          <SearchBar onSearch={setSearchTerm} />
        </div>
      </div>

      <div className="mb-8">
        <CategoryFilter selected={category} onCategoryChange={setCategory} />
      </div>

      <ProductGrid
        products={products}
        searchTerm={searchTerm}
        category={category}
      />
    </div>
  );
}
