import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { HeroBanner } from '@/components/home/HeroBanner';
import { products } from '@/data/products';
import { promotions } from '@/data/promotions';

export default function HomePage(): React.JSX.Element {
  const heroPromotion = promotions[0];
  const featuredProducts = products.slice(0, 4);

  if (!heroPromotion) {
    throw new Error('No promotions available for hero banner');
  }

  return (
    <>
      <HeroBanner promotion={heroPromotion} />
      <FeaturedProducts products={featuredProducts} />
    </>
  );
}
