import { notFound } from 'next/navigation';

import { ProductActions } from '@/components/product-detail/ProductActions';
import { BrewingGuide } from '@/components/product-detail/BrewingGuide';
import { ProductInfo } from '@/components/product-detail/ProductInfo';
import { WishlistButton } from '@/components/product-detail/WishlistButton';
import { products } from '@/data/products';

export function generateStaticParams(): { slug: string }[] {
  return products.map((p) => ({ slug: p.slug }));
}

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({
  params,
}: ProductPageProps): Promise<React.JSX.Element> {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <ProductInfo product={product} />

      <div className="mt-8 flex items-center gap-3 md:ml-auto md:max-w-md">
        <div className="flex-1">
          <ProductActions product={product} />
        </div>
        <WishlistButton product={product} />
      </div>

      <div className="mt-12">
        <BrewingGuide
          temperature={product.brew_temperature_celsius}
          time={product.brew_time_seconds}
          caffeineLevel={product.caffeine_level}
        />
      </div>
    </div>
  );
}
