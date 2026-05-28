import { PromotionSchema } from '@/data/schema';

const rawPromotions = [
  {
    id: 'promo-spring-harvest',
    name: 'Spring Harvest Collection',
    creative: 'hero-spring-2024',
    position: 'home-hero',
    description:
      'Discover our curated selection of first-flush spring teas, hand-picked at peak freshness.',
    cta_text: 'Shop Now',
    cta_url: '/products',
  },
  {
    id: 'promo-free-shipping',
    name: 'Free Shipping on Orders Over $50',
    creative: 'free-shipping-bar',
    position: 'top-bar',
    description:
      'Enjoy free standard shipping on all orders over $50. No code needed.',
    cta_text: 'Shop All Teas',
    cta_url: '/products',
  },
] as const satisfies readonly Record<string, unknown>[];

export const promotions = PromotionSchema.array().parse(rawPromotions);
